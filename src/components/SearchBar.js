// Component for the Search Bar
import React from 'react';

const SearchBar = (props) => {
  const handleKeyDown = (event) => {
    // Trigger onChange only when Enter key is pressed
    if (event.key === 'Enter') {
      props.setSearchValue(event.target.value);
    }
  };


  return (
    <div className='col col-sm-4'>
      <input 
        className='form-control' 
        value={props.value} 
        onChange={(event) => {}}
        onKeyDown={handleKeyDown}
        placeholder='Type to search...'></input>
    </div>
  );
};

export default SearchBar;