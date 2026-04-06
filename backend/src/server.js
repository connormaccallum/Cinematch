// load environment variables from .env file
require('dotenv').config({ path: '../../.env' });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// session cookies using CORS to allow requests from frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// parse JSON request bodies
app.use(express.json());

// session middleware stores cookie containing session id
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

// interaction related routes w/ prefix /api/interactions
app.use('/api/interactions', interactionRoutes);

// start express server
app.listen(PORT, () => {
    console.log(`Cinematch server is running on port ${PORT}`);
});