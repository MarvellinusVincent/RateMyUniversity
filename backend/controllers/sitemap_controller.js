const fs = require('fs');
const { pool } = require('../config/db');
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, '../../frontend/public');

const generateSitemapChunk = (universities, isFirstChunk = false) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  if (isFirstChunk) {
    xml += `
      <url>
        <loc>https://ratemyuniversity.io/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;
  }

  universities.forEach(univ => {
    const lastmod = univ.updated_at 
      ? new Date(univ.updated_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    xml += `
      <url>
        <loc>https://ratemyuniversity.io/university/${univ.id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${isFirstChunk ? 0.8 : 0.6}</priority>
      </url>`;
  });
  xml += `</urlset>`;
  return xml;
};

exports.generateSitemaps = async () => {
  try {
    const { rows: universities } = await pool.query(
      'SELECT id, updated_at FROM universities'
    );
    const chunkSize = 50000;
    const totalChunks = Math.ceil(universities.length / chunkSize);

    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = universities.slice(i * chunkSize, (i + 1) * chunkSize);
      const chunkXml = generateSitemapChunk(chunk, i === 0);
      const chunkFilename = `sitemap-universities-${i + 1}.xml`;
      
      fs.writeFileSync(path.join(PUBLIC_DIR, `sitemap-universities-${i + 1}.xml`), chunkXml);
      indexXml += `
        <sitemap>
          <loc>https://ratemyuniversity.io/${chunkFilename}</loc>
        </sitemap>`;
    }

    indexXml += `</sitemapindex>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), indexXml);
    console.log('Sitemaps generated successfully!');
  } catch (err) {
    console.error('Sitemap generation failed:', err);
    throw err;
  }
};