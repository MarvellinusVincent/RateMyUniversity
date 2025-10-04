const { pool } = require('../config/db');

const searchUniversityLimit = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.country, COUNT(r.id) as review_count
       FROM universities u
       LEFT JOIN reviews r ON u.id = r.university_id
       WHERE u.name ILIKE $1
       GROUP BY u.id
       ORDER BY review_count DESC
       LIMIT 10`,
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
      `SELECT u.id, u.name, u.country, COUNT(r.id) as review_count
       FROM universities u
       LEFT JOIN reviews r ON u.id = r.university_id
       WHERE u.name ILIKE $1
       GROUP BY u.id
       ORDER BY review_count DESC`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching universities:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { searchUniversityAll, searchUniversityLimit };