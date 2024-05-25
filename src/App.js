// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className="App" data-bs-theme="light">
      {/* <header className="App-header">
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
      </header> */}
      <div className='container-fluid movie-app' data-bs-theme="light">
        <h1 className='header-text'>Movie Picker</h1>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
        <MovieList movies={movies} setMovies={setMovies}/>
      </div>
    </div>
  );
}

export default App;
