const { webp2mp4 } = require('../function/webp2mp4.js');
const { ffmpeg } = require('../function/converter.js');

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) throw `🚩 Reply sticker`;
    let mime = m.quoted.mimetype || '';
    if (!/webp|audio/.test(mime)) throw `🚩 Reply sticker`;
    let media = await m.quoted.download();
    let out = Buffer.alloc(0);
    if (/webp/.test(mime)) {
        out = await webp2mp4(media);
    } else if (/audio/.test(mime)) {
        out = await ffmpeg(media, [
            '-filter_complex', 'color',
            '-pix_fmt', 'yuv420p',
            '-crf', '51',
            '-c:a', 'copy',
            '-shortest'
        ], 'mp3', 'mp4');
    }
    await conn.sendFile(m.chat, out, 'out.mp4', '`Succes`', m, 0, { thumbnail: out });
};

handler.help = ['tovideo *<replystic>*'];
handler.tags = ['sticker'];
handler.limit = true
handler.command = ['tovideo', 'tomp4', 'tovid'];

module.exports = handler;