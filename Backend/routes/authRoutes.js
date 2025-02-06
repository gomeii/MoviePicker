const express = require('express');
const { loginUser, createUser, refreshToken} = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/create', createUser);
router.post('/refresh', refreshToken);

module.exports = router;