import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Como funciona o processo de cadastro?",
      answer: "O cadastro é simples e rápido. Você precisa enviar sua documentação exigida pelo Detran local, incluindo certificação profissional. Nossa equipe valida tudo rapidamente e, após a aprovação, você pode começar a receber alunos imediatamente."
    },
    {
      question: "Como funciona o modelo de comissão?",
      answer: "Cobramos apenas uma pequena comissão sobre cada aula realizada. O modelo é transparente e justo - quanto mais você ensina, mais você ganha. Os valores específicos da comissão são informados durante o processo de cadastro."
    },
    {
      question: "Como recebo os pagamentos?",
      answer: "Os pagamentos são processados de forma segura através da plataforma. Você recebe os valores de forma recorrente, respeitando o modelo de comissão estabelecido. Os pagamentos são feitos diretamente na sua conta cadastrada."
    },
    {
      question: "Posso definir meus próprios preços?",
      answer: "Sim! Você tem total controle sobre o valor da sua hora/aula. Você pode definir diferentes preços para diferentes tipos de aula e também oferecer pacotes com valores mais vantajosos. Os preços aparecem no seu perfil para os alunos compararem."
    },
    {
      question: "Como gerencio minha agenda?",
      answer: "Você tem controle total sobre sua disponibilidade. Através da plataforma, você pode definir seus horários disponíveis, bloquear períodos específicos e gerenciar todos os seus agendamentos em um só lugar. A agenda é integrada e fácil de usar."
    },
    {
      question: "Preciso ter um veículo próprio?",
      answer: "Não necessariamente. Você pode oferecer aulas usando seu próprio veículo ou o veículo do aluno. A flexibilidade é uma das vantagens da nossa plataforma. Você informa no seu perfil qual opção oferece."
    },
    {
      question: "Como funcionam as avaliações?",
      answer: "Após cada aula, os alunos podem avaliar o instrutor. Quanto melhor suas avaliações, mais destaque você ganha no marketplace. Isso ajuda a atrair mais alunos e aumentar sua base de clientes."
    },
    {
      question: "Há algum custo para usar a plataforma?",
      answer: "Não há taxas de cadastro ou mensalidade fixa. Você paga apenas uma comissão sobre as aulas realizadas. Isso significa que você só paga quando está ganhando, tornando o modelo muito justo e acessível."
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
            Tire suas dúvidas sobre ser instrutor na plataforma
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

