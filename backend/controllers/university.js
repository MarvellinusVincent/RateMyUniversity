const { pool } = require('../config/db');

// Get all details of the university from the university table in the database
const getSpecificUniversity = async (req, res) => {
  const { name } = req.query;
  try {
    const result = await pool.query('SELECT * FROM universities WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }
    const university = result.rows[0];
    res.json({
      id: university.id,
      name: university.name,
      country: university.country,
      web_pages: university.web_pages,
      domains: university.domains,
    });
  } catch (error) {
    console.error('Error fetching university details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all reviews of the university
const getReviewFromUniversity = async (req, res) => {
  const { university_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE university_id = $1', [university_id]);
    res.status(200).json({
      message: 'Reviews fetched successfully',
      reviews: result.rows,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = { getSpecificUniversity, getReviewFromUniversity };
