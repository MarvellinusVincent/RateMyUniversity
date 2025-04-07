const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemap_controller');

router.get('/sitemap-index.xml', sitemapController.generateSitemapIndex);
router.get('/sitemap.xml', sitemapController.generateMainSitemap);
router.get('/sitemap-universities.xml', sitemapController.generateUniversitiesSitemap);

module.exports = router;