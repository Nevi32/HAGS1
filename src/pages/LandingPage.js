import React, { useState } from 'react';
import Logo from '../components/Logo';
import AuthForm from '../components/AuthForm';

function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="landing-page flex flex-col lg:flex-row h-screen">
      <div className="left-side bg-white flex flex-col justify-center items-center relative lg:flex-1 lg:order-1 order-2 lg:py-0 py-8">
        <Logo />
        <div className="lg:hidden w-full px-4 mt-8">
          <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />
        </div>
      </div>
      <div className="right-side bg-white flex justify-center items-center lg:flex-1 lg:order-2 order-1 lg:p-8 hidden lg:flex">
        <AuthForm isLogin={isLogin} toggleForm={() => setIsLogin(!isLogin)} />
      </div>
    </div>
  );
}

export default LandingPage;

