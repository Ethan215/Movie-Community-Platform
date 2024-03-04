import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './contexts/firebase'
import { collection, addDoc, where, query, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

function UserPage(){
    const {username} = useParams();
    const [reviews, setReviews] = useState([]);

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


    return(
        <div>
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
    );
}
export default UserPage;