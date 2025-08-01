'use client';

import { useState, useEffect } from 'react';
import { PlanType } from '@/types';
import { 
  Crown, 
  X, 
  CheckCircle, 
  Zap, 
  TrendingUp, 
  Users, 
  Star,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'script_limit' | 'idea_limit' | 'premium_feature' | 'general';
  currentPlan?: PlanType;
  className?: string;
}

interface PlanOption {
  key: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function UpgradePrompt({
  isOpen,
  onClose,
  trigger = 'general',
  currentPlan = 'free',
  className = ''
}: UpgradePromptProps) {
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/create-checkout');
      const data = await response.json();

      if (data.success) {
        const planOptions: PlanOption[] = data.plans
          .filter((plan: any) => plan.id !== currentPlan) // Don't show current plan
          .map((plan: any) => ({
            key: plan.id,
            name: plan.name,
            price: plan.price,
            features: plan.features,
            highlight: plan.id === 'pro',
            popular: plan.popular,
            description: getPlanDescription(plan.id),
            icon: getPlanIcon(plan.id),
            color: getPlanColor(plan.id)
          }));
        
        setPlans(planOptions);
        
        // Auto-select recommended plan based on trigger
        if (trigger === 'script_limit' || trigger === 'premium_feature') {
          setSelectedPlan('pro');
        } else {
          setSelectedPlan('starter');
        }
      } else {
        setError(data.error || 'Failed to load plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load upgrade options');
    } finally {
      setLoading(false);
    }
  };

  const getPlanDescription = (planKey: string): string => {
    const descriptions: Record<string, string> = {
      starter: 'Perfeito para criadores começando a escalar seu canal',
      pro: 'Ideal para criadores sérios que querem máxima qualidade',
      business: 'Para equipes e canais enterprise com necessidades avançadas'
    };
    return descriptions[planKey] || '';
  };

  const getPlanIcon = (planKey: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      starter: <Zap className="w-6 h-6" />,
      pro: <Crown className="w-6 h-6" />,
      business: <Users className="w-6 h-6" />
    };
    return icons[planKey] || <Star className="w-6 h-6" />;
  };

  const getPlanColor = (planKey: string): string => {
    const colors: Record<string, string> = {
      starter: 'blue',
      pro: 'purple',
      business: 'yellow'
    };
    return colors[planKey] || 'gray';
  };

  const getTriggerMessage = (): { title: string; description: string; urgency: string } => {
    const messages = {
      script_limit: {
        title: '🎬 Você atingiu o limite de roteiros!',
        description: 'Faça upgrade para continuar criando roteiros profissionais e alcançar mais visualizações.',
        urgency: 'Não perca ideias virais por falta de roteiros!'
      },
      idea_limit: {
        title: '💡 Limite de ideias atingido!',
        description: 'Desbloqueie ideias ilimitadas e nunca mais fique sem inspiração para seus vídeos.',
        urgency: 'Suas próximas ideias virais estão esperando!'
      },
      premium_feature: {
        title: '👑 Recurso Premium',
        description: 'Esta funcionalidade está disponível apenas para usuários Pro. Desbloqueie todo o potencial!',
        urgency: 'Maximize seus resultados com recursos avançados!'
      },
      general: {
        title: '🚀 Turbine seu canal!',
        description: 'Desbloqueie recursos premium e acelere o crescimento do seu canal do YouTube.',
        urgency: 'Junte-se a milhares de criadores de sucesso!'
      }
    };
    return messages[trigger] || messages.general;
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setUpgrading(true);
    setError(null);

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: selectedPlan,
          successUrl: `${window.location.origin}/dashboard/billing?success=true&plan=${selectedPlan}`,
          cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (!isOpen) return null;

  const triggerInfo = getTriggerMessage();

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white rounded-t-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{triggerInfo.title}</h2>
              <p className="text-purple-100 text-lg">{triggerInfo.description}</p>
              <div className="mt-3 px-4 py-2 bg-white/20 rounded-lg inline-block">
                <p className="text-sm font-medium">{triggerInfo.urgency}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">Carregando planos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchPlans}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                {/* Plan Options */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.key}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.key
                          ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-lg scale-105`
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } ${plan.highlight ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                      onClick={() => setSelectedPlan(plan.key)}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            MAIS POPULAR
                          </span>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center mb-4">
                        <div className={`inline-flex p-3 bg-${plan.color}-100 rounded-xl mb-3`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold text-gray-900">
                            ${plan.price.toFixed(2)}
                          </span>
                          <span className="text-gray-600 ml-1">/mês</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${plan.originalPrice.toFixed(2)}/mês
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 6).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 6 && (
                          <li className="text-sm text-gray-500 font-medium">
                            +{plan.features.length - 6} recursos adicionais
                          </li>
                        )}
                      </ul>

                      {/* Selection Indicator */}
                      {selectedPlan === plan.key && (
                        <div className="absolute top-2 right-2">
                          <div className={`w-6 h-6 bg-${plan.color}-500 rounded-full flex items-center justify-center`}>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Plan Summary */}
                {selectedPlan && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Plano Selecionado: {plans.find(p => p.key === selectedPlan)?.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {plans.find(p => p.key === selectedPlan)?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          ${plans.find(p => p.key === selectedPlan)?.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">por mês</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading || !selectedPlan}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        Fazer Upgrade Agora
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Talvez depois
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="w-5 h-5 text-green-500 mb-1" />
                      <span>Crescimento garantido</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Star className="w-5 h-5 text-yellow-500 mb-1" />
                      <span>Avaliação 4.9/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-5 h-5 text-blue-500 mb-1" />
                      <span>10,000+ criadores</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}