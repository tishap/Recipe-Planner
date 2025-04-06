// components/SuccessPage.jsx
import React from 'react';

function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h2>Recipe Successfully Submitted!</h2>
      <p>Thank you for contributing to our recipe collection.</p>
      <button onClick={() => window.location.reload()} className="btn-new-recipe">
        Add Another Recipe
      </button>
    </div>
  );
}

export default SuccessPage;
