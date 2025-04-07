const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); 
const { submitReview, submitLike, checkIfLiked } = require('../controllers/review_controller.js');

// Route to submit a review
router.post('/submit', submitReview);

// Route to like a review
router.post('/:id/like', authenticate, submitLike);

// Route to check if the user has liked a review before
router.get('/:id/hasLiked', authenticate, checkIfLiked);


module.exports = router;