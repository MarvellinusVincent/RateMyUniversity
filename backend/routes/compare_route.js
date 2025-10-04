const express = require('express');
const router = express.Router();
const { compareUniversities } = require('../controllers/compare_controller');

router.get('/', compareUniversities);

module.exports = router;