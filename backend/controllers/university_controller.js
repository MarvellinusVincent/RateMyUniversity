const { pool } = require('../config/db');

// Get all details of the university from the university table in the database
const getSpecificUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM universities WHERE id = $1', [id]);
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sort = req.query.sort || 'recent';
  const offset = (page - 1) * limit;
  
  // Determine sort order
  let orderBy;
  if (sort === 'recent') {
    orderBy = 'r.created_at DESC';
  } else if (sort === 'popular') {
    orderBy = 'COALESCE(l.like_count, 0) DESC, r.created_at DESC';
  } else {
    orderBy = 'r.created_at DESC';
  }

  try {
    const [reviewsResult, countResult, statsResult] = await Promise.all([
      pool.query(`
        SELECT r.*, u.username, COALESCE(l.like_count, 0) as likes
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN (
          SELECT review_id, COUNT(*) as like_count
          FROM review_likes
          GROUP BY review_id
        ) l ON r.id = l.review_id
        WHERE r.university_id = $1
        ORDER BY ${orderBy}
        LIMIT $2 OFFSET $3
      `, [university_id, limit, offset]),
      
      pool.query(`
        SELECT COUNT(*) as total
        FROM reviews
        WHERE university_id = $1
      `, [university_id]),
      
      pool.query(`
        SELECT 
          COALESCE(ROUND(AVG(overall_rating)::numeric, 1), 0) as overall,
          COALESCE(ROUND(AVG(safety_rating)::numeric, 1), 0) as safety,
          COALESCE(ROUND(AVG(social_life_rating)::numeric, 1), 0) as social,
          COALESCE(ROUND(AVG(clubs_rating)::numeric, 1), 0) as clubs,
          COALESCE(ROUND(AVG(facilities_rating)::numeric, 1), 0) as facilities,
          COALESCE(ROUND(AVG(athletics_rating)::numeric, 1), 0) as athletics,
          COALESCE(ROUND(AVG(academic_rating)::numeric, 1), 0) as academic,
          COALESCE(ROUND(AVG(professors_rating)::numeric, 1), 0) as professors,
          COALESCE(ROUND(AVG(difficulty_rating)::numeric, 1), 0) as difficulty,
          COALESCE(ROUND(AVG(opportunities_rating)::numeric, 1), 0) as opportunities,
          COALESCE(ROUND(AVG(internet_rating)::numeric, 1), 0) as internet,
          COALESCE(ROUND(AVG(location_rating)::numeric, 1), 0) as location,
          COALESCE(ROUND(AVG(housing_rating)::numeric, 1), 0) as housing,
          COALESCE(ROUND(AVG(food_rating)::numeric, 1), 0) as food,
          COALESCE(ROUND(AVG(transportation_rating)::numeric, 1), 0) as transportation,
          COALESCE(ROUND(AVG(happiness_rating)::numeric, 1), 0) as happiness
        FROM reviews
        WHERE university_id = $1
      `, [university_id])
    ]);
    
    const totalReviews = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalReviews / limit);
    
    const averages = statsResult.rows[0] || {
      overall: 0, safety: 0, social: 0, clubs: 0, facilities: 0,
      athletics: 0, academic: 0, professors: 0, difficulty: 0,
      opportunities: 0, internet: 0, location: 0, housing: 0,
      food: 0, transportation: 0, happiness: 0
    };
    
    res.json({ 
      reviews: reviewsResult.rows,
      averages: averages,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalReviews: totalReviews,
        reviewsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

const getAllUniversityIDs = async (req, res) =>  {
  try {
    const result = await pool.query('SELECT id, name FROM universities');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const getUniversityName = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'University ID is required',
      details: {
        parameter: 'id',
        expected: 'Number or UUID string',
        received: id
      }
    });
  }

  try {
    const { rows } = await pool.query(
      'SELECT name FROM universities WHERE id = $1', 
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: `University with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    
    if (error.code === '22P02') {
      return res.status(400).json({
        success: false,
        error: 'Invalid university ID format',
        details: {
          expected: 'Number or valid UUID',
          received: id
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Database operation failed'
    });
  }
};

const FeaturedUniversities = async(req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, COUNT(v.id) as review_count
      FROM universities u
      LEFT JOIN reviews v ON u.id = v.university_id
      GROUP BY u.id
      ORDER BY review_count DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


module.exports = { getSpecificUniversity, getReviewFromUniversity, getAllUniversityIDs, getUniversityName, FeaturedUniversities };
