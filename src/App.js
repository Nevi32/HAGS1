import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ViewMembers from './pages/ViewMembers';
import RegMembers from './pages/RegMembers';
import Groups from './pages/Groups';
import Projects from './pages/Projects';
import Finances from './pages/Finances';
import Quick from './pages/Quick';
import ReceiptManager from './pages/ReceiptManager'; // Import ReceiptManager component
import OfflineBanner from './components/OfflineBanner';
import SyncNotification from './components/SyncNotification';

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        setIsSyncing(false);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOffline) {
      setIsSyncing(true);
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-data');
      });
    }
  }, [isOffline]);

  return (
    <ThemeProvider>
      <Router>
        {isOffline && <OfflineBanner />}
        {isSyncing && <SyncNotification />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewmembers" element={<ViewMembers />} />
          <Route path="/regmembers" element={<RegMembers />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/quick" element={<Quick />} />
          <Route path="/receiptmanager" element={<ReceiptManager />} /> {/* New Route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
