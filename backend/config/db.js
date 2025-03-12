const { Pool } = require("pg");

// Setup the database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = { pool };
