const express = require('express');
const router = express.Router();
const { getSpecificUniversity, getReviewFromUniversity, getAllUniversityIDs, getUniversityName, FeaturedUniversities } = require('../controllers/university');

router.get('/university_name/:id', getUniversityName);

router.get('/all_university_ids', getAllUniversityIDs);

router.get('/getFeaturedUniversities', FeaturedUniversities);

// Route to get the details of the university
router.get('/:id', getSpecificUniversity);

// Route to get the reviews of the specific university
router.get('/:university_id/reviews', getReviewFromUniversity);


module.exports = router;