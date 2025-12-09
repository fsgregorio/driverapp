import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/instrutor/Hero';
import Vantagens from '../components/instrutor/Vantagens';
import ComoFunciona from '../components/instrutor/ComoFunciona';
import Precos from '../components/instrutor/Precos';
import CTAFinal from '../components/instrutor/CTAFinal';
import FAQ from '../components/instrutor/FAQ';
import Footer from '../components/Footer';

const LandingInstrutor = () => {
  const navigate = useNavigate();

  const handleSwitchProfile = () => {
    sessionStorage.removeItem('selectedProfile');
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="LandingInstrutor">
      <Navbar 
        onSwitchProfile={handleSwitchProfile} 
        currentProfile="instructor"
        scrollToSection={scrollToSection}
      />
      <Hero />
      <Vantagens />
      <ComoFunciona />
      <Precos />
      <CTAFinal />
      <FAQ />
      <Footer onSwitchProfile={handleSwitchProfile} />
    </div>
  );
};

export default LandingInstrutor;

