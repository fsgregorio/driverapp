import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import TermosDeUso from './TermosDeUso';
import PoliticaPrivacidade from './PoliticaPrivacidade';

const Footer = ({ onSwitchProfile }) => {
  const navigate = useNavigate();
  const [showTermos, setShowTermos] = useState(false);
  const [showPolitica, setShowPolitica] = useState(false);

  return (
    <footer className="bg-secondary text-white py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* About */}
          <div>
            <img 
              src="/imgs/logo/idriveblack.png" 
              alt="iDrive Logo" 
              className="h-8 sm:h-9 md:h-11 w-auto mb-3 sm:mb-4"
            />
            <p className="text-gray-400 text-xs sm:text-sm">
              Conectamos alunos e instrutores certificados para aulas práticas seguras e sem burocracia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
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
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => setShowTermos(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPolitica(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contato</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:contato@drivetopass.com.br" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Switch Profile Button */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © 2025 iDrive. Todos os direitos reservados.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/login?type=student')}
              className="bg-white hover:bg-gray-100 text-secondary font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base w-full sm:w-auto"
            >
              Login
            </button>
            <button
              onClick={onSwitchProfile}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base w-full sm:w-auto"
            >
              Trocar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showTermos}
        onClose={() => setShowTermos(false)}
        title="Termos de Uso"
      >
        <TermosDeUso />
      </Modal>

      <Modal
        isOpen={showPolitica}
        onClose={() => setShowPolitica(false)}
        title="Política de Privacidade"
      >
        <PoliticaPrivacidade />
      </Modal>
    </footer>
  );
};

export default Footer;


