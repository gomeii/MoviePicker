// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  imdbID: { type: String, required: true, unique: true },
  Poster: { type: String },
  Plot: { type: String },
  Runtime: { type: String },
  Rated: { type: String },
  Ratings: {type: [String]},
  Genres: { type: [String] },
  Language: { type: [String] },
  Release: {type: String},
  Year: {type: String},
  Type: { type: String},
  Director: { type: String },
  Country: { type: String },
  boxOffice: { type: String },
  imdbRating: { type: String },
  Metascore: { type: String },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;