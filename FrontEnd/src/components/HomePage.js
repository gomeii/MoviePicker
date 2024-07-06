// src/components/HomePage.js

import React, { useState, useEffect, useContext} from 'react';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import { AuthContext } from '../context/AuthContext';
import { Alert , Row } from 'react-bootstrap';
import './styling/HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const { isAuthenticated, user} = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  // Received from the dockerfile environment variables
  const API_URL = process.env.REACT_APP_API_URL;

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

  const fetchSavedMovies = async (user) => {
    const id = localStorage.getItem('token');
    // const user = JSON.parse(localStorage.getItem('user'));
    if( isAuthenticated){
      try {
        const baseAddress = API_URL;
        const GetEndpoint = `/api/users/${id}/movies`;
        const endpoint = baseAddress + GetEndpoint;
        console.log(endpoint);
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
        const data = await response.json();
        console.log(data);
        setSavedMovies(data.movies || []);
      } catch (error) {
        console.error('Error fetching saved movies:', error);
      }
    }
  };



  const removeSavedMovie = async (movieID) => {
    if (isAuthenticated) {
      console.log("Movie trying to be removed from user profile: " ,movieID)
      const baseAddress = API_URL;
      const removeEndpoint = `/api/users/removeMovie`;
      const endpoint = baseAddress + removeEndpoint;
      const userID = localStorage.getItem('token');
      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userID,
            movieID: movieID,
          }),
        });

        if (response.status === 200) {
          fetchSavedMovies();
          console.log('Movie removed successfully:', response.statusText);
        } else {
          console.error('Failed to remove movie:', response.statusText);
        }
      } catch (error) {
        console.error('Error removing movie:', error);
      }
    }
  };
  
  useEffect(() => {
    fetchSavedMovies();
  }, [isAuthenticated]);
  
  return (
    <>
    <h1 className='header-text'>Movie Picker</h1>
        <div className='container-fluid movie-app' data-bs-theme="light">       
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
            <Row className='header'><h2 className='text-left'>Search Results</h2></Row>
            <MovieList movies={movies} onMovieSaved={fetchSavedMovies} showSaveButton={true}/>
            <Row className='header'><h2 className='text-left'>Saved Movies</h2></Row>
            {isAuthenticated ? (
                <MovieList movies={savedMovies} onMovieRemoved={removeSavedMovie} showSaveButton={false}/>
            ) : (
              <Alert variant="warning" className="mt-3">
                Please <Alert.Link href="/login">login/signup</Alert.Link> to save movies function.
              </Alert>
            )}  
        </div>
    </>
  );
};

export default HomePage;