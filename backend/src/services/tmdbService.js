// Import axios for making HTTP requests and db for database interactions
const axios = require('axios');
const db = require('../config/db');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

const getOrFetchMovie = async (movieID) => {
    try {
        // Check if movie exists in local db
        const localMovie = await db.query(`
            SELECT m.*, 
            ARRAY_AGG(DISTINCT g.GenreName) AS genres,
            (SELECT JSON_AGG(CAST_LIST) FROM (
                SELECT p.Name as name, mc.CharacterName as character, p.ProfilePicture as profilePath
                FROM MovieCredit mc
                JOIN Person p ON mc.PersonID = p.PersonID
                WHERE mc.MovieID = m.MovieID AND mc.CreditType = 'CAST'
                LIMIT 10
            ) CAST_LIST) AS cast,
            (SELECT JSON_BUILD_OBJECT('name', p.Name, 'profilePicture', p.ProfilePicture)
                FROM MovieCredit mc
                JOIN Person p ON mc.PersonID = p.PersonID
                WHERE mc.MovieID = m.MovieID AND mc.CreditType = 'CREW' AND mc.Job = 'Director'
                LIMIT 1) AS director
            FROM Movie m
            LEFT JOIN MovieGenre mg ON m.MovieID = mg.MovieID
            LEFT JOIN Genre g ON mg.GenreID = g.GenreID
            WHERE m.MovieID = $1
            GROUP BY m.MovieID`, [movieID]
        );

        if (localMovie.rows.length > 0) {
            console.log(`Movie ${movieID} found in local database`);
            return formatMovie(localMovie.rows[0]);
        }

        // If not found, fetch from TMDb
        console.log(`Movie ${movieID} not found. Fetching from TMDb...`);
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieID}?append_to_response=credits`, {
            headers: {
                Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
            }
        });

        const movieData = response.data;

        await db.query('BEGIN');

        // Insert movie data into Movie table
        await db.query(
            'INSERT INTO Movie (MovieID, Title, Synopsis, ReleaseDate, Runtime, PosterPath, AvgRating) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (MovieID) DO NOTHING',
            [movieData.id, movieData.title, movieData.overview, movieData.release_date, movieData.runtime, movieData.poster_path, movieData.vote_average]
        );

        // Insert genre and movieGenre data into Genre and MovieGenre tables
        for (const genre of movieData.genres) {
            await db.query(
                'INSERT INTO Genre (GenreID, GenreName) VALUES ($1, $2) ON CONFLICT (GenreID) DO NOTHING',
                [genre.id, genre.name]
            );
            await db.query(
                'INSERT INTO MovieGenre (MovieID, GenreID) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [movieData.id, genre.id]
            );
        }

        // Insert cast data into Person and MovieCredit tables
        const topCast = movieData.credits.cast.slice(0, 10);
        for (const cast of topCast) {
            await db.query(
                'INSERT INTO Person (PersonID, Name, ProfilePicture) VALUES ($1, $2, $3) ON CONFLICT (PersonID) DO NOTHING',
                [cast.id, cast.name, cast.profile_path]
            )

            const creditId = `${movieData.id}-${cast.id}-CAST`;
            await db.query(
                'INSERT INTO MovieCredit (MovieCreditID, MovieID, PersonID, CreditType, CharacterName) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [creditId, movieData.id, cast.id, 'CAST', cast.character]
            );
        }

        // Insert director data into Person and MovieCredit tables
        const director = movieData.credits.crew.find(member => member.job === 'Director');
        if (director) {
            await db.query(
                'INSERT INTO Person (PersonID, Name, ProfilePicture) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [director.id, director.name, director.profile_path]
            );

            const creditId = `${movieData.id}-${director.id}-CREW`;
            await db.query(
                'INSERT INTO MovieCredit (MovieCreditID, MovieID, PersonID, CreditType, Job) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [creditId, movieData.id, director.id, 'CREW', director.job]
            );
        }

        // Commit transaction after all inserts
        await db.query('COMMIT');
        console.log(`Movie ${movieID} fetched and stored in local database`);
        return formatMovie(movieData);
    }

    // Handle any errors by rolling back transaction and logging the error
    catch (error) {
        await db.query('ROLLBACK');
        console.error(`Error fetching movie ${movieID}:`, error.message);
        throw error;
    }
};

// search for movies by title
// results not cached to prevent db bloat
const searchMovies = async (query, page = 1) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                query: query,
                page: page
            },
            headers: {
                Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
            }
        });

        const normalizedResults = response.data.results.map(movie =>
            formatMovie(movie)
        );


        return {
            ...response.data,
            results: normalizedResults
        };

    } catch (error) {
        console.error(`Search service error:`, error.message);
        throw error;
    }
};

// display trending movies for the week
// not cached to prevent db bloat and allow current data
const getTrendingMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
            params: {
                page: page
            },
            headers: {
                Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
            }
        });

        const normalizedResults = response.data.results.map(movie =>
            formatMovie(movie)
        );

        return {
            ...response.data,
            results: normalizedResults
        };

    } catch (error) {
        console.error(`Trending movies service error:`, error.message);
        throw error;
    }
};

const formatMovie = (movieData) => {
    return {
        id: movieData.MovieID || movieData.id,
        title: movieData.Title || movieData.title,
        synopsis: movieData.Synopsis || movieData.overview,
        releaseDate: movieData.ReleaseDate || movieData.release_date,
        runtime: movieData.Runtime || movieData.runtime,
        posterPath: movieData.PosterPath || movieData.poster_path,
        avgRating: movieData.AvgRating || movieData.vote_average,
        genres: movieData.genres || [],
        cast: movieData.cast || [],
        director: movieData.director || null
    }
};

// Export service functions for use in other parts of the application
module.exports = {
    getOrFetchMovie,
    searchMovies,
    getTrendingMovies
};