// src/pages/LandingPage.js
import React, { useState } from 'react';
import Logo from '../components/Logo';
import AuthForm from '../components/AuthForm';

function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="landing-page">
      <div className="left-side">
        <Logo />
      </div>
      <div className="right-side">
        <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />
      </div>
    </div>
  );
}

export default LandingPage;