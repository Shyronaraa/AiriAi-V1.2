const axios = require('axios');
const cheerio = require('cheerio');

class Nhentai {
  constructor() {
    this.baseURL = "https://nhentai.to";
  }
  
  latest() {
    return new Promise(async (resolve, reject) => {
      await axios.request({
        url: this.baseURL,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 11; RMX3261) AppleWebKit/537.36 (KHTML, Gecko) Chrome/108.0.0.0 Mobile Safari/537.36"
        }
      }).then(response => {
        const $ = cheerio.load(response.data);
        const result = $("div.container.index-container > div.gallery").map((_, el) => {
          return {
            id: $(el).find("a").attr("href").match(/\d+/)[0],
            title: $(el).find("a > div.caption").text().trim(),
            thumbnail: $(el).find("a > img").attr("data-src"),
            link: this.baseURL + $(el).find("a").attr("href")
          };
        }).get();
        resolve(result);
      }).catch(e => {
        reject(e);
      });
    });
  }
  
  search(query) {
    return new Promise(async (resolve, reject) => {
      await axios.request({
        baseURL: this.baseURL,
        url: "/search?q=" + encodeURIComponent(query),
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 11; RMX3261) AppleWebKit/537.36 (KHTML, Gecko) Chrome/108.0.0.0 Mobile Safari/537.36"
        }
      }).then(response => {
        const $ = cheerio.load(response.data);
        const result = $("div.container.index-container > div.gallery").map((_, el) => {
          return {
            id: $(el).find("a").attr("href").match(/\d+/)[0],
            title: $(el).find("a > div.caption").text().trim(),
            thumbnail: $(el).find("a > img").attr("src"),
            link: this.baseURL + $(el).find("a").attr("href")
          };
        }).get();
        resolve(result);
      }).catch(e => {
        reject(e);
      });
    });
  }
  
  get(id) {
    return new Promise(async (resolve, reject) => {
      await axios.request({
        url: this.baseURL + "/g/" + id,
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0 (Linux; Android 11; RMX3261) AppleWebKit/537.36 (KHTML, Gecko) Chrome/108.0.0.0 Mobile Safari/537.36"
        }
      }).then(response => {
        const $ = cheerio.load(response.data);
        const data = {
          id: "",
          title: "",
          titleJa: "",
          cover: "",
          parodies: [],
          characters: [],
          tags: [],
          artists: [],
          groups: [],
          languages: [],
          categories: [],
          uploaded: "",
          pages: []
        };
        data.id = $("div#info > h3").text().trim();
        data.title = $("div#info > h1").text().trim();
        data.cover = $("div#cover > a > img").attr("src");
        data.titleJa = $("div#info > h2").text().trim();
        data.uploaded = $("div.tag-container.field-name span.tags time").attr("datetime");
        $("div#thumbnail-container > div.thumb-container").each((index, element) => {
          const pages = $(element).find("a > img").attr("data-src");
          data.pages.push(pages);
        });
        $("a.tag.tag-66049").each((index, element) => {
          const parodyName = $(element).find("span.name").text();
          data.parodies.push(parodyName);
        });
        $("a.tag.tag-62150, a.tag.tag-62151").each((index, element) => {
          const characterName = $(element).find("span.name").text();
          data.characters.push(characterName);
        });
        $("a.tag").not(".tag-66049, .tag-62150, .tag-62151").each((index, element) => {
          const tagName = $(element).find("span.name").text();
          data.tags.push(tagName);
        });
        $("a.tag.tag-19368").each((index, element) => {
          const artistName = $(element).find("span.name").text();
          data.artists.push(artistName);
        });
        $("a.tag.tag-22152").each((index, element) => {
          const groupName = $(element).find("span.name").text();
          data.groups.push(groupName);
        });
        $("a.tag.tag-19, a.tag.tag-17").each((index, element) => {
          const languageName = $(element).find("span.name").text();
          data.languages.push(languageName);
        });
        $("a.tag.tag-9").each((index, element) => {
          const categoryName = $(element).find("span.name").text();
          data.categories.push(categoryName);
        });
        resolve(data);
      }).catch(e => {
        reject(e);
      });
    });
  }
}

module.exports = { Nhentai };