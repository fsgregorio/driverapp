import React from 'react';

const PoliticaPrivacidade = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-sm text-gray-500 mb-6">
        Última atualização: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">1. Introdução</h3>
        <p className="text-gray-700 mb-4">
          A DriverApp está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você usa nossa plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">2. Informações que Coletamos</h3>
        <div className="text-gray-700 space-y-4">
          <div>
            <p className="font-semibold mb-2">2.1 Informações Fornecidas por Você:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo</li>
              <li>E-mail</li>
              <li>Telefone</li>
              <li>CPF (para instrutores)</li>
              <li>Número da CNH (Carteira Nacional de Habilitação)</li>
              <li>Endereço</li>
              <li>Informações de pagamento</li>
              <li>Fotos e documentos de certificação (para instrutores)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">2.2 Informações Coletadas Automaticamente:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Localização geográfica aproximada</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">3. Como Usamos suas Informações</h3>
        <p className="text-gray-700 mb-3">Utilizamos suas informações pessoais para:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Fornecer e melhorar nossos serviços</li>
          <li>Conectar alunos com instrutores apropriados</li>
          <li>Processar pagamentos e transações</li>
          <li>Enviar notificações sobre aulas, agendamentos e atualizações</li>
          <li>Verificar identidades e credenciais</li>
          <li>Prevenir fraudes e garantir segurança</li>
          <li>Enviar comunicações de marketing (com seu consentimento)</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">4. Compartilhamento de Informações</h3>
        <div className="text-gray-700 space-y-3">
          <p>
            Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Com instrutores/alunos:</strong> Informações necessárias para facilitar o agendamento e comunicação</li>
            <li><strong>Prestadores de serviços:</strong> Empresas que nos ajudam a operar a plataforma (processamento de pagamentos, hospedagem, etc.)</li>
            <li><strong>Obrigações legais:</strong> Quando exigido por lei ou processo judicial</li>
            <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
            <li><strong>Com seu consentimento:</strong> Em outras situações com sua autorização explícita</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">5. Segurança dos Dados</h3>
        <p className="text-gray-700 mb-4">
          Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia SSL/TLS, armazenamento seguro e controles de acesso restritos.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">6. Retenção de Dados</h3>
        <p className="text-gray-700 mb-4">
          Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">7. Seus Direitos (LGPD)</h3>
        <p className="text-gray-700 mb-3">De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Confirmar a existência de tratamento de dados</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Solicitar portabilidade dos dados</li>
          <li>Revogar seu consentimento</li>
          <li>Ser informado sobre compartilhamento de dados</li>
        </ul>
        <p className="text-gray-700 mt-4">
          Para exercer esses direitos, entre em contato conosco através dos canais disponíveis na plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">8. Cookies e Tecnologias Similares</h3>
        <p className="text-gray-700 mb-4">
          Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">9. Menores de Idade</h3>
        <p className="text-gray-700 mb-4">
          Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se descobrirmos que coletamos informações de um menor, tomaremos medidas para excluir essas informações.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">10. Alterações nesta Política</h3>
        <p className="text-gray-700 mb-4">
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política na plataforma e atualizando a data de "Última atualização".
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">11. Contato</h3>
        <p className="text-gray-700 mb-4">
          Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato conosco através dos canais disponíveis na plataforma.
        </p>
        <p className="text-gray-700">
          <strong>Encarregado de Dados (DPO):</strong> Para questões relacionadas à LGPD, você pode entrar em contato com nosso encarregado de proteção de dados através dos canais de contato da plataforma.
        </p>
      </section>
    </div>
  );
};

export default PoliticaPrivacidade;

