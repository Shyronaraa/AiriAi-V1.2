let handler = async (m, { conn }) => {
  const c = await conn.groupMetadata(m.chat);
  const online = Object.entries(conn.chats)
    .filter(
      ([k, v]) =>
        k.endsWith("@s.whatsapp.net") &&
        v.presences &&
        c.participants.some((p) => k.startsWith(p.id)),
    )
    .sort((a, b) => a[0].localeCompare(b[0], "id", { sensitivity: "base" }))
    .map(([k], i) => `*${i + 1}.* @${k.split("@")[0]}`)
    .join("\n");

  let text = `*L I S T - O N L I N E*\n<==================>\n`;
  text += online;
  conn.reply(m.chat, text, m);
};

handler.help = ["listonline"];
handler.tags = ["group"];
handler.command = ["listonline","liston"];
handler.group = true;

module.exports = handler;