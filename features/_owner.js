var handler = async (m, { conn }) => {
  const p = nomorown;
  let pp = await conn.profilePictureUrl(`${p}@s.whatsapp.net`, 'image').catch((_) => "https://telegra.ph/file/1ecdb5a0aee62ef17d7fc.jpg");
  let owner = `wa.me/${p}`;
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:WhatsApp; Shyro\nNICKNAME:DEVELOPER\nORG: ${nameowner}\nTITLE:soft\nitem1.TEL;waid=${nomorown}:${nomorown}\nitem1.X-ABLabel:Contact Support\nitem2.URL:https://wa.me/${nomorown}\nitem2.X-ABLabel:💬 More\nitem3.EMAIL;type=INTERNET:wa.me/6281998885279\nitem3.X-ABLabel:Email\nitem4.ADR:;;🇯🇵 Jepang;;;;\nitem4.X-ABADR:💬 More\nitem4.X-ABLabel:Lokasi\nBDAY;value=9-9-1945\nEND:VCARD`;
  const sentMsg = await conn.sendMessage(m.chat, {
    contacts: {
      displayName: wm,
      contacts: [{ vcard }]
    },
    contextInfo: {
      externalAdReply: {
        title: Func.Styles('my - owner ><'),
        body: '',
        thumbnailUrl: 'https://files.catbox.moe/ooxn43.jpg',
        sourceUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: fkontak });
  await conn.reply(m.chat, Func.Styles('if you find bug/error please contact to this number'), sentMsg);
}

handler.command = ['owner', 'creator'];
module.exports = handler;