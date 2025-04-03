const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();

// Initialize the app
const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require('./routes/user_routes');
const reviewRoutes = require('./routes/review_route');
const specificUniversityRoutes = require('./routes/university');
const searchUniversityRoutes = require('./routes/search_university');

// Middleware
app.use(bodyParser.json());

// Setup routes
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/specificUni', specificUniversityRoutes);
app.use('/searchUniversity', searchUniversityRoutes);

// Test DB connection and start the server
const { pool } = require('./config/db');
pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Error connecting to the database", err));

// Start the server
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
