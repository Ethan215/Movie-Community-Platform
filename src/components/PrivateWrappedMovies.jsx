import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Movies = (props) => {
  const { username } = useParams();
  const [topMovies, setTopMovies] = useState([]);
  const [movie, setMovie] = useState(null);

  const fetchTopMovies = useCallback(async () => {
  try {
    const q = query(collection(db, 'reviews'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const topThreeReviews = findTopThreeReviews(reviewsData);
    // Call the new function here
    // const topFiveMovies = function()
    console.log(topThreeReviews)
    // Pass topFiveMovies to SetTopMovies
    setTopMovies(topThreeReviews);
    // console.log(topMovies)
  } catch (error) {
    console.error('Failed to fetch top movies:', error);
  }
}, [username]);

// Create function that accepts list of reviews and looks up each movie from the list (Returning movie details from list)
// Accepts n reviews as parameters.
  // For each review, go through a loop to extract movieID and use "getMovieByID" function from fetch.js to retrieve movie
  // details.
  // Add each retrieved movie to a list/array and return that list/array

const fetchMovieId = useCallback(async () => {
  try {
    const q = query(collection(db, 'movie'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const topThreeReviews = findTopThreeReviews(reviewsData);
    console.log(topThreeReviews)
    setTopMovies(topThreeReviews);
    // console.log(topMovies)
  } catch (error) {
    console.error('Failed to fetch top movies:', error);
  }
}, [username]);

const findTopThreeReviews = useCallback(reviewsData => {
  if (reviewsData.length === 0) {
    console.error('User has no reviews.');
    return [];
  }
  // Sorting reviews in descending order based on rating
  const sortedReviews = reviewsData.sort((a, b) => b.rating - a.rating);
  // Getting top three highest reviews
  const topThreeReviews = sortedReviews.slice(0, 3);
  console.log(topThreeReviews)
  return topThreeReviews;
}, []);

useEffect(() => {
  const fetchMovieId = async () => {
    try {
      // Fetching movie ID from reviews based on the first review
      const q = query(collection(db, 'reviews'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      const movieId = querySnapshot.docs[0]?.data()?.movie_id; // Assuming the first review contains the movie ID
      if (!movieId) {
        throw new Error('Movie ID not found in reviews');
      }
      return movieId;
    } catch (error) {
      console.error('Failed to fetch movie ID:', error);
      return null;
    }
  };

  /*const fetchMovie = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=7fe3338624f016b56f11393910f1f293`);
      if (!response.ok) {
        throw new Error('Movie not found');
      }
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  // Fetch movie ID first
  fetchMovieId().then(movieId => {
    if (movieId) {
      // Fetch movie details using the retrieved movie ID
      fetchMovie(movieId);
    }
  }); */

  fetchTopMovies();
}, [username, fetchTopMovies]);

  return (
    <div id="movies" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Movies</h2>
          <p>
            Lights, Camera, ACTION!!! Let's get your top films rollin'
          </p>
        </div>
        <div id="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="team">
                  <div className="thumbnail">
                    {" "}
                    <img src={d.img} alt="..." className="team-img" />
                    <div className="caption">
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};


/*
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Movies = () => {
  const { username } = useParams();
  const [topMovies, setTopMovies] = useState([]);

  // Create function to fetch movies based on inputted movieId
  // https://api.themoviedb.org/3/movie/{movie_id} <-- Gets movie by id from API
  // const getMovieByID=(searchTerm)=>{
  //  fetch('https://api.themoviedb.org/3/movie/'+searchTerm, options)
  //  .then(res => res.json())
  //  .then(json => setMovieList(json.results))
  }; // Gets movie by movieID

  // ChatGPT code to fetch movies based on inputted movieID
  // Define the getMovieByID function inside the component
  const getMovieByID = async (movieId) => {
    const API_KEY = "your_api_key_here"; // Replace with your actual API key
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Returns the movie details object
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      return null; // Return null or a meaningful error object/message
    }
  };

  // This function sorts the reviews by rating and then fetches the movie details for the top 5 movies
  const fetchTopMoviesDetails = useCallback(async () => {
    try {
      const q = query(collection(db, 'reviews'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort reviews in descending order by rating and slice the top 5
      const sortedReviews = reviewsData.sort((a, b) => b.rating - a.rating).slice(0, 5);

      // Extract movie IDs from the sorted top 5 reviews
      const movieIds = sortedReviews.map(review => review.movie_id);

      // Fetch movie details for each movie ID and update the state
      const moviesDetails = await Promise.all(movieIds.map(id => getMovieByID(id)));
      setTopMovies(moviesDetails.filter(movie => movie != null)); // Ensure only valid movie details are set
    } catch (error) {
      console.error('Failed to fetch top movies:', error);
    }
  }, [username]);

  // Initial fetch when component mounts or username changes
  useEffect(() => {
    fetchTopMoviesDetails();
  }, [username, fetchTopMoviesDetails]);

  return (
    <div id="movies" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Movies</h2>
          <p>Lights, Camera, ACTION!!! Let's get your top films rollin'</p>
        </div>
        <div className="row">
          {topMovies.length > 0 ? (
            topMovies.map((movie, i) => (
              <div key={`${movie.id}-${i}`} className="col-md-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "100%", height: "auto" }}
                />
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}; */
