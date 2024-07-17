const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `🚩 Input Instagram Url`;
  if (!Func.isUrl(text)) throw `🚩 Input Instagram Url`;
  m.react('🕑');
  try {
    let media = await igdl(text);
    if (media.length === 0) throw "🚩 No media found";
    let url = media.map((a) => a.download);
    for (let i of url) {
      conn.sendFile(m.chat, i, '', '', m);
    }
  } catch (e) {
    throw e;
  }
};

handler.help = ['instagram'].map(v => v + ' *<url>*');
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl)$/i;
handler.limit = true;
module.exports = handler;

async function igdl(url) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://v3.igdownloader.app/api/ajaxSearch',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*'
      },
      data: qs.stringify({
        recaptchaToken: '',
        q: url,
        t: 'media',
        lang: 'en'
      })
    });
    const $ = cheerio.load(response.data.data);
    const result = [];
    $('ul.download-box li').each((index, element) => {
      const thumbnail = $(element).find('.download-items__thumb img').attr('src');
      const options = [];
      $(element).find('.photo-option select option').each((i, opt) => {
        options.push({
          resolution: $(opt).text(),
          url: $(opt).attr('value')
        });
      });
      const download = $(element).find('.download-items__btn a').attr('href');

      result.push({
        thumbnail: thumbnail,
        options: options,
        download: download
      });
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}