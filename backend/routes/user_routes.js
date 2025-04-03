const express = require("express");
const router = express.Router();
const { signUp, login, getUser, updateUsername, updatePassword, getReviews } = require('../controllers/user_controller');

// User Signup Route
router.post("/signup", signUp);

// User Login Route
router.post("/login", login);

router.get("/getUser", getUser);

router.put("/updateUsername", updateUsername)

router.put("/updatePassword", updatePassword)

router.get("/getReviews", getReviews)

module.exports = router;
