// Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  // State for toggling between sign-up and login forms
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Toggle between login and sign-up
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // Handle form submission for login and sign-up
  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';

    axios.post(endpoint, { username, password })
      .then(response => {
        console.log(response.data.message);
        if (response.data.token) {
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.data.token);
          onAuthSuccess();
        }
      })
      .catch(error => {
        setError('Error: ' + (error.response?.data?.message || 'An error occurred'));
        console.error('Authentication error:', error);
      });
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={toggleForm} className="toggle-form">
        {isLogin ? 'Create an account' : 'Have an account? Log in'}
      </button>
    </div>
  );
};

export default Auth;
