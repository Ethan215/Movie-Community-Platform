import React, { useEffect, useState, useCallback } from 'react';
import { Alert } from "react-bootstrap"
import { db } from './contexts/firebase';
import { collection, addDoc, where, query, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Link, useParams} from 'react-router-dom';
import './MovieDetail.css'
import { useAuthUser } from './contexts/AuthUserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

function MovieDetail() {
  // State variables for rating and review text
  const [editReviewText, setEditReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { currentUser } = useAuthUser();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); 
  // Rating variable
  const [editRating, setEditRating] = useState(5);
  const [rating, setRating] = useState(5); 

  // Get the movie id from the URL
  const { id } = useParams(); 
  // State variable for the review text
  const [reviewText, setReviewText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorWatchlist, setErrorWatchlist] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  
  //  gets all comments matching the current movie ID via a Firebase query.
  const fetchReviews = useCallback(async () => {
    try {
      // Query the reviews collection in the database where the movie_id matches the id from the URL
      const q = query(collection(db, "reviews"), where("movie_id", "==", id));
      // Get the documents from the query
      const querySnapshot = await getDocs(q);
      // Map the documents to the review data
      const reviewsData = querySnapshot.docs.map(doc => ({id: doc.id, 
      ...doc.data(),}));
      // Set the reviews state variable
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [id]); 


  // Use effect to fetch the movie details and reviews when the component mounts
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch the movie details from the API
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=7fe3338624f016b56f11393910f1f293`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        // Parse the response to JSON
        const data = await response.json();
        // Set the movie state variable
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };
    fetchMovie();
    fetchReviews();
  }, [id, fetchReviews]); 

  useEffect(() => {
    const checkIsInWatchlist = async () => {
      try {
        const q = query(collection(db, "watchlist"), where("username", "==", currentUser.username), where("movie_id", "==", id));
        const querySnapshot = await getDocs(q);
        setIsInWatchlist(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    if (currentUser) {
      checkIsInWatchlist();
    }
  }, [currentUser, id]);

  // Handles the logic for editing comments, updating the modified comments to the database.
  const handleSaveEdit = async (reviewId) => {
    // Get the review document from the database
    const reviewDoc = doc(db, "reviews", reviewId);
    try {
      // Update the review document with the edited rating and review text
      await updateDoc(reviewDoc, {
        rating: Number(editRating),
        review_text: editReviewText,
        edited_at: serverTimestamp(),
        public: true,
        movie_poster_path: movie.poster_path,
        movie_name: movie.title
      });
      // Exit editing mode
      setEditingReviewId(null);
      // Clear the state variables
      setEditRating(5);
      setEditReviewText('')
      setReviewText('');
      setRating(5);
      // Fetch the reviews to update the state
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };
  // Function to start editing a review
  const startEdit = (review) => {
    // Set the state variables for editing
    setEditRating(review.rating);
    setEditReviewText(review.review_text);
    setEditingReviewId(review.id);
    // Plus, potentially open a modal or reveal the edit form
  };

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
  
  // Function to submit a review
  const handleSubmitReview = async (e) => {
    e.preventDefault(); 

    try {
      // Query the reviews collection to check if the user has already submitted a review
      const q = query(collection(db, "reviews"), where("username", "==", currentUser.username), where("movie_id", "==", id) );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      // Clear the error message
      setErrorMessage('');
      // If the user has already submitted a review, show an error message
      if(reviewsData.length!==0){
        setErrorMessage("You already posted a review. Delete or edit your current review.")
      }else{
        // If the user hasn't submitted a review, add the review to the database
        await addDoc(collection(db, "reviews"),{
          movie_id: id,
          rating: Number(rating),
          review_text: reviewText,
          username: currentUser.username,
          created_at: serverTimestamp(),
          public: true,
          movie_poster_path: movie.poster_path,
          movie_name: movie.title
        });
      }
      // Clear the state variables
      setReviewText('');
      setRating(5);
      // Fetch the reviews to update the state
      fetchReviews(); // Re-fetch reviews after submitting
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  }
  // If the movie details haven't been fetched yet, show a loading message
  //function to add movie to watchlist, but also able to remove movie from watchlist
  const addOrRemoveMovieFromWatchlist = async (e) => {
    e.preventDefault(); 
    
    try {
      if (isInWatchlist) { // If movie is in watchlist, remove it
        const q = query(collection(db, "watchlist"), where("username", "==", currentUser.username), where("movie_id", "==", id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          setIsInWatchlist(false);
          setErrorWatchlist("Movie removed from your watchlist.");
        }
      } else { // If movie is not in watchlist, add it
        await addDoc(collection(db, "watchlist"), {
          username: currentUser.username,
          movie_id: id,
          movie_title: movie.title,
          movie_poster_path: movie.poster_path
        });
        setIsInWatchlist(true);
        setErrorWatchlist("Movie added to your watchlist.");
      }

    } catch (error) {
      console.error("Error adding or removing movie from watchlist:", error);
    }
  };

  if (!movie) {
    return <div>Movie Doesn't Exist</div>;
  }
  function EditReviewModal({ review, editRating, setEditRating, editReviewText, setEditReviewText, onSave, onCancel }) {
    return (
      <div className="modal" style={{display: 'block'}}> {/* Make sure the modal box is visible */}
        <div className="modal-content">
          <span className="close" onClick={onCancel}>&times;</span>
          <form className="edit-review-form" onSubmit={(e) => {
            e.preventDefault();
            onSave(review.id);
          }}>
            <div className="edit-rating ">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEditRating(index + 1)}
                  className={`star-button ${editRating > index ? 'filled' : 'empty'}`}
                >
                  <FontAwesomeIcon icon={fasStar} />
                </button>
              ))}
            </div>
            <label htmlFor="editReviewText" className="edit-review-label">New Review:</label>
            <textarea  id="editReviewText" className="review-textarea" value={editReviewText} onChange={(e) => setEditReviewText(e.target.value)} />
            <input type="submit" className="save-btn" value="Save" />
          </form>
        </div>
      </div>
    );
  }
  
  // Render the movie details and review form
  return (
    <div className="movie-container">
       {/* Display Move Information  */}
        <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <p className="movie-synopsis">{`Synopsis: ${movie.overview}`}</p>
            {errorWatchlist && <Alert variant="danger">{errorWatchlist}</Alert>}
            {currentUser && (
            <button onClick={addOrRemoveMovieFromWatchlist} className="watchlist-button">
              {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>
            )}
        </div>
        {/* Display Move Rating  */}
        <div>
          <h5>YOUR RATING</h5>
          <form onSubmit={handleSubmitReview}>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <fieldset className="rating"> 
                {[5, 4, 3, 2, 1].map((number) => (
                  <React.Fragment key={number.toString()}>
                    <input
                      type="radio"
                      id={`star${number.toString().replace('.', 'half')}`}
                      name="rating"
                      value={number.toString()}
                      checked={rating === number.toString()}
                      onChange={(e) => setRating(e.target.value)}
                      className="star-radio-btn" // Add a class name to hide
                    /> 
                    {/* Display Star*/}
                    <label htmlFor={`star${number}`}>
                      <FontAwesomeIcon icon={fasStar} /> 
                    </label>
                  </React.Fragment>
                ))}
              </fieldset>
              <div className="review-input-container">
                <label htmlFor="reviewText">Review:</label>
                <textarea 
                  id="reviewText" 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  className="review-textarea"
                />
              </div>
            <button className="submit-review-btn" type="submit">Submit Review</button>
        </form>
      </div>
        {/* Display Move Review List  */}
        <div className="reviews-container">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div className="review-block" key={review.id}>
              <div className="review-content">
                {/*This is the section for displaying Review */}
                <Link to={`/user/${review.username}`} className="reviewer-name-link">{review.username}</Link>
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
                  {currentUser && currentUser.username === review.username && (
                    <div className="review-actions">
                      <button className="edit-btn" onClick={() => startEdit(review)}>Edit Review</button>
                      {editingReviewId === review.id && (
                        <EditReviewModal 
                          review={review}
                          editRating={editRating}
                          setEditRating={setEditRating}
                          editReviewText={editReviewText}
                          setEditReviewText={setEditReviewText}
                          onSave={() => handleSaveEdit(review.id)}
                          onCancel={() => setEditingReviewId(null)}
                        />
                      )}
                      <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
                    </div>
                  )}
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

export default MovieDetail;