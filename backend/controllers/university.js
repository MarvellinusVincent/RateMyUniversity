const { pool } = require('../config/db');

// Get all reviews for a specific university
const getReviewsByUniversity = async (req, res) => {
  const { university_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE university_id = $1',
      [university_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this university' });
    }
    res.status(200).json({
      message: 'Reviews fetched successfully',
      reviews: result.rows,
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = { getReviewsByUniversity };
