// src/components/LoginForm.js
import React from 'react';

function LoginForm({ onSwitchForm }) {
  return (
    <form className="auth-form">
      <h2>Welcome to HAGS</h2>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      <p>New to HAGS? <button onClick={onSwitchForm}>Create an account</button></p>
    </form>
  );
}

export default LoginForm;

