const express = require('express');
const router = express.Router();
const { submitSchool, submitContactForm } = require('../controllers/email_controller.js');

router.post('/submit-school', submitSchool);

router.post('/contact', submitContactForm);

module.exports = router;