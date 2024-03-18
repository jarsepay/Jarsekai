import fs from 'fs'

let jarsepay = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `‣ Example: ${usedPrefix + command} main-join`
   try {
   if (!m.quoted.text) throw `Harap balas kodenya.`   
   let path = `Jarsekai/${text}.js` 
   await fs.writeFileSync(path, m.quoted.text) 
   m.reply(`Kode berhasil tersimpan di ${path}`)
   } catch (error) {
    console.error(error)
    throw 'Error: ' + error.message
   }
}
jarsepay.help = ['saveplugin']
jarsepay.tags = ['owner'] 
jarsepay.command = ['sfp', 'sfplugin', 'saveplugin']

jarsepay.rowner = true

export default jarsepay