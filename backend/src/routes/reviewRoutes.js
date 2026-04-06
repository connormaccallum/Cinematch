const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const requireAuth = require('../middleware/requireAuth');

// get all reviews for a movie
router.get('/:movieId', reviewController.getReviewsForMovie);

// submit a review which requires auth
router.post('/:movieId', requireAuth, reviewController.addReview);

module.exports = router;