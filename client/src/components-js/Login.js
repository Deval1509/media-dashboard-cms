import React, { useState } from 'react';
import '../components-css/Login.css';

const Login = ({ onLogin }) => {
  // State to track the username, password, and any login error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission for login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple hardcoded validation for demonstration purposes
    if (username === 'admin' && password === 'password') {
      onLogin(true);  // Call the onLogin function with 'true' to indicate success
    } else {
      setError('Invalid username or password');  // Set an error message if login fails
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {/* Display error message if login fails */}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Update username state
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
