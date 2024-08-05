// src/components/AuthForm.js
import React from 'react';

function AuthForm({ isLogin, toggleForm }) {
  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Welcome to HAGS' : 'Create HAGS Account'}</h2>
      <form className="auth-form">
        {!isLogin && <input type="text" placeholder="Full Name" required />}
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
      </form>
      <p>
        {isLogin ? "New to HAGS? " : "Already have an account? "}
        <button onClick={toggleForm}>
          {isLogin ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;