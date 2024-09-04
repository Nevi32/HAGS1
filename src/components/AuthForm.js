import React, { useState } from 'react';
import { signUp, signIn } from '../utils/auth';
import { Eye, EyeOff } from 'lucide-react';

function AuthForm({ isLogin, toggleForm }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await signIn(formData.email, formData.password);
      setMessage(result.message);
      if (result.success) {
        window.location.href = '/dashboard';
      }
    } else {
      if (formData.password === formData.confirmPassword) {
        const result = await signUp(formData.email, formData.password);
        setMessage(result.message);
        if (result.success) {
          toggleForm();
        }
      } else {
        setMessage('Passwords do not match');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Welcome to HAGS' : 'Create HAGS Account'}</h2>
      <p>{isLogin ? 'Please sign in to your account' : 'Please fill in the details to create your account'}</p>
      {message && <div className="message">{message}</div>}
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
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {!isLogin && (
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}
        <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
      </form>
      <div className="form-options">
        <button onClick={toggleForm} className="toggle-form">
          {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;






