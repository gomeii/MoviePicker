import React, { useEffect, useState} from 'react';
import CarouselCard from './CarouselCard';
import './styling/MovieList.css';

const MovieList = ({ movies, onMovieSaved, onMovieRemoved, showSaveButton }) => {
  // movies prop = movie array containing the list of movie objects
  // onMovieSaved = function prop to handle the save movie button logic from CarouselCard -> MovieList -> HomePage
  // onMovieRemoved = function prop to handle the remove movie button logic from CarouselCard -> MovieList -> HomePage
  // showSaveButton = bool prop sent down to set whether or not the carousel cards rendered should display the save button
  
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