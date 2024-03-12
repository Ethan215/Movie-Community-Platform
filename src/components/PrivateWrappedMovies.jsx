import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const Movies = (props) => {
  const { username } = useParams();
  const [topReviews, setTopReviews] = useState([]);
  const [movies, setMovies] = useState([]);

  const findTopFiveReviews = useCallback(reviewsData => {
    if (reviewsData.length === 0) {
      console.error('User has no reviews.');
      return [];
    }
    // Sorting reviews in descending order based on rating
    const sortedReviews = reviewsData.sort((a, b) => b.rating - a.rating);
    // Getting top Five highest reviews
    const topFiveReviews = sortedReviews.slice(0, 5);
    // console.log(topFiveReviews)
    return topFiveReviews;
  }, []);

  const fetchTopReviews = useCallback(async () => {
    try {
      const q = query(collection(db, 'reviews'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const topFiveReviews = findTopFiveReviews(reviewsData);
      setTopReviews(topFiveReviews);
    } catch (error) {
      console.error('Failed to fetch top movies:', error);
    }
  }, [username]);

useEffect(() => {
  const fetchTopReviewsAndUpdateMovies = async () => {
    await fetchTopReviews(); // Make sure this updates `topReviews` state

    // After topReviews are fetched and set, we proceed to fetch movie details
    // Ensure fetchTopReviews function updates the topReviews state correctly
    const moviePromises = topReviews.map((review) => {
      const fetchUrl = `https://api.themoviedb.org/3/movie/${review.movie_id}?api_key=7fe3338624f016b56f11393910f1f293`;
      return fetch(fetchUrl).then((response) => {
        if (!response.ok) throw new Error('Movie not found');
        return response.json();
      }).catch(error => {
        console.error("Failed to fetch movie details:", error);
        return null; // Return null or some error indication for this movie
      });
    });

    try {
      // Wait for all movie detail fetches to complete
      const movies = await Promise.all(moviePromises);
      // Filter out any nulls/errors if necessary
      setMovies(movies.filter(movie => movie !== null));
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  // Calling the function to fetch reviews and then movies
  fetchTopReviewsAndUpdateMovies();
}, [username, fetchTopReviews, topReviews]); // topReviews dependency ensures it reruns when topReviews state updates


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
          {movies.length > 0
            ? movies.map((m, i) => (
                <div key={`${m.name}-${i}`} className="team">
                  <div className="thumbnail">
                    {" "}
                    <img src={`${props.baseUrl}${m.poster_path}`} alt="Movie poster" className="team-img" />
                    <div className="caption">
                      <h4>{m.title}</h4>
                      <p>{m.release_date.slice(0,4)}</p>
                      <p>{m.genres.map((genre) => genre.name).join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))
            : <h4>Loading...</h4>}
        </div>
      </div>
    </div>
  );
};
