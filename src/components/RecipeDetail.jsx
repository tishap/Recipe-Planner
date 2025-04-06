// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../App'; // Import from your App.jsx file
import './RecipeDetail.css'; // Create this CSS file

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        // Fetch recipe details
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipe_details')
          .select('*')
          .eq('id', id)
          .single();

        if (recipeError) throw recipeError;

        // Fetch recipe instructions
        const { data: instructionsData, error: instructionsError } = await supabase
          .from('recipe_instructions')
          .select('*, user_id')
          .eq('recipe_details_id', id)
          .single();

        if (instructionsError) throw instructionsError;
        
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('username, email, level')
          .eq('id', instructionsData.user_id)
          .single();
        
        if (userError && instructionsData.user_id) {
          console.warn('User not found:', userError);
        }

        // Combine the data
        setRecipe({
          ...recipeData,
          instructions: instructionsData,
          user: userData || { username: 'Unknown User', level: 'beginner' }
        });
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="not-found">Recipe not found</div>;

  return (
    <div className="recipe-detail-container">
      <Link to="/recipes" className="back-btn">&larr; Back to Recipes</Link>
      
      <h1>{recipe.instructions?.dishname || 'Unnamed Recipe'}</h1>
      
      <div className="recipe-meta">
        <div className="meta-item">
          <span className="meta-label">Meal Type:</span>
          <span className="meta-value">{recipe.mealtype}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Category:</span>
          <span className="meta-value">{recipe.category}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Time:</span>
          <span className="meta-value">{recipe.estimatetime} minutes</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Added by:</span>
          <span className="meta-value">{recipe.user?.username} ({recipe.user?.level})</span>
        </div>
      </div>
      
      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <pre className="ingredients">{recipe.instructions?.ingredients}</pre>
        </div>
        
        <div className="instructions-section">
          <h2>Instructions</h2>
          <pre className="cooking-steps">{recipe.instructions?.instructions}</pre>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;