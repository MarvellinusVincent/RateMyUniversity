const express = require("express");
const router = express.Router();
const { signUp, login, logout, refreshToken, verifyUser, getUser, updateUsername, updatePassword, getReviews } = require('../controllers/user_controller');

// User Signup Route
router.post("/signup", signUp);

// User Login Route
router.post("/login", login);

// User Logout Route
router.post("/logout", logout);

// Refresh Token Route
router.get("/refresh", refreshToken);

// Verify Token Route
router.get("/verify", verifyUser);

// Get User Route
router.get("/getUser", getUser);

// Update Username Route
router.put("/updateUsername", updateUsername)

// Update User Password Route
router.put("/updatePassword", updatePassword)

// Get User Reviews Route
router.get("/getReviews", getReviews)

module.exports = router;
