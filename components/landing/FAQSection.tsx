'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "Como o TubeSpark é diferente de outras ferramentas?",
    answer: "Somos a ÚNICA ferramenta com sistema YouTube-Native. Enquanto outras ferramentas geram ideias genéricas, nós criamos roteiros específicos para maximizar retenção, engajamento e alcance no YouTube."
  },
  {
    id: 2,
    question: "Quanto tempo leva para ver resultados?",
    answer: "A maioria dos nossos usuários vê aumento nas views em 24-48h após publicar o primeiro vídeo com nossos roteiros. Em 30 dias, 87% dobram suas métricas."
  },
  {
    id: 3,
    question: "Funciona para qualquer nicho?",
    answer: "SIM! Nossa IA é treinada em +50 nichos diferentes: tech, lifestyle, gaming, educação, finanças, saúde, entretenimento, e muito mais. Quanto mais específico seu nicho, melhor nossa personalização."
  },
  {
    id: 4,
    question: "Posso cancelar quando quiser?",
    answer: "Claro! Sem contratos, sem burocracias. Cancele com 1 clique a qualquer momento. Plus: garantia 30 dias se não ficar satisfeito."
  },
  {
    id: 5,
    question: "Preciso de conhecimento técnico?",
    answer: "ZERO! É só conectar seu canal, escolher o tipo de vídeo que quer fazer, e nossa IA entrega o roteiro pronto. Literalmente copiar e colar."
  }
];

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-400">
            Tudo que você precisa saber sobre o TubeSpark
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <span className="text-xl font-bold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-6 h-6 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    openFAQ === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer.split('YouTube-Native').map((part, index) => (
                      index === 0 ? part : (
                        <span key={index}>
                          <strong className="text-yellow-400">YouTube-Native</strong>
                          {part}
                        </span>
                      )
                    ))}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}