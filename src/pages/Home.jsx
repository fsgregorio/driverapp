import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import PopupSelector from '../components/PopupSelector';
import Hero from '../components/Hero';

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DriverApp",
    "description": "A forma moderna de aprender e ensinar direção. Conectamos alunos e instrutores certificados para aulas práticas seguras, rápidas e sem burocracia.",
    "url": "https://driverapp.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://driverapp.com.br/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

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
      <SEO
        title="DriverApp - A forma moderna de aprender e ensinar direção"
        description="Conectamos alunos e instrutores certificados para aulas práticas seguras, rápidas e sem burocracia. Plataforma gratuita para aulas de direção."
        keywords="aulas de direção, instrutor de direção, aulas práticas, aprender a dirigir, instrutor certificado, aulas de direção habilitados"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      <PopupSelector isOpen={showPopup} onSelectProfile={handleSelectProfile} />
      <Hero onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Home;

