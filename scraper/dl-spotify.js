/** 
 *  Created By Muhammad Adriansyah
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xyzencode
 *  My Instagram : https://instagram.com/xyzencode
 *  My Youtube : https://youtube.com/@xyzencode
*/

const dScrape = require("d-scrape");
const Spotify = require("spotifydl-x");

const spotify = new Spotify.default({ clientId: '941540aaf96c456a9d1ad7ea26817da0', clientSecret: '07d4dd6ed5634187b525566b9e328517' });

async function downloadTrack(url) {
    try {
        const res = await spotify.downloadTrack(url);
        const buffer = Buffer.from(res, 'binary');
        return buffer;
    } catch (e) {
        console.error(e)
        return null;
    }
}

async function searchSpoti(query) {
    const data = await dScrape.search.spotifySearch(query);
    const result = []
    data.map((data) => {
        result.push({
            name: data.album.name,
            image: data.album.images[0].url,
            url: data.external_urls.spotify,
            artist: data.artists[0].name,
            duration: (data.duration_ms / 1000).toFixed(0),
        })
    })
    return result;
}

module.exports = { downloadTrack, searchSpoti }