/* 
* Created By Shyro
* MIT Licence
* Copyright: 2023 - 2024
* Thanks For Slemek And XYZ Team
* Wea Bot || Airi Multidevice
* Contact Support: +6287735358548
*/

const NeoApi = require("@neoxr/wb");
const fs = require("fs");
const Airii = new NeoApi();

global.owner = [
  ["6287735348548"],
]; 

global.numberbot = "6287735348548";
global.nameowner = "SHYRO",
global.nomorown = "6287735348548";
global.APIs = {}
global.APIKeys = {}
global.namebot = "Airi BETA";
global.version = "1.2";
global.wm = "The Simple WhatsApp Bot"
global.packname = "WhatsApp Bot With Baileys";
global.author = `Airi BETA v1.2`;
global.sky = "https://0x0.st/XBm6.jpg"
global.Func = Airii.Function;
global.Miaw = fs.readFileSync(`./package.json`)
global.Beton = require('./function/funcbeton.js')
/*====================
     OTHER ( Danger Zone )
=======================*/
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("Update AiriSystem.js");
  delete require.cache[file];
  require(file);
});

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}