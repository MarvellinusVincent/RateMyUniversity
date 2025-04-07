const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // Added fs import
const compression = require('compression');
require("dotenv").config();
const cron = require('node-cron');
const { generateSitemaps } = require('./controllers/sitemap_controller');

// Cron job for sitemaps
cron.schedule('0 3 * * 0', async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('[CRON] Auto-regenerating sitemaps...');
    try {
      await generateSitemaps();
      console.log('[CRON] Sitemaps regenerated');
    } catch (err) {
      console.error('[CRON] Sitemap regeneration failed:', err);
    }
  }
});

const app = express();

// Disable etag
app.set('etag', false);

// Enable compression
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    "https://ratemyuniversity.vercel.app",
    "https://ratemyuniversity.io",
    "http://localhost:3000",
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(bodyParser.json());

// Sitemap handling
app.use('/sitemap', express.static(path.join(__dirname, '../frontend/public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.removeHeader('ETag');
    }
  },
  maxAge: '1d'
}));

app.use((req, res, next) => {
  if (req.path.match(/sitemap.*\.xml$/)) {
    res.set({
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex'
    });
    res.removeHeader('ETag');
  }
  next();
});

// Static files with proper headers
app.use(express.static(path.join(__dirname, '../frontend/build'), {
  setHeaders: (res, path) => {
    // Set proper MIME types
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    
    // Cache control
    if (path.includes('/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
  maxAge: '1d'
}));

// API Routes
const userRoutes = require('./routes/user_routes');
const reviewRoutes = require('./routes/review_route');
const specificUniversityRoutes = require('./routes/university');
const searchUniversityRoutes = require('./routes/search_university');
const emailRoutes = require('./routes/email_route');
const sitemapRoutes = require('./routes/sitemap_route');

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/specificUni', specificUniversityRoutes);
app.use('/searchUniversity', searchUniversityRoutes);
app.use('/email', emailRoutes);
app.use('/', sitemapRoutes);

// Database connection
const { pool } = require('./config/db');
pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Error connecting to the database", err));

// Client-side routing fallback - MUST BE LAST
const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});