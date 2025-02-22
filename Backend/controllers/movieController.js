const User = require('../models/user');
const Movie = require('../models/movie');
const { baseLogger } = require('../server.js');
// Rries to add a movie to the global collection 
exports.addMovieToGlobalCollection = async (additionalInfo) => {
  
  try {
    // Function being called with passed in movieData
    // baseLogger.info("Trying to add movie to global collection:", additionalInfo);
    // Check if movie already exists in the movies database
    
    const movie = await Movie.findOne({ imdbID: await additionalInfo.imdbID });
    baseLogger.logger.info("Movie Object found:", movie);
    // If movie doesnt already exists in the global movies database add it 
    if (movie === null) {
      // baseLogger.info("Movie does not exist and is being added to global collection:");
      const newMovie = new Movie(additionalInfo);
      await newMovie.save();
    }
    // Increase the UserCounter of the movie object 
    await exports.incrementMovieCounter(movie); 
    baseLogger.logger.info("UserCounter incremented");
    // Return Movie object that was incremented
    return movie;
  } catch (error) {
    // Catch any errors encountered
    baseLogger.error({error}, "Error encountered trying to addMovieToGlobalCollection/incrementingMovieCounter"); 
    return additionalInfo;
  } 
};

// Remove a movie from the global collection (No users can have this movie in their profile)
exports.removeMovieFromGlobalCollection = async (movieData) => {
  try {
    baseLogger.info({movieData},"Trying to remove movie from global collection:");
    const movie = await Movie.findOne({imdbID : movieData.imdbID});
    // If, movie exists just lower call the decrement movie counter function
    if(movie !== null){
      const updatedMovie = await exports.decrementMovieCounter(movie);
      if (updatedMovie.UserCounter < 1){
        baseLogger.info({updatedMovie}, "Removing movie from global collection");
        await updatedMovie.remove();
      }
      return movie;
    }
    // Else, movie does not exists and you cant lower the decrement counter anymore 
    else{
      req.loq.error({movieData}, "Does not exist in the global collection");
      throw error;
    }
  } catch (error) {
    baseLogger.error({movieData}, "Error encountered trying to removeMovieFromGlobalCollection/decrementingMovieCounter"); 
    throw error;
  }
};


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
