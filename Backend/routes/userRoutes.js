const express = require('express');
const { addUserMovie, removeUserMovie, getUserMovies } = require('../controllers/userController');
const router = express.Router();

router.post('/addMovie', addUserMovie);
router.delete('/removeMovie', removeUserMovie);
router.get('/:id/movies', getUserMovies); // Ensure this route exists

module.exports = router;