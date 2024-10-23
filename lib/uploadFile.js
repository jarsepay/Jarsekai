import fetch from 'node-fetch'
import crypto from 'crypto'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
/**
 * Upload epheremal file to file.io
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {Buffer} buffer File Buffer
 */
const fileIO = async buffer => {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || {}
  let form = new FormData()
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  form.append('file', blob, 'tmp.' + ext)
  let res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
    method: 'POST',
    body: form
  })
  let json = await res.json()
  if (!json.success) throw json
  return json.link
}

/**
 * Upload image to catbox
 * Supported mimetype:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`s
 * - `image/webp`
 * - `video/mp4`
 * - `video/gif`
 * - `audio/mpeg`
 * - `audio/opus`
 * - `audio/mpa`
 * @param {Buffer} buffer Image Buffer
 * @return {Promise<string>}
 */
const catbox = async (buffer) => {
  const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {}
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  const formData = new FormData()
  const randomBytes = crypto.randomBytes(5).toString("hex")
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext)

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  })

  return await response.text()
}

/**
 * 
 * @param {Buffer} inp 
 * @returns {Promise<string>}
 */
export default async function (inp) {
  let err = false
  for (let upload of [catbox, fileIO]) {
    try {
      return await upload(inp)
    } catch (e) {
      err = e
    }
  }
  if (err) throw err
}