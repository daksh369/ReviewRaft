import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ReviewGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [review, setReview] = useState('');
  const [reviewKeywords, setReviewKeywords] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const businessNameFromQr = queryParams.get('businessName');
    if (businessNameFromQr) {
      setBusinessName(businessNameFromQr);
    }
  }, [location]);

  const generateReview = () => {
    // In a real application, you would use a service like Gemini to generate a review.
    // For this example, we'll use a template.
    const generatedReview = `I had a great experience at ${businessName}. The ${reviewKeywords} was excellent. I would highly recommend it to anyone looking for a quality experience.`;
    setReview(generatedReview);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(review);
    alert('Review copied to clipboard!');
  };

  const handleBusinessNameChange = (event) => {
    setBusinessName(event.target.value);
  };

  const handleReviewKeywordsChange = (event) => {
    setReviewKeywords(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    generateReview();
  };

  return (
    <div className="review-generator">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="businessName">Business Name:</label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={handleBusinessNameChange}
            placeholder="e.g., 'The Friendly Cafe'"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reviewKeywords">What did you like?</label>
          <input
            type="text"
            id="reviewKeywords"
            value={reviewKeywords}
            onChange={handleReviewKeywordsChange}
            placeholder="e.g., 'coffee and croissants'"
            required
          />
        </div>
        <button type="submit">Generate Review</button>
      </form>
      {review && (
        <div className="review-output">
          <h2>Your Generated Review:</h2>
          <p>{review}</p>
          <div className="review-actions">
            <button onClick={copyToClipboard}>Copy and Add Review</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewGenerator;