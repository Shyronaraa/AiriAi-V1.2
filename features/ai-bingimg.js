const BingImageCreator = require('../scraper/ai-imgbing.js');

const handler = async (m, { conn, args, command }) => {
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw 'Masukkan prompt!\n*Ex:* .bingimg a girl';
    }
    m.react('🕑');
    try {
        const res = new BingImageCreator({
            cookie: "Your Cookie Here!"
        });
        const data = await res.createImage(text);
        const filteredData = data.filter(file => !file.endsWith('.svg'));
        const totalCount = filteredData.length;

        if (totalCount > 0) {
            for (let i = 0; i < totalCount; i++) {
                try {
                    conn.sendMessage(m.chat, { image: { url: filteredData[i] }, caption: ''}, { quoted: m });
                } catch (error) {
                    console.error(`Error sending file: ${error.message}`);
                    await m.reply(`Failed to send image *(${i + 1}/${totalCount})*`);
                }
            }
        } else {
            await m.reply('No images found after filtering.');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        await m.reply('Failed to send images.');
    }
};

handler.help = ["bingimg *<prompt>*"];
handler.tags = ["ai"];
handler.command = /^(bingimg)$/i;
handler.limit = 5;
module.exports = handler;