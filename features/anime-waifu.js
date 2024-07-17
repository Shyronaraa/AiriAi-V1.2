let handler = async (m, { conn, command, usedPrefix, text }) => {
  let res = await fetch('https://api.waifu.pics/sfw/waifu');
  m.react('🕑');
  if (!res.ok) throw await res.text();
  let json = await res.json();
  if (!json.url) throw 'Error!';
  conn.sendButton(
    m.chat,
    [["Next!", `${usedPrefix + command} ${text}`]],
    fkontak,
    {
      body: Func.texted('monospace', 'Random Istri'),
      url: json.url,
    }
  );
  m.react('✅');
};

handler.command = /^(waifu)$/i;
handler.tags = ['anime'];
handler.help = ['waifu'];
handler.limit = true;

module.exports = handler;