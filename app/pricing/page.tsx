"use client";

import { useState } from "react";
import { 
  Check, 
  Crown, 
  Zap, 
  Star,
  Rocket,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    description: 'Perfeito para iniciantes no YouTube',
    icon: <Zap className="w-6 h-6" />,
    color: 'blue',
    features: [
      '100 ideias por mês',
      '20 roteiros básicos',
      '5 roteiros premium',
      'Análise de tendências',
      'Suporte por email',
      'Multilíngue (PT, EN, ES, FR)'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    description: 'Para criadores sérios que querem crescer',
    icon: <Crown className="w-6 h-6" />,
    color: 'purple',
    features: [
      'Ideias ilimitadas',
      'Roteiros básicos ilimitados',
      '50 roteiros premium por mês',
      'Análise de concorrentes',
      'Análise de tendências avançada',
      'Integração YouTube completa',
      'Suporte prioritário',
      'YouTube-Native Framework'
    ],
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 99.99,
    description: 'Para equipes e agências',
    icon: <Rocket className="w-6 h-6" />,
    color: 'red',
    features: [
      'Tudo do Pro',
      'Roteiros premium ilimitados',
      'API completa',
      'White-label disponível',
      'Múltiplos usuários',
      'Gerente de conta dedicado',
      'Análise avançada de ROI',
      'Treinamento personalizado'
    ],
    popular: false
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/signin';
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planId,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/pricing?upgrade=canceled`
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Escolha seu plano
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Comece gratuitamente e faça upgrade conforme seu canal cresce
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onUpgrade={handleUpgrade}
              loading={loading === plan.id}
              isLoggedIn={!!user}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Perguntas Frequentes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. 
                  Não há taxas de cancelamento ou multas.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  O que é o YouTube-Native Framework?
                </h3>
                <p className="text-gray-600">
                  É nossa tecnologia exclusiva que cria roteiros otimizados 
                  especificamente para o algoritmo do YouTube, aumentando 
                  suas chances de viralização.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vocês oferecem reembolso?
                </h3>
                <p className="text-gray-600">
                  Oferecemos reembolso total em até 30 dias se você não 
                  estiver satisfeito com nosso serviço.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posso fazer upgrade ou downgrade?
                </h3>
                <p className="text-gray-600">
                  Sim! Você pode alterar seu plano a qualquer momento. 
                  As mudanças são aplicadas no próximo ciclo de cobrança.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para revolucionar seu canal?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Junte-se a milhares de criadores que já estão usando o TubeSpark
            </p>
            <Link
              href={user ? "/dashboard" : "/auth/signin"}
              className="inline-flex items-center px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user ? "Ir para Dashboard" : "Começar Gratuitamente"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ 
  plan, 
  onUpgrade, 
  loading, 
  isLoggedIn 
}: { 
  plan: any; 
  onUpgrade: (planId: string) => void;
  loading: boolean;
  isLoggedIn: boolean;
}) {
  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      icon: 'text-blue-600 bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      popular: 'bg-blue-600'
    },
    purple: {
      border: 'border-purple-200',
      icon: 'text-purple-600 bg-purple-100',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      popular: 'bg-purple-600'
    },
    red: {
      border: 'border-red-200',
      icon: 'text-red-600 bg-red-100',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      popular: 'bg-red-600'
    }
  };

  const colors = colorClasses[plan.color as keyof typeof colorClasses];

  return (
    <div className={`bg-white rounded-2xl border-2 ${colors.border} p-8 relative ${
      plan.popular ? 'ring-2 ring-purple-600' : ''
    }`}>
      {plan.popular && (
        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${colors.popular} text-white px-4 py-1 rounded-full text-sm font-medium`}>
          Mais Popular
        </div>
      )}
      
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors.icon} mb-4`}>
          {plan.icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-600">/mês</span>
        </div>
        
        <button
          onClick={() => onUpgrade(plan.id)}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 ${colors.button}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {isLoggedIn ? 'Fazer Upgrade' : 'Começar Agora'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          )}
        </button>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Inclui:
        </h4>
        <ul className="space-y-3">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}