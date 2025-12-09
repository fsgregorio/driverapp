import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupSelector from '../components/PopupSelector';
import Hero from '../components/Hero';

const Home = () => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already selected a profile in this session
    const savedProfile = sessionStorage.getItem('selectedProfile');
    if (savedProfile) {
      // Redirect to the saved profile page
      navigate(savedProfile === 'student' ? '/aluno' : '/instrutor', { replace: true });
    }
  }, [navigate]);

  const handleSelectProfile = (profile) => {
    sessionStorage.setItem('selectedProfile', profile);
    setShowPopup(false);
    
    // Navigate to the appropriate page
    if (profile === 'student') {
      navigate('/aluno');
    } else {
      navigate('/instrutor');
    }
  };

  const handleGetStarted = () => {
    setShowPopup(true);
  };

  return (
    <div className="Home">
      <PopupSelector isOpen={showPopup} onSelectProfile={handleSelectProfile} />
      <Hero onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Home;

