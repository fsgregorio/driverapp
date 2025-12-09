import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ onSwitchProfile }) => {
  const navigate = useNavigate();

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
    <footer className="bg-secondary text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre</h3>
            <p className="text-gray-400 text-sm">
              Conectamos alunos e instrutores certificados para aulas práticas seguras e sem burocracia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className="hover:text-white transition-colors text-left"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/aluno')}
                  className="hover:text-white transition-colors text-left"
                >
                  Para Alunos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/instrutor')}
                  className="hover:text-white transition-colors text-left"
                >
                  Para Instrutores
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Switch Profile Button */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 DriverApp. Todos os direitos reservados.
          </p>
          <button
            onClick={onSwitchProfile}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Trocar Perfil
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


