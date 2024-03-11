import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from "../contexts/AuthUserContext";
import { Button, Alert } from "react-bootstrap";

export default function Comedy() {
  // Declare state variables for movie list, error, and logout function
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState("");
  const { logout } = useAuthUser();
  const navigate = useNavigate();  
  // Declare state variables for current user and show dropdown
  const { currentUser } = useAuthUser();
  const [showDropdown, setShowDropDown] = useState(false);


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YTkwODE5MTAxZDA5MWQ5MTBjYzE0ZjdkZDdmYWE1NSIsInN1YiI6IjY1YmYzZjgyYmE0ODAyMDE4MjZjMWE5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KOl14U2aSpIol1hFgSSBS0GBwxlPJ7PcBKOzKYqc8gM'
    }
  };  // simplifies fetch calls: insert 'options' as secondary parameter in any fetch, no API key needed!

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie?page=1&with_genres=35', options)
    .then(res => res.json())
    .then(json => setMovieList(json.results))
  }, []); // populates movieList with comedy results

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (error) {
      setError("Failed to log out");
    }
  };

  // Toggle drop-down menu function
  const toggleDropdown = () => setShowDropDown(!showDropdown);
  
  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
        <div style={{ position: 'absolute',top:'20px', right:'20px', zIndex: 1000 }}>
          <Button onClick={toggleDropdown}>
            {currentUser?.username}    {/*Display User name */}
          </Button>
          {showDropdown && (
            <div style = {{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
              padding: '12px 16px',
              zIndex: 1001

            }}
            >
              <Link to={`/user/${currentUser?.username}`} style={{  marginBottom: '10px' }}>My Account</Link>
              <Link to={`/user/${currentUser?.username}/privateWrapped`} style={{  marginBottom: '10px', display: 'block'}}>Wrapped</Link>
              <button 
              onClick={handleLogout}
              style={{
              background: 'none',
              color: 'blue',
              cursor: 'pointer',
              textDecoration: 'underline',
              border: 'none',
              padding: 0,
              font: 'inherit'
            }}>Log Out
            </button>
          </div>
          )}
          </div>


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
