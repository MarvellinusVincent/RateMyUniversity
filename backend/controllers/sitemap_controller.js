require('dotenv').config();
const fs = require('fs').promises;
const fsSync = require('fs'); 
const { pool } = require('../config/db');
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, '../../frontend/public');
const BASE_URL = 'https://ratemyuniversity.io';

const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
];

const generateSitemapChunk = (universities, chunkId) => {
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  if (chunkId === 1) {
    STATIC_PAGES.forEach(page => {
      xml += `  <url><loc>${BASE_URL}${page.url}</loc><lastmod>${today}</lastmod></url>\n`;
    });
  }

  universities.forEach(univ => {
    xml += `  <url><loc>${BASE_URL}/university/${univ.id}</loc><lastmod>${today}</lastmod></url>\n`;
  });

  xml += '</urlset>';
  return xml;
};

exports.generateSitemaps = async () => {
  try {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });

    const { rows: universities } = await pool.query(
      'SELECT id, updated_at FROM universities ORDER BY updated_at DESC'
    );

    const chunkSize = 50000;
    const totalChunks = Math.ceil(universities.length / chunkSize);
    const today = new Date().toISOString().split('T')[0];

    let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (let i = 0; i < totalChunks; i++) {
      const chunk = universities.slice(i * chunkSize, (i + 1) * chunkSize);
      const chunkXml = generateSitemapChunk(chunk, i + 1);  // Sync function
      const filename = `sitemap-universities-${i + 1}.xml`;
      
      await fs.writeFile(path.join(PUBLIC_DIR, filename), chunkXml);
      
      indexXml += `  <sitemap><loc>${BASE_URL}/${filename}</loc><lastmod>${today}</lastmod></sitemap>\n`;
    }

    indexXml += '</sitemapindex>';
    await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap-index.xml'), indexXml);

    console.log(`✅ Generated ${totalChunks} sitemap files`);
  } catch (err) {
    console.error('❌ Sitemap generation failed:', err);
    throw err;
  }
};