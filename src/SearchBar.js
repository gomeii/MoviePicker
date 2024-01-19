// This will be the component for the search bar
// 
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleInputChange = (event) => {
      setSearchTerm(event.target.value);
      console.log(event.target.value);
    };
  
    const handleSearch = async () => {
      // Call the onSearch prop with the current search term
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${searchTerm}`
        );
        // Assuming the API response contains an array of movies
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // onSearch(searchTerm);
    };
  
    const handleKeyPress = (event) => {
      // Trigger search if Enter key is pressed
      if (event.key === 'Enter') {
        handleSearch();
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    );
  };
  
  export default SearchBar;