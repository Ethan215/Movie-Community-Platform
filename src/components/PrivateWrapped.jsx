import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./PrivateWrappedHeader";
import { Genres } from "./PrivateWrappedGenres";
import { About } from "./PrivateWrappedSummary";
import { Movies } from "./PrivateWrappedMovies";
import JsonData from "./SampleData.json";
import SmoothScroll from "smooth-scroll";
import "./PrivateWrapped.css";


/*import { useParams } from 'react-router-dom';
import { db } from '../contexts/firebase'
import { collection, addDoc, where, query, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthUser } from "../contexts/AuthUserContext";
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

  return (
    <div>
      <Header data={landingPageData.Header} />
      <Genres data={landingPageData.Genres} />
      <Movies data={landingPageData.Movies} />
      <About data={landingPageData.About} />
    </div>
  );
};

export default PrivateWrapped;
