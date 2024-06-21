let jarsepay = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
	let isEnable = /true|enable|(turn)?on|1/i.test(command)
	let chat = global.db.data.chats[m.chat]
	let user = global.db.data.users[m.sender]
	let setting = global.db.data.settings[conn.user.jid]
	let type = (args[0] || '').toLowerCase()
	let isAll = false
	let isUser = false
	switch (type) {
		case 'self':
			isAll = true
			if (!isROwner) {
				global.dfail('rowner', m, conn)
				throw false
			}
			global.opts['self'] = isEnable
			break
		case 'welcome':
			if (!m.isGroup) {
				if (!isOwner) {
					global.dfail('group', m, conn)
					throw false
				}
			} else if (!isAdmin) {
				global.dfail('admin', m, conn)
				throw false
			}
			chat.welcome = isEnable
			break
		default:
			if (!/[01]/.test(command)) return m.reply(await style(`
Options
• Self
• Welcome

${usedPrefix}on self
${usedPrefix}off self`.trim(), 1))
			throw false
	}
	m.reply(`${type} berhasil di ${isEnable ? 'nyala' : 'mati'}kan ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}
`.trim())
}

jarsepay.help = ['enable', 'disable']
jarsepay.tags = ['main']
jarsepay.command = ['on', 'true', 'enable', 'turnon', 'off', 'false', 'disable', 'turnoff']

export default jarsepay