import React, { useState, useEffect, useCallback } from "react";
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
  const [landingPageData, setLandingPageData] = useState({});
  const [configuration, setConfiguration] = useState({});
  const baseUrl = configuration.images ? `${configuration.images?.base_url}${configuration.images?.poster_sizes[4]}` : ''

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

  useEffect(() => {
    setLandingPageData(JsonData);
    fetchConfiguration();
  }, []);

  return (
    <div>
      <Header data={landingPageData.Header} />
      <Genres data={landingPageData.Genres} />
      <Movies data={landingPageData.Movies} baseUrl={baseUrl} />
      <About data={landingPageData.About} />
    </div>
  );
};

export default PrivateWrapped;
