const express = require('express');
const { addUserMovie, removeUserMovie, getUserMovies } = require('../controllers/userController');
const { authenticateJWT } = require('../controllers/authController');
const router = express.Router();

router.post('/addMovie', authenticateJWT, addUserMovie);
router.delete('/removeMovie', authenticateJWT,removeUserMovie);
router.get('/movies', authenticateJWT, getUserMovies); // Ensure this route exists

module.exports = router;