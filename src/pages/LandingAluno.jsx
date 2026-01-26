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
    "logo": `${siteUrl}/imgs/logo/idrive.png`,
    "description": "Plataforma que conecta alunos que querem tirar carteira de motorista com instrutores profissionais certificados. Aulas práticas seguras, flexíveis e sem burocracia.",
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
    "serviceType": "Aulas Práticas de Direção para Primeira Habilitação",
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
    "serviceOutput": "Preparação completa para tirar a primeira habilitação"
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
          "text": "Todos os instrutores passam por um processo rigoroso de verificação onde validamos sua documentação exigida pelo Detran local, incluindo certificação profissional. Mantemos um padrão rigoroso para garantir a segurança e qualidade das aulas para alunos que estão tirando sua primeira habilitação. Além disso, os instrutores recebem avaliações dos alunos após cada aula, o que ajuda a manter a qualidade do serviço."
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
          "text": "Oferecemos aulas práticas completas para primeira habilitação, incluindo: primeiros passos, controle de embreagem, baliza e estacionamento, rodovia e estradas, manobras em trânsito, direção defensiva, e preparação para o exame do Detran. Cada instrutor pode oferecer diferentes tipos de aula, então você pode escolher o que melhor atende às suas necessidades de aprendizado."
        }
      },
      {
        "@type": "Question",
        "name": "Quantas aulas preciso fazer para tirar a carteira?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O número de aulas necessárias varia de acordo com seu aprendizado e confiança ao volante. Muitos instrutores oferecem pacotes de aulas com valores mais vantajosos para o curso completo de primeira habilitação. Os pacotes podem incluir todas as aulas necessárias até você estar pronto para o exame do Detran. Os valores e condições variam de acordo com cada instrutor e estão disponíveis no perfil de cada um."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso fazer a parte teórica também?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nossa plataforma conecta você com instrutores profissionais para as aulas práticas. A parte teórica (curso teórico e exame teórico) geralmente é feita através de autoescolas ou cursos online credenciados pelo Detran. Nossos instrutores podem te orientar sobre esse processo e focar nas aulas práticas que são essenciais para você passar no exame prático do Detran."
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
        title="Tire sua Carteira de Motorista com Instrutores Profissionais - iDrive"
        description="Conectamos você com instrutores profissionais certificados para tirar sua primeira habilitação. Aulas práticas seguras, flexíveis e sem burocracia. Plataforma 100% gratuita."
        keywords="tirar carteira motorista, primeira habilitação, aulas práticas direção, instrutor de direção, aprender a dirigir, aulas baliza, controle embreagem, aulas rodovia, instrutor certificado, exame detran, carteira de motorista, CNH"
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
      <Footer onSwitchProfile={handleSwitchProfile} currentProfile="student" />
    </div>
  );
};

export default LandingAluno;

