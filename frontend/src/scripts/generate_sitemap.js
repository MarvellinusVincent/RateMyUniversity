const fs = require('fs');
const axios = require('axios');

(async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/specificUni/ids`);
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
    console.log('Sitemap generated successfully!');

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
  } catch (error) {
    console.error('Failed to generate sitemap:', error.message);
    process.exit(1);
  }
})();