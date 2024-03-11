// EditReviewModal.js
import React from 'react';
import './EditReviewModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

function EditReviewModal({ review, editRating, setEditRating, editReviewText, setEditReviewText, onSave, onCancel }) {
  return (
    <div className="modal" style={{display: 'block'}}>
      <div className="modal-content">
        <span className="close" onClick={onCancel}>&times;</span>
        <form className="edit-review-form" onSubmit={(e) => {
            e.preventDefault();
            onSave(review.id);
        }}>
          <div className="edit-rating">
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
          <label htmlFor="editReviewText" className="edit-review-label">
            New Review:
          </label>
          <textarea
            id="editReviewText"
            className="review-textarea"
            value={editReviewText}
            onChange={(e) => setEditReviewText(e.target.value)}
          />
          <input type="submit" className="save-btn" value="Save" />
        </form>
      </div>
    </div>
  );
}

export default EditReviewModal;
