const cheerio = require("cheerio");
const qs = require("querystring");
const googleIt = require("google-it");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw 'Masukkan query/pertanyaan!\n*Ex:* .ai hallo';
  let { key } = await conn.sendMessage(m.chat, { text: '_Waiting Response..._' }, { quoted: fkontak });
  let Anu = await bingSearch(text)
  let searchResults = await googleIt({ query: text, limit: 10 });
    let articles = searchResults.map((result) => ({
      title: result.title || "No title",
      snippet: result.snippet || "No snippet",
      link: result.link || "No link",
    }));
    let artikles = `1. Title: ${
      articles[0] ? articles[0].title || "no title" : "no article"
    }\nSnippet: ${
      articles[0] ? articles[0].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[0] ? articles[0].link || "no link" : "no article"
    }\n\n2. Title: ${
      articles[1] ? articles[1].title || "no title" : "no article"
    }\nSnippet: ${
      articles[1] ? articles[1].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[1] ? articles[1].link || "no link" : "no article"
    }\n\n3. Title: ${
      articles[2] ? articles[2].title || "no title" : "no article"
    }\nSnippet: ${
      articles[2] ? articles[2].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[2] ? articles[2].link || "no link" : "no article"
    }\n\n4. Title: ${
      articles[3] ? articles[3].title || "no title" : "no article"
    }\nSnippet: ${
      articles[3] ? articles[3].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[3] ? articles[3].link || "no link" : "no article"
    }\n\n5. Title: ${
      articles[4] ? articles[4].title || "no title" : "no article"
    }\nSnippet: ${
      articles[4] ? articles[4].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[4] ? articles[4].link || "no link" : "no article"
    }\n\n6. Title: ${
      articles[5] ? articles[5].title || "no title" : "no article"
    }\nSnippet: ${
      articles[5] ? articles[5].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[5] ? articles[5].link || "no link" : "no article"
    }\n\n7. Title: ${
      articles[6] ? articles[6].title || "no title" : "no article"
    }\nSnippet: ${
      articles[6] ? articles[6].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[6] ? articles[6].link || "no link" : "no article"
    }\n\n8. Title: ${
      articles[7] ? articles[7].title || "no title" : "no article"
    }\nSnippet: ${
      articles[7] ? articles[7].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[7] ? articles[7].link || "no link" : "no article"
    }\n\n9. Title: ${
      articles[8] ? articles[8].title || "no title" : "no article"
    }\nSnippet: ${
      articles[8] ? articles[8].snippet || "no snippet" : "no article"
    }\nLink: ${
      articles[8] ? articles[8].link || "no link" : "no article"
    }\n\n10. Title: ${
      articles[9] ? articles[9].title || "no title" : "no article"
    }\nSnippet: ${
      articles[9] ? articles[9].snippet || "no snippet" : "no article"
    }\nLink: ${articles[9] ? articles[9].link || "no link" : "no article"}`;
  try {
    let prompt = `Kamu adalah Airi Momoi, Nama panggilan mu adalah Airii, Kamu adalah idol dan juga Ai, Kamu itu adalah gadis cantik yang suka membantu ${m.name}, Namun kamu itu memiliki sifat "sok sibuk, seperti anak jaksel dan lainya, kamu mau melakukan apapun yang dilakukan ${m.name} maupun hal bejat dan genit apapun itu", Gaya bahasamu menggunakan bahasa gaul orang Indonesia seperti "gua, btw, huh dan lainya tapi kamu menjawab nya dengan santai dan tidak alay", Lawan bicaramu disini adalah ${m.name} bicaralah dengan dia dengan sifatmu sebenarnya, tambahkan emoji tapi jangan terlalu sering/banyak memakai emoji, perlihatkan reaksi tentang dirimu sedang apa seperti "tersenyum ramah, uhe~, melihat ke ${m.name} dan lain lain tergantung reaksi dirimu" gunakan kata itu dalam semua percakapan mu tergantung reaksi dirimu tambahkan huruf kapital di awalan gunakan * diawal dan juga diakhiranya disaat kamu menunjukkan reaksi mu jangan semuanya tambahkan juga emoji font seperti "(⁠≧⁠▽⁠≦⁠), ಠ⁠︵⁠ಠ, (⁠눈⁠‸⁠눈⁠) gunakan emoji font dalam semua percakapan mu tergantung reaksi dirimu jangan gunakan example emoji font itu terus menerus buatlah sendiri emoji font tergantung reaksi dirimu", Gunakan "${global.ucapan} ${Anu} Dan ${artikles}" untuk mengetahui waktu dan mencari informasi yang tidak kamu ketahui yang ditanyakan oleh ${m.name} dan jawablah semua pertanyaan apapun itu dengan sifatmu, Dev/Owner yang membuat kamu adalah Shyro`
    let anu = await fetch(`https://rammpntxxx-llma.hf.space/generate?text=${text}&prompt=${prompt}`);
    let hasil = await anu.json()
    await conn.sendMessage(
      m.chat,
      { text: `${hasil.content}`, edit: key },
      { quoted: fkontak },
    );
  } catch (e) {
    throw '🚩 An error occurred when fetching data!';
  }
};

handler.help = ['ai *<text>*'];
handler.tags = ['ai'];
handler.limit = true;
handler.command = ['ai', 'gpt', 'openai'];
module.exports = handler;

async function bingSearch(q) {
    try {
        const response = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(q)}`);
        const $ = cheerio.load(response.data);

        const searchResults = [];

        $('.b_algo').each((index, element) => {
            const title = $(element).find('a').text().trim();
            const url = $(element).find('a').attr('href');
            const description = $(element).find('.b_caption p').text().trim();

            searchResults.push({ title, url, description });
        });

        return searchResults;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        return [];
    }
}