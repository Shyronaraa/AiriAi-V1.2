let fs = require("fs");

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} *<filename>*`;

  if (command === "sf") {
    if (!m.quoted) throw `🚩 Reply Your Code`;
    let path = `features/${text}.js`;
    await fs.writeFileSync(path, m.quoted.text);
    let key = await conn.sendMessage(
      m.chat,
      { text: "*[ VERIFIKASI KODE... ]*" },
      { quoted: m },
    );
    await conn.sendMessage(
      m.chat,
      {
        text: `*[ SUCCES MENYIMPAN KODE ]*\n\n\`\`\`${m.quoted.text}\`\`\``,
        edit: key.key,
      },
      { quored: m },
    );
  } else if (command === "df") {
    let path = `features/${text}.js`;
    let key = await conn.sendMessage(
      m.chat,
      { text: "*[ MENGHAPUS FILE... ]*" },
      { quoted: m },
    );
    if (!fs.existsSync(path))
      return conn.sendMessage(
        m.chat,
        { text: `*[ FILE TIDAK ADA ]*`, edit: key.key },
        { quored: m },
      );
    fs.unlinkSync(path);
    await conn.sendMessage(
      m.chat,
      { text: `*[ SUKSES MENGHAPUS FILE ]*`, edit: key.key },
      { quored: m },
    );
  }
};
handler.help = ["sf", "df"].map((v) => v + " *<code/plugname>*");
handler.tags = ["owner"];
handler.command = /^(sf|df)$/i;
handler.rowner = true;
module.exports = handler;
