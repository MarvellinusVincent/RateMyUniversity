const { pool } = require('../config/db');

// Generate main sitemap index
exports.generateSitemapIndex = (req, res) => {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>https://ratemyuniversity.io/sitemap.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
            <loc>https://ratemyuniversity.io/sitemap-universities.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
    </sitemapindex>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapIndex);
};

// Generate main pages sitemap
exports.generateMainSitemap = (req, res) => {
    const mainPages = [
        { url: 'https://ratemyuniversity.io', lastmod: new Date().toISOString() }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    mainPages.forEach(page => {
        sitemap += `
        <url>
            <loc>${page.url}</loc>
            <lastmod>${page.lastmod}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>`;
    });

    sitemap += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
};

// Generate universities sitemap
exports.generateUniversitiesSitemap = async (req, res) => {
    try {
        const result = await pool.query('SELECT id FROM universities');
        const universityIds = result.rows;

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        universityIds.forEach(university => {
            sitemap += `
            <url>
                <loc>https://ratemyuniversity.io/university/${university.id}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>`;
        });

        sitemap += `\n</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error('Error generating universities sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
};