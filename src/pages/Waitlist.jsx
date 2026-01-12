import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Waitlist = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll para o topo quando a página carregar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSwitchProfile = () => {
    sessionStorage.removeItem('selectedProfile');
    navigate('/');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateWhatsApp = (phone) => {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const formatWhatsApp = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    if (whatsapp && !validateWhatsApp(whatsapp)) {
      setError('Por favor, informe um WhatsApp válido (com DDD).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Aqui você faria a chamada para a API
      // Por enquanto, simulamos um delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulação de sucesso
      setIsSuccess(true);
      setEmail('');
      setWhatsapp('');

      // Aqui você salvaria os dados:
      // await fetch('/api/waitlist', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, whatsapp: whatsapp.replace(/\D/g, '') })
      // });
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lista de Espera - DriveToPass",
    "description": "Cadastre-se na lista de espera e seja um dos primeiros a usar a DriveToPass quando estiver disponível."
  };

  return (
    <div className="Waitlist min-h-screen flex flex-col">
      <SEO
        title="Lista de Espera - DriveToPass"
        description="Cadastre-se na lista de espera e seja um dos primeiros a usar a DriveToPass quando estiver disponível. Exclusividade para primeiros usuários."
        keywords="lista de espera, drivetopass, cadastro, pré-lançamento"
        canonicalUrl="/waitlist"
        structuredData={structuredData}
      />
      
      <Navbar
        onSwitchProfile={handleSwitchProfile}
        currentProfile={null}
        scrollToSection={() => {}}
        hideFAQ={true}
      />

      <main className="flex-1">
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-white to-accent overflow-hidden pt-20 pb-16">
          {/* Background Illustration */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 700 L150 650 L200 680 L250 600 L300 650 L350 580 L400 620 L450 550 L500 600 L550 520 L600 580 L650 500 L700 550 L750 480 L800 520 L850 450 L900 500 L950 420 L1000 480 L1050 400 L1100 450 L1150 380 L1200 420 L1200 800 L100 800 Z" fill="#2463EB"/>
              <ellipse cx="600" cy="400" rx="200" ry="100" fill="#2463EB"/>
              <rect x="450" y="350" width="300" height="100" rx="20" fill="#2463EB"/>
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeIn">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-6">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
                  Estamos em Desenvolvimento!
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  A DriveToPass está sendo preparada com muito cuidado para oferecer a melhor experiência possível.
                </p>
                <p className="text-lg text-gray-500">
                  Cadastre-se na lista de espera e seja um dos <strong className="text-primary">primeiros usuários</strong> a ter acesso exclusivo quando lançarmos!
                </p>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Cadastro realizado com sucesso!</h3>
                      <p className="text-green-700">
                        Você será notificado assim que a DriveToPass estiver disponível. Obrigado por fazer parte desta jornada!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {!isSuccess && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-lg"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-secondary mb-2">
                      WhatsApp <span className="text-gray-400 text-xs">(opcional)</span>
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all text-lg"
                      disabled={isSubmitting}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Receba notificações instantâneas quando estivermos prontos!
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cadastrando...
                      </span>
                    ) : (
                      'Garantir meu Acesso Exclusivo'
                    )}
                  </button>
                </form>
              )}

              {/* Benefits */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-secondary mb-6 text-center">
                  Por que se cadastrar agora?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-secondary mb-2">Acesso Exclusivo</h4>
                    <p className="text-sm text-gray-600">Seja um dos primeiros a usar a plataforma</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-secondary mb-2">Notificação Imediata</h4>
                    <p className="text-sm text-gray-600">Seja avisado assim que estivermos prontos</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-secondary mb-2">Benefícios Especiais</h4>
                    <p className="text-sm text-gray-600">Vantagens exclusivas para primeiros usuários</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onSwitchProfile={handleSwitchProfile} />
    </div>
  );
};

export default Waitlist;

