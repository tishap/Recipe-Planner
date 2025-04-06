// components/ReviewForm.jsx
import React from 'react';

function ReviewForm({ formData, onSubmit, onPrevious, loading, error }) {
  return (
    <div className="form-step">
      <h2>Review Your Recipe</h2>
      
      <div className="review-section">
        <h3>User Information</h3>
        <p><strong>Username:</strong> {formData.user.username}</p>
        <p><strong>Email:</strong> {formData.user.email}</p>
        <p><strong>Cooking Level:</strong> {formData.user.level}</p>
      </div>
      
      <div className="review-section">
        <h3>Recipe Details</h3>
        <p><strong>Meal Type:</strong> {formData.recipeDetails.mealtype}</p>
        <p><strong>Category:</strong> {formData.recipeDetails.category}</p>
        <p><strong>Estimated Time:</strong> {formData.recipeDetails.estimatetime} minutes</p>
      </div>
      
      <div className="review-section">
        <h3>Recipe Instructions</h3>
        <p><strong>Dish Name:</strong> {formData.recipeInstructions.dishname}</p>
        
        <h4>Ingredients:</h4>
        <pre>{formData.recipeInstructions.ingredients}</pre>
        
        <h4>Instructions:</h4>
        <pre>{formData.recipeInstructions.instructions}</pre>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-buttons">
        <button type="button" onClick={onPrevious} className="btn-previous" disabled={loading}>
          Previous
        </button>
        <button type="button" onClick={onSubmit} className="btn-submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Recipe'}
        </button>
      </div>
    </div>
  );
}

export default ReviewForm;

