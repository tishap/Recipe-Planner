// src/components/RecipeList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../App'; // Import from your App.jsx file
import './RecipeList.css'; // Create this CSS file

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Get recipe details with joined user and instructions information
        const { data: recipeDetails, error: recipeError } = await supabase
          .from('recipe_details')
          .select(`
            id,
            mealtype,
            category,
            estimatetime,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (recipeError) throw recipeError;
        
        // For each recipe detail, get the dish name from recipe_instructions
        const recipesWithNames = await Promise.all(
          recipeDetails.map(async (recipe) => {
            const { data: instructionData, error: instructionError } = await supabase
              .from('recipe_instructions')
              .select('dishname, user_id')
              .eq('recipe_details_id', recipe.id)
              .single();
              
            if (instructionError) return { ...recipe, dishname: 'Unnamed Recipe' };
            
            // Get user info
            if (instructionData.user_id) {
              const { data: userData } = await supabase
                .from('users')
                .select('username, level')
                .eq('id', instructionData.user_id)
                .single();
                
              return { 
                ...recipe, 
                dishname: instructionData.dishname,
                username: userData?.username || 'Unknown User',
                level: userData?.level || 'beginner'
              };
            }
            
            return { 
              ...recipe, 
              dishname: instructionData.dishname,
              username: 'Unknown User',
              level: 'beginner'
            };
          })
        );
        
        setRecipes(recipesWithNames);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipe-list-container">
      <h1>Recipe Collection</h1>
      
      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found. Start by adding your first recipe!</p>
          <Link to="/new-recipe" className="add-recipe-btn">Add Recipe</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.dishname || 'Unnamed Recipe'}</h3>
              <div className="recipe-card-details">
                <p><strong>Meal Type:</strong> {recipe.mealtype}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <p><strong>Time:</strong> {recipe.estimatetime} minutes</p>
                <p><strong>Added by:</strong> {recipe.username} ({recipe.level})</p>
              </div>
              <Link to={`/recipe/${recipe.id}`} className="view-recipe-btn">
                View Recipe
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;