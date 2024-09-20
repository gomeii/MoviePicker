const Movie = require('../models/movie');
const User = require('../models/user');
const movieController = require('./movieController'); // Adjust the path as needed

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
    
    // Add the movie to the global collection
    let movie = await movieController.addMovieToGlobalCollection(additionalInfo);
    if (!movie) {
      return res.status(500).json({ message: 'Error adding movie to global collection' });
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
  // movieID = imdbID
  // userID = <user>._id (objectId)
  const {userID , movieData} = req.body;
  console.log("Request Body recieved in function removeUserMovie:", req.body);
  console.log("Movie Data extracted from the request body:", movieData);
  try {
    // Validate the incoming movie object
    validMovie = (movieData !== null);
    console.log("Movie is valid:", validMovie);
    if (!validMovie) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }
    
    // Find the user by ID
    const user = await User.findById(userID);
    console.log(user);
    if (!user) {
      console.log("error with determining user");
      return res.status(404).json({ message: 'User not found' });
    }

    // Try and find movie in the global collection by the imbdID passed in from the user
    console.log("Trying to remove movie from global collection with imdbID:", movieData.imdbID);
    let movie = Movie.findOne({imdbID: movieData.imdbID});
    if (!movie){
      res.status(500).json({message: 'There is no movie in the global collection. Movie cannot exist in user profile', error});
    }

    // Decrement the movie's counter in the global collection
    let movieObject = await movieController.removeMovieFromGlobalCollection(userID,movieData.imdbID);
    if (movieObject === null) {
      // If the movieObject is null that means it was removed from the global collection
      // This movieObject also needs to be removed from the user profile
      res.status(200).json({ message: 'Movie removed from global collection and user profile', movies: user.movies});
    }else{
      res.status(200).json({ message: 'Movie removed successfully', movies: user.movies });
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Server error in function removeUserMovie', error: error });
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