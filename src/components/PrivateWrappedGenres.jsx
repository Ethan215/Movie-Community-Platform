
import React from 'react';

export const Genres = ({ topThreeGenres }) => {

  return (
    <div id="genres" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2 className="mb-5 sono-style">Top Genres</h2>
        </div>

        <div className="genre-grid">
          {topThreeGenres.length > 0 ? (
            topThreeGenres?.map((genre, i) => (
              <div key={`${genre[0]}-${i}`} className="genre-card">
                <h3>{genre[0]}</h3>
                <p className="mb-0 sono-style">{genre[1]} movies</p>
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

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Genres = (props) => {
  const { username } = useParams();
  const [topMovies, setTopMovies] = useState([]);
  const [movie, setMovie] = useState(null);

  // const fetchReviews = useCallback(async () => {
  //   try {
  //     const q = query(collection(db, 'reviews'), where('username', '==', username));
  //     const querySnapshot = await getDocs(q);
  //     const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setTReviews(reviewsData);
  //   } catch (error) {
  //     console.error('Failed to fetch top movies:', error);
  //   }
  // }, [username]);

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

/*    const fetchMovie = async (movieId) => {
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
    <div id="genres" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Top Genres</h2>
        </div>
        <div className="row">
          {topMovies.length > 0 ? (
            topMovies.map((movie, i) => (
              <div key={`${movie.id}-${i}`} className="col-md-4">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{
                    width: "135px",
                    height: "200px",
                    marginRight: "20px",
                    }}
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
};
