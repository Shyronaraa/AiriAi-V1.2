let handler = async (m, { conn, text, command }) => {
    let [atas, bawah] = text.split`|`
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `🚩 *Ex:* Top Text|Bottom Text`
  m.react('🕑')
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak didukung!`
    let img = await q.download()
    let url = await Uploader.Uguu(img)
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`
    conn.sendStimg(m.chat, meme, fkontak, { packname: global.packname, author: global.author })

}
handler.help = ['stickermeme *<teks>|<teks>*']
handler.tags = ['sticker']
handler.command = /^(s(tic?ker)?me(me)?)$/i
handler.limit = true

module.exports = handler