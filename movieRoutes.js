const express = require('express');
const { addMovie, removeMovie } = require('../controllers/movieController');
const router = express.Router();

router.post('/add', addMovie);
router.post('/remove', removeMovie);

module.exports = router;