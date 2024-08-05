import React from 'react';

function AuthForm({ isLogin, toggleForm }) {
  return (
    <div className="auth-form-container w-full max-w-md">
      <h2 className="text-brightGreen text-2xl mb-2">
        {isLogin ? 'Welcome to HAGS' : 'Create HAGS Account'}
      </h2>
      <p className="mb-8 text-textColor">
        {isLogin ? 'Please sign in to your account' : 'Please fill in the details to create your account'}
      </p>
      <form className="auth-form flex flex-col gap-4">
        {!isLogin && <input type="text" placeholder="Full Name" className="p-3 border border-gray-300 rounded" required />}
        <input type="email" placeholder="Email" className="p-3 border border-gray-300 rounded" required />
        <input type="password" placeholder="Password" className="p-3 border border-gray-300 rounded" required />
        {!isLogin && <input type="password" placeholder="Confirm Password" className="p-3 border border-gray-300 rounded" required />}
        <button type="submit" className="p-3 bg-primaryGreen text-white rounded transition hover:bg-green-700">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="form-options flex flex-col items-center mt-4">
        {isLogin && <a href="#forgot-password" className="text-brightGreen text-sm mt-2 hover:underline">Forgot Password?</a>}
        <button onClick={toggleForm} className="text-brightGreen text-sm mt-2 hover:underline">
          {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;

