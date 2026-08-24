/**
 * Pairing Manager - Gère le cycle de vie du pairing web
 * Intègre QR et Pairing Code dans un flux unifié
 */

import fs from "fs-extra";
import pino from "pino";
import QRCode from "qrcode";
import {
  makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
  fetchLatestBaileysVersion,
  DisconnectReason,
  delay,
} from "@whiskeysockets/baileys";
import pn from "awesome-phonenumber";
import sessionManager from "./sessionManager.js";

const MAX_RECONNECT_ATTEMPTS = 3;
const SESSION_TIMEOUT = 5 * 60 * 1000;
const MESSAGE = `
*LOGIN SUCCESSFULL* ✅

*Gɪᴠᴇ ᴀ ꜱᴛᴀʀ ᴛᴏ ʀᴇᴘᴏ ꜰᴏʀ ᴄᴏᴜʀᴀɢᴇ* 🌟
https://github.com/NOSTRA-DevOps/Nova-MD

*Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ ꜰᴏʀ ϙᴜᴇʀʏ* 💭
https://t.me/Nostra_DigitalCenter
https://t.me/LaboKingFreeSurf
https://whatsapp.com/channel/0029Vb8ZJnsAYlUHo1uA6W0y

*NOSTRA COMMUNITY*
https://chat.whatsapp.com/LUkXjJNfWrT8Fz7akxosH0
*Yᴏᴜ-ᴛᴜʙᴇ ᴛᴜᴛᴏʀɪᴀʟꜱ* 🪄 
https://youtube.com/@LaboKingFreeSurf

*NOVA-MD--WHATSAPP* 🥀
`;

class PairingManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanupSessions(), 60000);
    this.sessionSaveInProgress = new Map();
  }

  /**
   * Crée une nouvelle session de pairing avec QR Code
   */
  async createQRSession() {
    const sessionId =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const sessionDir = `./temp_session_${sessionId}`;

    const sessionData = {
      sessionId,
      sessionDir,
      qrGenerated: false,
      sessionCompleted: false,
      responseSent: false,
      reconnectAttempts: 0,
      currentSocket: null,
      timeoutHandle: null,
      isCleaningUp: false,
      createdAt: Date.now(),
      mode: "qr",
      credsUpdated: false,
      sessionSaved: false,
    };

    this.sessions.set(sessionId, sessionData);
    return sessionId;
  }

  /**
   * Crée une nouvelle session de pairing avec Pairing Code
   */
  async createPairSession(phoneNumber) {
    if (!phoneNumber) throw new Error("Phone number is required");

    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    const phone = pn("+" + phoneNumber);
    if (!phone.isValid()) throw new Error("Invalid phone number");

    phoneNumber = phone.getNumber("e164").replace("+", "");

    const sessionId =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const sessionDir = `./temp_session_${sessionId}`;

    const sessionData = {
      sessionId,
      sessionDir,
      phoneNumber,
      pairingCodeSent: false,
      sessionCompleted: false,
      responseSent: false,
      reconnectAttempts: 0,
      currentSocket: null,
      timeoutHandle: null,
      isCleaningUp: false,
      createdAt: Date.now(),
      mode: "pair",
      credsUpdated: false,
      sessionSaved: false,
    };

    this.sessions.set(sessionId, sessionData);
    return sessionId;
  }

  /**
   * Supprime les fichiers de session temporaires
   */
  async removeSessionDir(dirPath) {
    try {
      if (await fs.pathExists(dirPath)) {
        await fs.remove(dirPath);
        return true;
      }
    } catch (e) {
      console.error("Error removing session dir:", e);
    }
    return false;
  }

  /**
   * Nettoie les sessions expirées
   */
  async cleanupSessions() {
    const now = Date.now();
    const expiredSessions = [];

    for (const [sessionId, data] of this.sessions.entries()) {
      if (now - data.createdAt > SESSION_TIMEOUT) {
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      const data = this.sessions.get(sessionId);
      await this.cleanup(sessionId, "session_expired");
    }
  }

  /**
   * Nettoie une session
   */
  async cleanup(sessionId, reason = "unknown") {
    const data = this.sessions.get(sessionId);
    if (!data) return;
    if (data.isCleaningUp) return;

    console.log(`🧹 Cleanup session ${sessionId} - ${reason}`);

    if (reason === "session_complete" || data.sessionCompleted) {
      if (data.timeoutHandle) {
        clearTimeout(data.timeoutHandle);
        data.timeoutHandle = null;
      }
      this.sessions.delete(sessionId);
      console.log(`✅ Socket handed over to index.js successfully.`);
      return;
    }

    data.isCleaningUp = true;

    if (data.timeoutHandle) {
      clearTimeout(data.timeoutHandle);
      data.timeoutHandle = null;
    }

    if (data.currentSocket) {
      try {
        data.currentSocket.ev.removeAllListeners();
        await data.currentSocket.end();
      } catch (e) {}
      data.currentSocket = null;
    }

    setTimeout(async () => {
      await this.removeSessionDir(data.sessionDir);
      this.sessions.delete(sessionId);
    }, 5000);
  }

  /**
   * Sauvegarde la session (méthode partagée QR + Pair)
   */
  async saveSessionData(data, sock, sessionId) {
    // Éviter les doubles sauvegardes
    if (this.sessionSaveInProgress.get(sessionId)) {
      console.log('⏳ Session save already in progress...');
      return;
    }
    this.sessionSaveInProgress.set(sessionId, true);

    try {
      const tempCredsPath = `${data.sessionDir}/creds.json`;
      const mainSessionDir = "./session";

      // Vérifier que le fichier existe
      if (!fs.existsSync(tempCredsPath)) {
        console.log('❌ No credentials file found');
        this.sessionSaveInProgress.delete(sessionId);
        return;
      }

      // Lire les credentials
      const rawData = await fs.readFile(tempCredsPath, 'utf-8');
      const credsData = JSON.parse(rawData);

      // Vérifier que la session est valide (me.id existe)
      if (!credsData.me?.id) {
        console.log('⚠️ Session not valid (no me.id)');
        this.sessionSaveInProgress.delete(sessionId);
        return;
      }

      console.log(`✅ Session valid: me.id = ${credsData.me.id}`);

      // Forcer registered à true si nécessaire
      if (!credsData.registered) {
        credsData.registered = true;
        fs.writeFileSync(tempCredsPath, JSON.stringify(credsData, null, 2));
        console.log('🔧 Forced registered: true');
      }

      // Créer le dossier principal
      if (!(await fs.pathExists(mainSessionDir))) {
        await fs.mkdir(mainSessionDir, { recursive: true });
      }

      // Copier les credentials
      await fs.copy(data.sessionDir, mainSessionDir);
      console.log("✅ Session credentials saved to main session directory");

      // Extraire le numéro de téléphone
      let phoneNumber = data.phoneNumber || null;
      if (!phoneNumber && credsData.me?.id) {
        phoneNumber = credsData.me.id.split(":")[0];
      }

      // Sauvegarder en base de données
      const savedId = await sessionManager.saveSession(credsData, phoneNumber);
      console.log(`✅ Session saved to database: ${savedId}`);

      // Envoyer le message de succès
      const userJid = sock.authState.creds.me?.id
        ? jidNormalizedUser(sock.authState.creds.me.id)
        : jidNormalizedUser(data.phoneNumber + "@s.whatsapp.net");

      if (userJid) {
        const msg = await sock.sendMessage(userJid, {
          text: `✅ *Session ID:* \`${savedId}\`\n\n📌 *SESSION SAVED INSIDE YOUR DATABASE DON'T SHARE IT* ✅`,
        });
        await sock.sendMessage(userJid, {
          text: MESSAGE,
          quoted: msg,
        });
        console.log('✅ Success message sent');
      }

      // Marquer comme complété
      data.sessionCompleted = true;
      data.sessionSaved = true;

      // Cleanup après 5 secondes
      setTimeout(async () => {
        await this.cleanup(sessionId, "session_complete");
      }, 5000);

    } catch (error) {
      console.error('❌ Error saving session:', error);
    } finally {
      this.sessionSaveInProgress.delete(sessionId);
    }
  }

  /**
   * Lance la session de pairing QR (Version CORRIGÉE)
   */
  async initiateQRSession(sessionId) {
    const data = this.sessions.get(sessionId);
    if (!data) throw new Error("Session not found");

    return new Promise(async (resolve, reject) => {
      try {
        const { version } = await fetchLatestBaileysVersion();

        if (!(await fs.pathExists(data.sessionDir))) {
          await fs.mkdir(data.sessionDir, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(
          data.sessionDir,
        );

        data.currentSocket = makeWASocket({
          version,
          logger: pino({ level: "silent" }),
          browser: Browsers.macOS("Chrome"),
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
              state.keys,
              pino({ level: "fatal" }).child({ level: "fatal" }),
            ),
          },
          printQRInTerminal: false,
          markOnlineOnConnect: false,
          generateHighQualityLinkPreview: false,
          defaultQueryTimeoutMs: 600000,
          connectTimeoutMs: 60000,
          keepAliveIntervalMs: 30000,
          retryRequestDelayMs: 250,
          maxRetries: 3,
        });

        const sock = data.currentSocket;

        // ✅ Écouter les mises à jour des credentials
        sock.ev.on('creds.update', async (updatedCreds) => {
          console.log('🔄 creds.update triggered');
          
          // Sauvegarder les credentials
          await saveCreds();
          
          // Vérifier si la session est valide
          if (updatedCreds.me?.id) {
            console.log(`✅ Session valid via creds.update: ${updatedCreds.me.id}`);
            data.credsUpdated = true;
            
            // Forcer registered si nécessaire
            if (!updatedCreds.registered) {
              updatedCreds.registered = true;
              await saveCreds();
              console.log('🔧 Forced registered: true via creds.update');
            }
            
            // Sauvegarder la session si pas déjà fait
            if (!data.sessionSaved && !data.sessionCompleted) {
              await this.saveSessionData(data, sock, sessionId);
            }
          }
        });

        // Gestion du QR Code
        const handleQRCode = async (qr) => {
          if (data.qrGenerated || data.sessionCompleted || data.isCleaningUp)
            return;
          data.qrGenerated = true;

          try {
            const qrDataURL = await QRCode.toDataURL(qr, {
              errorCorrectionLevel: "M",
            });
            resolve({
              type: "qr",
              qr: qrDataURL,
              sessionId,
            });
          } catch (err) {
            console.error("Error generating QR code:", err);
            reject(err);
          }
        };

        sock.ev.on("connection.update", async (update) => {
          if (data.isCleaningUp) return;

          const { connection, lastDisconnect, qr, isNewLogin } = update;

          // QR Code
          if (qr && !data.qrGenerated && !data.sessionCompleted) {
            await handleQRCode(qr);
          }

          // ✅ Nouvelle connexion (reconnexion complète)
          if (isNewLogin) {
            console.log(`🔐 New login via QR code`);
          }

          // ✅ Connexion ouverte
          if (connection === "open") {
            console.log('🔐 Connection open');
            
            // Si la session est déjà sauvegardée, ne rien faire
            if (data.sessionSaved || data.sessionCompleted) return;
            
            // Si creds a déjà été mis à jour, sauvegarder
            if (data.credsUpdated) {
              const saveId = await this.saveSessionData(data, sock, sessionId);
              const userJid = Object.keys(sock.authState.creds.me || {}).length > 0
                                 ? jidNormalizedUser(sock.authState.creds.me.id)
                                : null;
                      if (userJid) {
                          await delay(2000);
                          const msg = await sock.sendMessage(userJid, { 
                                text: `✅ *Session ID:* \`${saveId}\`\n\n📌 SESSION SAVED INSIDE YOUR DATABASE,DON'T SHARE IT!` 
                               });
                            await sock.sendMessage(userJid, { quoted: msg });
                      }
            } else {
              // Sinon, vérifier le fichier après un délai
              console.log('⏳ Waiting for session to be ready...');
              await delay(3000);
              
              // Vérifier une dernière fois
              const tempCredsPath = `${data.sessionDir}/creds.json`;
              if (fs.existsSync(tempCredsPath)) {
                try {
                  const rawData = await fs.readFile(tempCredsPath, 'utf-8');
                  const credsData = JSON.parse(rawData);
                  if (credsData.me?.id) {
                    console.log('✅ Session found via file check');
                    const saveId = await this.saveSessionData(data, sock, sessionId);
                    const userJid = Object.keys(sock.authState.creds.me || {}).length > 0
                                 ? jidNormalizedUser(sock.authState.creds.me.id)
                                : null;
                      if (userJid) {
                          await delay(2000);
                          const msg = await sock.sendMessage(userJid, { 
                                text: `✅ *Session ID:* \`${saveId}\`\n\n📌 SESSION SAVED INSIDE YOUR DATABASE,DON'T SHARE IT!` 
                               });
                            await sock.sendMessage(userJid, { quoted: msg });
                      }
                  }
                } catch (e) {
                  console.log('⚠️ File check failed:', e.message);
                }
              }
            }
          }

          // 🔴 Connexion fermée
          if (connection === "close") {
            console.log('🔌 Connection closed');
            
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            
            // ✅ Cas : QR scanné, Baileys va se reconnecter automatiquement
            if (statusCode === DisconnectReason.restartRequired) {
              console.log('🔄 Restart required - Baileys will reconnect automatically');
              // NE PAS faire de cleanup, Baileys va se reconnecter
              // Vérifier une dernière fois
              const tempCredsPath = `${data.sessionDir}/creds.json`;
              if (fs.existsSync(tempCredsPath)) {
                try {
                  const rawData = await fs.readFile(tempCredsPath, 'utf-8');
                  const credsData = JSON.parse(rawData);
                  if (credsData.me?.id) {
                    console.log('✅ Session found via file check');
                    const saveId = await this.saveSessionData(data, sock, sessionId);
                    const userJid = Object.keys(sock.authState.creds.me || {}).length > 0
                                 ? jidNormalizedUser(sock.authState.creds.me.id)
                                : null;
                      if (userJid) {
                          await delay(2000);
                          const msg = await sock.sendMessage(userJid, { 
                                text: `✅ *Session ID:* \`${saveId}\`\n\n📌 SESSION SAVED INSIDE YOUR DATABASE,DON'T SHARE IT!` 
                               });
                            await sock.sendMessage(userJid, { quoted: msg });
                      }
                  }
                } catch (e) {
                  console.log('⚠️ File check failed:', e.message);
                }
              return;
            }
            
            // Si la session est sauvegardée, nettoyer
            if (data.sessionSaved || data.sessionCompleted) {
              await this.cleanup(sessionId, "session_complete");
              return;
            }

            // ❌ Cas : déconnexion volontaire
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
              await this.cleanup(sessionId, "logged_out");
              reject(new Error("Invalid QR code or session expired"));
            } else {
              // Tentative de reconnexion
              if (data.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                data.reconnectAttempts++;
                await delay(2000);
                await this.initiateQRSession(sessionId);
              } else {
                await this.cleanup(sessionId, "max_reconnects");
                reject(new Error("Max reconnection attempts reached"));
              }
            }
          }
        });

        // Timeout de session
        data.timeoutHandle = setTimeout(async () => {
          if (!data.sessionCompleted && !data.isCleaningUp) {
            await this.cleanup(sessionId, "timeout");
            reject(new Error("Session timeout"));
          }
        }, SESSION_TIMEOUT);
        
      } catch (err) {
        console.error("Error initiating QR session:", err);
        reject(err);
      }
    });
  }

  /**
   * Lance la session de pairing avec code (Version CORRIGÉE)
   */
  async initiatePairSession(sessionId) {
        const data = this.sessions.get(sessionId);
        if (!data) throw new Error('Session not found');

        return new Promise(async (resolve, reject) => {
            try {
                const { version } = await fetchLatestBaileysVersion();

                if (!await fs.pathExists(data.sessionDir)) {
                    await fs.mkdir(data.sessionDir, { recursive: true });
                }

                const { state, saveCreds } = await useMultiFileAuthState(data.sessionDir);

                data.currentSocket = makeWASocket({
                    version,
                    logger: pino({ level: 'silent' }),
                    browser: Browsers.macOS('Chrome'),
                    auth: {
                        creds: state.creds,
                        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' }))
                    },
                    printQRInTerminal: false,
                    markOnlineOnConnect: false,
                    generateHighQualityLinkPreview: false,
                    defaultQueryTimeoutMs: 60000,
                    connectTimeoutMs: 60000,
                    keepAliveIntervalMs: 30000,
                    retryRequestDelayMs: 250,
                    maxRetries: 3
                });

                const sock = data.currentSocket;

                sock.ev.on('connection.update', async (update) => {
                    if (data.isCleaningUp) return;

                    const { connection, lastDisconnect, isNewLogin } = update;

                    if (connection === 'open') {
                        if (data.sessionCompleted) return;
                        data.sessionCompleted = true;

                        try {
                            const tempCredsPath = `${data.sessionDir}/creds.json`;
                            const mainSessionDir = './session';

                            if (!await fs.pathExists(mainSessionDir)) {
                                await fs.mkdir(mainSessionDir, { recursive: true });
                            }

                            if (await fs.pathExists(tempCredsPath)) {
                                await fs.copy(data.sessionDir, mainSessionDir);
                                console.log('✅ Session credentials saved to main session directory');
                            }

                            await delay(3000);

                            if (fs.existsSync(tempCredsPath)) {
                                // Lire les credentials
                                const credsData = JSON.parse(await fs.readFile(tempCredsPath, 'utf-8'));
    
                                // Sauvegarder en base de données (MongoDB, PostgreSQL, MySQL)
                                const phoneNumber = data.phoneNumber || Object.keys(credsData.me || {})[0]?.split('@')[0] || null;
                                const saveId = await sessionManager.saveSession(credsData, phoneNumber);
    
                                console.log(`✅ Session saved to database: ${saveId}`);
    
                                // Envoyer l'ID de session à l'utilisateur
                                const userJid = Object.keys(sock.authState.creds.me || {}).length > 0
                                 ? jidNormalizedUser(sock.authState.creds.me.id)
                                : jidNormalizedUser(data.phoneNumber + '@s.whatsapp.net');
    
                                if (userJid) {
                                    await delay(2000);
                                    const msg = await sock.sendMessage(userJid, { 
                                        text: `✅ *Session ID:* \`${saveId}\`\n\n📌 SESSION SAVED INSIDE YOUR DATABASE,DON'T SHARE IT!` 
                                    });
                                    await sock.sendMessage(userJid, { quoted: msg });
                                }
                            }
                        } catch (err) {
                            console.error('Error saving session:', err);
                        } finally {
                                setTimeout(async () => { // ✅ MODIFIÉ
                                    await this.cleanup(sessionId, 'session_complete');
                                }, 10000);
                        }
                    }

                    if (isNewLogin) console.log(`🔐 New login via pair code for ${data.phoneNumber}`);

                    if (connection === 'close') {
                        if (data.sessionCompleted || data.isCleaningUp) {
                            await this.cleanup(sessionId, 'already_complete');
                            return;
                        }

                        const statusCode = lastDisconnect?.error?.output?.statusCode;
                        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                            await this.cleanup(sessionId, 'logged_out');
                            reject(new Error('Invalid pairing code or session expired'));
                        } else if (data.pairingCodeSent && !data.sessionCompleted) {
                            if (data.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                                data.reconnectAttempts++;
                                await delay(2000);
                                await this.initiatePairSession(sessionId);
                            } else {
                                await this.cleanup(sessionId, 'max_reconnects');
                                reject(new Error('Max reconnection attempts reached'));
                            }
                        }
                    }
                });

                // Attendre un peu avant de demander le code
                if (!sock.authState.creds.registered && !data.pairingCodeSent && !data.isCleaningUp) {
                    await delay(1500);
                    try {
                        data.pairingCodeSent = true;
                        let code = await sock.requestPairingCode(data.phoneNumber);
                        code = code?.match(/.{1,4}/g)?.join('-') || code;

                        resolve({
                            type: 'pair',
                            code,
                            sessionId,
                            phoneNumber: data.phoneNumber
                        });
                    } catch (error) {
                        data.pairingCodeSent = false;
                        reject(new Error('Failed to get pairing code: ' + error.message));
                    }
                }

                sock.ev.on('creds.update', saveCreds);

                // Timeout
                data.timeoutHandle = setTimeout(async () => {
                    if (!data.sessionCompleted && !data.isCleaningUp) {
                        await this.cleanup(sessionId, 'timeout');
                        reject(new Error('Pairing timeout'));
                    }
                }, SESSION_TIMEOUT);

            } catch (err) {
                console.error('Error initiating pair session:', err);
                reject(err);
            }
        });
    }


  /**
   * Vérifie si la session est complétée
   */
  isSessionComplete(sessionId) {
    const data = this.sessions.get(sessionId);
    if (!data) return false;

    if (!data.sessionCompleted) return false;

    try {
      const tempCredsPath = `${data.sessionDir}/creds.json`;
      const mainCredsPath = "./session/creds.json";

      let filePath = fs.existsSync(mainCredsPath)
        ? mainCredsPath
        : fs.existsSync(tempCredsPath)
          ? tempCredsPath
          : null;

      if (filePath) {
        const credsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return credsData.registered === true && !!credsData.me?.id;
      }
    } catch (e) {
      console.error("Error verifying physical creds in isSessionComplete:", e);
      return false;
    }

    return false;
  }
}

export default new PairingManager();