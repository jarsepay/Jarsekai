let jarsepay = async (m, { conn, usedPrefix }) => {
	let chat = global.db.data.chats[m.chat]
	if (chat.isBanned === true) {
		m.reply('Chat ini sudah dalam keadaan mute.')
		return
	}
	chat.isBanned = true
	await m.reply('Bot berhasil di mute pada chat ini.')
}
jarsepay.help = ['mute']
jarsepay.tags = ['group']
jarsepay.command = ['mute']

jarsepay.admin = true
jarsepay.group = true

export default jarsepay