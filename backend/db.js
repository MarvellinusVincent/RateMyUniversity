const { Pool } = require("pg");
require("dotenv").config();

// Create a new pool instance for connecting to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Export the pool to be used in other parts of the backend
module.exports = pool;