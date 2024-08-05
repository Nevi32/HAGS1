// src/components/SignUpForm.js
import React from 'react';

function SignUpForm({ onSwitchForm }) {
  return (
    <form className="auth-form">
      <h2>Create HAGS Account</h2>
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p>Already have an account? <button onClick={onSwitchForm}>Sign in</button></p>
    </form>
  );
}

export default SignUpForm;