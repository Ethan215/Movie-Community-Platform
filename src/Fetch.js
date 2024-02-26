import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
function Fetch(){
  const [movieList,setMovieList] = useState([])

  const getMovie=()=>{
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=4a90819101d091d910cc14f7dd7faa55") // discover fetch
    .then(res => res.json())  // store result in json
    .then(json => setMovieList(json.results)) // use setMovieList to create a list of the discover section movies
  }

  useEffect(()=>{
    getMovie()
  },[])

  //console.log(movieList)
  
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Movie Rater :)</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movieList.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              style={{ 
                width: "270px", 
                height: "400px", 
                margin: "40px" 
              }} 
            />
          </Link>
        ))}
      </div>
    </>
  );
}

export default Fetch;