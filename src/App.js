import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import CardCarousel from './components/CardCarousel';

const App = () => {
  const [movies, setMovies] = useState([]);

  // Fetch movies based on search term
  const fetchMovies = (searchTerm) => {
    fetch(`http://www.omdbapi.com/?apikey=36043e2&s=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        /* Need to clean this code up, setMovies() doesnt really do anything 

            

        */
        if (data.Search) {
          setMovies(data.Search);
        } else {
          setMovies([]);
        }
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
};

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
      <body>
        <div>
          <h1>Movie Search App</h1>
          <SearchBar onSearch={fetchMovies} />
          <CardCarousel movies={movies} />
        </div>
      </body>
    </div>
  );
}

export default App;
