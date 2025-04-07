const express = require('express');
const router = express.Router();
const { getSpecificUniversity, getReviewFromUniversity, getAllUniversityIDs } = require('../controllers/university');

router.get('/all_university_ids', getAllUniversityIDs);

// Route to get the details of the university
router.get('/:id', getSpecificUniversity);

// Route to get the reviews of the specific university
router.get('/:university_id/reviews', getReviewFromUniversity);


module.exports = router;