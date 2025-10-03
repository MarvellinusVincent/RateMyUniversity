const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.js'); 
const { submitReview, submitLike, checkIfLiked, deleteReview, getBulkLikeStatus } = require('../controllers/review_controller.js');

// Route to submit a review
router.post('/submit', submitReview);

// Route to like a review
router.post('/:id/like', authenticate, submitLike);

// Route to check if the user has liked a review before
router.get('/:id/hasLiked', authenticate, checkIfLiked);

// Route to delete review
router.delete('/delete/:id', authenticate, deleteReview);

router.get('/bulk-like-status', authenticate, getBulkLikeStatus);

module.exports = router;