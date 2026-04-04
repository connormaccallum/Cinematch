// load environment variables from .env file
require('dotenv').config();

// import dependencies and route handlers
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());

// movie related routes w/ prefix /api/movies
app.use('/api/movies', movieRoutes);

// auth related routes w/ prefix /api/auth
app.use('/api/auth', authRoutes);

// start express server
app.listen(PORT, () => {
    console.log(`Cinematch server is running on port ${PORT}`);
});