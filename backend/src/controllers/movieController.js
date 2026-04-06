// movie service to handle data logic
const tmdbService = require('../services/tmdbService');

// coordinate between request and service to return movie details
const getMovieDetails = async (req, res) => {
    try {
        const { id } = req.params;
        // find movie locally or fetch from TBDb
        const movie = await tmdbService.getOrFetchMovie(id);

        // 404 if movie not found in either
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // return movie data as JSON w/ success status
        res.status(200).json(movie);
    } catch (error) {
        console.error('Error in getMovieDetails:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
};

// coordinate between request and service to return search results
const searchMovies = async (req, res) => {
    try {
        // extract search query from query string
        const { q: query, page } = req.query;

        // validate that query is provided
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // fetch search results from TMDb
        const results = await tmdbService.searchMovies(query, page || 1);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search for movies' });
    }
};

// coordinate between request and service to return trending movies
const getTrendingMovies = async (req, res) => {
    try {
        // extract page number from query string for pagination
        const { page } = req.query;

        // fetch trending movies from TMDb
        const movies = await tmdbService.getTrendingMovies(page || 1);
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error in getTrendingMovies:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
};

// export controller functions for use in routes
module.exports = {
    getMovieDetails,
    searchMovies,
    getTrendingMovies
};