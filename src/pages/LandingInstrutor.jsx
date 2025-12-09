import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/instrutor/Hero';
import Vantagens from '../components/instrutor/Vantagens';
import ComoFunciona from '../components/instrutor/ComoFunciona';
import Precos from '../components/instrutor/Precos';
import CTAFinal from '../components/instrutor/CTAFinal';
import FAQ from '../components/instrutor/FAQ';
import Footer from '../components/Footer';

const LandingInstrutor = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "Instrutor de Direção Independente",
    "description": "Cadastre-se como instrutor de direção independente e transforme sua experiência em uma fonte de renda estável. Controle total sobre sua agenda e seus ganhos.",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "DriverApp",
      "url": "https://driverapp.com.br"
    },
    "jobLocation": {
      "@type": "Country",
      "name": "Brasil"
    },
    "employmentType": "CONTRACTOR",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "BRL",
      "value": {
        "@type": "QuantitativeValue",
        "value": "Variável",
        "unitText": "Por aula"
      }
    }
  };

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
      <SEO
        title="Seja Instrutor de Direção - Ganhe Renda Extra - DriverApp"
        description="Cadastre-se como instrutor de direção independente e comece a receber alunos hoje mesmo. Zero mensalidade, controle total sobre agenda e preços. Modelo de comissão justo e transparente."
        keywords="ser instrutor de direção, instrutor independente, ganhar dinheiro dando aulas, cadastro instrutor, instrutor certificado, renda extra direção"
        canonicalUrl="/instrutor"
        ogImage="/imgs/instrutor.png"
        structuredData={structuredData}
      />
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

