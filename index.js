import './system/config.js'
import { fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import cfont from 'cfonts'
import { spawn } from 'child_process'
import { createInterface } from 'readline'
import { promises as fsPromises } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { sizeFormatter } from 'human-readable'

import axios from 'axios'
import os from 'os'
import path from 'path'
import moment from 'moment-timezone'
import fs from 'fs'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'

let formatSize = sizeFormatter({
	std: 'JEDEC',
	decimalPlaces: '2',
	keepTrailingZeroes: false,
	render: (literal, symbol) => `${literal} ${symbol}B`
})
const { say } = cfont
const { tz } = moment
const app = express()
const port = process.env.PORT || 8082
const time = tz('Asia/Jakarta').format('HH:mm:ss')
const currentFilePath = new URL(import.meta.url).pathname
const __dirname = dirname(fileURLToPath(import.meta.url))

let bot_ku = 'Jarsekai'
say(bot_ku, {
    font: 'simpleBlock',
    align: 'center',
    gradient: ['yellow', 'cyan', 'red'],
    transitionGradient: 1,
})
say('By ' + info.namaowner, {
    font: 'tiny',
    align: 'center',
    colors: ['white']
})
app.listen(port, () => {
    console.log(chalk.green(`⚡ Port : ${port}`))
})
const folderPath = './tmp'
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
    console.log(chalk.green('Folder tmp berhasil dibuat.'))
}

let isRunning = false

const rl = createInterface(process.stdin, process.stdout)

async function start(file) {
    if (isRunning) return
    isRunning = true

    const args = [join(dirname(currentFilePath), file), ...process.argv.slice(2)]
    const p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    })
    p.on("message", data => {
        console.log(chalk.magenta("[ ✅ Diterima ]", data))
        switch (data) {
            case "reset":
                p.process.kill()
                isRunning = false
                start.apply(this, arguments)
                break
            case "uptime":
                p.send(process.uptime())
                break
        }
    })
    p.on("exit", (_, code) => {
        isRunning = false
        console.error('[❗] Exit dengan kode: ', code)
        if (code !== 0) return start(file)
        watchFile(args[0], () => {
            unwatchFile(args[0])
            start(file)
        })
    })

    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    if (!opts["test"])
        if (!rl.listenerCount()) rl.on("line", line => {
            p.emit("message", line.trim())
        })


    const packageJsonPath = join(dirname(currentFilePath), './package.json')
    const jarsekaiFolder = join(dirname(currentFilePath), 'Jarsekai')
    const totalFoldersAndFiles = await getTotalFoldersAndFiles(jarsekaiFolder)
    fs.readdir(jarsekaiFolder, async (err, files) => {
        if (err) {
            console.error(chalk.red(`Plugin Error: ${err}`))
            return
        }

        try {
            console.log(chalk.bgGreen(chalk.black(`Baileys berhasil terinstall dengan versi ${(await fetchLatestBaileysVersion()).version}`)))
        } catch (e) {
            console.error(chalk.bgRed(chalk.white('Baileys tidak dapat terinstall')))
        }
    })


    try {
        const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8')
        const packageJsonObj = JSON.parse(packageJsonData)
        const {
            data
        } = await axios.get('https://api.ipify.org')
        const ramInGB = os.totalmem() / (1024 * 1024 * 1024)
        const freeRamInGB = os.freemem() / (1024 * 1024 * 1024)

        console.log(`❲ Dashboard ❳
• Name Bot: ${chalk.white(packageJsonObj.name)}
• Versi Script: ${chalk.white(packageJsonObj.version)}
• Deskripsi: ${chalk.white(packageJsonObj.description)}
• OS: ${chalk.white(os.type())}
• Memory: ${chalk.white(freeRamInGB.toFixed(2) + ' / ' + ramInGB.toFixed(2))}
• IP Anda: ${chalk.red(data)}
• Nama Pengguna: ${chalk.white(info.namaowner)}

❲ ${chalk.bgCyan(chalk.black('Informasi Lain'))} ❳
• Total Plugins: ${chalk.white(totalFoldersAndFiles.files)} File
• Creator Script: ${chalk.bold.cyan('Jarsépay')}`)

    } catch (err) {
        console.error(chalk.red(`Tidak dapat membaca package.json: ${err}`))
    }

    setInterval(() => {}, 1000)
}

function getTotalFoldersAndFiles(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                reject(err)
            } else {
                let folders = 0
                let filesCount = 0
                files.forEach((file) => {
                    const filePath = join(folderPath, file)
                    if (fs.statSync(filePath).isDirectory()) {
                        folders++
                    } else {
                        filesCount++
                    }
                })
                resolve({
                    folders,
                    files: filesCount
                })
            }
        })
    })
}

start('jarsekai.js')