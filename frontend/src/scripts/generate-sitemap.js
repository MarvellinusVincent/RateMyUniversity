const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

(async () => {
  try {
    const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://ratemyuniversity.io/sitemap-universities.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
      <sitemap>
        <loc>https://ratemyuniversity.io/sitemap-reviews.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    </sitemapindex>`;
    fs.writeFileSync('public/sitemap.xml', mainSitemap);
    console.log('Main Sitemap generated successfully!');

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/specificUni/all_university_ids`);
    const universities = response.data;
    const lastModDate = new Date().toISOString();

    const uniSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${universities.map(university => `
        <url>
          <loc>https://ratemyuniversity.io/university/${university.id}</loc>
          <lastmod>${lastModDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;
    fs.writeFileSync('public/sitemap-universities.xml', uniSitemap);
    console.log('University Sitemap generated!');

    const reviewSitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${universities.map(university => `
        <url>
          <loc>https://ratemyuniversity.io/addReview/${university.id}</loc>
          <lastmod>${lastModDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>`;
    fs.writeFileSync('public/sitemap-reviews.xml', reviewSitemap);
    console.log('Review Sitemap generated!');
  } catch (error) {
    console.error('Failed to generate sitemap:', error.message);
    process.exit(1);
  }
})();