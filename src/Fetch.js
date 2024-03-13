import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import UserDropdown from "./UserDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {TMDBAccessToken} from "./Api"

function Fetch() {
  // Declare state variables for movie list, error, and logout function
  const [movieList, setMovieList] = useState([]);
  // Declare state variable for input text
  const [inputText, setInputText] = useState('');


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + TMDBAccessToken
    }
  };  // simplifies fetch calls: insert 'options' as secondary parameter in any fetch, no API key needed!

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie', options)
    .then(res => res.json())
    .then(json => setMovieList(json.results))
  }, []); // populates movieList with discover results upon opening homepage

  const getResults=(searchTerm)=>{
    fetch('https://api.themoviedb.org/3/search/movie?query='+searchTerm+'&include_adult=false&language=en-US&page=1', options)
    .then(res => res.json())
    .then(json => setMovieList(json.results))
  }; // populates movieList with search results using string inputted

  const handleChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
  }; // scrapes text input and feeds term to search

  const handleImageClick = () => {
    getResults(inputText);
  }; // feeds term to search upon magnifying glass click

  const handleKeyDown = (event) => {
    if (event.key === 'Enter')
    getResults(inputText);
  }; // feeds term to search upon enter-key down

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Search for a movie!</h1>
      <div style={{ textAlign: 'center' }}>
        <input
            type="text"
            placeholder="Enter a movie title..."
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ marginRight: '5px', 
                     verticalAlign: 'middle',
                     border: '1px solid #333'}}
          />
        <FontAwesomeIcon
            icon={faSearch}
            onClick={handleImageClick}
            style={{ cursor: 'pointer',
            border: '1px solid #333',
            padding: '6px',
            borderRadius: '6px',
            verticalAlign: 'middle'}}
          />
      </div>
        <UserDropdown></UserDropdown>


      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {movieList.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: '270px',
                height: '400px',
                margin: '20px',
                transition: 'transform 0.2s', // Adds a smooth transition effect on hover
                '&:hover': {
                  transform: 'scale(1.05)', // Slightly increase the size on hover
                }
              }}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

export default Fetch;
