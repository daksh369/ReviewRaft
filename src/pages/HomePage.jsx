import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewGenerator from '../components/ReviewGenerator';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Google Review Automation</h1>
        <p>Generate AI-powered reviews for your favorite businesses.</p>
      </header>
      <main>
        <ReviewGenerator />
      </main>
    </div>
  );
}

export default HomePage;