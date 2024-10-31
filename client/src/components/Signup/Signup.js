import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to the signup API
    axios.post('http://localhost:5000/api/signup', { username, password })
      .then(response => {
        setSuccess('User registered successfully!');
        setError(''); 
        // Redirect the user to the login page or clear the form fields
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          setError('Username already exists');
        } else {
          setError('An error occurred. Please try again.');
        }
        setSuccess('');
      });
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
