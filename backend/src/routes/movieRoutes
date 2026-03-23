// import express and controllers for movie routes
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// map trending endpoint for fetching trending movies
router.get('/trending', movieController.getTrendingMovies);

// map search endpoint for searchng by title
router.get('/search', movieController.searchMovies);

// map details endpoint for searching by ID
router.get('/:id', movieController.getMovieDetails);

module.exports = router;