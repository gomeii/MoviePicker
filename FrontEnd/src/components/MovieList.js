import React, { useEffect, useState} from 'react';
import CarouselCard from './CarouselCard';
import './styling/MovieList.css';


const MovieList = ({ movies, onMovieSaved, onMovieRemoved, showSaveButton }) => {

  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          <CarouselCard 
          movie={movie}
          onMovieSaved={onMovieSaved}
          onMovieRemoved={onMovieRemoved}
          showSaveButton={showSaveButton}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieList;