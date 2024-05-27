// src/components/HomePage.js

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import './styling/HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({isAuthenticated,setIsAuthenticated}) => {
    const [movies, setMovies] = useState([]);
    const [searchValue, setSearchValue] = useState('');
  
    useEffect(() => {
      const fetchMovies = async () => {
        if (searchValue !== '') {
          const apiKey = process.env.REACT_APP_OMDB_API_KEY;
          const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`;
          const response = await fetch(url);
          const responseJson = await response.json();
  
          if (responseJson.Search) {
            setMovies(responseJson.Search);
          } else {
            setMovies([]);
          }
        }
      };
  
      fetchMovies();
    }, [searchValue]);

  return (
    <>
        <div className='container-fluid movie-app' data-bs-theme="light">
            <h1 className='header-text'>Movie Picker</h1>
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
            <MovieList movies={movies}/>
        </div>
    </>
  );
};

export default HomePage;