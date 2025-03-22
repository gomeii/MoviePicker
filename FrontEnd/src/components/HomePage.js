// src/components/HomePage.js

import React, { useState, useEffect, useContext} from 'react';
import SearchBar from './SearchBar';
import MovieList from './MovieList';
import { AuthContext } from '../context/AuthContext';
import { Alert , Row } from 'react-bootstrap';
import './styling/HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const { isAuthenticated, logout} = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  // Received from the dockerfile environment variables
  const API_URL = process.env.REACT_APP_API_URL;

  // Side Effect of: searchValue (Whenever the search value is updated the fetchMovies() function updates the movies collection)
  useEffect(() => {
    fetchMovies(searchValue);
  }, [searchValue]);

  // Side Effect of: isAuthenticated (Whenever the user is logged in, the fetchSavedMovies() function updates the saved movies collection)
  useEffect(() => {
    fetchSavedMovies();
  }, [isAuthenticated]);

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: "POST",
            credentials: "include", // Send HTTP-only cookie
        });

        if (!response.ok) throw new Error("Failed to refresh token");

        const data = await response.json();
        sessionStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error("Token refresh failed, Please log in again.");
        return null;
    }
  };

  //API Request wrapper with automatic token refresh
  const fetchWithAuth = async (url, options = {}) => {
    let token = sessionStorage.getItem("accessToken");

    let response = await fetch(`${API_URL}${url}`, { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }, 
    });

    if (response.status === 401) {
        console.log("Access token expired, attempting refresh...");
        // Try refreshing the token
        const newToken = await refreshAccessToken();
        if (!newToken) {
            // If no new access token received sign user out
            logout();
            return Promise.reject("Session expired. Please log in again.");
        }

        // Retry the original request with the new token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${API_URL}${url}`, { ...options, headers, credentials: "include" });
    }

    return response.json();
  };

  // Logic for Fetching Movie JSON Data from a Search Query
  const fetchMovies = async (searchValue) => {

    // Only try to access the OMDb API if there is a non-empty string in the search bar
    if (searchValue !== '') {
      try{
        const response = await fetch(`${API_URL}/api/search/query`, {
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
          // Try to extract the proper values from the response
          // IF query returns a movie array it will return the following items [movies: Array of movies with information, totalResults: Number of movies matching the searchValue, validResponse: true]
          // ELSE query returns only the valid response variable [validResponse: false]
          const {movies, totalResults, validResponse} = searchQueryResponse;
          
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
  const fetchSavedMovies = async () => {

      // Try fetching data for logged in user
      try{
        const data = await fetchWithAuth("/api/users/movies");
        setSavedMovies(data.movies || []);
      } catch (error) {
        console.error('Error caught in fetching saved movies (async Promise Rejected)', error);
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
                <MovieList className="savedMovies" movies={savedMovies} onMovieRemoved={fetchSavedMovies} showSaveButton={false} shouldAutoScroll={false} />
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