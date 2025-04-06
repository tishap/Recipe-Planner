// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import UserForm from './components/UserForm';
import RecipeDetailsForm from './components/RecipeDetailsForm';
import RecipeInstructionsForm from './components/RecipeInstructionsForm';
import ReviewForm from './components/ReviewForm';
import SuccessPage from './components/SuccessPage';
import ProgressBar from './components/ProgressBar';
import RecipeList from './components/RecipeList'; // New component
import RecipeDetail from './components/RecipeDetail'; // New component
import './App.css';

// Initialize Supabase client
const supabaseUrl = 'https://jilczyzhahscnbcaqcyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbGN6eXpoYWhzY25iY2FxY3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzMyMDEsImV4cCI6MjA1OTQwOTIwMX0.3U9TOXRnZXS3dAcTE-_aKyP-gZyqzknPZt5ivQXYoWg';
export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      level: 'beginner'
    },
    recipeDetails: {
      mealtype: '',
      category: '',
      estimatetime: 0
    },
    recipeInstructions: {
      dishname: '',
      ingredients: '',
      instructions: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Insert user data and get the user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([formData.user])
        .select('id')
        .single();
      
      if (userError) throw userError;
      
      // Step 2: Insert recipe details and get the recipe details ID
      const { data: recipeDetailsData, error: recipeDetailsError } = await supabase
        .from('recipe_details')
        .insert([formData.recipeDetails])
        .select('id')
        .single();
      
      if (recipeDetailsError) throw recipeDetailsError;
      
      // Step 3: Insert recipe instructions with foreign keys
      const { error: recipeInstructionsError } = await supabase
        .from('recipe_instructions')
        .insert([{
          ...formData.recipeInstructions,
          user_id: userData.id,
          recipe_details_id: recipeDetailsData.id
        }]);
      
      if (recipeInstructionsError) throw recipeInstructionsError;
      
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit the recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeForm = () => {
    switch (step) {
      case 1:
        return (
          <UserForm 
            formData={formData.user} 
            updateFormData={(data) => updateFormData('user', data)} 
            onNext={handleNext} 
          />
        );
      case 2:
        return (
          <RecipeDetailsForm 
            formData={formData.recipeDetails} 
            updateFormData={(data) => updateFormData('recipeDetails', data)} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <RecipeInstructionsForm 
            formData={formData.recipeInstructions} 
            updateFormData={(data) => updateFormData('recipeInstructions', data)} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewForm 
            formData={formData} 
            onSubmit={handleSubmit} 
            onPrevious={handlePrevious}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  // Integrated recipe form with routing
  const RecipeFormWrapper = () => {
    if (success) {
      return <Navigate to="/success" />;
    }

    return (
      <div className="app-container">
        <h1>Recipe Planner</h1>
        <ProgressBar currentStep={step} totalSteps={4} />
        <div className="form-container">
          {renderRecipeForm()}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="app">
        <header>
          <nav className="main-nav">
            <div className="logo">Recipe Planner</div>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/recipes">Browse Recipes</Link></li>
              <li><Link to="/new-recipe">Add Recipe</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            {/* Recipe browsing routes */}
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            
            {/* Recipe creation flow */}
            <Route path="/new-recipe" element={<RecipeFormWrapper />} />
            <Route path="/success" element={<SuccessPage />} />
            
            {/* Homepage - redirects to recipes list */}
            <Route path="/" element={<Navigate to="/recipes" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;