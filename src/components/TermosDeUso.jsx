import React from 'react';

const TermosDeUso = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-sm text-gray-500 mb-6">
        Última atualização: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">1. Aceitação dos Termos</h3>
        <p className="text-gray-700 mb-4">
          Ao acessar e usar a plataforma DriverApp, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concorda com alguma parte destes termos, não deve usar nossa plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">2. Descrição do Serviço</h3>
        <p className="text-gray-700 mb-4">
          A DriverApp é uma plataforma digital que conecta alunos interessados em aulas práticas de direção com instrutores certificados e independentes. Nossa plataforma facilita o agendamento, comunicação e pagamento entre alunos e instrutores.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">3. Cadastro e Conta de Usuário</h3>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>3.1.</strong> Para usar a plataforma, você deve criar uma conta fornecendo informações precisas, completas e atualizadas.
          </p>
          <p>
            <strong>3.2.</strong> Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta.
          </p>
          <p>
            <strong>3.3.</strong> Você concorda em notificar imediatamente a DriverApp sobre qualquer uso não autorizado de sua conta.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">4. Responsabilidades dos Usuários</h3>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>4.1 Alunos:</strong> Os alunos são responsáveis por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fornecer informações precisas sobre sua habilitação e experiência</li>
            <li>Comparecer pontualmente às aulas agendadas</li>
            <li>Respeitar o instrutor e seguir suas instruções</li>
            <li>Cancelar aulas com antecedência mínima conforme política da plataforma</li>
          </ul>
          <p className="mt-4">
            <strong>4.2 Instrutores:</strong> Os instrutores são responsáveis por:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manter certificação válida e atualizada</li>
            <li>Fornecer aulas de qualidade e seguras</li>
            <li>Manter veículo em condições adequadas e seguro</li>
            <li>Respeitar os horários agendados</li>
            <li>Cumprir todas as leis e regulamentações aplicáveis</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">5. Pagamentos e Reembolsos</h3>
        <div className="text-gray-700 space-y-3">
          <p>
            <strong>5.1.</strong> Os preços das aulas são definidos pelos instrutores e podem variar.
          </p>
          <p>
            <strong>5.2.</strong> A plataforma pode cobrar uma comissão sobre as transações realizadas.
          </p>
          <p>
            <strong>5.3.</strong> Políticas de cancelamento e reembolso estão sujeitas aos termos acordados entre aluno e instrutor, respeitando a política da plataforma.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">6. Limitação de Responsabilidade</h3>
        <p className="text-gray-700 mb-4">
          A DriverApp atua apenas como intermediária entre alunos e instrutores. Não somos responsáveis por:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Qualidade das aulas fornecidas pelos instrutores</li>
          <li>Acidentes ou incidentes durante as aulas</li>
          <li>Disputas entre alunos e instrutores</li>
          <li>Danos a veículos ou propriedades</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">7. Propriedade Intelectual</h3>
        <p className="text-gray-700 mb-4">
          Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, é propriedade da DriverApp ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">8. Modificações dos Termos</h3>
        <p className="text-gray-700 mb-4">
          Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. O uso continuado da plataforma após as alterações constitui sua aceitação dos novos termos.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">9. Rescisão</h3>
        <p className="text-gray-700 mb-4">
          Podemos encerrar ou suspender sua conta e acesso à plataforma imediatamente, sem aviso prévio, por qualquer motivo, incluindo violação destes termos.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">10. Lei Aplicável</h3>
        <p className="text-gray-700 mb-4">
          Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-bold text-secondary mb-4">11. Contato</h3>
        <p className="text-gray-700 mb-4">
          Para questões sobre estes termos, entre em contato conosco através dos canais disponíveis na plataforma.
        </p>
      </section>
    </div>
  );
};

export default TermosDeUso;

