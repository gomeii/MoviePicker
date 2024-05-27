import React from 'react';
import './styling/SearchBar.css';

const SearchBar = ({ searchValue, setSearchValue }) => {
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


// const handleKeyDown = (event) => {
//   // Trigger onChange only when Enter key is pressed
//   if (event.key === 'Enter') {
//     setSearchValue(event.target.value);
//   }
// };