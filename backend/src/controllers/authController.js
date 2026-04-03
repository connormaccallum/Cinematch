const db = require('../config/db');
const bcrypt = require('bcrypt');

// number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

// handle user registration
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // validate that all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // check if username or email already exists
        const existingUser = await db.query(
            'SELECT * FROM "User" WHERE Username = $1 OR Email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // insert new user into the database
        const result = await db.query(
            'INSERT INTO "User" (Username, Email, PasswordHash) VALUES ($1, $2, $3) RETURNING UserID, Username, Email, JoinDate',
            [username, email, passwordHash]
        );

        // return the new user data (without password hash)
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error in registerUser:', error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// handle user login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // validate that all fields are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // find user by username
        const result = await db.query(
            'SELECT * FROM "User" WHERE Username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // compare password against stored hash using bcrypt
        const passwordMatches = await bcrypt.compare(password, user.passwordhash);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // return user data (without password hash)
        res.status(200).json({
            userid: user.userid,
            username: user.username,
            email: user.email,
            joindate: user.joindate
        });
    } catch (error) {
        console.error('Error in loginUser:', error.message);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// export controller functions for use in routes
module.exports = {
    registerUser,
    loginUser
};