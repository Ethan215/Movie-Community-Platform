import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './contexts/firebase'
import { doc, deleteDoc, collection, where, query, getDocs } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuthUser } from './contexts/AuthUserContext';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

function UserPage(){
    const {username} = useParams();
    const { currentUser } = useAuthUser();
    const [reviews, setReviews] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const navigate = useNavigate();
    

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


    // Function to delete a review
    const handleDeleteReview = async (reviewId)=>{
        if (window.confirm("Delete Review? This action cannot be undone.")) {
        try {
        // Delete the review document from the database
        await deleteDoc(doc(db, "reviews", reviewId));
        // Fetch the reviews to update the state
        fetchReviews(); // Refresh reviews after deletion
        } catch (error) {
        console.error("Error deleting review:", error);
        }
    }
    }

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



<div className="reviews-container">
        <h2>{(currentUser && currentUser.username ===username)? 'My Reviews' : `${username}'s Reviews`}</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="review-block" key={review.id}>
                <div className="review-image-container" style={{ marginRight: '20px', fontSize: '40px', fontWeight: 'bold'}} >
                    <img 
                    src={`https://image.tmdb.org/t/p/w500${review.movie_poster_path}`} 
                    alt = "Edit review to see the pic :)."
                    style={{ width: '100px', height: '150px' }}
                    />
                            {'\t'}{review.movie_name}

                </div>
              <div className="review-content">
                {/*This is the section for displaying Review */}
                <span className="reviewer-name">{review.username}</span>
                    <div className="static-stars">
                      {/* Display user rating scores based on editorial ratings (total of 5) */}
                      {[...Array(5)].map((_, index) => (
                        <FontAwesomeIcon 
                          key={index} 
                          icon={index < review.rating ? fasStar : farStar} 
                          className="star" 
                        />
                      ))}
                    </div>
                  {/*This is the section where the text content of the comment is displayed */}
                <p className="review-text">{review.review_text}</p>
                {/*Includes information at the bottom of the comment, such as the date of the comment, the date of editing, and the action button。 */}
                <div className="review-footer">  
                  <span className="review-date">
                    Reviewed on: {review.created_at?.toDate()?.toLocaleDateString() || "Unknown date"}
                  </span>
                {/*If the comment has been edited, it will show the date of the edit */}
                  {review.edited_at && (
                    <span className="edit-date">
                      Edited on: {review.edited_at.toDate().toLocaleDateString()}
                    </span>
                  )}
                  {/*If the currently logged in user is the author of this comment (currentUser.username === review.username), then two buttons will be displayed - one for editing the comment (edit-btn) and one for deleting it (delete-btn). */}
             
                    <div className="review-actions">
                      <button className="edit-btn" onClick={()=>navigate(`/movie/${review.movie_id}`)}>Go to Movie Page</button>
                      <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
                    </div>
                </div>
              </div>
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