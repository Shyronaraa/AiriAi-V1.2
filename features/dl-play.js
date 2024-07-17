/*
* Created By Shyro
* Copyright 2023 2024 ( Airi Ai )
*/

const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

function trimYouTubeUrl(url) {
  const trimmedUrl = url.split('?')[0];
  return trimmedUrl;
}
const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `🚩 Input query!`;
  m.react('🕑');
  try {
    let trimmedUrl = trimYouTubeUrl(text);
    let search = await yts(trimmedUrl);
    if (!search) throw 'Not Found, Try Another Title';
    let vid = search.all[0];
    let { title, thumbnail, timestamp, views, ago, url } = vid;
    let caption = `┏━━ 「 DATA OBJECT 」 ━━┓\n`;
    caption += `┃ ❖ Title: ${title}\n`;
    caption += `┃ ❖ Duration: ${timestamp}\n`;
    caption += `┃ ❖ Views: ${views}\n`;
    caption += `┃ ❖ Upload: ${ago}\n`;
    caption += `┗━━━━━━━━━━━━━━━━━━━━━┅`;
    conn.sendMessage(m.chat, {
			text: Func.texted('monospace', caption),
			contextInfo: {
				forwardingScore: 2024,
				isForwarded: false,
				mentionedJid: [m.sender],
				externalAdReply: {
					showAdAttribution: true,
					title: Func.Styles("Powered By Airi Ai"),
					body: m.name + ' ' + ucapan,
					mediaType: 1,
					sourceUrl: null,
					thumbnailUrl: thumbnail,
					renderLargerThumbnail: true
				}
			}
		}, {
			quoted: m
		})
    const audioStream = ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });
    const writableStream = fs.createWriteStream(`./tmp/${title}.mp3`);
    await streamPipeline(audioStream, writableStream);
    let doc = {
      audio: {
        url: `./tmp/${title}.mp3`
      },
      mimetype: 'audio/mp4',
      fileName: `${title}`,
    };
    await conn.sendMessage(m.chat, doc, { quoted: m });
    fs.unlink(`./tmp/${title}.mp3`, (err) => {
      if (err) {
        console.error(`Failed to delete audio file: ${err}`);
      } else {
        console.log(`Deleted audio file: ./tmp/${title}.mp3`);
      }
    });
  } catch (error) {
    console.error(error);
    throw 'An error occurred while processing the request.';
  }
};

handler.help = ['play'].map((v) => v + ' *<query>*');
handler.tags = ['downloader'];
handler.limit = true
handler.command = /^(play)$/i;

module.exports = handler;