const db = require('../config/db');

// fetch all reviews for a given movie
// no auth required to read reviews
const getReviewsForMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const result = await db.query(
            `SELECT
                r.ReviewID AS "reviewId",
                r.Rating AS "rating",
                r.Review AS "text",
                r.DateRated AS "dateRated",
                u.Username AS "username",
                u.UserID AS "userId"
            FROM Review r
            JOIN UserMovieInteraction umi ON r.InteractionID = umi.InteractionID
            JOIN "User" u ON umi.UserID = u.UserID
            WHERE umi.MovieID = $1
            ORDER BY r.DateRated DESC`,
            [movieId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getReviewsForMovie:', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// submit a review for a movie the logged in user has watched
const addReview = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating, text } = req.body;

        // validate rating is between 1-10
        if (!rating || rating < 1 || rating > 10) {
            return res.status(400).json({ error: 'Rating must be between 1 and 10' });
        }

        // find the interaction for this user and movie
        const interactionResult = await db.query(
            `SELECT InteractionID AS "interactionId", ListStatus AS "listStatus"
             FROM UserMovieInteraction
             WHERE UserID = $1 AND MovieID = $2`,
            [req.user.userid, movieId]
        );

        // user has not added this movie to their watchlist at all
        if (interactionResult.rows.length === 0) {
            return res.status(403).json({ error: 'You must watch this movie before reviewing it' });
        }

        const interaction = interactionResult.rows[0];

        // user has the movie saved but hasn't marked it as watched yet
        if (interaction.listStatus !== 'WATCHED') {
            return res.status(403).json({ error: 'You must mark this movie as watched before reviewing it' });
        }

        // insert or update the review
        // if review exists, will be updated because only one review per movie 
        const result = await db.query(
            `INSERT INTO Review (InteractionID, Rating, Review)
             VALUES ($1, $2, $3)
             ON CONFLICT (InteractionID) DO UPDATE
                SET Rating = EXCLUDED.Rating,
                    Review = EXCLUDED.Review,
                    DateRated = CURRENT_DATE
             RETURNING ReviewID AS "reviewId", Rating AS "rating", Review AS "text", DateRated AS "dateRated"`,
            [interaction.interactionId, rating, text || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in addReview:', error.message);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

module.exports = {
    getReviewsForMovie,
    addReview
};