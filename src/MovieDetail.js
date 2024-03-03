import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from "react-bootstrap"
import { db } from './contexts/firebase';
import { collection, addDoc, where, query, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css'
import { useAuthUser } from './contexts/AuthUserContext';

function MovieDetail() {
  const [editRating, setEditRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { currentUser } = useAuthUser();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const { id } = useParams(); 
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); 
  const [errorMessage, setErrorMessage] = useState('');
  
  
  const fetchReviews = useCallback(async () => {
    try {
      const q = query(collection(db, "reviews"), where("movie_id", "==", id));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({id: doc.id, 
      ...doc.data(),}));
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [id]); 


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=7fe3338624f016b56f11393910f1f293`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };
  
    
    fetchMovie();
    fetchReviews();
  }, [id, fetchReviews]); 
  

  const handleSaveEdit = async (reviewId) => {
    const reviewDoc = doc(db, "reviews", reviewId);
    try {
      await updateDoc(reviewDoc, {
        rating: Number(editRating),
        review_text: editReviewText,
        edited_at: serverTimestamp()
      });
      setEditingReviewId(null); // Exit editing mode
      setEditRating(5);
      setEditReviewText('')
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };
  const startEdit = (review) => {
    setEditRating(review.rating);
    setEditReviewText(review.review_text);
    setEditingReviewId(review.id);
    // Plus, potentially open a modal or reveal the edit form
  };

  const handleDeleteReview = async (reviewId)=>{
    if (window.confirm("Delete Review? This action cannot be undone.")) {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      fetchReviews(); // Refresh reviews after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }
  };
  
  //function to submit review, posts to reviews
  const handleSubmitReview = async (e) => {
    e.preventDefault(); 

    try {
      const q = query(collection(db, "reviews"), where("username", "==", currentUser.username), where("movie_id", "==", id) );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      setErrorMessage('');
      if(reviewsData.length!==0){
        setErrorMessage("You already posted a review. Delete or edit your current review.")
      }else{
        await addDoc(collection(db, "reviews"),{
          movie_id: id,
          rating: Number(rating),
          review_text: reviewText,
          username: currentUser.username,
          created_at: serverTimestamp()
        });
      }
      setReviewText('');
      setRating(5);
      fetchReviews(); // Re-fetch reviews after submitting
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!movie) {
    return <div>Movie Doesn't Exist</div>;
  }

  return (
      <div>
      <button onClick={() => navigate('/home') }className = "home-button">Back to Home</button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
            width: "135px",
            height: "200px",
            marginRight: "20px", 
            }}
        />

        <div>
            <h1>{movie.title}</h1>
            <p>{`Synopsis: ${movie.overview}`}</p>
        </div>
        </div>
        <div>
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
             {editingReviewId === review.id ? (
                  // Render input fields for editing
                  <div>
                    <select id="rating" value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                      {[1, 2, 3, 4, 5].map((number) => (
                        <option key={number} value={number}>{number}</option>
                      ))}
                    </select>
                    <textarea
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(review.id)}>Save</button>
                    <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                  </div>
                ) : (
                  <p>Reviewer: {review.username}, Rating: {review.rating}, Review: {review.review_text}, 
                  Reviewed on: {review.created_at?.toDate()?.toLocaleDateString() || "Unknown date"},
                  {review.edited_at && ` Edited on: ${review.edited_at.toDate().toLocaleDateString()}`}</p>
                )}
            {currentUser && currentUser.username === review.username && (
              <>
                <button onClick={() => startEdit(review)}>Edit Review</button>
                <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
    <div>
      
        <h2>Submit a Review</h2>
        <form onSubmit={handleSubmitReview}>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div>
            <label htmlFor="rating">Rating:</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>{number}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="reviewText">Review:</label>
            <textarea id="reviewText" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
          </div>

          <button type="submit">Submit Review</button>
        </form>
      </div>
        </div>
  );
}

export default MovieDetail;