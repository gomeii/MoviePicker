// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true},
  lastName:  { type: String},
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  movies:    [{type: mongoose.Schema.Types.ObjectId, ref:'movies'}]
});

const User = mongoose.model('users', userSchema);

module.exports = User;