// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import BlindSignaturePage from './components/BlindSignaturePage';
import AggregationPage from './components/AggregationPage';
import VoteCastingPage from './components/VoteCastingPage';
import ResultsTallyPage from './components/ResultsTallyPage';
import VoteCastingWithSignaturePage from './components/VoteCastingWithSignaturePage';
import AttackAnalysisPage from './components/AttackAnalysisPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="bg-light text-dark min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand small" to="/">CryptoBallot</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/auth">Auth</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/blind">Blind Sign</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/aggregation">Aggregation</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vote">Cast Vote</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/results">Results</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vote-signature">Vote w/ Sign</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/attack-analysis">Attack Analysis</Link>
              </li>
            </ul>
            {currentUser && (
              <span className="navbar-text ms-3 small">
                Logged in as: <strong>{currentUser}</strong>
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {currentUser && <p className="text-end small">Welcome, {currentUser}!</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage onLogin={setCurrentUser} />} />
          <Route path="/blind" element={<BlindSignaturePage />} />
          <Route path="/aggregation" element={<AggregationPage />} />
          <Route path="/vote" element={<VoteCastingPage currentUser={currentUser} />} />
          <Route path="/results" element={<ResultsTallyPage currentUser={currentUser} />} />
          <Route path="/vote-signature" element={<VoteCastingWithSignaturePage currentUser={currentUser} />} />
          <Route path="/attack-analysis" element={<AttackAnalysisPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
