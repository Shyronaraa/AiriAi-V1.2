let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted || m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) throw `🚩 Input image!`;
  let { key } = await conn.sendMessage(m.chat, { text: '_Analyzing Your Image..._' }, { quoted: global.fkontak });
  try {
    let buffer = await q.download();
    let link = await Uploader.catbox(buffer);
    let { data } = await axios.get(
      "https://api.vyturex.com/describe?url=" + link,
    );
    await conn.sendMessage(
      m.chat,
      { text: `${data}`, edit: key },
      { quoted: fkontak },
    );
  } catch (e) {
    throw eror;
  }
};
handler.help = ["img2prompt"].map((a) => a + " *<image>*");
handler.tags = ["ai"];
handler.limit = true
handler.command = ["img2prompt","prompt"];

module.exports = handler;