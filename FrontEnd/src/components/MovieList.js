import React, { useEffect, useState, useRef} from 'react';
import CarouselCard from './CarouselCard';
import './styling/MovieList.css';

const MovieList = ({ movies, onMovieSaved, onMovieRemoved, showSaveButton }) => {
  const listRef = useRef(null);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!listRef.current) return;
    
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!listRef.current || isPaused) return;

        listRef.current.scrollLeft += 2 * direction; // Adjust speed

        const maxScrollLeft = listRef.current.scrollWidth - listRef.current.clientWidth;

        // When reaching the end, pause and change direction
        if (listRef.current.scrollLeft >= maxScrollLeft && direction === 1) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection(-1);
            setIsPaused(false);
          }, 100); // 2-second pause
        } else if (listRef.current.scrollLeft <= 0 && direction === -1) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection(1);
            setIsPaused(false);
          }, 100); // 2-second pause
        }
      }, 50);
    };

    if (!isPaused) {
      startScrolling();
    }

    return () => clearInterval(scrollInterval); // Cleanup on unmount
  }, [direction, isPaused]);

  return (
    <div
      className="movie-list"
      ref={listRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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