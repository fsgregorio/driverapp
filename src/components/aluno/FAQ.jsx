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
      answer: "Oferecemos aulas práticas completas para primeira habilitação, incluindo: primeiros passos, controle de embreagem, baliza e estacionamento, rodovia e estradas, manobras em trânsito, direção defensiva, e preparação para o exame do Detran. Cada instrutor pode oferecer diferentes tipos de aula, então você pode escolher o que melhor atende às suas necessidades de aprendizado."
    },
    {
      question: "Quantas aulas preciso fazer para tirar a carteira?",
      answer: "O número de aulas necessárias varia de acordo com seu aprendizado e confiança ao volante. Muitos instrutores oferecem pacotes de aulas com valores mais vantajosos para o curso completo de primeira habilitação. Os pacotes podem incluir todas as aulas necessárias até você estar pronto para o exame do Detran. Os valores e condições variam de acordo com cada instrutor e estão disponíveis no perfil de cada um. Você pode comparar pacotes e escolher o que melhor se adequa ao seu orçamento e necessidades."
    },
    {
      question: "Preciso fazer a parte teórica também?",
      answer: "Nossa plataforma conecta você com instrutores profissionais para as aulas práticas. A parte teórica (curso teórico e exame teórico) geralmente é feita através de autoescolas ou cursos online credenciados pelo Detran. Nossos instrutores podem te orientar sobre esse processo e focar nas aulas práticas que são essenciais para você passar no exame prático do Detran."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 md:py-32 bg-white" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre nossa plataforma
          </p>
        </header>

        <div className="space-y-4" role="list">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className="bg-accent rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              role="listitem"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
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
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={openIndex !== index}
              >
                <div className="px-6 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

