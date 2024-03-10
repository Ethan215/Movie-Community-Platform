import React, { useState, useEffect } from "react";
import { Navigation } from "./PrivateWrappedNavigation";
import { Header } from "./PrivateWrappedHeader";
import { Genres } from "./PrivateWrappedGenres";
import { About } from "./PrivateWrappedSummary";
import { Shows } from "./PrivateWrappedShows";
import { Movies } from "./PrivateWrappedMovies";
import JsonData from "./SampleData.json";
import SmoothScroll from "smooth-scroll";
import "./PrivateWrapped.css";

/* import { useAuthUser } from "../contexts/AuthUserContext";
import { db } from "../contexts/firebase";
import { collection, query, where, getDocs } from "firebase/firestore"; */

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const PrivateWrapped = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

/*  const [topMovies, setTopMovies] = useState([]);
  const [topShows, setTopShows] = useState([]);

  // Function to fetch top movies
  const fetchTopMovies = async (userId) => {
    const moviesRef = collection(db, "movies");
    const q = query(moviesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTopMovies(movies);
  };

  // Function to fetch top shows
  const fetchTopShows = async (userId) => {
    const showsRef = collection(db, "shows");
    const q = query(showsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTopShows(shows);
  }; */

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Genres data={landingPageData.Genres} />
      <Shows data={landingPageData.Shows} />
      <Movies data={landingPageData.Movies} />
      <About data={landingPageData.About} />
    </div>
  );
};

export default PrivateWrapped;
