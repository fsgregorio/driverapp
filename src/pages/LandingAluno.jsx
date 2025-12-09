import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/aluno/Hero';
import Vantagens from '../components/aluno/Vantagens';
import ComoFunciona from '../components/aluno/ComoFunciona';
import Precos from '../components/aluno/Precos';
import CTAFinal from '../components/aluno/CTAFinal';
import FAQ from '../components/aluno/FAQ';
import Footer from '../components/Footer';

const LandingAluno = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Aulas Práticas de Direção",
    "provider": {
      "@type": "Organization",
      "name": "DriverApp",
      "url": "https://driverapp.com.br"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "description": "Aulas práticas de direção para habilitados. Encontre instrutores certificados, compare preços e agende suas aulas. Plataforma 100% gratuita.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "description": "Uso da plataforma é gratuito"
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
    <div className="LandingAluno">
      <SEO
        title="Aulas Práticas de Direção para Habilitados - DriverApp"
        description="Pratique e melhore suas habilidades ao volante com instrutores certificados. Aulas práticas para habilitados: baliza, controle de embreagem, rodovia e mais. Plataforma 100% gratuita."
        keywords="aulas práticas direção, aulas para habilitados, instrutor de direção, aulas baliza, controle embreagem, aulas rodovia, aprender a dirigir melhor, instrutor certificado"
        canonicalUrl="/aluno"
        ogImage="/imgs/student.png"
        structuredData={structuredData}
      />
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

