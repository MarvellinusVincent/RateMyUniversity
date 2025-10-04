const { pool } = require('../config/db');

const compareUniversities = async (req, res) => {
  const { uni1, uni2 } = req.query;

  if (!uni1 || !uni2) {
    return res.status(400).json({
      error: 'Both university IDs are required',
      details: {
        required: ['uni1', 'uni2'],
        received: { uni1: !!uni1, uni2: !!uni2 }
      }
    });
  }

  if (uni1 === uni2) {
    return res.status(400).json({
      error: 'Cannot compare a university with itself'
    });
  }

  try {
    const [uni1Data, uni2Data] = await Promise.all([
      getUniversityWithStats(uni1),
      getUniversityWithStats(uni2)
    ]);

    if (!uni1Data) {
      return res.status(404).json({
        error: `University with ID ${uni1} not found`
      });
    }

    if (!uni2Data) {
      return res.status(404).json({
        error: `University with ID ${uni2} not found`
      });
    }

    res.json({
      university1: uni1Data,
      university2: uni2Data
    });
  } catch (error) {
    console.error('Error comparing universities:', error);
    res.status(500).json({
      error: 'Failed to compare universities',
      message: error.message || 'Internal server error'
    });
  }
};

async function getUniversityWithStats(universityId) {
  try {
    const uniResult = await pool.query(
      'SELECT * FROM universities WHERE id = $1',
      [universityId]
    );

    if (uniResult.rows.length === 0) {
      return null;
    }

    const university = uniResult.rows[0];

    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE university_id = $1',
      [universityId]
    );

    const statsResult = await pool.query(
      `SELECT 
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
      WHERE university_id = $1`,
      [universityId]
    );

    const reviewCount = parseInt(countResult.rows[0].total);
    const averages = statsResult.rows[0];

    return {
      id: university.id,
      name: university.name,
      country: university.country,
      web_pages: university.web_pages,
      domains: university.domains,
      reviewCount: reviewCount,
      averages: {
        overall: Number(averages.overall) || 0,
        safety: Number(averages.safety) || 0,
        social: Number(averages.social) || 0,
        clubs: Number(averages.clubs) || 0,
        facilities: Number(averages.facilities) || 0,
        athletics: Number(averages.athletics) || 0,
        academic: Number(averages.academic) || 0,
        professors: Number(averages.professors) || 0,
        difficulty: Number(averages.difficulty) || 0,
        opportunities: Number(averages.opportunities) || 0,
        internet: Number(averages.internet) || 0,
        location: Number(averages.location) || 0,
        housing: Number(averages.housing) || 0,
        food: Number(averages.food) || 0,
        transportation: Number(averages.transportation) || 0,
        happiness: Number(averages.happiness) || 0,
      }
    };
  } catch (error) {
    console.error('Error fetching university stats:', error);
    throw error;
  }
}

module.exports = { compareUniversities };