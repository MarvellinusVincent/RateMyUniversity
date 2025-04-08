const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const CHUNK_SIZE = 2000;
const BASE_URL = 'https://ratemyuniversity.io';

(async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/specificUni/all_university_ids`);
    const universities = response.data;
    const lastModDate = new Date().toISOString();

    const universityChunks = [];
    for (let i = 0; i < universities.length; i += CHUNK_SIZE) {
      universityChunks.push(universities.slice(i, i + CHUNK_SIZE));
    }

    // --- 1. Generate university sitemap chunks ---
    const universitySitemapEntries = [];
    universityChunks.forEach((chunk, index) => {
      const chunkXml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${chunk.map(u => `
          <url>
            <loc>${BASE_URL}/university/${u.id}</loc>
            <lastmod>${lastModDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>`).join('')}
        </urlset>`;

      const filename = `sitemap-universities-${index}.xml`;
      fs.writeFileSync(`public/${filename}`, chunkXml);
      universitySitemapEntries.push(filename);
    });

    // --- 2. Generate review sitemap chunks ---
    const reviewSitemapEntries = [];
    universityChunks.forEach((chunk, index) => {
      const chunkXml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${chunk.map(u => `
          <url>
            <loc>${BASE_URL}/addReview/${u.id}</loc>
            <lastmod>${lastModDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>`).join('')}
        </urlset>`;

      const filename = `sitemap-reviews-${index}.xml`;
      fs.writeFileSync(`public/${filename}`, chunkXml);
      reviewSitemapEntries.push(filename);
    });

    // --- 3. Generate main sitemap index ---
    const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${[...universitySitemapEntries, ...reviewSitemapEntries].map(filename => `
        <sitemap>
          <loc>${BASE_URL}/${filename}</loc>
          <lastmod>${lastModDate}</lastmod>
        </sitemap>`).join('')}
      </sitemapindex>`;

    fs.writeFileSync('public/sitemap.xml', mainSitemap);
    console.log(`Generated:
      - 1 main sitemap.xml
      - ${universitySitemapEntries.length} university sitemaps
      - ${reviewSitemapEntries.length} review sitemaps`);

  } catch (error) {
    console.error('Failed to generate sitemap:', error.message);
    process.exit(1);
  }
})();