const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require('../config/db');

// User Signup
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
            [username, email, hashedPassword]
        );
        const newUser = result.rows[0];
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error("Error during sign up:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });  // Create access token
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });  // Create refresh token
        res.json({ message: "Login successful", token, refreshToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get User
const getUser = async (req, res) => {
    const { userID } = req.query;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userID]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = result.rows[0];
        res.json({ username: user.username });

    } catch (error) {
        console.error("Error during getting user: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { signUp, login, getUser };
