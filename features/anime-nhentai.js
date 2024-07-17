/*
* Created By Shyro
*/

const PDFDocument = require("pdfkit");
const { extractImageThumb } = require("@whiskeysockets/baileys");
const fs = require("fs");

let handler = async(m, { conn, args }) => {
    let code = (args[0] || '').replace(/\D/g, '');
    if (!code) throw '🚩 Input code';
    m.react('🕑');
    let fucek = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            ...(m.chat ? { remoteJid: "status@broadcast" } : {})
        },
        message: {
            "liveLocationMessage": {
                "title": "N H E N T A I",
                "h": "N H E N T A I",
                'jpegThumbnail': fs.readFileSync('./src/thumbnail.png')
            }
        }
    };
    let data = await nhentaiScraper(code);
    let pages = [];
    let thumb = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`;
    data.images.pages.map((v, i) => {
        let ext = new URL(v.t).pathname.split('.')[1];
        pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`);
    });
    let buffer = await (await fetch(thumb)).buffer();
    let jpegThumbnail = await extractImageThumb(buffer);
    let imagepdf = await toPDF(pages);
    await conn.sendMessage(m.chat, {
        document: imagepdf,
        jpegThumbnail,
        fileName: data.title.english + '.pdf',
        mimetype: 'application/pdf'
    }, { quoted: fucek });
    m.react('✅');
};

handler.command = /^(nhentai|nhpdf)$/i;
handler.tags = ['anime'];
handler.help = ['nhentai *<code>*'];
handler.premium = true;

module.exports = handler;

async function nhentaiScraper(id) {
    let uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/';
    let html = (await axios.get(uri)).data;
    return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data;
}

function toPDF(images, opt = {}) {
    return new Promise(async (resolve, reject) => {
        if (!Array.isArray(images)) images = [images];
        let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' });
        for (let x = 0; x < images.length; x++) {
            if (/.webp|.gif/.test(images[x])) continue;
            let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data;
            doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
            if (images.length != x + 1) doc.addPage();
        }
        doc.on('data', (chunk) => buffs.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffs)));
        doc.on('error', (err) => reject(err));
        doc.end();
    });
}