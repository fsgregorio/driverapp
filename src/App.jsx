import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import LandingAluno from './pages/LandingAluno';
import LandingInstrutor from './pages/LandingInstrutor';
import Waitlist from './pages/Waitlist';
import DashboardAluno from './pages/DashboardAluno';
import DashboardInstrutor from './pages/DashboardInstrutor';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aluno" element={<LandingAluno />} />
              <Route path="/instrutor" element={<LandingInstrutor />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/dashboard/aluno" element={<DashboardAluno />} />
              <Route path="/dashboard/instrutor" element={<DashboardInstrutor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
