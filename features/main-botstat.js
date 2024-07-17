const canvafy = require('canvafy');

let handler = async (m, { conn }) => {
  let wm = global.wm;
  let _uptime = process.uptime() * 1000;
  let uptimex = clockString(_uptime);
  let nomor = conn.user.jid;
  let pp = await conn
    .profilePictureUrl(nomor, "image")
    .catch((_) => "https://telegra.ph/file/1a2ce69ce7445f80d1421.png");
  let fkontak = {
    key: {
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo",
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Bot\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };
  let Back = 'https://btch.pages.dev/file/d338c0822e34687fb0f35.jpg'
  let hm = `*STATISTIC AIRI*
+-- Bot Name:  *${namebot}*
+-- Url: wa.me/${nomor.split("@")[0]}
+-- Runtime: *${uptimex}*
+-- User: *${Object.keys(global.db.data.users).length}*
+-- Total Features: *${
    Object.values(features)
      .filter((v) => v.help && !v.disabled)
      .map((v) => v.help)
      .flat(1).length
  }*
`;
  let Anunya = await new canvafy.Security()
        .setAvatar(pp)
        .setBackground("image", "https://0x0.st/Xaru.jpg")
        .setCreatedTimestamp(Date.now())
        .setSuspectTimestamp(1)
        .setBorder("#f0f0f0")
        .setLocale("id") // country short code - default "en"
        .setAvatarBorder("#f0f0f0")
        .setOverlayOpacity(0.9)
        .build();
  await conn.sendFile(m.chat, Anunya, '', hm, fkontak, null, {
  fileLength: '10000',
  contextInfo: {
    externalAdReply: {
      showAdAttribution: true,
      mediaType: 1,
      description: null,
      title: null,
      body: Func.Styles('Airi -- The Simple WhatsApp Bot'),
      renderLargerThumbnail: true,
      thumbnailUrl: Back,
      sourceUrl: null    
}}}, { quoted: fkontak })
};

handler.help = ["botstat"];
handler.tags = ["main"];
handler.command = /^(botstat|stat)$/i;
module.exports = handler;

function clockString(ms) {
  let days = Math.floor(ms / (24 * 60 * 60 * 1000));
  let daysms = ms % (24 * 60 * 60 * 1000);
  let hours = Math.floor(daysms / (60 * 60 * 1000));
  let hoursms = ms % (60 * 60 * 1000);
  let minutes = Math.floor(hoursms / (60 * 1000));
  let minutesms = ms % (60 * 1000);
  let sec = Math.floor(minutesms / 1000);
  return `${days} Day ${hours} Hour ${minutes} Minute ${sec} Second`;
}