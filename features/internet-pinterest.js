const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");
const axios = require("axios");

const handler = async (m, { conn, text, args }) => {
  if (!text) throw "🚩 Input query";
  m.react('🕑');
  const prohibitedTerms = ['hentai', 'telanjang', 'fuck', 'naked', 'bokep', 'tobrut', 'memek', 'kontol', 'foto bokep', 'foto telanjang', 'hot', 'fotobokep', 'fototelanjang', 'belahan', 'asbak bali']; // Add more terms if needed
  const queryWithoutSpaces = text.replace(/\s/g, '').toLowerCase();
  if (prohibitedTerms.some(term => queryWithoutSpaces.includes(term))) {
    return conn.reply(m.chat, 'Kamu tidak dapat mencari kata kunci ini', m);
  }
  try {
    const anu = await getPinterestImages(text);
    const result = [];
    shuffleArray(anu);
    let i = 1;
    for (const woila of anu) {
      try {
        result.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: 'Image: ' + '`' + `${i++}` + '`'
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: null
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: null,
            hasMediaAttachment: true,
            ...(await prepareWAMessageMedia({ image: { url: woila } }, { upload: conn.waUploadToServer }))
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: []
          })
        });
      } catch (e) {}
    }
    m.react('✅');
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: ""
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: `Cara menyimpan gambar:\n> Pencet gambar yang dipilih\n> Klik titik 3 di kanan atas ( ⋮ )\n> Klik Simpan\nResult From: ${text}`
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: result
            })
          })
        }
      }
    }, {});
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  } catch (e) {}
};

handler.command = ["pin", "pinterest"]
handler.help = "pinterest *<query>*";
handler.tags = "internet";
handler.limit = true;

module.exports = handler;

async function getPinterestImages(text) {
  const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
  const params = {
    source_url: `/search/pins/?q=${text}`,
    data: JSON.stringify({
      options: {
        isPrefetch: false,
        query: text,
        scope: 'pins',
        no_fetch_context_on_resource: false
      },
      context: {}
    }),
    _: Date.now() 
  };
  try {
    const { data } = await axios.get(url, { params });
    const imageUrls = data.resource_response.data.results.map(v => v.images.orig.url);
    return imageUrls.splice(0, 5);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}