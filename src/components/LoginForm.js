import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Password input
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/login', { username, password });
      setMessage(res.data);
      if (res.data === "Login successful!") {
        onLogin(username);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : "Login failed");
    }
  };

  return (
    <div className="card p-3">
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input 
            className="form-control" 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input 
            className="form-control" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default LoginForm;
