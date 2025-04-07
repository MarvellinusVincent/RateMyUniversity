const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

(async () => {
  try {
    const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://ratemyuniversity.io</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    </urlset>`;
    fs.writeFileSync('public/sitemap.xml', mainSitemap);
    console.log('Main Sitemap generated successfully!');

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/specificUni/all_university_ids`);
    const universities = response.data;

    const uniSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${universities.map(university => `
          <url>
            <loc>https://ratemyuniversity.io/university/${university.id}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `).join('')}
      </urlset>`;
    fs.writeFileSync('public/sitemap-universities.xml', uniSitemap);
    console.log('University Sitemap generated successfully!');

    const reviewSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${universities.map(university => `
          <url>
            <loc>https://ratemyuniversity.io/addReview/${university.id}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>
        `).join('')}
      </urlset>`;
    fs.writeFileSync('public/sitemap-reviews.xml', reviewSitemap);
    console.log('Review sitemap generated successfully!');
  } catch (error) {
    console.error('Failed to generate sitemap:', error.message);
    process.exit(1);
  }
})();