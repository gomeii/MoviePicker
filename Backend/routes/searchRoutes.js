const express = require('express');
const { searchReq, searchAdditional } = require('../controllers/searchController');
const router = express.Router();

router.post('/query', searchReq);
router.post('/additional', searchAdditional);

module.exports = router;