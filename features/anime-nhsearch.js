const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const { Nhentai } = require('../scraper/nime-nhentai.js');
let miaw = new Nhentai();

let handler = async (m, { text, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Masukkan query untuk dicari`, m);
    m.react('🕑');
    let res = await miaw.search(text);
    let sections = [{
      title: namebot,
      rows: [{
        header: '🍄 Kembali ke menu awal',
        title: "",
        id: '.menu'
      }]
    }];
    res.map((sky) => {
      sections.push({
        title: '',
        rows: [{
          title: sky.title,
          description: sky.link,
          id: `nhentai ${sky.id}`
        }]
      });
    });
    const listMessage = {
      title: 'Click Here',
      sections
    };
    const msg = await generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: 'Pilih Salah Satu List Doujin Di Bawah Ini'
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: namebot
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              subtitle: namebot,
              hasMediaAttachment: false,
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify(listMessage)
                }
              ]
            })
          })
        }
      }
    }, {});
    await conn.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
};

handler.help = ['nhentaisearch *<query>*'];
handler.tags = ['anime'];
handler.premium = true;
handler.command = /^nhsearch|nhsearch$/i;

module.exports = handler;