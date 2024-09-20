const express = require('express');
const { searchReq } = require('../controllers/searchController');
const router = express.Router();

router.post('/query', searchReq);

module.exports = router;