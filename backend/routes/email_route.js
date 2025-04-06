const express = require('express');
const router = express.Router();
const { submitSchool } = require('../controllers/email_controller.js');

router.post('/submit-school', submitSchool);

module.exports = router;