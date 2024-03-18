import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'
import util from 'util'

const _fs = fs.promises

let jarsepay = async (m, { conn, text, usedPrefix, command, __dirname }) => {
	if (!text) throw `‣ Example: ${usedPrefix + command} main.js`
	if (!m.quoted) throw `‣ Example: ${usedPrefix + command} main.js (dengan membalas kodenya)`
	if (/p(lugin)?/i.test(command)) {
		let filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
		const error = syntaxError(m.quoted.text, filename, {
			sourceType: 'module',
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true
		})
		if (error) throw error
		const pathFile = path.join(__dirname, filename)
		await _fs.writeFile(pathFile, m.quoted.text)
		m.reply(`
Kode berhasil tersimpan di ${filename}`.trim())
	} else {
		const isJavascript = m.quoted.text && !m.quoted.mediaMessage && /\.js/.test(text)
		if (isJavascript) {
			const error = syntaxError(m.quoted.text, text, {
				sourceType: 'module',
				allowReturnOutsideFunction: true,
				allowAwaitOutsideFunction: true
			})
			if (error) throw error
			await _fs.writeFile(text, m.quoted.text)
			m.reply(`
Kode berhasil tersimpan di ${text}`.trim())
		} else if (m.quoted.mediaMessage) {
			const media = await m.quoted.download()
			await _fs.writeFile(text, media)
			m.reply(`Kode berhasil tersimpan di ${text}`)
		} else {
			throw 'Kode ini tidak didukung.'
		}
	}
}
jarsepay.help = ['savefile']
jarsepay.tags = ['owner']
jarsepay.command = ['sf', 'savefile']

jarsepay.rowner = true

export default jarsepay