const express = require('express');
const router = express.Router();
const { getReviewsByUniversity } = require('../controllers/university');

// Route to submit a review
router.get('/university/:university_id/reviews', getReviewsByUniversity);

module.exports = router;