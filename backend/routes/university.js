const express = require('express');
const router = express.Router();
const { getSpecificUniversity, getReviewFromUniversity } = require('../controllers/university');

// Route to get the details of the university
router.get('/', getSpecificUniversity);

// Route to get the reviews of the specific university
router.get('/:university_id/reviews', getReviewFromUniversity);


module.exports = router;