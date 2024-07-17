/* 
* Created By Shyro
* MIT Licence
* Copyright: 2023 - 2024
* Thanks For Slemek And XYZ Team
* Wea Bot || Airi Multidevice
* Contact Support: +6287735348548
* Buy the script to get all code ･⁠ ⁠〰⁠ ⁠･⁠ 
*/
const simple = require('./function/simple')
const util = require('util')
const { color } = require('./function/color')
const moment = require("moment-timezone")
const fs = require('fs')
const fetch = require("node-fetch")
const {
  WAMessageStubType,
  generateWAMessage,
  areJidsSameUser,
  proto,
} = require("@whiskeysockets/baileys");


const isNumber = (x) => typeof x === "number" && !isNaN(x);
const delay = (ms) =>
  isNumber(ms) && new Promise((resolve) => setTimeout(resolve, ms));
(module.exports = {
  async handler(chatUpdate) {
    const appenTextMessage = async (text, chatUpdate) => {
      let messages = await generateWAMessage(
        m.chat,
        { text: text, mentions: m.mentionedJid },
        {
          userJid: this.user.id,
          quoted: m.quoted && m.quoted.fakeObj,
        },
      );
      messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
      messages.key.id = m.key.id;
      messages.pushName = m.pushName;
      if (m.isGroup) messages.participant = m.sender;
      let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: "append",
      };
      this.ev.emit("messages.upsert", msg);
    };
    if (global.db.data == null) await loadDatabase();
    this.msgqueque = this.msgqueque || [];
    if (!chatUpdate) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);
    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;
    if (m.message?.viewOnceMessageV2)
      m.message = m.message.viewOnceMessageV2.message;
    if (m.message?.documentWithCaptionMessage)
      m.message = m.message.documentWithCaptionMessage.message;
    if (m.message?.viewOnceMessageV2Extension)
      m.message = m.message.viewOnceMessageV2Extension.message;
    if (!m) return;
    try {
      m = simple.smsg(this, m) || m;
      if (!m) return;

      m.exp = 0;
      m.limit = false;
      try {
        let user = global.db.data.users[m.sender];
        if (typeof user !== "object") global.db.data.users[m.sender] = {};
        if (user) {
          if (!isNumber(user.exp)) user.exp = 0;
          if (!isNumber(user.limit)) user.limit = 15;
          if (!isNumber(user.joinlimit)) user.joinlimit = 1;
          if (!isNumber(user.lastclaim)) user.lastclaim = 0;
          if (!("registered" in user)) user.registered = false;
          if (!user.registered) {
            if (!("name" in user)) user.name = m.name;
            if (!isNumber(user.age)) user.age = -1;
            if (!isNumber(user.regTime)) user.regTime = -1;
          }
          if (!isNumber(user.afk)) user.afk = -1;
          if (!("afkReason" in user)) user.afkReason = "";
          if (!("pasangan" in user)) user.pasangan = "";
          if (!("sahabat" in user)) user.sahabat = "";
          if (!("banned" in user)) user.banned = false;
          if (!("online" in user)) user.online = false;
          if (!("premium" in user)) user.premium = false;
          if (!("moderator" in user)) user.moderator = false;
          if (!("online" in user)) user.online = false;
          if (!user.acc) user.acc = false;
          if (!user.acc) user.end = false;
          if (!isNumber(user.premiumDate)) user.premiumDate = 0;
          if (!isNumber(user.bannedDate)) user.bannedDate = 0;
          if (!isNumber(user.warn)) user.warn = 0;
          if (!isNumber(user.count)) user.count = 0;
          if (!isNumber(user.level)) user.level = 0;
          if (!("role" in user)) user.role = "Kroco";
          if (!("autolevelup" in user)) user.autolevelup = true;
          if (!isNumber(user.saldo)) user.saldo = 0;
          if (!isNumber(user.reglast)) user.reglast = 0;
          if (!isNumber(user.unreglast)) user.unreglast = 0;
          if (!isNumber(user.snlast)) user.snlast = 0;
          if (!isNumber(user.lastspam)) user.lastspam = 0;
        } else
          global.db.data.users[m.sender] = {
            exp: 0,
            limit: 15,
            joinlimit: 1,
            spammer: 0,
            registered: true,
            name: m.name,
            age: -1,
            regTime: -1,
            afk: -1,
            afkReason: "",
            pasangan: "",
            sahabat: "",
            banned: false,
            premium: false,
            moderator: false,
            online: 0,
            acc: 0,
            end: 0,
            warn: 0,
            count: 0,
            pc: 0,
            level: 0,
            role: "Kroco",
            autolevelup: true,
          };
        let chat = global.db.data.chats[m.chat];
        if (typeof chat !== "object") global.db.data.chats[m.chat] = {};
        if (chat) {
          if (!("isBanned" in chat)) chat.isBanned = false;
          if (!("welcome" in chat)) chat.welcome = false;
          if (!("isBanned" in chat)) chat.mute = false;
          if (!("member" in chat)) chat.member = [];
          if (!isNumber(chat.chat)) chat.chat = 0;
        } else
          global.db.data.chats[m.chat] = {
            isBanned: false,
            welcome: false,
            antiLink: true,
            mute: false,
            member: [],
            chat: 0,
          };
        let settings = global.db.data.settings;
        if (typeof settings !== "object")
          global.db.data.settings[this.user.jid] = {};
        if (settings) {
          if (!("autodownload" in settings)) settings.autodownload = false;
          if (!("online" in settings)) settings.online = false;
          if (!("anticall" in settings)) settings.anticall = true;
          if (!("blockcmd" in settings)) settings.blockcmd = [];
          if (!isNumber(settings.start)) settings.start = 0;
        } else
          global.db.data.settings = {
            autodownload: false,
            autoread: true,
            anticall: true,
            antibot: false,
            antilink: true,
            blockcmd: [],
            start: 0,
          };
      } catch (e) {
        console.error(e);
      }
      const isROwner = [
        conn.decodeJid(global.conn.user.id),
        ...global.owner.map((a) => a + "@s.whatsapp.net"),
      ].includes(m.sender);
      const isOwner = isROwner || m.fromMe;
      const isMods = global.db.data.users[m.sender].moderator;
      const isPrems = global.db.data.users[m.sender].premium;
      const isBans = global.db.data.users[m.sender].banned;

      if (m.isGroup) {
        let member = await (
          await conn.groupMetadata(m.chat)
        ).participants.map((a) => a.id);

        db.data.chats[m.chat].member = member;
        db.data.chats[m.chat].chat += 1;
      }
      if (
        m.messageStubType ===
        (WAMessageStubType.CALL_MISSED_VOICE ||
          WAMessageStubType.CALL_MISSED_VIDEO)
      ) {
        await conn.reply(
          m.chat,
          "Oops! Maaf sepertinya anda telah menelepon bot!, kamu akan dibanned",
          null,
        );
        await conn.delay(1000);
        await conn.updateBlockStatus(m.chat, "block");
      }
      if (isROwner) {
        db.data.users[m.sender].premium = true;
        db.data.users[m.sender].premiumDate = "Unlimited 🥶";
        db.data.users[m.sender].limit = "404 Tidak Diketahui 🥶";
        db.data.users[m.sender].moderator = true;
      } else if (isPrems) {
        db.data.users[m.sender].premiumDate -= 1000;
        db.data.users[m.sender].limit = "Unlimited 🥶";
      } else if (!isROwner && isBans) return;
      if (opts["queque"] && m.text && !(isMods || isPrems)) {
        let queque = this.msgqueque,
          time = 1000 * 5;
        const previousID = queque[queque.length - 1];
        queque.push(m.id || m.key.id);
        setInterval(async function () {
          if (queque.indexOf(previousID) === -1) clearInterval(this);
          else await delay(time);
        }, time);
      }
      db.data.users[m.sender].online = new Date() * 1;
      db.data.users[m.sender].chat += 1;
      if (opts["autoread"]) await this.readMessages([m.key]);
      if (opts["nyimak"]) return;
      if (!m.fromMe && !isOwner && !isPrems && !isMods && opts["self"]) return;
      if (opts["pconly"] && m.chat.endsWith("g.us")) return;
      if (opts["gconly"] && !m.fromMe && !m.chat.endsWith("g.us")) return;
      if (opts["swonly"] && m.chat !== "status@broadcast") return;
      if (typeof m.text !== "string") m.text = "";
      if (m.isBaileys) return;
      m.exp += Math.ceil(Math.random() * 10);
      let usedPrefix;
      let _user =
        global.db.data &&
        global.db.data.users &&
        global.db.data.users[m.sender];

      const groupMetadata =
        (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {};
      const participants = (m.isGroup ? groupMetadata.participants : []) || [];
      const user =
        (m.isGroup
          ? participants.find((u) => conn.decodeJid(u.id) === m.sender)
          : {}) || {}; // User Data
      const bot =
        (m.isGroup
          ? participants.find((u) => conn.decodeJid(u.id) == this.user.jid)
          : {}) || {}; // Your Data
      const isRAdmin = (user && user.admin == "superadmin") || false;
      const isAdmin = isRAdmin || (user && user.admin == "admin") || false; // Is User Admin?
      const isBotAdmin = (bot && bot.admin) || false; // Are you Admin?
      for (let name in global.features) {
        let plugin = global.features[name];
        if (!plugin) continue;
        if (plugin.disabled) continue;
        if (typeof plugin.all === "function") {
          try {
            await plugin.all.call(this, m, chatUpdate);
          } catch (e) {
            // if (typeof e === 'string') continue
            console.error(e);
          }
        }
        const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
        let _prefix = plugin.customPrefix
          ? plugin.customPrefix
          : conn.prefix
            ? conn.prefix
            : global.prefix;
        let match = (
          _prefix instanceof RegExp // RegExp Mode?
            ? [[_prefix.exec(m.text), _prefix]]
            : Array.isArray(_prefix) // Array?
              ? _prefix.map((p) => {
                  let re =
                    p instanceof RegExp // RegExp in Array?
                      ? p
                      : new RegExp(str2Regex(p));
                  return [re.exec(m.text), re];
                })
              : typeof _prefix === "string" // String?
                ? [
                    [
                      new RegExp(str2Regex(_prefix)).exec(m.text),
                      new RegExp(str2Regex(_prefix)),
                    ],
                  ]
                : [[[], new RegExp()]]
        ).find((p) => p[1]);
        if (typeof plugin.before === "function")
          if (
            await plugin.before.call(this, m, {
              match,
              conn: this,
              participants,
              groupMetadata,
              user,
              bot,
              isROwner,
              isOwner,
              isRAdmin,
              isAdmin,
              isBotAdmin,
              isPrems,
              isBans,
              chatUpdate,
            })
          )
            continue;
        if (typeof plugin !== "function") continue;
        if (opts && match && m) {
          let result =
            ((opts?.["multiprefix"] ?? true) && (match[0] || "")[0]) ||
            (opts?.["noprefix"] ?? false ? null : (match[0] || "")[0]);
          usedPrefix = result;
          let noPrefix = !result ? m.text : m.text.replace(result, "");
          let [command, ...args] = noPrefix.trim().split` `.filter((v) => v);
          args = args || [];
          let _args = noPrefix.trim().split` `.slice(1);
          let text = _args.join` `;
          command = (command || "").toLowerCase();
          let fail = plugin.fail || global.dfail;

          const prefixCommand = !result
            ? plugin.customPrefix || plugin.command
            : plugin.command;
          let isAccept =
            (prefixCommand instanceof RegExp && prefixCommand.test(command)) ||
            (Array.isArray(prefixCommand) &&
              prefixCommand.some((cmd) =>
                cmd instanceof RegExp ? cmd.test(command) : cmd === command,
              )) ||
            (typeof prefixCommand === "string" && prefixCommand === command);
          m.prefix = !!result;
          usedPrefix = !result ? "" : result;
          if (!isAccept) continue;
          m.plugin = name;
          if (
            m.chat in global.db.data.chats ||
            m.sender in global.db.data.users
          ) {
            let chat = global.db.data.chats[m.chat];
            let user = global.db.data.users[m.sender];
            if (
              name != "owner-unbanchat.js" &&
              chat &&
              chat.isBanned &&
              !isOwner
            )
              return;
            if (
              name != "group-unmute.js" &&
              chat &&
              chat.mute &&
              !isAdmin &&
              !isOwner
            )
              return;
          }

          if (db.data.settings.blockcmd.includes(command)) {
            dfail("block", m, this);
            continue;
          }
          if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
            fail("owner", m, this);
            continue;
          }
          if (plugin.rowner && !isROwner) {
            fail("rowner", m, this);
            continue;
          }
          if (plugin.restrict) {
            fail("restrict", m, this);
            continue;
          }
          if (plugin.owner && !isOwner) {
            fail("owner", m, this);
            continue;
          }
          if (plugin.mods && !isMods) {
            fail("mods", m, this);
            continue;
          }
          if (plugin.premium && !isPrems) {
            fail("premium", m, this);
            continue;
          }
          if (plugin.banned && !isBans) {
            fail("banned", m, this);
            continue;
          }
          if (plugin.group && !m.isGroup) {
            fail("group", m, this);
            continue;
          } else if (plugin.botAdmin && !isBotAdmin) {
            fail("botAdmin", m, this);
            continue;
          } else if (plugin.admin && !isAdmin) {
            fail("admin", m, this);
            continue;
          }
          if (plugin.private && m.isGroup) {
            fail("private", m, this);
            continue;
          }
          if (plugin.register == true && _user.registered == false) {
            fail("unreg", m, this);
            continue;
          }
          m.isCommand = true;
          let xp = "exp" in plugin ? parseInt(plugin.exp) : 17; // XP Earning per command
          if (xp > 9999999999999999999999)
            m.reply("Ngecit -_-"); // Hehehe
          else m.exp += xp;
          if (
            !isPrems &&
            plugin.limit &&
            global.db.data.users[m.sender].limit < plugin.limit * 1
          ) {
            let limit = `Oops! Limit anda sepertinya sudah habis, kembalilah esok hari untuk limit reset atau beli role Premium!`;
            conn.sendMessage(
              m.chat,
              {
                text: limit,
              },
              { quoted: fkontak },
            );
            continue;
          }
          if (m.isBaileys && !m.fromMe) {
            if (isBotAdmin && !isAdmin) {
              await conn.reply(m.chat, "Bot Lain Terdeteksi! Hush Hush!");
              await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            }
          }
          if (plugin.level > _user.level) {
            let level = `🚩 Levelmu tidak cukup untuk mengakses fitur ini`;
            conn.sendMessage(
              m.chat,
              {
                text: level,
              },
              { quoted: m },
            );
            continue;
          }
          let extra = {
            match,
            usedPrefix,
            noPrefix,
            _args,
            args,
            command,
            text,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isPrems,
            isBans,
            chatUpdate,
          };
          try {
            await plugin.call(this, m, extra);
            if (!isPrems) m.limit = m.limit || plugin.limit || true;
          } catch (e) {
            // Error occured
            m.error = e;
            console.error(e);
            if (e) {
              let text = util.format(e);
              for (let key of Object.values(global.APIKeys))
              if (e.name)
                for (let jid of global.owner) {
                  let data = (await conn.onWhatsApp(jid))[0] || {};
                  if (data.exists)
                    this.reply(
                      data.jid,
                      `*[ EROR MAS ]*
*Nama Plug :* ${m.plugin}
*From :* @${m.sender.split("@")[0]} *(wa.me/${m.sender.split("@")[0]})*
*Jid Chat :* ${m.chat} 
*Command  :* ${usedPrefix + command}

*Error Log :*
\`\`\`${text}\`\`\`
`.trim(),
                      fkontak,
                    );
                }
              m.reply(e);
            }
          } finally {
            //m.reply(util.format(_user))
            if (typeof plugin.after === "function") {
              try {
                await plugin.after.call(this, m, extra);
              } catch (e) {
                console.error(e);
              }
            }
            /*if (m.limit && plugin.limit && !isPrems) {
              let cap = `*[ ${m.limit + 1} USAGE ]*
           > • _Total Limit : *[ ${db.data.users[m.sender].limit} ]*`;
            }*/
          }
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (opts["queque"] && m.text) {
        const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
        if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
      }
     // console.log(global.db.data.users[m.sender])
      let user,
        stats = global.db.data.stats;
      if (m) {
        if (m.sender && (user = global.db.data.users[m.sender])) {
          user.exp += m.exp;
          user.limit -= m.limit * 1;
        }
        let stat;
        if (m.plugin) {
          let now = +new Date();
          if (m.plugin in stats) {
            stat = stats[m.plugin];
            if (!isNumber(stat.total)) stat.total = 1;
            if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1;
            if (!isNumber(stat.last)) stat.last = now;
            if (!isNumber(stat.lastSuccess))
              stat.lastSuccess = m.error != null ? 0 : now;
          } else
            stat = stats[m.plugin] = {
              total: 1,
              success: m.error != null ? 0 : 1,
              last: now,
              lastSuccess: m.error != null ? 0 : now,
            };
          stat.total += 1;
          stat.last = now;
          if (m.error == null) {
            stat.success += 1;
            stat.lastSuccess = now;
          }
        }
      }

      try {
        require("./function/print")(m, this, chatUpdate);
      } catch (e) {
        console.log(m, m.quoted, e);
      }
      if (opts["autoread"])
        await this.chatRead(
          m.chat,
          m.isGroup ? m.sender : undefined,
          m.id || m.key.id,
        ).catch(() => {});
    }
  },
  async participantsUpdate({ id, participants, action }) {
    if (opts["self"]) return;
    if (global.isInit) return;
    let chat = global.db.data.chats[id] || {};
    let text = "";
    switch (action) {
      case "add":
      case "remove":
        if (chat.welcome) {
          let groupMetadata =
            (await this.groupMetadata(id)) || (conn.chats[id] || {}).metadata;
          for (let user of participants) {
            let pp = "https://i.ibb.co/sQTkHLD/ppkosong.png";
            let name = await this.getName(user);
            let gpname = await this.getName(id);
            let member = groupMetadata.participants.length;
            pp: pp;
            try {
              pp = await this.profilePictureUrl(user, "image");
            } catch (e) {
            } finally {
              text = (
                action === "add"
                  ? (
                      chat.sWelcome ||
                      this.welcome ||
                      conn.welcome ||
                      "Welcome, @user!"
                    )
                      .replace("@subject", await this.getName(id))
                      .replace(
                        "@desc",
                        groupMetadata.desc
                          ? String.fromCharCode(8206).repeat(4001) +
                              groupMetadata.desc
                          : "",
                      )
                  : chat.sBye || this.bye || conn.bye || "Bye, @user!"
              ).replace("@user", "@" + user.split("@")[0]);
              let wel = pp;
              let lea = pp;
              this.sendMessage(
                id,
                {
                  document: fs.readFileSync("./package.json"),
                  fileName: wm,
                  mimetype: "application/pdf",
                  fileLength: 9999999,
                  pageCount: 2024,
                  caption: text,
                  contextInfo: {
                    mentionedJid: [user],
                    externalAdReply: {
                      title:
                        action === "add"
                          ? "W E L C O M E  U S E R"
                          : "G O O D B Y E  U S E R",
                      body: "",
                      thumbnailUrl: pp,
                      sourceUrl: null,
                      mediaType: 1,
                      renderLargerThumbnail: true,
                    },
                  },
                },
                { quoted: null },
              );
            }
          }
        }
        break;
      case "promote":
        text =
          chat.sPromote ||
          this.spromote ||
          conn.spromote ||
          "@user ```is now Admin```";
      case "demote":
        if (!text)
          text =
            chat.sDemote ||
            this.sdemote ||
            conn.sdemote ||
            "@user ```is no longer Admin```";
        text = text.replace("@user", "@" + participants[0].split("@")[0]);
        if (chat.detect) this.sendMessage(id, { text: text });
        break;
    }
  },
  async GroupUpdate({ jid, desc, descId, descTime, descOwner, announce, m }) {
    if (!db.data.chats[jid].desc) return;
    if (!desc) return;
    let caption = `
    @${descOwner.split`@`[0]} telah mengubah deskripsi grup.
    ${desc}
        `.trim();
    this.sendMessage(jid, caption, { quoted: m });
  },
}),

global.dfail = (type, m, conn) => {
    let imgr = 'https://telegra.ph/file/1d8541e8e0462625dfe12.jpg'
    let msg = {
        rowner: '🚩 Oops!, perintah ini khusus Owner!',
		owner: '🚩 Oops!, perintah ini khusus owner!',
		mods: '🚩 Oops!, perintah ini khusus Moderator!',
		premium: '🚩 Oops!, perintah ini khusus member Premium!',
		group: '🚩 Oops!, perintah ini hanya berlaku di group chat!',
		private: '🚩 Oops!, perintah ini hanya berlaku di private chat!',
		admin: '🚩 Oops!, perintah ini khusus Admin!',
		botAdmin: '🚩 Jadikan Airi sebagai admin agar bisa meng-akses perintah ini!',
        restrict: '🚩 Fitur ini dibatasi!'
    }[type]
    if (msg) return conn.sendMessage(m.chat, {
text: msg,
contextInfo: {
externalAdReply: {
title: "ᴀ ᴋ s ᴇ s - ᴅ ɪ ᴛ ᴏ ʟ ᴀ ᴋ",
thumbnailUrl: imgr,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: global.Fek})
    let msgg = {
        unreg: `mᴏʜᴏɴ ᴅᴀғᴛᴀʀ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ sᴇʙᴇʟᴜᴍ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ʙᴏᴛ ᴘɪʟɪʜ ᴏᴘsɪ ɪɴɪ ᴜɴᴛᴜᴋ ᴍᴇɴᴅᴀғᴛᴀʀ\n\n.ᴅᴀғᴛᴀʀ ɴᴀᴍᴀ.ᴜᴍᴜʀ\n\n.ᴠᴇʀɪғʏ`
    }[type]
    if (msgg) return conn.sendFooterText(m.chat, null, msgg, 'ᴍᴏʜᴏɴ ᴅᴀғᴛᴀʀ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ ᴋᴀᴋ!', global.Fek)
}
let chalk = require("chalk");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'handler.js'"));
  delete require.cache[file];
  if (global.reloadHandler) console.log(global.reloadHandler());
});
