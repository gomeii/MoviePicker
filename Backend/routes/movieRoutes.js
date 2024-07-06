const express = require('express');
const  {addMovieToGlobalCollection, removeMovieFromGlobalCollection } = require('../controllers/movieController');
const router = express.Router();

router.post('/add', addMovieToGlobalCollection);
router.post('/remove', removeMovieFromGlobalCollection);

module.exports = router;