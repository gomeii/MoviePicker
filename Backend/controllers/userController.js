const Movie = require('../models/movie');
const User = require('../models/user');

// Add Movie to Users Profile
exports.addUserMovie = async (req,res) => {
  
  const {userID , additionalInfo} = req.body;
  try {
    // Validate the incoming movie object
    validMovie = (additionalInfo !== null || additionalInfo.imdbID !== null);
    console.log("Movie is valid:",validMovie);
    if (!validMovie) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }
    
    // Find the user by ID
    const user = await User.findById(userID);
    console.log("User:", user);
    if (!user) {
      console.log("error with determining user");
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the movie already exists in the global collection
    let movie = await Movie.findOne({ imdbID: additionalInfo.imdbID });
    if (!movie) {
      // If it doesn't exist, create a new movie document
      movie = new Movie(additionalInfo);
      await movie.save();
    }

    // Check if the movie already exists in the user's profile
    const movieExists = user.movies.includes(movie._id);
    // console.log("Movie already exists in user profile: ", movieExists);
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in profile' });
    }

    // Add the movie object to the user's movies array
    user.movies.push(movie._id);
    console.log("Pushed Movie to user profile")
    // Save the updated user document

    await user.save();

    res.status(200).json({ message: 'Movie saved successfully', movies: user.movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.removeUserMovie = async (req,res) => {
  // movieID should be the imdbID, which will first be looked up on the movies model, then checked if that objectID exists on the user profile
  // console.log(req.body);
  const {userID , movieID} = req.body;
  // console.log("Movie ID trying to be removed: ", movieId);
  try {
    // Validate the incoming movie object
    validMovie = (movieID !== null);
    console.log("Movie is valid:", validMovie);
    if (!validMovie) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }
    
    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      console.log("error with determining user");
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie already exists in the global collection
    let movie = await Movie.findOne({ imdbID: movieID });
    if (!movie) {
      // If it doesn't exist, fail because it cannot exists on the users profile
      return res.status(404).json({message: 'Movie could not be found'})
    }

    user.movies.remove({_id: movie._id});
    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Movie removed successfully', movies: user.movies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

// Get saved movies for a user
exports.getUserMovies = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('movies');
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ movies: user.movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};