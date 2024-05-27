const User = require('../models/user');
const Movie = require('../models/movie');

// Add a movie to a user's profile
exports.addMovie = async (req, res) => {
  try {
    const { userId, title, imdbID, poster, plot } = req.body;
    const newMovie = new Movie({ title, imdbID, poster, plot, user: userId });
    await newMovie.save();

    const user = await User.findById(userId);
    user.movies.push(newMovie._id);
    await user.save();

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a movie from a user's profile
exports.removeMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    await Movie.findByIdAndDelete(movieId);

    const user = await User.findById(userId);
    user.movies = user.movies.filter(movie => movie.toString() !== movieId);
    await user.save();

    res.status(200).json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};