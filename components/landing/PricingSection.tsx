'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

interface PricingSectionProps {
  locale: string;
}

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para creators iniciantes',
    originalPrice: 'R$47',
    price: 'R$19',
    period: '/mês',
    badge: { text: '60% OFF - Primeiros 100 usuários', style: 'bg-green-600/20 border-green-600/30 text-green-400' },
    features: [
      '100 ideias virais/mês',
      '20 roteiros básicos',
      'Análise de tendências',
      'Suporte por email'
    ],
    buttonText: 'COMEÇAR GRÁTIS',
    buttonStyle: 'bg-gray-700 hover:bg-gray-600 text-white',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para creators sérios',
    originalPrice: 'R$197',
    price: 'R$67',
    period: '/mês',
    badge: { text: '🔥 MELHOR CUSTO-BENEFÍCIO', style: 'bg-yellow-600 text-black' },
    features: [
      'ILIMITADO ideias e roteiros',
      'Roteiros YouTube-Native',
      'Análise de competidores',
      'Suporte prioritário',
      'BÔNUS: Curso Viral Secrets'
    ],
    buttonText: '🚀 QUERO SER PRO AGORA',
    buttonStyle: 'youtube-red-gradient hover:scale-105 text-white',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para agencies e teams',
    originalPrice: 'R$497',
    price: 'R$197',
    period: '/mês',
    badge: { text: 'Para equipes grandes', style: 'bg-purple-600/20 border-purple-600/30 text-purple-400' },
    features: [
      'Tudo do Pro +',
      '10 usuários inclusos',
      'API access',
      'White-label option',
      'Suporte dedicado'
    ],
    buttonText: 'FALAR COM VENDAS',
    buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
    popular: false
  }
];

export default function PricingSection({ locale }: PricingSectionProps) {
  return (
    <section id="precos" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Urgency Banner */}
        <div className="text-center mb-8">
          <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse">
            ⏰ OFERTA EXPIRA EM: <CountdownTimer size="sm" showLabels={false} className="inline-block ml-2" />
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-white">Escolha Seu</span><br/>
            <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              Plano de Sucesso
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Mais de <strong className="text-yellow-400">10.847 creators</strong> já escolheram o TubeSpark
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-2xl p-8 relative ${
                plan.popular 
                  ? 'pricing-popular bg-gradient-to-br from-red-600/20 to-yellow-600/20 border border-yellow-600' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-gray-500 line-through text-xl">{plan.originalPrice}</span>
                  <span className="text-4xl font-bold text-white ml-2">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <div className={`rounded-lg px-4 py-2 text-sm font-bold ${plan.badge.style}`}>
                  {plan.badge.text}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className={`w-5 h-5 mr-3 ${plan.popular ? 'text-yellow-500' : 'text-green-500'}`} />
                    <span className="text-gray-300">
                      {feature.includes('ILIMITADO') || feature.includes('YouTube-Native') || feature.includes('BÔNUS') ? (
                        <strong>{feature}</strong>
                      ) : (
                        feature
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={`/${locale}/auth/signup?plan=${plan.id}`}
                className={`w-full py-4 rounded-xl font-bold transition-all text-lg block text-center ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
        
        {/* Guarantee Section */}
        <div className="text-center mt-16">
          <div className="inline-block bg-green-600/20 border border-green-600/30 rounded-2xl p-8">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Garantia 30 Dias</h3>
            <p className="text-gray-300 max-w-2xl">
              Se você não conseguir pelo menos <strong className="text-white">dobrar suas views</strong> 
              nos primeiros 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}