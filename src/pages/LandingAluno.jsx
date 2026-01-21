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
  const siteUrl = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://drivetopass.com.br');
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "iDrive",
    "url": siteUrl,
    "logo": `${siteUrl}/imgs/logo/iDrive.png`,
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

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Aulas Práticas de Direção",
    "provider": {
      "@type": "Organization",
      "name": "iDrive",
      "url": siteUrl
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
      "description": "Uso da plataforma é gratuito",
      "availability": "https://schema.org/InStock"
    },
    "category": "Educação e Treinamento de Direção",
    "serviceOutput": "Melhoria nas habilidades de direção"
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
        "name": "Para Alunos",
        "item": `${siteUrl}/aluno`
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
        "name": "Como os instrutores são avaliados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Todos os instrutores passam por um processo de verificação onde validamos sua documentação exigida pelo Detran local, incluindo certificação profissional. Mantemos um padrão rigoroso para garantir a segurança e qualidade das aulas. Além disso, os instrutores recebem avaliações dos alunos após cada aula, o que ajuda a manter a qualidade do serviço."
        }
      },
      {
        "@type": "Question",
        "name": "Posso cancelar uma aula?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, você pode cancelar uma aula respeitando o prazo estabelecido nas políticas da plataforma. Cancelamentos dentro do prazo não geram cobrança. Recomendamos verificar os termos específicos ao fazer o agendamento."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o pagamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O pagamento é processado de forma segura através da plataforma. Para alunos, o pagamento é feito por aula ou pacote, com opções de cartão de crédito ou PIX. Os valores são definidos por cada instrutor e aparecem claramente no perfil."
        }
      },
      {
        "@type": "Question",
        "name": "Quais os tipos de aula posso fazer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oferecemos diversos tipos de aulas práticas para habilitados, incluindo: baliza e estacionamento, controle de embreagem, rodovia e estradas, manobras em trânsito, direção defensiva, e muito mais. Cada instrutor pode oferecer diferentes tipos de aula, então você pode escolher o que melhor atende às suas necessidades."
        }
      },
      {
        "@type": "Question",
        "name": "Como funcionam os pacotes de aulas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Muitos instrutores oferecem pacotes de aulas com valores mais vantajosos. Os pacotes podem incluir múltiplas aulas do mesmo tipo ou uma combinação de diferentes tipos de aula. Os valores e condições variam de acordo com cada instrutor e estão disponíveis no perfil de cada um. Você pode comparar pacotes e escolher o que melhor se adequa ao seu orçamento e necessidades."
        }
      },
      {
        "@type": "Question",
        "name": "Os instrutores são independentes ou vinculados a autoescolas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nossa plataforma conecta alunos com instrutores independentes certificados. Isso permite maior flexibilidade, preços mais competitivos e liberdade de escolha tanto para alunos quanto para instrutores."
        }
      }
    ]
  };

  const structuredData = [organizationSchema, serviceSchema, breadcrumbSchema, faqSchema];

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
        title="Aulas Práticas de Direção para Habilitados - iDrive"
        description="Pratique e melhore suas habilidades ao volante com instrutores certificados. Aulas práticas para habilitados: baliza, controle de embreagem, rodovia e mais. Plataforma 100% gratuita."
        keywords="aulas práticas direção, aulas para habilitados, instrutor de direção, aulas baliza, controle embreagem, aulas rodovia, aprender a dirigir melhor, instrutor certificado, aulas direção habilitados, prática direção, melhorar direção"
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

