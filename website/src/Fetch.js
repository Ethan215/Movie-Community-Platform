import React, { useEffect, useState } from "react";

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
  
  return(

    <div>
      {movieList.map((movie)=>(
        <img style={{width:"270px",height:"400px",marginLeft:"40px",marginTop:"40px"}} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/> // display movie posters
      ))}
    </div>
    
  )
}

export default Fetch