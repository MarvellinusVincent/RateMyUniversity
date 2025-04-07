const express = require('express');
const router = express.Router();
const { getSpecificUniversity, getReviewFromUniversity, getAllUniversityIDs } = require('../controllers/university');

// Route to get the details of the university
router.get('/:id', getSpecificUniversity);

// Route to get the reviews of the specific university
router.get('/:university_id/reviews', getReviewFromUniversity);

router.get('/ids', getAllUniversityIDs);


module.exports = router;