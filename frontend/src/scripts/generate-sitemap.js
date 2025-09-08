const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const CHUNK_SIZE = 2000;
const BASE_URL = 'https://ratemyuniversity.io';

// Static pages to include in sitemap
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/search/university', priority: '0.9', changefreq: 'daily' },
  { url: '/login', priority: '0.5', changefreq: 'monthly' },
  { url: '/signUp', priority: '0.5', changefreq: 'monthly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/guidelines', priority: '0.4', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/copyright', priority: '0.3', changefreq: 'yearly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' }
];

(async () => {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch universities with error handling
    let universities = [];
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/specificUni/all_university_ids`, {
        timeout: 30000 // 30 second timeout
      });
      universities = response.data;
      console.log(`Fetched ${universities.length} universities`);
    } catch (apiError) {
      console.error('Failed to fetch universities:', apiError.message);
      console.log('Continuing with static pages only...');
    }

    const lastModDate = new Date().toISOString();
    const allSitemapFiles = [];

    // --- 1. Generate static pages sitemap ---
    const staticSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const staticSitemapFile = 'sitemap-static.xml';
    fs.writeFileSync(`public/${staticSitemapFile}`, staticSitemapXml);
    allSitemapFiles.push(staticSitemapFile);
    console.log('Generated static pages sitemap');

    if (universities.length > 0) {
      // Split universities into chunks
      const universityChunks = [];
      for (let i = 0; i < universities.length; i += CHUNK_SIZE) {
        universityChunks.push(universities.slice(i, i + CHUNK_SIZE));
      }

      // --- 2. Generate university sitemap chunks ---
      universityChunks.forEach((chunk, index) => {
        const chunkXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(u => `  <url>
    <loc>${BASE_URL}/university/${u.id}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

        const filename = `sitemap-universities-${index}.xml`;
        fs.writeFileSync(`public/${filename}`, chunkXml);
        allSitemapFiles.push(filename);
      });

      // --- 3. Generate review sitemap chunks ---
      universityChunks.forEach((chunk, index) => {
        const chunkXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunk.map(u => `  <url>
    <loc>${BASE_URL}/addReview/${u.id}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

        const filename = `sitemap-reviews-${index}.xml`;
        fs.writeFileSync(`public/${filename}`, chunkXml);
        allSitemapFiles.push(filename);
      });

      console.log(`Generated ${universityChunks.length} university sitemaps and ${universityChunks.length} review sitemaps`);
    }

    // --- 4. Generate main sitemap index ---
    const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemapFiles.map(filename => `  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
    <lastmod>${lastModDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync('public/sitemap.xml', mainSitemap);

    console.log(`✅ Sitemap generation completed:
- 1 main sitemap.xml
- ${allSitemapFiles.length} total sitemap files`);

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    // Don't exit with error code to prevent build failure
    // process.exit(1);
  }
})();