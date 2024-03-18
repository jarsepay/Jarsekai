![cover](https://telegra.ph/file/7d2231d69683d1bf936e0.jpg)

<h1 align="center">J A R S E K A I</h1>

**A base ESM for whatsapp bot using baileys library from whiskeysockets. Im not the real creator, but i improve it. see the [original here](https://github.com/Tiooxy/Merry-based).** 

I only share the base of the script, if you want to get the other code you can see from our [whatsapp bot group](https://chat.whatsapp.com/I2y6xw47Vg2DuslgQmLjqg). i sometimes drop a code for the bot feature randomly.

### Requirements
1. FFMPEG
3. NodeJS 18 or higher
2. Server vRAM 512MB

### Setup
1. Fill the pairing number to get the pair code, see it [here](https://github.com/jarsepay/Jarsekai/blob/main/system%2Fconfig.js#L19)
2. Change the [owner number](https://github.com/jarsepay/Jarsekai/blob/main/system%2Fconfig.js#L14), [thumbs image](https://github.com/jarsepay/Jarsekai/blob/main/system%2Fconfig.js#L31-L43), [etc](https://github.com/jarsepay/Jarsekai/blob/main/system%2Fconfig.js).
3. Now your bot is ready to use!

**Example:**
```js
global.owner = [
    ['6282148864989', 'Jarsépay', true]
] // Change the owner number here

global.info = {
    pairingNumber: '', // Fill your number starting with your country code, example: '6282148864989'
    namaowner: 'Jarsépay', // owner name
    nomorowner: '6282148864989', // owner number
    packname: 'Sticker by ', // sticker packname
    author: 'Jarsépay', // sticker author name
    namabot: 'Jarsekai', // your bot name
    wm: 'I M  J A R S E K A I', // the main of watermark
    stickpack: 'Created by', // you can ignore this or follow it same as the above packname
    stickauth: 'Jarsépay' // same as stickpack
}
```
### Support Server
Got any questions or feedback? Join our [Discord Server](https://discord.com/invite/2t3qJzuUxH) or [WhatsApp Group](https://chat.whatsapp.com/I2y6xw47Vg2DuslgQmLjqg)
