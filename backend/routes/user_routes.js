const express = require("express");
const router = express.Router();
const { signUp, login, getUser } = require('../controllers/user_controller');

// User Signup Route
router.post("/signup", signUp);

// User Login Route
router.post("/login", login);

router.get("/getUser", getUser);

module.exports = router;
