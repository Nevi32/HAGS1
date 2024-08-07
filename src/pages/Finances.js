import React from 'react';
import Navbar from '../components/Navbar';

function Finances() {
  return (
    <div className="finances-page">
      <Navbar />
      <main>
        <h1>Finances</h1>
        {/* Add content for financial management */}
        <p>Monitor and manage your financial data here.</p>
        {/* Add your financial dashboard or reports component here */}
      </main>
    </div>
  );
}

export default Finances;