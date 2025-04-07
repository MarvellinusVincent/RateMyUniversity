const express = require('express');
const router = express.Router();
const sitemap_controller = require('../controllers/sitemap_controller');
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, '../../frontend/public');

router.get('/sitemap-index.xml', async (req, res) => {
    try {
      await sitemap_controller.generateSitemaps();
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
      res.sendFile('sitemap-index.xml', { root: PUBLIC_DIR });
    } catch (err) {
      res.status(500).send('Sitemap generation failed');
    }
  });

router.get('/sitemap-universities-:chunkId.xml', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    res.sendFile(`sitemap-universities-${req.params.chunkId}.xml`, { 
      root: PUBLIC_DIR
    });
});

module.exports = router;