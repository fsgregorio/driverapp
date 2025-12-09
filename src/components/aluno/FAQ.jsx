import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Como os instrutores são avaliados?",
      answer: "Todos os instrutores passam por um processo de verificação onde validamos sua documentação exigida pelo Detran local, incluindo certificação profissional. Mantemos um padrão rigoroso para garantir a segurança e qualidade das aulas. Além disso, os instrutores recebem avaliações dos alunos após cada aula, o que ajuda a manter a qualidade do serviço."
    },
    {
      question: "Posso cancelar uma aula?",
      answer: "Sim, você pode cancelar uma aula respeitando o prazo estabelecido nas políticas da plataforma. Cancelamentos dentro do prazo não geram cobrança. Recomendamos verificar os termos específicos ao fazer o agendamento."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "O pagamento é processado de forma segura através da plataforma. Para alunos, o pagamento é feito por aula ou pacote, com opções de cartão de crédito ou PIX. Os valores são definidos por cada instrutor e aparecem claramente no perfil."
    },
    {
      question: "Quais os tipos de aula posso fazer?",
      answer: "Oferecemos diversos tipos de aulas práticas para habilitados, incluindo: baliza e estacionamento, controle de embreagem, rodovia e estradas, manobras em trânsito, direção defensiva, e muito mais. Cada instrutor pode oferecer diferentes tipos de aula, então você pode escolher o que melhor atende às suas necessidades."
    },
    {
      question: "Como funcionam os pacotes de aulas?",
      answer: "Muitos instrutores oferecem pacotes de aulas com valores mais vantajosos. Os pacotes podem incluir múltiplas aulas do mesmo tipo ou uma combinação de diferentes tipos de aula. Os valores e condições variam de acordo com cada instrutor e estão disponíveis no perfil de cada um. Você pode comparar pacotes e escolher o que melhor se adequa ao seu orçamento e necessidades."
    },
    {
      question: "Os instrutores são independentes ou vinculados a autoescolas?",
      answer: "Nossa plataforma conecta alunos com instrutores independentes certificados. Isso permite maior flexibilidade, preços mais competitivos e liberdade de escolha tanto para alunos quanto para instrutores."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre nossa plataforma
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-accent rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold text-lg text-secondary pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

