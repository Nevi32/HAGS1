import React, { useState } from 'react';

function AuthForm({ isLogin, toggleForm }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      // For example, check email and password
      localStorage.setItem('userInfo', JSON.stringify({
        email: formData.email
      }));
      window.location.href = '/dashboard'; // Redirect to dashboard
    } else {
      // Handle sign up logic here
      // For example, save user info
      if (formData.password === formData.confirmPassword) {
        localStorage.setItem('userInfo', JSON.stringify({
          name: formData.fullName,
          email: formData.email
        }));
        window.location.href = '/dashboard'; // Redirect to dashboard
      } else {
        alert('Passwords do not match');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Welcome to HAGS' : 'Create HAGS Account'}</h2>
      <p>{isLogin ? 'Please sign in to your account' : 'Please fill in the details to create your account'}</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
      </form>
      <div className="form-options">
        {isLogin && <a href="#forgot-password" className="forgot-password">Forgot Password?</a>}
        <button onClick={toggleForm} className="toggle-form">
          {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;





