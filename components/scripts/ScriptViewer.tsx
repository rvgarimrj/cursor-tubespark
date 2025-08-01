'use client';

import { useState } from 'react';
import { 
  Clock, 
  Target, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Star, 
  Youtube, 
  FileText, 
  CheckCircle, 
  PlayCircle, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Trophy,
  Activity,
  Lightbulb,
  BrainCircuit,
  Gauge,
  ArrowRight,
  Copy,
  Download,
  Edit3
} from 'lucide-react';

interface ScriptViewerProps {
  script: any;
  onEdit?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  showAnalytics?: boolean;
}

export default function ScriptViewer({ 
  script, 
  onEdit, 
  onCopy, 
  onDownload, 
  showAnalytics = true 
}: ScriptViewerProps) {
  const [activeTab, setActiveTab] = useState<'script' | 'analytics' | 'production'>('script');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!script) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Nenhum roteiro selecionado</p>
      </div>
    );
  }

  const isYouTubeNative = script.framework_type === 'youtube_native';
  const isPremium = script.script_type === 'premium' || script.type?.includes('premium');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${isYouTubeNative ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isYouTubeNative ? (
                <Youtube className="w-8 h-8" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {isYouTubeNative ? 'YouTube-Native' : 'Tradicional'} {isPremium ? 'Premium' : 'Básico'}
                </h1>
                <p className="text-sm opacity-90">
                  Gerado em {new Date(script.created_at || script.generatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            {/* Framework Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isYouTubeNative 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isYouTubeNative ? '🚀 CIENTÍFICO' : '📄 TRADICIONAL'}
              </span>
              {isPremium && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                  ⭐ PREMIUM
                </span>
              )}
            </div>

            {/* Performance Preview */}
            {isYouTubeNative && script.predicted_retention && (
              <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{script.predicted_retention}%</div>
                  <div className="text-xs opacity-90">Retenção Prevista</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{script.hook_strength || 'N/A'}</div>
                  <div className="text-xs opacity-90">Hook Strength</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{script.confidence_level || 'Medium'}</div>
                  <div className="text-xs opacity-90">Confiança</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onCopy && (
              <button
                onClick={onCopy}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Copiar roteiro"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {['script', 'analytics', 'production'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? `border-b-2 ${isYouTubeNative ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'}`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'script' && '📝'} 
              {tab === 'analytics' && '📊'} 
              {tab === 'production' && '🎬'} 
              {' '}
              {tab === 'script' ? 'Roteiro' : tab === 'analytics' ? 'Analytics' : 'Produção'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'script' && (
          <ScriptContent 
            script={script} 
            isYouTubeNative={isYouTubeNative}
            isPremium={isPremium}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
        )}
        
        {activeTab === 'analytics' && showAnalytics && (
          <AnalyticsContent script={script} isYouTubeNative={isYouTubeNative} />
        )}
        
        {activeTab === 'production' && (
          <ProductionContent script={script} isYouTubeNative={isYouTubeNative} isPremium={isPremium} />
        )}
      </div>
    </div>
  );
}

// Script Content Component
function ScriptContent({ 
  script, 
  isYouTubeNative, 
  isPremium, 
  expandedSection, 
  setExpandedSection 
}: any) {
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isYouTubeNative) {
    return <YouTubeNativeScriptContent 
      script={script} 
      isPremium={isPremium}
      expandedSection={expandedSection}
      toggleSection={toggleSection}
    />;
  }

  return <TraditionalScriptContent 
    script={script} 
    isPremium={isPremium}
    expandedSection={expandedSection}
    toggleSection={toggleSection}
  />;
}

// YouTube-Native Script Content
function YouTubeNativeScriptContent({ script, isPremium, expandedSection, toggleSection }: any) {
  const content = script.content || script;

  return (
    <div className="space-y-6">
      {/* Hook Section */}
      <ScriptSection
        title="🎣 Hook Científico (0-8s)"
        subtitle="Otimizado para máxima retenção"
        expanded={expandedSection === 'hook'}
        onToggle={() => toggleSection('hook')}
        color="green"
      >
        <div className="space-y-4">
          {isPremium && content.hook_system ? (
            <div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Hook Principal:</h4>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-medium text-green-900">{content.hook_system.primary}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-green-700">
                    <span>Tipo: {content.hook_system.psychology_type}</span>
                    <span>Retenção: {content.hook_system.retention_prediction}</span>
                  </div>
                </div>
              </div>
              
              {content.hook_system.alternatives && (
                <div>
                  <h4 className="font-semibold mb-2">Variações para A/B Test:</h4>
                  <div className="space-y-2">
                    {content.hook_system.alternatives.map((hook: string, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-gray-800">{hook}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-medium text-green-900">{content.hook?.primary || content.hook}</p>
              {content.hook?.type && (
                <div className="flex items-center gap-4 mt-2 text-sm text-green-700">
                  <span>Tipo: {content.hook.type}</span>
                  <span>Psicologia: {content.hook.psychology_used}</span>
                  <span>Retenção: {content.hook.estimated_retention}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </ScriptSection>

      {/* Narrative Flow */}
      <ScriptSection
        title="📖 Estrutura Narrativa (3 Atos)"
        subtitle="Maximiza engagement e retenção"
        expanded={expandedSection === 'narrative'}
        onToggle={() => toggleSection('narrative')}
        color="blue"
      >
        <NarrativeStructure content={content} isPremium={isPremium} />
      </ScriptSection>

      {/* CTA Strategy */}
      <ScriptSection
        title="🎯 Estratégia de Conversão"
        subtitle="CTAs baseados em valor entregue"
        expanded={expandedSection === 'cta'}
        onToggle={() => toggleSection('cta')}
        color="purple"
      >
        <CTAStrategy content={content} isPremium={isPremium} />
      </ScriptSection>

      {/* Optimization Data */}
      <ScriptSection
        title="⚡ Otimizações para Algoritmo"
        subtitle="Elementos que maximizam alcance"
        expanded={expandedSection === 'optimization'}
        onToggle={() => toggleSection('optimization')}
        color="orange"
      >
        <OptimizationData content={content} isPremium={isPremium} />
      </ScriptSection>
    </div>
  );
}

// Traditional Script Content
function TraditionalScriptContent({ script, isPremium, expandedSection, toggleSection }: any) {
  const content = script.content || script;

  return (
    <div className="space-y-6">
      {/* Hook */}
      <ScriptSection
        title="🎯 Hook"
        subtitle="Abertura tradicional"
        expanded={expandedSection === 'hook'}
        onToggle={() => toggleSection('hook')}
        color="gray"
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800">{content.hook}</p>
        </div>
        
        {isPremium && content.alternativeHooks && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Hooks Alternativos:</h4>
            <div className="space-y-2">
              {content.alternativeHooks.map((hook: string, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-gray-700">{hook}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScriptSection>

      {/* Main Content */}
      <ScriptSection
        title="📝 Conteúdo Principal"
        subtitle="Estrutura linear tradicional"
        expanded={expandedSection === 'content'}
        onToggle={() => toggleSection('content')}
        color="blue"
      >
        {isPremium && content.mainContent?.sections ? (
          <div className="space-y-4">
            {content.mainContent.sections.map((section: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">{section.title}</h4>
                <p className="text-gray-700 mb-3">{section.content}</p>
                <div className="text-sm text-gray-500">
                  <span>Tempo: {section.timing}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {content.mainPoints?.map((point: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        )}
      </ScriptSection>

      {/* CTA */}
      <ScriptSection
        title="📢 Call to Action"
        subtitle="Conversão direta"
        expanded={expandedSection === 'cta'}
        onToggle={() => toggleSection('cta')}
        color="purple"
      >
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-900">{content.cta}</p>
        </div>
      </ScriptSection>
    </div>
  );
}

// Narrative Structure Component
function NarrativeStructure({ content, isPremium }: any) {
  if (isPremium && content.narrative_structure) {
    const acts = [
      { key: 'act1_identification', title: 'Ato 1: Identificação', color: 'blue' },
      { key: 'act2_solution_reveal', title: 'Ato 2: Revelação da Solução', color: 'green' },
      { key: 'act3_implementation', title: 'Ato 3: Implementação', color: 'purple' }
    ];

    return (
      <div className="space-y-6">
        {acts.map((act) => {
          const actData = content.narrative_structure[act.key];
          if (!actData) return null;

          return (
            <div key={act.key} className={`border-l-4 border-${act.color}-500 pl-4`}>
              <h4 className={`font-semibold text-${act.color}-900 mb-3`}>{act.title}</h4>
              <div className={`bg-${act.color}-50 p-4 rounded-lg`}>
                <p className={`text-${act.color}-900 mb-3`}>{actData.content}</p>
                <div className="text-sm text-gray-600">
                  <p><strong>Timing:</strong> {actData.timing}</p>
                  {actData.psychological_triggers && (
                    <p><strong>Triggers:</strong> {actData.psychological_triggers.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Basic narrative flow
  if (content.narrative_flow) {
    const phases = [
      { key: 'identification', title: 'Identificação', color: 'blue' },
      { key: 'solution', title: 'Solução', color: 'green' },
      { key: 'implementation', title: 'Implementação', color: 'purple' }
    ];

    return (
      <div className="space-y-4">
        {phases.map((phase) => {
          const phaseData = content.narrative_flow[phase.key];
          if (!phaseData) return null;

          return (
            <div key={phase.key} className={`border-l-4 border-${phase.color}-500 pl-4`}>
              <h4 className={`font-semibold text-${phase.color}-900 mb-2`}>{phase.title}</h4>
              <div className={`bg-${phase.color}-50 p-3 rounded-lg`}>
                <p className={`text-${phase.color}-900`}>{phaseData.content}</p>
                {phaseData.timing && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Timing:</strong> {phaseData.timing}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-gray-500">Estrutura narrativa não disponível</p>;
}

// CTA Strategy Component
function CTAStrategy({ content, isPremium }: any) {
  if (isPremium && content.conversion_strategy) {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Soft CTAs:</h4>
          <ul className="space-y-1">
            {content.conversion_strategy.soft_ctas?.map((cta: string, index: number) => (
              <li key={index} className="text-purple-800">• {cta}</li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-700">Ratio Valor:</p>
            <p className="text-gray-900">{content.conversion_strategy.value_ratio}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-700">Integração:</p>
            <p className="text-gray-900">{content.conversion_strategy.natural_integration}</p>
          </div>
        </div>
      </div>
    );
  }

  if (content.cta_strategy) {
    return (
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-900 mb-3">{content.cta_strategy.primary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-purple-700">Abordagem:</span>
            <p className="text-purple-800">{content.cta_strategy.approach}</p>
          </div>
          <div>
            <span className="font-medium text-purple-700">Timing:</span>
            <p className="text-purple-800">{content.cta_strategy.timing}</p>
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-gray-500">Estratégia de CTA não disponível</p>;
}

// Optimization Data Component
function OptimizationData({ content, isPremium }: any) {
  const optimization = content.retention_optimization || content.optimization_data;
  
  if (!optimization) {
    return <p className="text-gray-500">Dados de otimização não disponíveis</p>;
  }

  return (
    <div className="space-y-4">
      {optimization.pattern_interrupts && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">Pattern Interrupts:</h4>
          <div className="flex flex-wrap gap-2">
            {optimization.pattern_interrupts.map((time: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm">
                {time}
              </span>
            ))}
          </div>
        </div>
      )}

      {optimization.value_payoffs && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Value Payoffs:</h4>
          <div className="flex flex-wrap gap-2">
            {optimization.value_payoffs.map((time: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                {time}
              </span>
            ))}
          </div>
        </div>
      )}

      {optimization.open_loops && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Open Loops:</h4>
          <ul className="space-y-1">
            {optimization.open_loops.map((loop: string, index: number) => (
              <li key={index} className="text-blue-800">• {loop}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Analytics Content Component
function AnalyticsContent({ script, isYouTubeNative }: any) {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Retenção Prevista"
          value={`${script.predicted_retention || 'N/A'}%`}
          icon={<Eye className="w-6 h-6" />}
          color={isYouTubeNative ? 'green' : 'blue'}
          comparison={isYouTubeNative ? '+42% vs tradicional' : undefined}
        />
        
        <MetricCard
          title="Hook Strength"
          value={script.hook_strength || 'N/A'}
          icon={<Zap className="w-6 h-6" />}
          color={isYouTubeNative ? 'yellow' : 'gray'}
          comparison={isYouTubeNative ? 'Otimizado cientificamente' : undefined}
        />
        
        <MetricCard
          title="Engagement Previsto"
          value={`${script.predicted_engagement || 'N/A'}%`}
          icon={<Heart className="w-6 h-6" />}
          color={isYouTubeNative ? 'red' : 'purple'}
          comparison={isYouTubeNative ? '+180% vs tradicional' : undefined}
        />
      </div>

      {/* Viral Factors */}
      {script.viral_factors && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Elementos Virais Identificados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {script.viral_factors.map((factor: any, index: number) => (
              <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-yellow-900">{factor.factor}</span>
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm">
                    {factor.weight}pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Level */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-500" />
          Nível de Confiança
        </h3>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full font-medium ${
            script.confidence_level === 'high' 
              ? 'bg-green-100 text-green-800'
              : script.confidence_level === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {script.confidence_level === 'high' ? '🎯 Alto' : 
             script.confidence_level === 'medium' ? '⚡ Médio' : 
             '⚠️ Baixo'}
          </div>
          <p className="text-gray-600">
            {script.confidence_level === 'high' 
              ? 'Baseado em dados completos do canal e otimizações avançadas'
              : script.confidence_level === 'medium'
              ? 'Baseado em dados parciais e padrões gerais'
              : 'Baseado em informações limitadas'
            }
          </p>
        </div>
      </div>

      {/* Framework Comparison */}
      {isYouTubeNative && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Vantagens do YouTube-Native
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+42%</div>
              <div className="text-sm text-green-700">Retenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+180%</div>
              <div className="text-sm text-green-700">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+300%</div>
              <div className="text-sm text-green-700">Algoritmo</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Production Content Component
function ProductionContent({ script, isYouTubeNative, isPremium }: any) {
  const content = script.content || script;
  const productionData = content.post_production_guidance || {};

  return (
    <div className="space-y-6">
      {/* Editing Suggestions */}
      {productionData.editing_suggestions && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-purple-500" />
            Sugestões de Edição
          </h3>
          <ul className="space-y-2">
            {productionData.editing_suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Thumbnail Optimization */}
      {productionData.thumbnail_optimization && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Otimização de Thumbnail
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-900">{productionData.thumbnail_optimization}</p>
          </div>
        </div>
      )}

      {/* Title Variations */}
      {productionData.title_variations && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Variações de Título
          </h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-900">{productionData.title_variations}</p>
          </div>
        </div>
      )}

      {/* Description Template */}
      {productionData.description_template && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Template de Descrição
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
              {productionData.description_template}
            </pre>
          </div>
        </div>
      )}

      {/* Performance Prediction */}
      {content.performance_prediction && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Predição de Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(content.performance_prediction.estimated_metrics || {}).map(([key, value]) => (
              <div key={key} className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-700 capitalize">
                  {key.replace(/_/g, ' ')}:
                </p>
                <p className="text-green-900 font-semibold">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function ScriptSection({ 
  title, 
  subtitle, 
  children, 
  expanded, 
  onToggle, 
  color = 'gray' 
}: any) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full p-4 text-left bg-${color}-50 hover:bg-${color}-100 transition-colors flex items-center justify-between`}
      >
        <div>
          <h3 className={`text-lg font-semibold text-${color}-900`}>{title}</h3>
          <p className={`text-sm text-${color}-700`}>{subtitle}</p>
        </div>
        <ArrowRight className={`w-5 h-5 text-${color}-600 transition-transform ${
          expanded ? 'rotate-90' : ''
        }`} />
      </button>
      
      {expanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color, comparison }: any) {
  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`font-semibold text-${color}-900`}>{title}</h4>
        <div className={`text-${color}-600`}>{icon}</div>
      </div>
      <div className={`text-3xl font-bold text-${color}-900 mb-2`}>{value}</div>
      {comparison && (
        <p className={`text-sm text-${color}-700`}>{comparison}</p>
      )}
    </div>
  );
}