import React, { useEffect, useState } from 'react';


const MovieList = (props) => {
  const [moviesWithAdditionalInfo, setMoviesWithAdditionalInfo] = useState([]);

  useEffect(() => {
    // Function to fetch additional information based on IMDb ID
    async function fetchAdditionalInfo(imdbID) {
      const response = await fetch(`http://www.omdbapi.com/?apikey=36043e2&i=${imdbID}`);
      const data = await response.json();
      // console.log(data);
      return data;
    }

    // Function to fetch additional info for each movie and update state
    async function fetchAdditionalInfoForMovies() {
      const movies = props.movies; // props.movies contains the list of movies
      const moviesWithInfo = [];

      for (const movie of movies) {
        const additionalInfo = await fetchAdditionalInfo(movie.imdbID);
        
        // Main Data
        const Plot = additionalInfo.Plot;
        const AgeRating = additionalInfo.Rated;
        const Country = additionalInfo.Country;
        // Metadata (General)
        const Genres = additionalInfo.Genre.split(", ");
        const Language = additionalInfo.Language.split(", ");
        if(movie.Type === "movie"){
          const Runtime = additionalInfo.Runtime;
          // Metadata (Movie)
          const Director = additionalInfo.Director;
          const BoxOffice = additionalInfo.BoxOffice;
          // Ratings
          const imdbRating = additionalInfo.imdbRating;           // Rating: [ 0.0 - 10.0 ]
          const MetaScore = additionalInfo.Metascore;             // Rating: [ 0   - 100  ]
          const movieWithInfo = { ...movie, Plot, Runtime, AgeRating, Genres, Language, Director, Country, BoxOffice, imdbRating, MetaScore};
          console.log(movieWithInfo);
        }
        // const RottenTomatoes = additionalInfo.Ratings[1].Value; // Rating: [ 0%  - 100% ]
        else{
          const movieWithInfo = { ...movie, Plot, AgeRating, Genres, Language, Country};
          console.log(movieWithInfo);
        }
      }

      setMoviesWithAdditionalInfo(moviesWithInfo);
    }

    fetchAdditionalInfoForMovies();
  }, [props.movies]); // Trigger effect whenever props.movies change

  return (
    <>
      {moviesWithAdditionalInfo.map((movie, index) => (
        <div key={index} className='image-coutainer d-flex justify-content-start m-3'>
          <img src={movie.Poster} alt='movie' />
          <div className='overlay d-flex align-items-center justify-content-center'></div>
        </div>
      ))}
    </>
  );
};

export default MovieList;

