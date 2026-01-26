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
  const siteUrl = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://drivetopass.com.br');
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "iDrive",
    "url": siteUrl,
    "logo": `${siteUrl}/imgs/logo/idrive.png`,
    "description": "Plataforma que conecta alunos e instrutores certificados para aulas práticas de direção seguras, rápidas e sem burocracia.",
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "sameAs": [
      "https://www.facebook.com/drivetopass",
      "https://www.instagram.com/drivetopass",
      "https://twitter.com/drivetopass"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    }
  };

  // JobPosting Schema
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "Instrutor de Direção Independente",
    "description": "Cadastre-se como instrutor de direção independente e transforme sua experiência em uma fonte de renda estável. Controle total sobre sua agenda e seus ganhos.",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "iDrive",
      "url": siteUrl
    },
    "jobLocation": {
      "@type": "Country",
      "name": "Brasil"
    },
    "employmentType": "CONTRACTOR",
    "workHours": "Flexível",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "BRL",
      "value": {
        "@type": "QuantitativeValue",
        "value": "Variável",
        "unitText": "Por aula"
      }
    },
    "qualifications": "Certificação profissional exigida pelo Detran",
    "skills": "Experiência em ensino de direção, paciência, comunicação clara"
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Para Instrutores",
        "item": `${siteUrl}/instrutor`
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como funciona o cadastro de instrutor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O cadastro é simples e rápido. Você precisa fornecer suas informações profissionais, incluindo certificação do Detran. Após a verificação, seu perfil estará ativo e você poderá começar a receber alunos."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto custa para ser instrutor na plataforma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A plataforma é totalmente gratuita para instrutores. Não há taxas de cadastro, mensalidade ou comissões fixas. Você tem controle total sobre seus preços e ganhos."
        }
      },
      {
        "@type": "Question",
        "name": "Como recebo os pagamentos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Os pagamentos são processados de forma segura através da plataforma. Você pode definir suas preferências de pagamento e receber diretamente na sua conta bancária."
        }
      },
      {
        "@type": "Question",
        "name": "Tenho controle sobre minha agenda?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, você tem controle total sobre sua agenda. Você define seus horários disponíveis e pode aceitar ou recusar solicitações de alunos conforme sua disponibilidade."
        }
      },
      {
        "@type": "Question",
        "name": "Como os alunos me encontram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Após o cadastro, seu perfil ficará visível na plataforma. Os alunos podem buscar instrutores por localização, tipo de aula, preço e avaliações. Você pode otimizar seu perfil para aparecer mais nas buscas."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso ter veículo próprio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não necessariamente. Você pode oferecer aulas com seu próprio veículo ou aceitar aulas onde o aluno usa seu próprio carro. Isso oferece flexibilidade tanto para você quanto para os alunos."
        }
      }
    ]
  };

  const structuredData = [organizationSchema, jobPostingSchema, breadcrumbSchema, faqSchema];

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
        title="Seja Instrutor de Direção - Ganhe Renda Extra - iDrive"
        description="Cadastre-se como instrutor de direção independente e comece a receber alunos hoje mesmo. Zero mensalidade, controle total sobre agenda e preços. Modelo de comissão justo e transparente."
        keywords="ser instrutor de direção, instrutor independente, ganhar dinheiro dando aulas, cadastro instrutor, instrutor certificado, renda extra direção, trabalhar como instrutor, plataforma instrutores"
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
      <Footer onSwitchProfile={handleSwitchProfile} currentProfile="instructor" />
    </div>
  );
};

export default LandingInstrutor;

