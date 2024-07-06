// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: {type: String},
  Rated: { type: String },
  Released: { type: String},
  Runtime: { type: String },
  Genre: { type: [String] },
  Director: { type: String },
  Writer: { type: String },
  Actors: { type: String},
  Plot: { type: String },
  Language: { type: [String] },
  Country: { type: String },
  Awards: { type: String},
  Poster: { type: String },
  Ratings: { type:  [] },
  Metascore: { type: String},
  imdbRating: { type: String},
  imdbVotes: {type: String},
  imdbID: { type: String, required: true, unique: true },
  Type: { type: String},
  DVD: { type: String},
  BoxOffice: { type: String},
  Production: { type: String},
  Website: {type: String},
  UserCounter: {type: Number, default: 0}
});

const Movie = mongoose.model('movies', movieSchema);

module.exports = Movie;