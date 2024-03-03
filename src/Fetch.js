import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from "./contexts/AuthUserContext";
import { Button, Alert } from "react-bootstrap";

function Fetch() {
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState("");
  const { logout } = useAuthUser();
  const navigate = useNavigate();

  const getMovie = () => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=4a90819101d091d910cc14f7dd7faa55")
    .then(res => res.json())
    .then(json => setMovieList(json.results));
  }

  useEffect(() => {
    getMovie();
  }, []);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Failed to log out");
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Movie Rater :)</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button 
        onClick={handleLogout} 
        style={{ 
          position: 'fixed', 
          right: '20px', 
          top: '20px',
          zIndex: 1000, // Ensure the button is always on top
        }}>
        Log Out
      </Button>
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
