// models/User.js
const mongoose = require('mongoose');
const movieSchema = require('./Movie').schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  movies: [movieSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;