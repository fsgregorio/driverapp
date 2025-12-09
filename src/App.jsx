import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import LandingAluno from './pages/LandingAluno';
import LandingInstrutor from './pages/LandingInstrutor';
import Waitlist from './pages/Waitlist';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aluno" element={<LandingAluno />} />
            <Route path="/instrutor" element={<LandingInstrutor />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
