"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Clock, 
  Target, 
  TrendingUp,
  FileText,
  Crown,
  Zap,
  Star,
  ExternalLink,
  Share2,
  Edit3
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import type { VideoScript, PremiumScriptContent, BasicScriptContent } from "@/types";

interface ScriptPageData {
  script: VideoScript;
  idea: {
    id: string;
    title: string;
    description: string;
    niche: string;
    trendScore: number;
    estimatedViews: string;
    tags: string[];
    channelType: string;
    duration: string;
  };
}

export default function ScriptViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<ScriptPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const scriptId = params.id as string;

  useEffect(() => {
    const loadScript = async () => {
      if (!user?.id || !scriptId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/scripts/${scriptId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load script');
        }

        setData({
          script: result.script,
          idea: result.idea
        });
      } catch (err) {
        console.error('Error loading script:', err);
        setError('Falha ao carregar roteiro. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadScript();
  }, [user?.id, scriptId]);

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(section);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const content = formatScriptForDownload(data.script, data.idea);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiro-${data.idea.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatScriptForDownload = (script: VideoScript, idea: any): string => {
    const content = script.content;
    let output = `ROTEIRO DE VÍDEO\n\n`;
    output += `Título: ${idea.title}\n`;
    output += `Nicho: ${idea.niche}\n`;
    output += `Duração Estimada: ${idea.duration}\n`;
    output += `Tipo: ${script.scriptType === 'premium' ? 'Premium' : 'Básico'}\n`;
    output += `Gerado em: ${new Date(script.createdAt!).toLocaleDateString('pt-BR')}\n\n`;
    output += `==============================================\n\n`;

    if (content.type === 'premium') {
      const premiumContent = content as PremiumScriptContent;
      output += `HOOK PRINCIPAL:\n${premiumContent.hook}\n\n`;
      
      if (premiumContent.alternativeHooks?.length > 0) {
        output += `HOOKS ALTERNATIVOS:\n`;
        premiumContent.alternativeHooks.forEach((hook, i) => {
          output += `${i + 1}. ${hook}\n`;
        });
        output += `\n`;
      }

      output += `INTRODUÇÃO:\n${premiumContent.introduction}\n\n`;

      output += `CONTEÚDO PRINCIPAL:\n`;
      premiumContent.mainContent.sections.forEach((section, i) => {
        output += `\n${i + 1}. ${section.title} (${section.timing})\n`;
        output += `${section.content}\n`;
        if (section.visualSuggestions?.length > 0) {
          output += `Sugestões visuais: ${section.visualSuggestions.join(', ')}\n`;
        }
      });

      output += `\nCONCLUSÃO:\n${premiumContent.conclusion}\n\n`;
      output += `CALL TO ACTION:\n${premiumContent.cta}\n\n`;

      if (premiumContent.seoTags?.length > 0) {
        output += `TAGS SEO:\n${premiumContent.seoTags.join(', ')}\n\n`;
      }
    } else {
      const basicContent = content as BasicScriptContent;
      output += `HOOK:\n${basicContent.hook}\n\n`;
      output += `PONTOS PRINCIPAIS:\n`;
      basicContent.mainPoints.forEach((point, i) => {
        output += `${i + 1}. ${point}\n`;
      });
      output += `\nCALL TO ACTION:\n${basicContent.cta}\n\n`;
    }

    return output;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Carregando roteiro...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar roteiro</h3>
          <p className="text-red-600">{error || 'Roteiro não encontrado'}</p>
          <Link 
            href="/dashboard/scripts" 
            className="inline-flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Ver todos os roteiros
          </Link>
        </div>
      </div>
    );
  }

  const { script, idea } = data;
  const content = script.content;
  const isPremium = content.type === 'premium';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              {isPremium ? (
                <Crown className="w-5 h-5 text-purple-600" />
              ) : (
                <Zap className="w-5 h-5 text-blue-600" />
              )}
              Roteiro {isPremium ? 'Premium' : 'Básico'}
            </h1>
            <p className="text-sm text-gray-600">
              Gerado em {new Date(script.createdAt!).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={() => handleCopy(formatScriptForDownload(script, idea), 'full')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied === 'full' ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copiar Tudo
          </button>
        </div>
      </div>

      {/* Idea Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h2>
            <p className="text-gray-600 mb-3">{idea.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                <span>{idea.niche}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-medium text-green-600">{idea.trendScore}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{idea.estimatedViews} views</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{idea.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Script Content */}
      <div className="space-y-6">
        {isPremium ? (
          <PremiumScriptView content={content as PremiumScriptContent} onCopy={handleCopy} copied={copied} />
        ) : (
          <BasicScriptView content={content as BasicScriptContent} onCopy={handleCopy} copied={copied} />
        )}
      </div>
    </div>
  );
}

function PremiumScriptView({ 
  content, 
  onCopy, 
  copied 
}: { 
  content: PremiumScriptContent; 
  onCopy: (text: string, section: string) => void;
  copied: string | null;
}) {
  return (
    <>
      {/* Hook Principal */}
      <ScriptSection
        title="🎣 Hook Principal"
        content={content.hook}
        onCopy={() => onCopy(content.hook, 'hook')}
        copied={copied === 'hook'}
      />

      {/* Hooks Alternativos */}
      {content.alternativeHooks && content.alternativeHooks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🔄 Hooks Alternativos</h3>
            <button
              onClick={() => onCopy(content.alternativeHooks.join('\n\n'), 'alt-hooks')}
              className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {copied === 'alt-hooks' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-3">
            {content.alternativeHooks.map((hook, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{hook}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Introdução */}
      <ScriptSection
        title="👋 Introdução"
        content={content.introduction}
        onCopy={() => onCopy(content.introduction, 'intro')}
        copied={copied === 'intro'}
      />

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 Conteúdo Principal</h3>
          <button
            onClick={() => onCopy(
              content.mainContent.sections.map(s => `${s.title}\n${s.content}`).join('\n\n'), 
              'main-content'
            )}
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {copied === 'main-content' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="space-y-6">
          {content.mainContent.sections.map((section, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{section.title}</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {section.timing}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{section.content}</p>
              
              {section.visualSuggestions && section.visualSuggestions.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium text-gray-600">💡 Sugestões visuais: </span>
                  <span className="text-gray-600">{section.visualSuggestions.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conclusão */}
      <ScriptSection
        title="✨ Conclusão"
        content={content.conclusion}
        onCopy={() => onCopy(content.conclusion, 'conclusion')}
        copied={copied === 'conclusion'}
      />

      {/* Call to Action */}
      <ScriptSection
        title="📢 Call to Action"
        content={content.cta}
        onCopy={() => onCopy(content.cta, 'cta')}
        copied={copied === 'cta'}
      />

      {/* Tags SEO */}
      {content.seoTags && content.seoTags.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🏷️ Tags SEO</h3>
            <button
              onClick={() => onCopy(content.seoTags.join(', '), 'seo-tags')}
              className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {copied === 'seo-tags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.seoTags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BasicScriptView({ 
  content, 
  onCopy, 
  copied 
}: { 
  content: BasicScriptContent; 
  onCopy: (text: string, section: string) => void;
  copied: string | null;
}) {
  return (
    <>
      {/* Hook */}
      <ScriptSection
        title="🎣 Hook"
        content={content.hook}
        onCopy={() => onCopy(content.hook, 'hook')}
        copied={copied === 'hook'}
      />

      {/* Pontos Principais */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 Pontos Principais</h3>
          <button
            onClick={() => onCopy(content.mainPoints.join('\n\n'), 'main-points')}
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {copied === 'main-points' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="space-y-3">
          {content.mainPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <ScriptSection
        title="📢 Call to Action"
        content={content.cta}
        onCopy={() => onCopy(content.cta, 'cta')}
        copied={copied === 'cta'}
      />
    </>
  );
}

function ScriptSection({ 
  title, 
  content, 
  onCopy, 
  copied 
}: { 
  title: string; 
  content: string; 
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onCopy}
          className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  );
}