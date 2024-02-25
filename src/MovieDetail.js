import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css'

function MovieDetail() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const { id } = useParams(); // Retrieve the movie ID from the URL

  useEffect(() => {
    // Function to fetch movie data
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=7fe3338624f016b56f11393910f1f293`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovie();
  }, [id]); // Rerun the effect if movieId changes

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
      <div>
      <button onClick={() => navigate('/') }className = "home-button">Back to Home</button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
            width: "135px",
            height: "200px",
            marginRight: "20px", // Added space between the image and the text
            }}
        />
        <div>
            <h1>{movie.title}</h1>
            <p>{`Synopsis: ${movie.overview}`}</p>
        </div>
        </div>
        </div>
  );
}

export default MovieDetail;