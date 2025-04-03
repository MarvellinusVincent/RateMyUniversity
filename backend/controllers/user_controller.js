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
            return res.status(400).json({ error: "Invalid email" });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }
        
        // Create the JWT tokens
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email, password: user.password }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Log the tokens before sending
        console.log("Generated Token:", token);
        console.log("Generated Refresh Token:", refreshToken);

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

const updateUsername = async (req, res) => {
    try {
        const { username, userId } = req.body;
        if (!username || !userId) {
            console.log("Error: Missing username or userId.");
            return res.status(400).json({ error: "Username and userId are required." });
        }
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            console.log("Error: Username already taken:", username);
            return res.status(400).json({ error: "Username already taken." });
        }
        const updateResult = await pool.query(
            'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
            [username, userId]
        );
        if (updateResult.rows.length === 0) {
            console.log("Error: User not found for userId:", userId);
            return res.status(404).json({ error: "User not found." });
        }
        console.log("Username updated successfully:", updateResult.rows[0]);
        res.status(200).json({
            message: "Username updated successfully",
            username: updateResult.rows[0].username,
        });
    } catch (err) {
        console.error("Error during username update:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};




const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, userId } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Both old and new passwords are required" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *',
            [hashedNewPassword, userId]
        );
        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error("Error when updating password:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getReviews = async (req, res) => {
    const { userId } = req.query;
    console.log("Received userId:", userId);  // Debug log

    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const result = await pool.query('SELECT * FROM reviews WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No reviews found for this user" });
        }
        res.status(200).json({ reviews: result.rows });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { signUp, login, getUser, updateUsername, updatePassword, getReviews };
