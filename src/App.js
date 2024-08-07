import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ViewMembers from './pages/ViewMembers';
import RegMembers from './pages/RegMembers';
import Groups from './pages/Groups';
import Projects from './pages/Projects';
import Finances from './pages/Finances';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/viewmembers" element={<ViewMembers />} />
        <Route path="/regmembers" element={<RegMembers />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/finances" element={<Finances />} />
      </Routes>
    </Router>
  );
}

export default App;