const axios = require('axios');
const cheerio = require('cheerio');

/**
 * @description Function to generate images based on the provided prompt text
 * @returns JSON string with image URLs and additional information
 * @summary Creates images based on the given prompt
 * @param {string} prompt - The prompt text for creating images
 * 
 * @creator INS DEV
 * @credits ABOUT SCRAPERS MADE BY INS DEV
 * @copyright Copyright © 2024 INS DEV Images. All rights reserved.
 */
const text2img = async (prompt) => {
  try {
    const encodedPrompt = encodeURIComponent(prompt);

    const nganuData = await axios.post('https://hdstockimages.com/wp-admin/admin-ajax.php', 
      `action=HDStockAiImageForm&cookie_ai=1&inputPrompt=${encodedPrompt}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );

    const $ = cheerio.load(nganuData.data);

    const anuHeadings = [];
    $('h3').each((i, elem) => {
      const headingText = $(elem).text().trim();
      if (headingText) {
        anuHeadings.push(headingText);
      }
    });

    const anuUrls = [];
    $('figure.image-box a').each((i, elem) => {
      const imgSrc = $(elem).attr('href');
      if (imgSrc) {
        anuUrls.push(imgSrc);
      }
    });

    const result = [];
    let anuIndex = 0;

    anuHeadings.forEach(heading => {
      const images = [];
      for (let i = 1; i <= 4; i++) {
        if (anuIndex < anuUrls.length) {
          images.push({
            [`url${i}`]: anuUrls[anuIndex++],
            quality: 'HD'
          });
        } else {
          break;
        }
      }
      if (images.length > 0) {
        result.push({
          title: heading,
          images: images,
          type: 'text2img'
        });
      }
    });

    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching images:', error);
    return JSON.stringify({ error: 'Failed to fetch images' }, null, 2);
  }
};