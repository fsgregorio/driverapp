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
    <footer className="bg-secondary text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* About */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-[#5B8DEF]">Drive</span>
              <span className="text-white">ToPass</span>
            </h2>
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
            © 2025 DriveToPass. Todos os direitos reservados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/login?type=student')}
              className="bg-white hover:bg-gray-100 text-secondary font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
            >
              Login
            </button>
            <button
              onClick={onSwitchProfile}
              className="bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
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


