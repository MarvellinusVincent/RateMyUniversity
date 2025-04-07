const express = require('express');
const router = express.Router();
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, '../../frontend/public');

router.get('/sitemap*.xml', (req, res) => {
  const filePath = path.join(PUBLIC_DIR, req.path);
  
  res.set({
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=86400',
    'X-Robots-Tag': 'noindex'
  });
  res.removeHeader('X-Powered-By');
  res.removeHeader('X-Robots-Tag');
  res.removeHeader('X-Render-Origin-Server');
  
  
  res.sendFile(filePath, {
    lastModified: false,
    etag: false,
    cacheControl: false,
    headers: {
      // Override any auto-added headers
      'X-Powered-By': undefined,
      'X-Robots-Tag': undefined
    }
  });
});

const sendSitemap = (res, filename) => {
  const filePath = path.join(PUBLIC_DIR, filename);
  
  const gzPath = `${filePath}.gz`;
  if (fs.existsSync(gzPath)) {
    res.set({
      'Content-Type': 'application/xml',
      'Content-Encoding': 'gzip',
      'Cache-Control': 'public, max-age=86400'
    });
    return res.sendFile(gzPath, { lastModified: false });
  }
  res.removeHeader('X-Powered-By');
  res.removeHeader('X-Robots-Tag');
  res.removeHeader('X-Render-Origin-Server');

  res.set({
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=86400'
  });
  res.sendFile(filePath, { lastModified: false });
};

router.get('/sitemap-index.xml', (req, res) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('X-Robots-Tag');
  res.removeHeader('X-Render-Origin-Server');
  sendSitemap(res, 'sitemap-index.xml');
});

router.get('/sitemap-universities-:chunkId.xml', (req, res) => {
  sendSitemap(res, `sitemap-universities-${req.params.chunkId}.xml`);
});

module.exports = router;