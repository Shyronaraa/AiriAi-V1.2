const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `🚩 Masukkan query untuk dicari`, m);
    let res = await fetch(API('https://api.github.com', '/search/repositories', {
        q: text
    }));
    if (!res.ok) throw eror;
    let json = await res.json();
    let sections = [{
      title: namebot,
      rows: [{
        header: '🍄 Kembali ke menu awal',
        title: "",
        id: '.menu'
      }]
    }];
    json.items.map((repo) => {
      sections.push({
        title: repo.name.toUpperCase(),
        rows: [{
          title: `Author: ${repo.owner.login}`,
          description: `Last Update: ${formatDate(repo.updated_at)}`,
          id: `.git ${repo.clone_url}`
        }]
      });
    });
    const listMessage = {
      title: 'Klik Disini!',
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
              text: 'Pilih Salah Satu Repo Di Bawah Ini'
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

handler.help = ['gitsearch *<query>*'];
handler.tags = ['internet'];
handler.limit = true;
handler.command = /^gitsearch|ghs?$/i;

module.exports = handler;

function formatDate(n, locale = 'id') {
    let d = new Date(n);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}