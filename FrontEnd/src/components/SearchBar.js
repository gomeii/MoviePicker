import React from 'react';
import './styling/SearchBar.css';


// Search Bar Logic implements search value state
const SearchBar = ({ searchValue, setSearchValue }) => {
  // searchValue prop = stateful data representing the value of what is currently inside the Search Bar form
  // setSearchValue prop = function of the searchValue state data, which will update the searchValue represented inside other compoentns
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className='fluid-container search-box'>
      <input 
        className='form-control' 
        value={searchValue} 
        onChange={handleInputChange}
        placeholder='Type to search...'
      />
    </div>
  );
};

export default SearchBar;