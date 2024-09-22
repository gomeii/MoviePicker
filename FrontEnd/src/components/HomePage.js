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

  // Side Effect of the Stateful Data: searchValue (Whenever the search value is updated the fetchMovies() function updates the movies collection)
  useEffect(() => {
    fetchMovies(searchValue);
  }, [searchValue]);

  // Side Effect of the Stateful Data: isAuthenticated (Whenever the user is logged in, the fetchSavedMovies() function updates the saved movies collection)
  useEffect(() => {
    fetchSavedMovies();
  }, [isAuthenticated]);


  // Logic for Fetching Movie JSON Data from a Search Query
  const fetchMovies = async (searchValue) => {

    // Only try to access the OMDb API if there is a non-empty string in the search bar
    if (searchValue !== '') {
      try{
        const baseAddress = API_URL;
        const searchEndpoint = `/api/search/query`
        const endpoint = baseAddress + searchEndpoint
        console.log(endpoint)
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({searchValue})
        });

        // Error Handling of endpoint response
        // HTTP Response is good (200-299 Status Code)
        if (response.ok){
          // Set the Query Response Object
          const searchQueryResponse = await response.json();
          console.log(searchQueryResponse);
          // Try to extract the proper values from the response
          // IF query returns a movie array it will return the following items [movies: Array of movies with information, totalResults: Number of movies matching the searchValue, validResponse: true]
          // ELSE query returns only the valid response variable [validResponse: false]
          const {movies, totalResults, validResponse} = searchQueryResponse;
          
          console.log(validResponse);
          // If there are new movies pulled in from the OMDb API endpoint set stateful movie data to so movie list will re render
          // Else do nothing so that the movie list is not re rendered to 0 on empty movie list (will maintain previous state)
          if(validResponse === "True"){
            setMovies(movies);
          }
        
        // HTTP Response is bad !=(200-299 Status Code)
        } else {
          console.error('INVALID HTTP Response from search endpoint');
        }
      // Catch any errors that arise from trying to fetch api response (most likely async promise rejection)
      } catch (error) {
        console.error('Error caught in fetching movies from OMDb API', error);
      }
    }
  };

  // Logic for fetching the movies in a persons profile from the MongoDB database
  const fetchSavedMovies = async (user) => {
    // const user = JSON.parse(localStorage.getItem('user'));
    
    // If the user isAuthenticated (maybe pointless since this function is a sideEffect of someone being authenticated)
    if( isAuthenticated){
      // Retrieve User ID from Authentication cookie, TODO: this needs to be something other than the userID set as a browser cookie
      const id = localStorage.getItem('token');
      // Try Getting a response from the Backend for the User
      try {
        const baseAddress = API_URL;
        const GetEndpoint = `/api/users/${id}/movies`;
        const endpoint = baseAddress + GetEndpoint;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Error Handling of endpoint response
        if (response.ok){
          console.log('VALID HTTP Response from "id/movies" endpoint');
          const data = await response.json();
          // 
          setSavedMovies(data.movies || []);
        } else {
          console.error('INVALID HTTP Response from addMovie endpoint');
        }
      } catch (error) {
        console.error('Error caught in fetching saved movies (async Promise Rejected)', error);
      }
    }
  };
  

  // Home Page Component
  return (
    <>
    <h1 className='header-text'>Movie Picker</h1>
        <div className='container-fluid movie-app' data-bs-theme="light">       
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
            <Row className='header'><h2 className='text-left'>Search Results</h2></Row>
            <MovieList movies={movies} onMovieSaved={fetchSavedMovies} showSaveButton={true}/>
            <Row className='header'><h2 className='text-left'>Saved Movies</h2></Row>
            {isAuthenticated ? (
                <MovieList movies={savedMovies} onMovieRemoved={fetchSavedMovies} showSaveButton={false}/>
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