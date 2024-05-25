import React from 'react';
import CarouselCard from './CarouselCard';

const MovieList = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          <CarouselCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieList;