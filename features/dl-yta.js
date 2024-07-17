const ytdl = require('ytdl-core');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const os = require('os');

let streamPipeline = promisify(pipeline);

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🚩 Input link from youtube`, m);
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
  let videoUrl = text;
  let videoInfo = await ytdl.getInfo(videoUrl);
  let { videoDetails } = videoInfo;
  let { title, thumbnails, lengthSeconds, viewCount, uploadDate } = videoDetails;
  let thumbnail = thumbnails[0].url;
  let audioStream = ytdl(videoUrl, {
    filter: 'audioonly',
    quality: 'highestaudio',
  });
  let tmpDir = os.tmpdir();
  let writableStream = fs.createWriteStream(`${tmpDir}/${title}.mp3`);
  await streamPipeline(audioStream, writableStream);
  let doc = {
    audio: {
      url: `${tmpDir}/${title}.mp3`,
    },
    mimetype: 'audio/mp4',
    fileName: `${title}`,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 2,
        mediaUrl: videoUrl,
        title: title,
        body: Func.Styles('airi the simple whatsapp bot'),
        thumbnail: await (await conn.getFile(thumbnail)).data,
      },
    },
  };
  await conn.sendMessage(m.chat, doc, { quoted: m });
  fs.unlink(`${tmpDir}/${title}.mp3`, (err) => {
    if (err) {
      console.error(`🚩 Failed to delete audio file: ${err}`);
    } else {
      console.log(`🚩 Deleted audio file: ${tmpDir}/${title}.mp3`);
    }
  });
};

handler.tags = ['downloader'];
handler.help = ['ytmp3 *<url>*'];
handler.limit = true;
handler.command = /^yta|ytmp3|youtubemp3$/i;

module.exports = handler;