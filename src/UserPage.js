import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './contexts/firebase'
import { collection, where, query, getDocs } from "firebase/firestore";
import { Link } from 'react-router-dom';

function UserPage(){
    const {username} = useParams();
    const [reviews, setReviews] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    const fetchReviews = useCallback(async () =>{
        try{
            const q = query(collection(db, "reviews"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            const reviewsData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data(),}));
            console.log(querySnapshot.docs.map(doc => doc.data())); 
            setReviews(reviewsData);
        }catch(error){
            console.error("Failed to fetch reviews:", error);
        }
    }, [username]);


    useEffect(() => {
        fetchReviews();
    }, [username, fetchReviews]); 

    const fetchWatchlist = useCallback(async () => {
        try {
            const q = query(collection(db, "watchlist"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            const watchlistData = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data(),}));
            setWatchlist(watchlistData);
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        }
    }, [username]);

    useEffect(() => {
        fetchWatchlist();
    }, [username, fetchWatchlist]); 

    return(
        <div>
        <div>
        <h1>Watchlist</h1>
        {watchlist.length > 0 ? (
            watchlist.map((watchlists) => (
                <div style={{ display: 'flex', alignItems: 'center', margin: '15px' }}>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${watchlists.movie_poster_path}`}
                        alt={watchlists.movie_title}
                        style={{
                        width: "110px",
                        height: "155px",
                        marginRight: "20px", 
                        }}
                    />
                    <Link to={`/movie/${watchlists.movie_id}`} style={{  marginBottom: '10px', display: 'block', fontSize: '32px' }}>{watchlists.movie_title}</Link>
                    </div>
            ))
            ) : (
                <p>No movies added yet.</p>
        )}
        </div>

        <div>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id}>
                <p>Reviewer: {review.username}, Rating: {review.rating}, Review: {review.review_text}, 
                  Reviewed on: {review.created_at?.toDate()?.toLocaleDateString() || "Unknown date"},
                  {review.edited_at && ` Edited on: ${review.edited_at.toDate().toLocaleDateString()}`}</p>
                  </div>
        ))
        ) : (
            <p>No reviews yet.</p>
        )}
    </div>
    </div>
    );
}
export default UserPage;