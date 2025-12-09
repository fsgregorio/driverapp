import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/aluno/Hero';
import Vantagens from '../components/aluno/Vantagens';
import ComoFunciona from '../components/aluno/ComoFunciona';
import Precos from '../components/aluno/Precos';
import CTAFinal from '../components/aluno/CTAFinal';
import FAQ from '../components/aluno/FAQ';
import Footer from '../components/Footer';

const LandingAluno = () => {
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
    <div className="LandingAluno">
      <Navbar 
        onSwitchProfile={handleSwitchProfile} 
        currentProfile="student"
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

export default LandingAluno;

