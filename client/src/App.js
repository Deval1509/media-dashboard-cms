import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MediaList from './components/MediaList/MediaList';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ContentForm from './components/ContentForm/ContentForm';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  return (
    <Router>
      <div className="App">
        <h1>Media Content Management Dashboard</h1>
        {isLoggedIn ? (
          <>
            <nav className="nav-bar">
              <Link to="/" className="nav-link">Home</Link>
              <span className="nav-separator">|</span>
              <Link to="/add-content" className="nav-link">Add Content</Link>
            </nav>
            <Routes>
              <Route path="/" element={<MediaList isAdmin={true} />} />
              <Route path="/add-content" element={<ContentForm />} />
            </Routes>
          </>
        ) : (
          showSignup ? (
            <>
              <Signup />
              <p>
                Already have an account?{' '}
                <button onClick={toggleSignup} className="link-button">
                  Go to Login
                </button>
              </p>
            </>
          ) : (
            <>
              <Login onLogin={handleLogin} />
              <p>
                Don't have an account?{' '}
                <button onClick={toggleSignup} className="link-button">
                  Sign Up
                </button>
              </p>
            </>
          )
        )}
      </div>
    </Router>
  );
}

export default App;
