'use client';

import { useState, useEffect } from 'react';
import { VideoIdea, ScriptType, PlanType, UsageLimitsCheck } from '@/types';
import { useAuth } from '@/lib/auth';
import { 
  Crown, 
  Zap, 
  Loader2, 
  X, 
  Clock, 
  Target, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Star,
  Youtube,
  FileText,
  Badge
} from 'lucide-react';

interface ScriptGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: VideoIdea;
  onScriptGenerated?: (scriptId: string) => void;
}

interface FrameworkOption {
  key: 'youtube_native' | 'traditional';
  name: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  metrics: {
    retention: string;
    engagement: string;
    algorithm: string;
  };
  features: string[];
  advantages: string[];
  color: string;
  recommended: boolean;
}

interface ScriptTypeOption {
  type: ScriptType;
  name: string;
  icon: React.ReactNode;
  price: string;
  priceNote: string;
  features: string[];
  color: string;
  available: boolean;
  upgradeRequired?: boolean;
}

export default function ScriptGenerationModal({
  isOpen,
  onClose,
  idea,
  onScriptGenerated
}: ScriptGenerationModalProps) {
  const { user } = useAuth();
  const [selectedFramework, setSelectedFramework] = useState<'youtube_native' | 'traditional'>('youtube_native');
  const [selectedType, setSelectedType] = useState<ScriptType>('basic');
  const [generating, setGenerating] = useState(false);
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [usageLimits, setUsageLimits] = useState<{
    basic: UsageLimitsCheck | null;
    premium: UsageLimitsCheck | null;
  }>({ basic: null, premium: null });
  const [error, setError] = useState<string | null>(null);

  // Framework options with detailed comparison
  const frameworkOptions: FrameworkOption[] = [
    {
      key: 'youtube_native',
      name: 'YouTube-Native',
      badge: 'RECOMENDADO',
      icon: <Youtube className="w-6 h-6" />,
      description: 'Framework científico otimizado especificamente para o algoritmo do YouTube',
      metrics: {
        retention: '75-85%',
        engagement: '4-7%',
        algorithm: 'Alto'
      },
      features: [
        'Hook otimizado para retenção máxima',
        'Estrutura narrativa envolvente (3 atos)',
        'Pattern interrupts automáticos',
        'CTAs baseados em valor entregue',
        'Predição de performance científica',
        'Otimização para algoritmo YouTube'
      ],
      advantages: [
        '+42% retenção vs tradicional',
        '+180% engagement rate',
        '+300% score no algoritmo',
        'Baseado em dados científicos',
        'Maximize chances de viralização'
      ],
      color: 'green',
      recommended: true
    },
    {
      key: 'traditional',
      name: 'Tradicional',
      badge: 'LEGACY',
      icon: <FileText className="w-6 h-6" />,
      description: 'Estrutura linear tradicional focada em conversão direta',
      metrics: {
        retention: '40-60%',
        engagement: '1.5-2.5%',
        algorithm: 'Baixo'
      },
      features: [
        'Estrutura linear simples',
        'Foco em conversão direta',
        'CTAs tradicionais',
        'Formato familiar'
      ],
      advantages: [
        'Estrutura conhecida',
        'Rápido de implementar',
        'Boa para vendas diretas'
      ],
      color: 'gray',
      recommended: false
    }
  ];

  // Fetch user plan and usage limits
  useEffect(() => {
    if (isOpen && user) {
      fetchUserLimits();
    }
  }, [isOpen, user]);

  const fetchUserLimits = async () => {
    try {
      const [basicResponse, premiumResponse] = await Promise.all([
        fetch('/api/usage/check?action=script_basic'),
        fetch('/api/usage/check?action=script_premium')
      ]);

      const basicData = await basicResponse.json();
      const premiumData = await premiumResponse.json();

      setUsageLimits({
        basic: basicData,
        premium: premiumData
      });

      // Set user plan from response
      if (basicData.planType) {
        setUserPlan(basicData.planType);
      }
    } catch (error) {
      console.error('Error fetching usage limits:', error);
    }
  };

  const scriptTypeOptions: ScriptTypeOption[] = [
    {
      type: 'basic',
      name: selectedFramework === 'youtube_native' ? 'YouTube-Native Básico' : 'Roteiro Básico',
      icon: <Zap className="w-5 h-5" />,
      price: 'Grátis',
      priceNote: `${usageLimits.basic?.remaining || 0} restantes este mês`,
      features: selectedFramework === 'youtube_native' ? [
        '🎣 Hook científico (5 tipos psicológicos)',
        '📖 Estrutura narrativa em 3 atos',
        '⚡ Pattern interrupts programados',
        '💡 CTAs baseados em valor',
        '📊 Predição de retenção',
        '🎯 Otimização para algoritmo'
      ] : [
        'Hook de abertura simples',
        '3-5 pontos principais',
        'Call-to-action básico',
        'Estrutura linear tradicional'
      ],
      color: selectedFramework === 'youtube_native' ? 'green' : 'blue',
      available: usageLimits.basic?.allowed || false,
      upgradeRequired: !usageLimits.basic?.allowed && userPlan === 'free'
    },
    {
      type: 'premium',
      name: selectedFramework === 'youtube_native' ? 'YouTube-Native Premium' : 'Roteiro Premium',
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
      price: userPlan === 'free' ? '$2.00' : 'Incluído',
      priceNote: userPlan === 'free' 
        ? 'Por roteiro' 
        : `${usageLimits.premium?.remaining === -1 ? 'Ilimitado' : `${usageLimits.premium?.remaining || 0} restantes`}`,
      features: selectedFramework === 'youtube_native' ? [
        '🎣 3 variações de hook para A/B test',
        '🎬 Guia completo de produção',
        '📊 Métricas de performance estimadas',
        '🎯 Personalização baseada no canal',
        '🔥 Elementos virais identificados',
        '📈 Score de confiança alto/médio/baixo',
        '🎨 Sugestões de thumbnail',
        '📝 Variações de título otimizadas',
        '⏰ Timing exato por seção'
      ] : [
        'Múltiplos hooks para teste',
        'Roteiro seção por seção',
        'Sugestões visuais básicas',
        'Tags SEO tradicionais',
        'Ideias de thumbnail',
        'Dicas de engajamento',
        'Previsões simples'
      ],
      color: selectedFramework === 'youtube_native' ? 'purple' : 'purple',
      available: usageLimits.premium?.allowed || false,
      upgradeRequired: !usageLimits.premium?.allowed && userPlan === 'free'
    }
  ];

  const handleGenerate = async () => {
    if (!user) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: idea.id,
          scriptType: selectedType,
          frameworkType: selectedFramework,
          customizations: {
            tone: 'casual',
            duration: 'medium'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'UPGRADE_REQUIRED') {
          // Redirect to upgrade flow
          window.location.href = '/dashboard/billing?upgrade=true&reason=script_limit';
          return;
        }
        throw new Error(data.message || 'Failed to generate script');
      }

      if (data.success) {
        onScriptGenerated?.(data.scriptId);
        onClose();
        // Redirect to script view
        window.location.href = `/dashboard/scripts/${data.scriptId}`;
      }
    } catch (error) {
      console.error('Error generating script:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate script');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/dashboard/billing?upgrade=true&reason=script_premium';
  };

  if (!isOpen) return null;

  const selectedFrameworkData = frameworkOptions.find(f => f.key === selectedFramework)!;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-2">🎬 Criar Roteiro Científico</h2>
              <p className="text-blue-100 text-lg mb-1">
                Para: <span className="font-semibold">{idea.title}</span>
              </p>
              <p className="text-blue-200 text-sm">
                Escolha o framework que maximiza suas chances de viralização
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Erro na geração</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Framework Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Escolha o Framework
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {frameworkOptions.map((framework) => (
                  <div
                    key={framework.key}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedFramework === framework.key
                        ? `border-${framework.color}-500 bg-${framework.color}-50 shadow-lg scale-105`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    } ${framework.recommended ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                    onClick={() => setSelectedFramework(framework.key)}
                  >
                    {/* Recommended Badge */}
                    {framework.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {framework.badge}
                        </span>
                      </div>
                    )}

                    {framework.key === 'traditional' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gray-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                          {framework.badge}
                        </span>
                      </div>
                    )}

                    {/* Framework Header */}
                    <div className="text-center mb-4">
                      <div className={`inline-flex p-3 bg-${framework.color}-100 rounded-xl mb-3`}>
                        {framework.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{framework.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{framework.description}</p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2 text-sm text-gray-700">📊 Performance Esperada:</h5>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-white rounded border">
                          <div className={`font-bold text-${framework.color === 'gray' ? 'gray' : 'green'}-600`}>
                            {framework.metrics.retention}
                          </div>
                          <div className="text-gray-500">Retenção</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className={`font-bold text-${framework.color === 'gray' ? 'gray' : 'blue'}-600`}>
                            {framework.metrics.engagement}
                          </div>
                          <div className="text-gray-500">Engagement</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className={`font-bold text-${framework.color === 'gray' ? 'gray' : 'purple'}-600`}>
                            {framework.metrics.algorithm}
                          </div>
                          <div className="text-gray-500">Algoritmo</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2 text-sm text-gray-700">✨ Principais Features:</h5>
                      <ul className="space-y-1">
                        {framework.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {framework.features.length > 4 && (
                          <li className="text-xs text-gray-500 font-medium">
                            +{framework.features.length - 4} recursos adicionais
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Advantages */}
                    <div>
                      <h5 className="font-semibold mb-2 text-sm text-gray-700">🚀 Vantagens:</h5>
                      <ul className="space-y-1">
                        {framework.advantages.slice(0, 3).map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Selection Indicator */}
                    {selectedFramework === framework.key && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-6 h-6 bg-${framework.color}-500 rounded-full flex items-center justify-center`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Comparison */}
            {selectedFramework === 'youtube_native' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Por que YouTube-Native é Superior:</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong className="text-green-700">+42% Retenção</strong>
                    <p className="text-green-600">Estrutura narrativa mantém audiência engajada</p>
                  </div>
                  <div>
                    <strong className="text-green-700">+180% Engagement</strong>
                    <p className="text-green-600">Value-first approach gera mais interação</p>
                  </div>
                  <div>
                    <strong className="text-green-700">+300% Algoritmo</strong>
                    <p className="text-green-600">YouTube prioriza conteúdo com alta retenção</p>
                  </div>
                </div>
              </div>
            )}

            {/* Script Type Selection */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Escolha o Tipo de Roteiro
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {scriptTypeOptions.map((option) => (
                  <div
                    key={option.type}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedType === option.type
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!option.available ? 'opacity-75' : ''}`}
                    onClick={() => option.available && setSelectedType(option.type)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${option.color}-100 rounded-lg`}>
                          {option.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{option.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xl font-bold text-${option.color}-600`}>
                              {option.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              {option.priceNote}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {!option.available && (
                        <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                          Limite atingido
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Premium badge */}
                    {option.type === 'premium' && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ PREMIUM
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Configuration Summary */}
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Configuração Selecionada
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Framework:</h5>
                  <div className="flex items-center gap-2">
                    {selectedFrameworkData.icon}
                    <span className="font-semibold">{selectedFrameworkData.name}</span>
                    {selectedFrameworkData.recommended && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Retenção esperada: <strong>{selectedFrameworkData.metrics.retention}</strong>
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Tipo de Roteiro:</h5>
                  <div className="flex items-center gap-2">
                    {scriptTypeOptions.find(s => s.type === selectedType)?.icon}
                    <span className="font-semibold">
                      {scriptTypeOptions.find(s => s.type === selectedType)?.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Tempo de geração: <strong>{selectedType === 'basic' ? '~15 segundos' : '~45 segundos'}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {scriptTypeOptions.find(p => p.type === selectedType)?.available ? (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className={`flex-1 bg-gradient-to-r ${
                    selectedFramework === 'youtube_native'
                      ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                  } text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando roteiro científico...
                    </>
                  ) : (
                    <>
                      🎬 Gerar Roteiro {selectedFramework === 'youtube_native' ? 'YouTube-Native' : 'Tradicional'}
                      {selectedFramework === 'youtube_native' && (
                        <span className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">
                          +180% Engagement
                        </span>
                      )}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Crown className="w-5 h-5" />
                  Fazer Upgrade para Desbloquear
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>

            {/* Performance Guarantee */}
            {selectedFramework === 'youtube_native' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h5 className="font-semibold text-gray-900">Garantia de Performance YouTube-Native</h5>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">75-85%</div>
                    <div className="text-gray-600">Retenção esperada</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4-7%</div>
                    <div className="text-gray-600">Engagement rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">300%+</div>
                    <div className="text-gray-600">Boost algoritmo</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Baseado em análise científica de 100M+ views em vídeos otimizados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}