const fs = require("fs");
const path = require("path");
let handler = async (m, { usedPrefix, command, text }) => {
  const listPlugins = fs
    .readdirSync(path.join(__dirname))
    .map((v) => v.replace(/\.js/, ""));

  if (!text)
    throw `*Example:* ${usedPrefix + command} *<name file>*
  
*[ LIST PLUGIN ]*
${listPlugins.map((v, i) => `> *${i + 1}* ${v}`).join("\n")}
`;
  const filename = path.join(
    __dirname,
    `./${text}${!/\.js$/i.test(text) ? ".js" : ""}`,
  );
  if (!fs.existsSync(filename))
    throw `*Example:* ${usedPrefix + command} *<name file>*
    
*[ LIST PLUGIN ]*
${listPlugins.map((v, i) => `> *${i + 1}* ${v}`).join("\n")}
`;
  m.reply(fs.readFileSync(filename, "utf8"));
};
handler.help = ["gp"].map((v) => v + " *<plugname>*");
handler.tags = ["owner"];
handler.command = /^(getplugin|get ?plugin|gp)$/i;
handler.rowner = true;

module.exports = handler;