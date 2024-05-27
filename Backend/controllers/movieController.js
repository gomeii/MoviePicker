const User = require('../models/user');

// Add a movie to a user's profile
exports.addMovie = async (req, res) => {

  const {userID , additionalInfo} = req.body;

  try {
    // Validate the incoming movie object
    if (!additionalInfo || !additionalInfo.imdbID) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }

    // Find the user by ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie already exists in the user's profile
    const movieExists = user.movies.some(m => additionalInfo.imdbID === additionalInfo.imdbID);
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in profile' });
    }

    // Add the movie object to the user's movies array
    user.movies.push(additionalInfo);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Movie saved successfully', movies: user.movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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