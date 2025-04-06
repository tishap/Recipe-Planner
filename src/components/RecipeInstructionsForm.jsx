// components/RecipeInstructionsForm.jsx
import React, { useState } from 'react';

function RecipeInstructionsForm({ formData, updateFormData, onNext, onPrevious }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dishname.trim()) newErrors.dishname = 'Dish name is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="form-step">
      <h2>Recipe Instructions</h2>
      
      <div className="form-group">
        <label htmlFor="dishname">Dish Name</label>
        <input
          id="dishname"
          type="text"
          value={formData.dishname}
          onChange={(e) => updateFormData({ dishname: e.target.value })}
          placeholder="Enter the name of your dish"
        />
        {errors.dishname && <div className="error">{errors.dishname}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => updateFormData({ ingredients: e.target.value })}
          placeholder="List all ingredients (one per line)"
          rows="6"
        />
        {errors.ingredients && <div className="error">{errors.ingredients}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => updateFormData({ instructions: e.target.value })}
          placeholder="Write step-by-step instructions"
          rows="8"
        />
        {errors.instructions && <div className="error">{errors.instructions}</div>}
      </div>
      
      <div className="form-buttons">
        <button type="button" onClick={onPrevious} className="btn-previous">
          Previous
        </button>
        <button type="button" onClick={handleNext} className="btn-next">
          Next
        </button>
      </div>
    </div>
  );
}

export default RecipeInstructionsForm;