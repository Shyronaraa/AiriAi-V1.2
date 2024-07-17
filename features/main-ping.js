const speed = require('performance-now');
const { spawn, exec, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  conn.sendFooterText = async (jid, title, text, footer, quoted, options) => {
    let msg = await generateWAMessageFromContent(  
      jid,
      {     
        interactiveMessage: {          
          body: {         
            text: text
          },     
          footer: {
            text: footer
          },     
          header: {
            title: title,
          },    
          nativeFlowMessage: {
            buttons: []    
          }   
        },
      }, 
      {quoted, ...options}
    )
    await conn.relayMessage(jid, msg.message, {})
  }
  let F = {
            key:
            { fromMe: false,
            participant: `0@s.whatsapp.net`, ...(m.chat  ? 
            { remoteJid: "status@broadcast" } : {}) },
            message: { "liveLocationMessage": { "caption":"S P E E D - B O T","h": `S P E E D - B O T`, 'jpegThumbnail': fs.readFileSync('./src/thumbnail.png')}}
           }
  let _muptime
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }
  let muptime = clockString(_muptime)
  let timestamp = speed();
  let latensi = speed() - timestamp;
  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    let child = stdout.toString("utf-8");
    let ssd = child.replace(/Memory:/, "Ram:");
    let ingpo = (`\`\`\`${ssd}Speed: ${latensi.toFixed(4)} ms\nRuntime: ${muptime}\nTotal Memory: ${Math.round(os.totalmem() / 1024 / 1024)} MB\nFree Memory: ${Math.round(os.freemem() / 1024 / 1024)} MB\`\`\``)
    conn.sendFooterText(m.chat, null, null, ingpo, F)
  });
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

module.exports = handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' Hari ️', h, ' Jam ', m, ' Menit ', s, ' Detik '].map(v => v.toString().padStart(2, 0)).join('')
}