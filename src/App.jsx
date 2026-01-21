import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import LandingAluno from './pages/LandingAluno';
import LandingInstrutor from './pages/LandingInstrutor';
import Waitlist from './pages/Waitlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardAluno from './pages/DashboardAluno';
import DashboardInstrutor from './pages/DashboardInstrutor';
import DashboardAdmin from './pages/DashboardAdmin';

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard/aluno" element={<DashboardAluno />} />
              <Route path="/dashboard/instrutor" element={<DashboardInstrutor />} />
              <Route path="/dashboard/admin" element={<DashboardAdmin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
