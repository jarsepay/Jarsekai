import moment from 'moment-timezone'
import { xpRange } from '../lib/levelling.js'
import { platform } from 'node:process'
import os from 'os'

let tags = {
	"advanced": "Advanced",
	"info": "Info",
	"main": "Main",
	"owner": "Owner",
}
const defaultMenu = {
	before: `
👋 %ucapan %taguser
%readmore
`.trimStart(),
	header: '`%category`',
	body: '> %cmd %islimit %isPremium',
	footer: '',
	after: info.wm,
}
let jarsepay = async (m, { conn, usedPrefix: _p, text }) => {
	try {
		let { exp, limit, level, role } = global.db.data.users[m.sender]
		let { min, xp, max } = xpRange(level, global.multiplier)
		let name = m.sender
		let taguser = `@${(m.sender || '').replace(/@s\.whatsapp\.net/g, '')}`
		let names = await conn.getName(m.sender)
		let botnama = info.namabot
		let ucapans = ucapan()
		let d = new Date(new Date + 3600000)
		let locale = 'id'
		const dd = new Date('2023-01-01')
		const locales = 'en'
		const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
		const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
		const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
		let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
		let week = d.toLocaleDateString(locale, {
			weekday: 'long'
		})
		let date = d.toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
		let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d)

		const platform = os.platform()

		const targetDate = new Date('January 1, 2025 00:00:00')
		const currentDate = new Date()
		const remainingTime = targetDate.getTime() - currentDate.getTime()
		const seconds = Math.floor(remainingTime / 1000) % 60
		const minutes = Math.floor(remainingTime / 1000 / 60) % 60
		const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24
		const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24)
		let dateCountdown = `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik lagi menuju tahun baru!`

		let time = d.toLocaleTimeString(locale, {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		})
		let _uptime = process.uptime() * 1000
		let _muptime
		if (process.send) {
			process.send('uptime')
			_muptime = await new Promise(resolve => {
				process.once('message', resolve)
				setTimeout(resolve, 1000)
			}) * 1000
		}
		let muptime = clockString(_muptime)
		let uptime = clockString(_uptime)
		let totalreg = Object.keys(global.db.data.users).length
		let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
		let help = Object.values(global.jarspy).filter(jarspy => !jarspy.disabled).map(jarspy => {
			return {
				help: Array.isArray(jarspy.tags) ? jarspy.help : [jarspy.help],
				tags: Array.isArray(jarspy.tags) ? jarspy.tags : [jarspy.tags],
				prefix: 'customPrefix' in jarspy,
				limit: jarspy.limit,
				premium: jarspy.premium,
				enabled: !jarspy.disabled,
			}
		})
		for (let jarspy of help)
			if (jarspy && 'tags' in jarspy)
				for (let tag of jarspy.tags)
					if (!(tag in tags) && tag) tags[tag] = tag
		conn.menu = conn.menu ? conn.menu : {}
		let before = conn.menu.before || defaultMenu.before
		let header = conn.menu.header || defaultMenu.header
		let body = conn.menu.body || defaultMenu.body
		let footer = conn.menu.footer || defaultMenu.footer
		let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
		let _text = [
			before,
			...Object.keys(tags).map(tag => {
				return header.replace(/%category/g, tags[tag]) + '\n' + [
					...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
						return menu.help.map(help => {
							return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
								.replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
								.replace(/%isPremium/g, menu.premium ? '🅟' : '')
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			}),
			after
		].join('\n')
		text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
		let replace = {
			'%': '%',
			p: _p,
			uptime,
			muptime,
			me: conn.getName(conn.user.jid),
			ucapan: ucapan(),
			exp: exp - min,
			maxexp: xp,
			totalexp: exp,
			xp4levelup: max - exp,
			level,
			limit,
			name,
			names,
			weton,
			week,
			date,
			dateIslamic,
			dateCountdown,
			platform,
			wib,
			wit,
			wita,
			time,
			totalreg,
			rtotalreg,
			role,
			taguser,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

		conn.sendMessage(m.chat, {
			text: await style(text),
			contextInfo: {
				forwardingScore: 0,
				isForwarded: true,
				mentionedJid: [m.sender],
				forwardedNewsletterMessageInfo: {
					newsletterJid: idchannel,
					serverMessageId: null,
					newsletterName: `⌜ ${info.namabot} ⌟ || Channel Information`,
				},
				externalAdReply: {
					showAdAttribution: true,
					title: info.wm,
					body: null,
					mediaType: 1,
					sourceUrl: url.sgc,
					thumbnailUrl: url.thumb,
					renderLargerThumbnail: true
				}
			}
		}, {
			quoted: m
		})
	} catch (error) {
		console.error(error)
		throw 'Error: ' + error.message
	}
}

jarsepay.help = ['menu']
jarsepay.tags = ['main']
jarsepay.command = ['menu', 'allmenu']

export default jarsepay

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
	const hour_now = moment.tz('Asia/Jakarta').format('HH')
	var ucapanWaktu = 'Selamat pagi'
	if (hour_now >= '03' && hour_now <= '10') {
		ucapanWaktu = 'Selamat pagi'
	} else if (hour_now >= '10' && hour_now <= '15') {
		ucapanWaktu = 'Selamat siang'
	} else if (hour_now >= '15' && hour_now <= '17') {
		ucapanWaktu = 'Selamat sore'
	} else if (hour_now >= '17' && hour_now <= '18') {
		ucapanWaktu = 'Selamat sore'
	} else if (hour_now >= '18' && hour_now <= '23') {
		ucapanWaktu = 'Selamat malam'
	} else {
		ucapanWaktu = 'Selamat malam'
	}
	return ucapanWaktu
}

async function getRAM() {
	const {
		totalmem
	} = await import('os')
	return Math.round(totalmem / 1024 / 1024)
}