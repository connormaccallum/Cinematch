const axios = require('axios');
const db = require('../config/db');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

const getOrFetchMovie = async (movieID) => {
    try {
        const localMovie = await db.query('SELECT * FROM Movie WHERE MovieID = $1', [movieID]);

        if (localMovie.rows.length > 0) {
            console.log(`Movie ${movieID} found in local database`);
            return localMovie.rows[0];
        }

        console.log(`Movie ${movieID} not found. Fetching from TMDb...`);
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieID}?append_to_response=credits`, {
            headers: {
                Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`
            }
        });

        const movieData = response.data;

        await db.query('BEGIN');

        await db.query(
            'INSERT INTO Movie (MovieID, Title, Synopsis, ReleaseDate, Runtime, PosterPath, AvgRating) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (MovieID) DO NOTHING',
            [movieData.id, movieData.title, movieData.overview, movieData.release_date, movieData.runtime, movieData.poster_path, movieData.vote_average]
        );

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

        const director = movieData.credits.crew.find(member => member.job === 'Director');
        if (director) {
            await db.query(
                'INSERT INTO Person (PersonID, Name, ProfilePicture) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [director.id, director.name, director.profile_path]
            );

            const creditId = `${movieData.id}-${director.id}-CREW`;
            await db.query(
                'INSERT INTO MovieCredit (MovieCreditID, MovieID, PersonID, CreditType) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                [creditId, movieData.id, director.id, 'CREW']
            );
        }

        await db.query('COMMIT');
        console.log(`Movie ${movieID} fetched and stored in local database`);
        return movieData;
    }

    catch (error) {
        await db.query('ROLLBACK');
        console.error(`Error fetching movie ${movieID}:`, error.message);
        throw error;
    }
};

module.exports = {
    getOrFetchMovie
};