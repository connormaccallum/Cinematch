const db = require('../config/db');
const tmdbService = require('../services/tmdbService');

// fetch all interactions for logged in user
const getWatchlist = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT
                umi.InteractionID  AS "interactionId",
                umi.ListStatus     AS "listStatus",
                umi.DateAdded      AS "dateAdded",
                umi.DateWatched    AS "dateWatched",
                m.MovieID          AS "movieId",
                m.Title            AS "title",
                m.PosterPath       AS "posterPath",
                m.ReleaseDate      AS "releaseDate",
                m.AvgRating        AS "avgRating"
            FROM UserMovieInteraction umi
            JOIN Movie m ON umi.MovieID = m.MovieID
            WHERE umi.UserID = $1
            ORDER BY umi.DateAdded DESC`,
            [req.user.userid]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getWatchlist:', error.message);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
};

// add movie to want to watch list
// checks if movie exists locally first
const addToWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({ error: 'movieId is required' });
        }

        // ensure the movie exists locally, or fetch if needed
        await tmdbService.getOrFetchMovie(movieId);

        // insert the interaction
        const result = await db.query(
            `INSERT INTO UserMovieInteraction (UserID, MovieID, ListStatus)
             VALUES ($1, $2, 'WANT_TO_WATCH')
             ON CONFLICT (UserID, MovieID) DO NOTHING
             RETURNING InteractionID AS "interactionId", ListStatus AS "listStatus", DateAdded AS "dateAdded"`,
            [req.user.userid, movieId]
        );

        // if the row already existed, return no rows
        // fetch the existing interaction to return consistent data
        if (result.rows.length === 0) {
            const existing = await db.query(
                `SELECT InteractionID AS "interactionId", ListStatus AS "listStatus", DateAdded AS "dateAdded"
                 FROM UserMovieInteraction
                 WHERE UserID = $1 AND MovieID = $2`,
                [req.user.userid, movieId]
            );
            return res.status(200).json(existing.rows[0]);
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in addToWatchlist:', error.message);
        res.status(500).json({ error: 'Failed to add movie to watchlist' });
    }
};

// update a WANT_TO_WATCH interaction to WATCHED and record the watch date
// only allows updating logged in user interactions 
const markAsWatched = async (req, res) => {
    try {
        const { interactionId } = req.params;

        const result = await db.query(
            `UPDATE UserMovieInteraction
             SET ListStatus = 'WATCHED', DateWatched = CURRENT_DATE
             WHERE InteractionID = $1 AND UserID = $2
             RETURNING InteractionID AS "interactionId", ListStatus AS "listStatus", DateWatched AS "dateWatched"`,
            [interactionId, req.user.userid]
        );

        // if no rows returned, either the interaction doesn't exist or belongs to another user
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Interaction not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error in markAsWatched:', error.message);
        res.status(500).json({ error: 'Failed to mark movie as watched' });
    }
};

// remove a movie from the logged in user's watchlist
// only allows deleting interactions that belong to the logged in user
const removeFromWatchlist = async (req, res) => {
    try {
        const { interactionId } = req.params;

        const result = await db.query(
            `DELETE FROM UserMovieInteraction
             WHERE InteractionID = $1 AND UserID = $2
             RETURNING InteractionID AS "interactionId"`,
            [interactionId, req.user.userid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Interaction not found' });
        }

        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        console.error('Error in removeFromWatchlist:', error.message);
        res.status(500).json({ error: 'Failed to remove movie from watchlist' });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    markAsWatched,
    removeFromWatchlist
};