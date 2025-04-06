// components/RecipeDetailsForm.jsx
import React, { useState } from 'react';

function RecipeDetailsForm({ formData, updateFormData, onNext, onPrevious }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mealtype.trim()) newErrors.mealtype = 'Meal type is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.estimatetime <= 0) newErrors.estimatetime = 'Estimate time must be greater than 0';
    
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
      <h2>Recipe Details</h2>
      
      <div className="form-group">
        <label htmlFor="mealtype">Meal Type</label>
        <select
          id="mealtype"
          value={formData.mealtype}
          onChange={(e) => updateFormData({ mealtype: e.target.value })}
        >
          <option value="">Select a meal type</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
        {errors.mealtype && <div className="error">{errors.mealtype}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => updateFormData({ category: e.target.value })}
        >
          <option value="">Select a category</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="meat">Meat</option>
          <option value="seafood">Seafood</option>
          <option value="pasta">Pasta</option>
          <option value="soup">Soup</option>
          <option value="salad">Salad</option>
          <option value="baking">Baking</option>
        </select>
        {errors.category && <div className="error">{errors.category}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="estimatetime">Estimated Time (minutes)</label>
        <input
          id="estimatetime"
          type="number"
          value={formData.estimatetime}
          onChange={(e) => updateFormData({ estimatetime: parseInt(e.target.value) || 0 })}
          min="1"
          placeholder="Enter estimated cooking time"
        />
        {errors.estimatetime && <div className="error">{errors.estimatetime}</div>}
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

export default RecipeDetailsForm;