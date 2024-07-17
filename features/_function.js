/* Copyright Airi-Ai 2023 - 2024
* Created By Shyro
* Airi BETA ver
* Thanks For Slemek And XYZ Team
* Don't Delete This WM!
*/

let fs = require("fs");
let fetch = require("node-fetch");
let moment = require("moment-timezone");

let handler = (m) => m;
handler.all = async function (m) {
  let name = await conn.getName(m.sender);
  let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg';
  let thumb = 'https://files.catbox.moe/soh7qf.jpg';
  try {
    pp = await this.profilePictureUrl(m.sender, "image");
  } catch (e) {
  } finally {
    global.doc = pickRandom([
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/pdf",
    ]);
    global.idshr = '120363295972445315@newsletter';
    global.bottime = `${moment.tz("Asia/Jakarta").format("HH:mm:ss")}`;
    global.ucapan = ucapan();
    global.Uploader = require("../function/uploader");
    global.Scraper = {
      Airi1: require("../scraper/skrep"),
      Airi2: require("../scraper/skrep2"),
      Airi3: require("../scraper/skrep3"),
    };
    global.cheerio = require("cheerio");
    global.axios = require("axios");
    global.fetch = require("node-fetch");
    const _uptime = process.uptime() * 1000;
    /*global.Fek = {
        key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' },
        message: {
            orderMessage: {
                itemCount: 2024,
                status: 1,
                thumbnail: await Func.reSize(await Func.fetchBuffer(thumb), 500, 500),
                surface: 1,
                message: ucapan,
                orderTitle: ucapan,
                sellerJid: '0@s.whatsapp.net'
            }
        }
    };
   global.ftroli = {
      key: {
        remoteJid: 'status@broadcast',
        participant: '0@s.whatsapp.net'
      },
      message: {
        orderMessage: {
          itemCount: 2024,
          status: 1,
          thumbnail: await Func.reSize(await Func.fetchBuffer(pp), 100, 100),
          surface: 1,
          message: Func.Styles('Airi Ai v1.2 beta'),
          orderTitle: Func.Styles('Airi Ai v1.2 beta'),
          sellerJid: '0@s.whatsapp.net'
        }
      }
    };
   global.fkontak = {
      key: {
        remoteJid: "0@s.whatsapp.net",
        participant: "0@s.whatsapp.net",
        id: "",
      },
      message: {
        conversation: `*_The Simple WhatsApp Bot - Airii_*`,
      },
    };*/
  }
};

module.exports = handler;

function ucapan() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  let res = "Udah Dini Hari Kok Belum Tidur? 🥱";
  if (time >= 4) {
    res = "Selamat Pagi 🌄";
  }
  if (time > 10) {
    res = "Selamat Siang ⛅";
  }
  if (time >= 15) {
    res = "Selamat Sore 🌇";
  }
  if (time >= 18) {
    res = "Selamat Malam 🌌";
  }
  return res;
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}
function ClockString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const clockString = `Date: ${day}-${month}-${year}\nTime: ${hours}:${minutes}:${seconds}`;
  return clockString;
}