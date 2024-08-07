import React, { useState } from 'react';
import Logo from '../components/Logo';
import AuthForm from '../components/AuthForm';
import '../styles/l.css';

function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 flex justify-center items-center bg-white hidden md:flex">
        <div className="relative z-10">
          <Logo />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background-green md:bg-white">
        <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />
      </div>
    </div>
  );
}

export default LandingPage;

