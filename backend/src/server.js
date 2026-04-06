// load environment variables from .env file
require('dotenv').config();

// import dependencies and route handlers
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// movie related routes w/ prefix /api/movies
app.use('/api/movies', movieRoutes);

// auth related routes w/ prefix /api/auth
app.use('/api/auth', authRoutes);

// start express server
app.listen(PORT, () => {
    console.log(`Cinematch server is running on port ${PORT}`);
});