// components/ProgressBar.jsx
import React from 'react';

function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="progress-bar">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`progress-step ${i + 1 <= currentStep ? 'active' : ''}`}
        >
          <div className="step-number">{i + 1}</div>
          <div className="step-label">
            {i === 0 ? 'User' : 
             i === 1 ? 'Details' : 
             i === 2 ? 'Instructions' : 'Review'}
          </div>
        </div>
      ))}
      <div className="progress-line">
        <div
          className="progress-line-fill"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;