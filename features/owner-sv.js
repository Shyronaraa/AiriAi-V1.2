let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `🚩 Masukkan path yang ingin di save`
    if (!m.quoted.text) throw `🚩 Reply code`
    let path = `${text}`
    await require('fs').writeFileSync(path, m.quoted.text)
    m.reply(`Saved ${path} to file!`)
}
handler.help = ['sv'].map(v => v + ' *<path>*')
handler.tags = ['owner']
handler.command = ['sv']
handler.owner = true
module.exports = handler