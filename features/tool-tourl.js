let handler = async (m, { args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw '🚩 Input media yang akan dijadikan URL!';
    m.react('🕑')
    let media = await q.download();
    let isTele = /image\/(png|jpe?g|gif)|webp|mp3|audio|video\/mp4/.test(mime);
    let link = await Uploader.catbox(media);
    let caption = `📮 *L I N K :* ${link}
📊 *S I Z E :* ${formatBytes(media.length)}
📛 *E x p i r e d :* ${isTele ? 'No Expiry Date' : 'Unknown'}

*S H O R T :* ${await shortUrl(link)}`;
    await m.reply(caption);
};

handler.help = ['tourl *<media>*'];
handler.tags = ['tools'];
handler.command = /^(tourl)$/i;
handler.limit = true;
module.exports = handler;

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
    let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
    return await res.text();
}