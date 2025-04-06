const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.use(express.json());
const corsOptions = {
    origin: [
      "https://ratemyuniversity.vercel.app",
      "https://ratemyuniversity.io",
      "http://localhost:3000",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
};
  
app.use(cors(corsOptions));

const userRoutes = require('./routes/user_routes');
const reviewRoutes = require('./routes/review_route');
const specificUniversityRoutes = require('./routes/university');
const searchUniversityRoutes = require('./routes/search_university');
const emailRoutes = require('./routes/email_route');

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/specificUni', specificUniversityRoutes);
app.use('/searchUniversity', searchUniversityRoutes);
app.use('/email', emailRoutes);

const { pool } = require('./config/db');
pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Error connecting to the database", err));

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
