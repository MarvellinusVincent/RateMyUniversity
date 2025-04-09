const { pool } = require('../config/db');

const searchUniversityLimit = async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    try {
      const result = await pool.query(
        'SELECT id, name, country FROM universities WHERE name ILIKE $1 LIMIT 10', 
        [`%${query}%`]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error searching universities:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

const searchUniversityAll = async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    try {
      const result = await pool.query(
        'SELECT id, name, country FROM universities WHERE name ILIKE $1', 
        [`%${query}%`]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error searching universities:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { searchUniversityAll, searchUniversityLimit };