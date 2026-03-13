// Pool class from pg library manages multiple connections to our DB
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Max connections to db and timeouts to db
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Event listener for connection success and error handling
pool.on('connect', () => {
    console.log('Successfully connected to the "${process.env.DB_NAME}" database as user: "${process.env.DB_USER}"');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper function to execute queries using this pool
module.exports = {
    query: (text, params) => pool.query(text, params),
};