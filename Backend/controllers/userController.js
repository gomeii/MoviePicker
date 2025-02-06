const Movie = require('../models/movie');
const User = require('../models/user');
// const movieController = require('./movieController'); // Adjust the path as needed



// Add Movie to Users Profile
exports.addUserMovie = async (req,res) => {
  try {
    const additionalInfo = req.body;
    const userID = req.userID;

    if (!userID) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }
    // Validate movie data
    const validMovie = additionalInfo && additionalInfo.imdbID;
    if (!validMovie) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }
    
    // Find the user by ID
    const user = await User.findById(userID);
    req.log.info({ user }, "Trying to add movie to this user's profile");
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Try to find the movie by the id
    const movie = await Movie.findOne({ imdbID: await additionalInfo.imdbID });
    // If the movie exists increment global counter and add it to the users movie array
    if(movie){
      const movieObjID = movie._id.toString();
      req.log.info(movieObjID);
      // Check if the movie already exists in the user's profile
      const movieExists = user.movies.some(m => m.toString() === movie._id.toString());
      if (movieExists) {
        req.log.info("Movie already exists in the users profile");
        return res.status(501).json({ message: 'Movie already in profile' });
      }else{
        // Add the movie object to the user's movies array
        user.movies.push(movieObjID);
        await user.save();
        // Increment the user counter of the global movie
        // await exports.incrementMovieCounter(movie);

        res.status(200).json({ message: 'Movie saved successfully', movies: user.movies });
      }
    }
    // If the movie does not exist add it to the global movie collection
    else{
      const newMovie = new Movie(additionalInfo);
      await newMovie.save();

      const newMovieObjID = newMovie._id.toString()
      req.log.info(newMovieObjID);

      user.movies.push(newMovieObjID);
      await user.save();

      await exports.incrementMovieCounter(newMovie);

      res.status(200).json({ message: 'Movie saved successfully', movies: user.movies });
    }
  } catch (error) {
    req.log.error({error},"Error encountered:");
    res.status(502).json({ message: 'Server error', error });
  }
};

exports.removeUserMovie = async (req,res) => {
  // movieID = imdbID
  // userID = <user>._id (objectId)
  try {
    const additionalInfo = req.body;
    const userID = req.userID;

    if (!userID) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }
    // Validate movie data
    const validMovie = additionalInfo && additionalInfo.imdbID;
    if (!validMovie) {
      return res.status(400).json({ message: 'Invalid movie data' });
    }
    
    // Find the user by ID
    const user = await User.findById(userID);
    req.log.info({ user }, "Trying to remove movie from this user's profile");
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Try to find the movie by the id
    const movie = await Movie.findOne({ imdbID: await additionalInfo.imdbID });
    // If the movie exists increment global counter and add it to the users movie array
    if(movie){
      const movieObjID = movie._id.toString();
      req.log.info(movieObjID);
      // Check if the movie already exists in the user's profile
      const movieExists = user.movies.some(m => m.toString() === movie._id.toString());
      if (!movieExists) {
        req.log.info("Movie does not exist in the users profile");
        return res.status(501).json({ message: 'Movie not in profile' });
      }else{
        // Remove the movie object to the user's movies array
        user.movies = user.movies.filter(movieID => movieID !== movieData.imdbID);
        await user.save();
        // Decrement the user counter of the global movie
        await exports.decrementMovieCounter(movie);

        res.status(200).json({ message: 'Movie removed successfully', movies: user.movies });
      }
    }else{
      console.log("Movie does not exist in the global collection");
      res.status(400).json({message: 'There is no movie in the global collection. Movie cannot exist in user profile', error});
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Server error in function removeUserMovie', error: error });
  }
}

// Get saved movies for a user
exports.getUserMovies = async (req, res) => {
  const userId = req.userID;
    try { 
      const user = await User.findById(userId).populate('movies');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ movies: user.movies });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


// Increment Movie Counter
exports.incrementMovieCounter = async (movie) => {
  // Receive MovieData from AddMovieToGlobalCollection function 
  movie.UserCounter += 1;
  await movie.save();
  return movie;
};

// Decrement Movie Counter
exports.decrementMovieCounter = async (movie) => {
  // Recieve MovieData from RemoveMovieFromGlobalCollection function
  if (movie.UserCounter > 0) {
    movie.UserCounter -= 1;
    await movie.save();
  }
  return movie;
};