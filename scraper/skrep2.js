const cheerio = require("cheerio");
const formData = require("form-data");

async function igdl(url) {
  let res = await axios("https://indown.io/");
  let _$ = cheerio.load(res.data);
  let referer = _$("input[name=referer]").val();
  let locale = _$("input[name=locale]").val();
  let _token = _$("input[name=_token]").val();
  let { data } = await axios.post(
    "https://indown.io/download",
    new URLSearchParams({
      link: url,
      referer,
      locale,
      _token,
    }),
    {
      headers: {
        cookie: res.headers["set-cookie"].join("; "),
      },
    },
  );
  let $ = cheerio.load(data);
  let result = [];
  let __$ = cheerio.load($("#result").html());
  __$("video").each(function () {
    let $$ = $(this);
    result.push({
      type: "video",
      thumbnail: $$.attr("poster"),
      url: $$.find("source").attr("src"),
    });
  });
  __$("img").each(function () {
    let $$ = $(this);
    result.push({
      type: "image",
      url: $$.attr("src"),
    });
  });

  return result;
}
const APIs = {
  1: "https://apkcombo.com",
  2: "apk-dl.com",
  3: "https://apk.support",
  4: "https://apps.evozi.com/apk-downloader",
  5: "http://ws75.aptoide.com/api/7",
  6: "https://cafebazaar.ir",
};
const Proxy = (url) =>
  url
    ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp`
    : "";
const api = (ID, path = "/", query = {}) =>
  (ID in APIs ? APIs[ID] : ID) +
  path +
  (query
    ? "?" +
      new URLSearchParams(
        Object.entries({
          ...query,
        }),
      )
    : "");

const tools = {
  APIs,
  Proxy,
  api,
};

let apkcombo = {
  search: async function (args) {
    let res = await fetch(
      tools.Proxy(
        tools.api(1, "/search/" + encodeURIComponent(args.replace(" ", "-"))),
      ),
    );
    let ress = [];
    res = await res.text();
    let $ = cheerio.load(res);
    let link = [];
    let name = [];
    $("div.content-apps > a").each(function (a, b) {
      let nem = $(b).attr("title");
      name.push(nem);
      link.push(
        $(b)
          .attr("href")
          .replace(
            "https://apkcombo-com.translate.goog/",
            "https://apkcombo.com/",
          )
          .replace("/?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp", ""),
      );
    });
    for (var i = 0; i < (name.length || link.length); i++) {
      ress.push({
        name: name[i],
        link: link[i],
      });
    }
    return ress;
  },
  download: async function (url) {
    let res = await fetch(url);
    res = await res.text();
    let $ = cheerio.load(res);
    let img = $("div.app_header.mt-14 > div.avatar > img").attr("data-src");
    let developer = $(
      "div.container > div > div.column.is-main > div.app_header.mt-14 > div.info > div.author > a",
    ).html();
    let appname = $(
      "div.container > div > div.column.is-main > div.app_header.mt-14 > div.info > div.app_name > h1",
    ).text();
    let link1 =
      "https://apkcombo.com" +
      $(
        "div.container > div > div.column.is-main > div.button-group.mt-14.mb-14.is-mobile-only > a",
      ).attr("href");
    res = await fetch(link1);
    res = await res.text();
    $ = cheerio.load(res);
    let link =
      $("#best-variant-tab > div:nth-child(1) > ul > li > ul > li > a").attr(
        "href",
      ) + "&fp=945d4e52764ab9b1ce7a8fba0bb8d68d&ip=160.177.72.111";
    return {
      img,
      developer,
      appname,
      link,
    };
  },
};

let apkdl = {
  search: async function (args) {
    let res = await fetch(
      tools.Proxy(
        tools.api(2, "/search", {
          q: args,
        }),
      ),
    );
    res = await res.text();

    let $ = cheerio.load(res);

    let link = [];
    let name = [];
    let ress = [];
    $("a.title").each(function (a, b) {
      let nem = $(b).text();
      name.push(nem);
      link.push(
        $(b)
          .attr("href")
          .replace("https://apk--dl-com.translate.goog/", "https://apk-dl.com/")
          .replace("?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp", ""),
      );
    });
    for (var i = 0; i < (name.length || link.length); i++) {
      ress.push({
        name: name[i],
        link: link[i],
      });
    }
    return ress;
  },
  download: async function (url) {
    let res = await fetch(tools.Proxy(url));
    res = await res.text();
    let $ = cheerio.load(res);
    let img = $("div.logo > img").attr("src");
    let developer = $("div.developer > a").attr("title");
    let appname = $("div.heading > h1 > a").attr("title");
    let link2 = $(
      "div.download-btn > div > a.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect.fixed-size.mdl-button--primary",
    ).attr("href");
    res = await fetch(link2);
    res = await res.text();
    $ = cheerio.load(res);
    let link1 = $("head > meta:nth-child(11)").attr("content");
    link1 = link1.replace("0; url=", "");
    res = await fetch(link1);
    res = await res.text();
    $ = cheerio.load(res);
    let link =
      `https:// ` +
      $(
        "body > div.mdl-layout.mdl-js-layout.mdl-layout--fixed-header > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(3) > a",
      ).attr("href");
    return { img, developer, appname, link };
  },
};

let aptoide = {
  search: async function (args) {
    let res = await fetch(
      tools.api(5, "/apps/search", {
        query: args,
        limit: 1000,
      }),
    );

    let ress = {};
    res = await res.json();
    ress = res.datalist.list.map((v) => {
      return {
        name: v.name,
        id: v.package,
      };
    });
    return ress;
  },
  download: async function (id) {
    let res = await fetch(
      tools.api(5, "/apps/search", {
        query: id,
        limit: 1,
      }),
    );

    res = await res.json();
    return {
      img: res.datalist.list[0].icon,
      developer: res.datalist.list[0].store.name,
      appname: res.datalist.list[0].name,
      link: res.datalist.list[0].file.path,
    };
  },
};
const tiktok = {
  v1: async function tiktok(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const encodedParams = new URLSearchParams();
        encodedParams.set("url", query);
        encodedParams.set("hd", "1");

        const response = await axios({
          method: "POST",
          url: "https://tikwm.com/api/",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: "current_language=en",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
          data: encodedParams,
        });
        const videos = response.data;
        resolve(videos);
      } catch (error) {
        reject(error);
      }
    });
  },
  v2: async function tiktok2(url) {
    let result = {};
    const bodyForm = new formData();
    bodyForm.append("q", url);
    bodyForm.append("lang", "id");
    try {
      const { data } = await axios(`https://savetik.co/api/ajaxSearch`, {
        method: "post",
        data: bodyForm,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "User-Agent": "PostmanRuntime/7.32.2",
        },
      });
      const $ = cheerio.load(data.data);
      result.status = true;
      result.caption = $(
        "div.video-data > div > .tik-left > div > .content > div > h3",
      ).text();
      (result.server1 = {
        quality: "MEDIUM",
        url: $(
          "div.video-data > div > .tik-right > div > p:nth-child(1) > a",
        ).attr("href"),
      }),
        (result.serverHD = {
          quality: $(
            "div.video-data > div > .tik-right > div > p:nth-child(3) > a",
          )
            .text()
            .split("MP4 ")[1],
          url: $(
            "div.video-data > div > .tik-right > div > p:nth-child(3) > a",
          ).attr("href"),
        }),
        (result.audio = $(
          "div.video-data > div > .tik-right > div > p:nth-child(4) > a",
        ).attr("href"));
      return result;
    } catch (err) {
      result.status = false;
      result.message = "Gatau kenapa";
      console.log(result);
      return result;
    }
  },
};
function facebook(t) {
  return new Promise(async (e, a) => {
    const i = await fetch("https://www.getfvid.com/downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.getfvid.com/",
        },
        body: new URLSearchParams(
          Object.entries({
            url: t,
          }),
        ),
      }),
      o = cheerio.load(await i.text());
    e({
      result: {
        url: t,
        title: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a",
        ).text(),
        time: o("#time").text(),
        hd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a",
        ).attr("href"),
        sd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a",
        ).attr("href"),
        audio: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a",
        ).attr("href"),
      },
    });
  });
}
module.exports = {
  igdl,
  apkdl,
  apkcombo,
  aptoide,
  tiktok,
  facebook,
};

let fs = require("fs");
let chalk = require("chalk");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update scrape"));
  delete require.cache[file];
  require(file);
});