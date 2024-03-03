import React, { useEffect, useState, useCallback } from 'react';
import { db } from './contexts/firebase';
import { collection, addDoc, where, query, serverTimestamp, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css'

function MovieDetail() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const { id } = useParams(); 
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); 
  
  
  const fetchReviews = useCallback(async () => {
    try {
      const q = query(collection(db, "reviews"), where("movie_id", "==", id));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
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
  
  //function to submit review, posts to reviews
  const handleSubmitReview = async (e) => {
    e.preventDefault(); 

    try {
      await addDoc(collection(db, "reviews"),{
        movie_id: id,
        rating: Number(rating),
        review_text: reviewText,
        created_at: serverTimestamp()
      });
  
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
            <p>Rating: {review.rating}</p>
            <p>{review.review_text}</p>
            <p>Reviewed on: {review.created_at?.toDate()?.toLocaleDateString() || "Unknown date"}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
    <div>
      
        <h2>Submit a Review</h2>
        <form onSubmit={handleSubmitReview}>
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