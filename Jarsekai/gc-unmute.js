let jarsepay = async (m, { conn, usedPrefix }) => {
	let chat = global.db.data.chats[m.chat]
	if (chat.isBanned === false) {
		m.reply('Chat ini tidak dalam keadaan mute.')
		return
	}
	chat.isBanned = false
	await m.reply('Bot berhasil di unmute pada chat ini.')
}
jarsepay.help = ['unmute']
jarsepay.tags = ['group']
jarsepay.command = ['unmute']

jarsepay.admin = true
jarsepay.group = true

export default jarsepay