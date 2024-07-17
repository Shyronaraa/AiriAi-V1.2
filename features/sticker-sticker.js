const fs = require("fs");

let handler = async (m, { usedPrefix, command, conn, text }) => {
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || "";
  let [kiri, kanan] = text.split("|");
  if (/image/.test(mime)) {
    let media = await conn.downloadAndSaveMediaMessage(q, new Date() * 1);
    conn.sendStimg(m.chat, media, global.fkontak, {
      packname: kiri || global.packname,
      author: kanan || global.author,
    });
    await fs.unlinkSync(media);
  } else if (/video/.test(mime)) {
    if (q.seconds > 11) return m.reply("🚩 Max 10 Second*");
    let media = await conn.downloadAndSaveMediaMessage(q, new Date() * 1);
    conn.sendStvid(m.chat, media, global.fkontak, {
      packname: kiri || global.packname,
      author: kanan || global.author,
    });
    await fs.unlinkSync(media);
  } else {
    m.reply(`🚩 Reply image/video`);
  }
};

handler.help = ["sticker"];
handler.tags = ["sticker"];
handler.limit = true
handler.command = ["s", "sticker","stiker"];

module.exports = handler;