const express = require("express");
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { signUp, login, logout, refreshToken, verifyUser, getUser, updateUsername, updatePassword, getReviews, deleteUser, forgotPassword, resetPassword, validateResetToken } = require('../controllers/user_controller');

// User Signup Route
router.post("/signup", signUp);

// User Login Route
router.post("/login", login);

// User Logout Route
router.post("/logout", logout);

// Refresh Token Route
router.post("/refresh", refreshToken);

// Verify Token Route
router.get("/verify", verifyUser);

// Get User Route
router.get("/getUser", getUser);

// Update Username Route
router.put("/updateUsername", authenticate, updateUsername)

// Update User Password Route
router.put("/updatePassword", authenticate, updatePassword)

// Get User Reviews Route
router.get("/getReviews", authenticate, getReviews)

// Delete User
router.delete("/delete", authenticate, deleteUser);

// Forget Password (Check if the user exists and sends link with expired time to reset password)
router.post("/forgotPassword", forgotPassword);

// Reset Password
router.post("/resetPassword", resetPassword);

// Validate Reset Token
router.post("/validateResetToken", validateResetToken);

module.exports = router;
