import './system/config.js'
import path, { join } from 'path'
import { platform } from 'process'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

import * as ws from 'ws'
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import os from 'os'
import Pino from 'pino'
import { format } from 'util'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low } from 'lowdb'
import fs from 'fs'
import { JSONFile } from "lowdb/node"
import storeSys from './lib/store2.js'
const store = storeSys.makeInMemoryStore()
const {
    DisconnectReason,
    useMultiFileAuthState,
    MessageRetryMap,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    proto,
    jidNormalizedUser,
    PHONENUMBER_MCC,
    Browsers
} = await (await import('@whiskeysockets/baileys')).default

import readline from "readline"
import { parsePhoneNumber } from "libphonenumber-js"

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()
const msgRetryCounterMap = (MessageRetryMap) => {}
const {
    version
} = await fetchLatestBaileysVersion()


protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')

global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎!./#\\').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}jarsepay/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function() {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? await global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        menfess: {},
        simulator: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFolder = storeSys.fixFileName(`${opts._[0] || ''}jarsepay/sessions`)
let {
    state,
    saveCreds
} = await useMultiFileAuthState(path.resolve('./jarsepay/sessions'))

const connectionOptions = {
    pairingCode: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage)
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            }
        }
        return message
    },
    msgRetryCounterMap,
    logger: Pino({
        level: 'fatal'
    }),
    auth: state,
    browser: ['Linux', 'Chrome', ''],
    version,
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false
global.pairingCode = true

if (global.pairingCode && !conn.authState.creds.registered) {
    let phoneNumber = ''
    
    console.log(chalk.whiteBright('› To use Pairing Code, please enter your WhatsApp number:'))
    console.log(chalk.whiteBright('› Example: 628123456789'))
    
    phoneNumber = await question(chalk.bgGreen(chalk.black(`\nEnter Your WhatsApp Number: `)))
    phoneNumber = phoneNumber.replace(/\D/g,'')
    
    if (phoneNumber.length < 10 || phoneNumber.length > 13) {
        console.log(chalk.bgRed(chalk.black('\n› Invalid phone number. Please enter a valid number.')))
    } else {
        console.log(chalk.cyan('› Generating Code....'))
        
        try {
            const code = await conn.requestPairingCode(phoneNumber)
            const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code
            
            console.log(chalk.whiteBright('› Your Pairing Code:'), chalk.bgGreenBright(chalk.black(` ${formattedCode} `)))
            console.log(chalk.whiteBright('› Please enter this code in your WhatsApp app.'))
            
        } catch (error) {
            console.log(chalk.bgRed(chalk.black('Failed to generate pairing code:', error.message)))
        }
    }
}

if (!opts['test']) {
    if (global.db) {
        setInterval(async () => {
            if (global.db.data) await global.db.write().catch(console.error)
            clearTmp()
        }, 30 * 1000)
    }
}

const directory = './jarsepay/sessions'

function deleteFilesExceptOne(directory, fileNameToKeep) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Terjadi kesalahan: ', err)
            return
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file)
            if (file !== fileNameToKeep) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Gagal menghapus file ${file}:`, err)
                    } else {
                        console.log(`File ${file} berhasil dihapus.`)
                    }
                })
            }
        })
    })
}

function clearTmp() {
    const tmp = [tmpdir(), join(__dirname, './tmp')]
    const filename = []
    tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
    return filename.map((file) => {
        const stats = statSync(file)
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 5 * 60 * 1000)) return unlinkSync(file)
        return false
    })
}

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin
    } = update
    global.stopped = connection

    if (isNewLogin) conn.isInit = true
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.readyState !== ws.default.CONNECTING) {
        console.log(await global.reloadHandler(true).catch(console.error))
        global.timestamp.connect = new Date
    }
    if (global.db.data == null) loadDatabase()
    if (connection === "open") {
        console.log(chalk.bgGreen(chalk.black(`💃 ${info.namabot} telah aktif`)))
        conn.sendMessage('6282148864989@s.whatsapp.net', {
            text: `╭───⌜ System Notice ⌟───\n│• Nama Bot: *${info.namabot}*\n│• Nama Pengguna: *${info.namaowner}*\n│• Status Bot: *Online*\n│• Creator Script: *Jarsépay*\n│• Github: *https://github.com/jarsepay*\n╰───────\n\nNote: Jangan jual script ini, jika ketahuan maka tidak akan ada update lagi.`,
            contextInfo: {
                externalAdReply: {
                    title: `💃 ${info.namabot} telah aktif`,
                    body: null,
                    thumbnailUrl: url.thumb,
                    sourceUrl: url.sgc,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, {
            quoted: null
        })
    }
    if (connection == 'close') {
        console.log(chalk.yellow(`Koneksi bot terputus! Sedang menyambungkan ulang...`))
    }
}

process.on('uncaughtException', console.error)
let isInit = true

let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (error) {
        console.error
    }
    if (restatConn) {
        const oldChats = global.conn.chats
        try {
            global.conn.ws.close()
        } catch {}
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, {
            chats: oldChats
        })
        isInit = true
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('group-participants.update', conn.participantsUpdate)
        conn.ev.off('messages.update', conn.pollUpdate)
        conn.ev.off('groups.update', conn.groupsUpdate)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
    }
    conn.welcome = '👋 Hai @user, selamat datang di @subject \n\nDeskripsi:\n@desc'
    conn.bye = '👋 Selamat tinggal @user, jangan lupa kembali'
    conn.spromote = '👑 @user telah di promosikan menjadi Admin'
    conn.sdemote = '👑 @user telah di demote dari Admin'
    conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
    conn.sSubject = 'Nama grup telah diubah menjadi \n@subject'
    conn.sIcon = 'Foto profil grup telah diubah!'
    conn.sRevoke = 'Link grup telah diubah menjadi \n@revoke'
    conn.sAnnounceOn = 'Grup telah ditutup! sekarang hanya admin yang bisa mengirim pesan.'
    conn.sAnnounceOff = 'Grup telah dibuka! sekarang semua peserta dapat mengirim pesan.'
    conn.sRestrictOn = 'Edit info grup telah diubah menjadi only admin!'
    conn.sRestrictOff = 'Edit info grup telah diubah ke semua peserta!'

    conn.handler = handler.handler.bind(global.conn)
    conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
    conn.pollUpdate = handler.pollUpdate.bind(global.conn)
    conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
    conn.connectionUpdate = connectionUpdate.bind(global.conn)
    conn.credsUpdate = saveCreds.bind(global.conn)

    const currentDateTime = new Date()
    const messageDateTime = new Date(conn.ev)
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
    }

    conn.ev.on('messages.upsert', conn.handler)
    conn.ev.on('group-participants.update', conn.participantsUpdate)
    conn.ev.on("messages.update", conn.pollUpdate)
    conn.ev.on('groups.update', conn.groupsUpdate)
    conn.ev.on('connection.update', conn.connectionUpdate)
    conn.ev.on('creds.update', conn.credsUpdate)
    isInit = false
    return true
}

const pluginFolder = global.__dirname(join(__dirname, './Jarsekai/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.jarspy = {}
async function filesInit() {
    for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            const file = global.__filename(join(pluginFolder, filename))
            const module = await import(file)
            global.jarspy[filename] = module.default || module
        } catch (e) {
            conn.logger.error(e)
            delete global.jarspy[filename]
        }
    }
}
filesInit().then((_) => Object.keys(global.jarspy)).catch(console.error)

global.reload = async (_ev, filename) => {
    if (pluginFilter(filename)) {
        const dir = global.__filename(join(pluginFolder, filename), true)
        if (filename in global.jarspy) {
            if (existsSync(dir)) conn.logger.info(`Plugin Update - '${filename}'`)
            else {
                conn.logger.warn(`Plugin Dihapus - '${filename}'`)
                return delete global.jarspy[filename]
            }
        } else conn.logger.info(`Plugin Baru - '${filename}'`)
        const err = syntaxerror(readFileSync(dir), filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
        })
        if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
        else {
            try {
                const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
                global.jarspy[filename] = module.default || module
            } catch (e) {
                conn.logger.error(`Error Require Plugin '${filename}\n${format(e)}'`)
            } finally {
                global.jarspy = Object.fromEntries(Object.entries(global.jarspy).sort(([a], [b]) => a.localeCompare(b)))
            }
        }
    }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
    const test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version']),
    ].map((p) => {
        return Promise.race([
            new Promise((resolve) => {
                p.on('close', (code) => {
                    resolve(code !== 127)
                })
            }),
            new Promise((resolve) => {
                p.on('error', (_) => resolve(false))
            })
        ])
    }))
    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
    const s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    }
    Object.freeze(global.support)
}

if (setting.autoclear) {
    setInterval(async () => {
        if (stopped === 'close' || !conn || !conn.user) return
        await deleteFilesExceptOne(directory, 'creds.json')
        await clearTmp()
        conn.reply(info.nomorowner + '@s.whatsapp.net', 'Sesi telah dibersihkan.', null) >
            console.log(chalk.cyanBright(
                `\n╭───────────────────·»\n│\n` +
                `│  Sessions cleared Successfully \n│\n` +
                `╰───❲ ${global.namebot} ❳\n`
            ))
    }, 120 * 60 * 1000)
}

_quickTest().catch(console.error)