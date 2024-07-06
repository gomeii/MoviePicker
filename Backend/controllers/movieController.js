const User = require('../models/user');
const Movie = require('../models/movie');

// Add a movie to the global 
exports.addMovieToGlobalCollection = async (movieData) => {
  try {
    console.log("In function addMovieToGlobalCollection, MovieID:", movieData.imdbID);
    let movie = await Movie.findOne({ imdbID: movieData.imdbID });
    // Only add movie to the global collection if it doesnt exist
    if (!movie) {
      console.log("Movie does not exist and is being created for the global collection")
      movie = new Movie(movieData);
      await movie.save();
    }
    // Increment Global Movie Counter
    await exports.incrementMovieCounter(movieData.imdbID); // Increment counter
    return movie;
  } catch (error) {
    console.error('Error adding movie to global collection:', error);
    throw error;
  }
};

// Remove a movie from the global collection (No users can have this movie in their profile)
exports.removeMovieFromGlobalCollection = async (userID, movieID) => {
  try {
    console.log("In function removeMovieFromGlobalCollection, MovieID:", movieID);
    const movie = await exports.decrementMovieCounter(userID,movieID); // Decrement counter
    return movie;
  } catch (error) {
    console.error('Error removing movie from global collection:', error);
    throw error;
  }
};


// Increment Movie Counter
exports.incrementMovieCounter = async (movieID) => {
  try {
    const movie = await Movie.findOne({imdbID: movieID});
    if (!movie) {
      throw new Error('Movie not found');
    }
    movie.UserCounter += 1;
    await movie.save();
    return movie;
  } catch (error) {
    console.error('Error incrementing movie counter:', error);
    throw error;
  }
};

// Decrement Movie Counter
exports.decrementMovieCounter = async (userID, movieID) => {
  try {
    // console.log("From within decrementMovieCounter, movieID:",movieID);
    const movie = await Movie.findOne({imdbID: movieID});
    console.log("From within decrementMovieCounter:", movie);
    const user = await User.findById(userID);
    console.log("Inside of decrementMovieCounter, User:", user);
    if (!movie) {
      throw new Error('Movie not found');
    }
    // Remove the movie from the user Profile
    user.movies.pull(movie._id);
    // Save the updated user document
    await user.save();

    // Ensure counter does not go below 0
    if (movie.UserCounter > 0) {
      movie.UserCounter -= 1;
    }  
    await movie.save();

    // If counter drops below 1, remove the movie from the global collection
    if (movie.UserCounter < 1) {
      await movie.remove();
      return null; // Signal that movie has been removed
    }

    return movie; // Return movie object to remove from user profile
  } catch (error) {
    console.error('Error decrementing movie counter:', error);
    throw error;
  }
};
