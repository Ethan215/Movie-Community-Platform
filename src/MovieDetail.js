import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css'

function MovieDetail() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const { id } = useParams(); // Retrieve the movie ID from the URL
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); // default rating

  useEffect(() => {
    // Function to fetch movie data
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
  
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3001/reviews/${id}`); // Adjust the URL as needed
        if (!res.ok) {
          throw new Error('Reviews not found');
        }
        const data = await res.json();
        setReviews(data); // Set reviews state
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchMovie();
    fetchReviews();
  }, [id]); // Rerun the effect if movieId changes
  
  //function to submit review, posts to reviews
  const handleSubmitReview = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('http://localhost:3001/reviews', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: id, // From useParams
          rating,
          review_text: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Optionally, fetch reviews again to update the list
      // fetchReviews();

      // Reset form
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
      <div>
      <button onClick={() => navigate('/fetch') }className = "home-button">Back to Home</button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
            width: "135px",
            height: "200px",
            marginRight: "20px", // Added space between the image and the text
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
            <p>Reviewed on: {new Date(review.created_at).toLocaleDateString()}</p>
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