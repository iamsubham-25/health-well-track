
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SymptomChecker from './pages/SymptomChecker';
import NearbyServices from './pages/NearbyServices';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import Reminders from './pages/Reminders';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate checking auth status from localStorage
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(loggedIn);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      {isAuthenticated ? (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/symptom-checker" />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/nearby-services" element={<NearbyServices />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="*" element={<Navigate to="/symptom-checker" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default App;
