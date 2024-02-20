import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // Fetch movies based on search term
  const fetchMovies = async (searchValue) => {

    const url= `http://www.omdbapi.com/?apikey=36043e2&s=${searchValue}`;
    
    const response = await fetch(url);
    const responseJson = await response.json();

    if(responseJson.Search){
      console.log(responseJson);
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    fetchMovies(searchValue);
  }, [searchValue]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>src/App.js</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className='container-fluid movie-app'>
        <h1>Movie Search App</h1>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
        <div className='row d-flex align-items-center mt-4 mb-4'>
          <MovieList movies={movies} setMovies={setMovies}/>
        </div>
      </div>
    </div>
  );
}

export default App;
