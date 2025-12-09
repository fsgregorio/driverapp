import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LandingAluno from './pages/LandingAluno';
import LandingInstrutor from './pages/LandingInstrutor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aluno" element={<LandingAluno />} />
          <Route path="/instrutor" element={<LandingInstrutor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
