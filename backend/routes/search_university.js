const express = require('express');
const router = express.Router();
const { searchUniversityLimit, searchUniversityAll } = require('../controllers/search_university_controller');

router.get('/limit', searchUniversityLimit);
router.get('/all', searchUniversityAll);

module.exports = router;