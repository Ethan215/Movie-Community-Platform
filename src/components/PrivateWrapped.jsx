import React, { useState, useEffect, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Header } from "./PrivateWrappedHeader";
import { Genres } from "./PrivateWrappedGenres";
import { About } from "./PrivateWrappedSummary";
import { Movies } from "./PrivateWrappedMovies";
import JsonData from "./SampleData.json";
import SmoothScroll from "smooth-scroll";
import "./PrivateWrapped.css";

// import { useParams } from 'react-router-dom';
// import { db } from '../contexts/firebase'
// import { collection, addDoc, where, query, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { useAuthUser } from "../contexts/AuthUserContext";
// import { db } from "../contexts/firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const PrivateWrapped = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true)
  const [landingPageData, setLandingPageData] = useState({});
  const [configuration, setConfiguration] = useState({});
  const [reviews, setReviews] = useState([])
  const [movies, setMovies] = useState([]);
  const baseUrl = configuration.images ? `${configuration.images?.base_url}${configuration.images?.poster_sizes[4]}` : ''

  const genreCount = {}
  reviews?.forEach(review => {
    const movie = movies?.find((movie) => review.movie_id == movie.id);
    const genres= movie?.genres.map((genre) => genre.name);

    genres?.forEach((genre) => {
      // Check if genreCount object already has this genre key
      if (genreCount.hasOwnProperty(genre)) {
        // Increment the count if the key already exists
        genreCount[genre] += 1;
      } else {
        // If not, create the key and set its value to 1
        genreCount[genre] = 1
      }
    } )
  })

  const genresCountArr = Object.entries(genreCount)
  // Sort the genresCount values in descending order
  genresCountArr.sort((a, b) => b[1] - a[1])
  const topThreeGenres = genresCountArr.slice(0, 3)

  const topFiveReviews = reviews.sort((a, b) => b.rating - a.rating).slice(0, 5);
  const topFiveMovies = topFiveReviews.map((r, i) => movies.find((m) => m.id == r.movie_id));

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // setReviews(reviewsData);
      // setIsLoading(false)
      return reviewsData;
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }

  useEffect(() => {
    setLandingPageData(JsonData);

    const fetchConfiguration = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/configuration?api_key=7fe3338624f016b56f11393910f1f293`);
        if (!response.ok) {
          throw new Error('Error: Not found');
        }
        const data = await response.json();
        setConfiguration(data);
      } catch (error) {
        console.error("Failed to fetch configuration:", error);
      }
    };

    const fetchReviewsAndMovies = async () => {
      // After reviews are fetched and set, we proceed to fetch movie details
      // Ensure fetchReviews function updates the topReviews state correctly


      try {
        const reviews = await fetchReviews();

        const moviePromises = reviews.map((review) => {
          const fetchUrl = `https://api.themoviedb.org/3/movie/${review.movie_id}?api_key=7fe3338624f016b56f11393910f1f293`;
          return fetch(fetchUrl).then((response) => {
            if (!response.ok) throw new Error('Movie not found');
            return response.json();
          }).catch(error => {
            console.error("Failed to fetch movie details:", error);
            return null; // Return null or some error indication for this movie
          });
        });
        // Wait for all movie detail fetches to complete
        const movies = await Promise.all(moviePromises);
        setIsLoading(false)

        setReviews(reviews);
        // Filter out any nulls/errors if necessary
        setMovies(movies.filter(movie => movie !== null));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchConfiguration();
    // Calling the function to fetch reviews and then movies
    fetchReviewsAndMovies();
  }, []);

  return (
    isLoading ? <div>Loading...</div> :
      <div>
        <Header data={landingPageData.Header} />
        <Genres topThreeGenres={topThreeGenres} />
        <Movies baseUrl={baseUrl} topFiveMovies={topFiveMovies} />
        <About
          data={landingPageData.About}
          baseUrl={baseUrl}
          topGenre={topThreeGenres?.[0]?.[0]}
          topThreeMovies={topFiveMovies.slice(0, 3)}
        />
      </div>

  );
};

export default PrivateWrapped;
