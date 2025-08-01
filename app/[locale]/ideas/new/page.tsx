"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/use-translation';
import { VideoIdeaInput, VideoIdea } from '@/types/ideas';
import { Sparkles, Loader2, Save, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function NewIdeaPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const { tDashboard, tCommon } = useTranslation();
  const router = useRouter();
  
  const [input, setInput] = useState<VideoIdeaInput>({
    niche: '',
    channelType: 'educational',
    audienceAge: '25-34',
    contentStyle: 'informativo',
    keywords: '',
    language: locale as 'pt' | 'en' | 'es' | 'fr'
  });
  
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.niche.trim()) {
      setError('Por favor, descreva seu nicho ou tópico');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar ideias');
      }

      setGeneratedIdeas(data.ideas);
    } catch (error) {
      console.error('Error generating ideas:', error);
      setError(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveIdea = async (idea: VideoIdea) => {
    setIsSaving(idea.id);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/ideas/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao salvar ideia');
      }

      // Show success feedback
      setSuccessMessage(`Ideia "${idea.title}" salva com sucesso!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving idea:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar ideia');
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerar Novas Ideias
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Use IA para criar ideias de vídeos personalizadas para seu canal
          </p>
        </div>
        <Link
          href={`/${locale}/ideas`}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Voltar para Ideias
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Parâmetros da Geração
          </h2>

          <div className="space-y-6">
            {/* Niche/Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nicho ou Tópico *
              </label>
              <textarea
                value={input.niche}
                onChange={(e) => setInput({ ...input, niche: e.target.value })}
                placeholder="Ex: Tecnologia, Culinária, Fitness, Educação Financeira..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
              />
            </div>

            {/* Channel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Canal
              </label>
              <select
                value={input.channelType}
                onChange={(e) => setInput({ ...input, channelType: e.target.value as any })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="educational">Educacional</option>
                <option value="entertainment">Entretenimento</option>
                <option value="gaming">Gaming</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="tech">Tecnologia</option>
                <option value="business">Negócios</option>
                <option value="other">Outros</option>
              </select>
            </div>

            {/* Audience Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idade do Público
              </label>
              <select
                value={input.audienceAge}
                onChange={(e) => setInput({ ...input, audienceAge: e.target.value as any })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="13-17">13-17 anos</option>
                <option value="18-24">18-24 anos</option>
                <option value="25-34">25-34 anos</option>
                <option value="35-44">35-44 anos</option>
                <option value="45-54">45-54 anos</option>
                <option value="55+">55+ anos</option>
              </select>
            </div>

            {/* Content Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estilo do Conteúdo
              </label>
              <select
                value={input.contentStyle}
                onChange={(e) => setInput({ ...input, contentStyle: e.target.value as any })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="informativo">Informativo</option>
                <option value="divertido">Divertido</option>
                <option value="tutorial">Tutorial</option>
                <option value="vlog">Vlog</option>
                <option value="review">Review</option>
                <option value="reação">Reação</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Palavras-chave (opcional)
              </label>
              <input
                type="text"
                value={input.keywords}
                onChange={(e) => setInput({ ...input, keywords: e.target.value })}
                placeholder="Ex: iniciante, 2024, dicas, como fazer..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando Ideias...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Gerar Ideias
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Generated Ideas */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Ideias Geradas {generatedIdeas.length > 0 && `(${generatedIdeas.length})`}
          </h2>

          {generatedIdeas.length === 0 && !isGenerating && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Preencha os parâmetros e clique em "Gerar Ideias" para começar
              </p>
            </div>
          )}

          {generatedIdeas.map((idea, index) => (
            <div
              key={idea.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {idea.title}
                </h3>
                <button
                  onClick={() => handleSaveIdea(idea)}
                  disabled={isSaving === idea.id}
                  className="text-red-600 hover:text-red-700 disabled:text-red-400 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:cursor-not-allowed"
                  title="Salvar ideia"
                >
                  {isSaving === idea.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {idea.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Score:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{idea.trendScore}/100</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Views:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{idea.estimatedViews}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Dificuldade:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{idea.difficulty}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Duração:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">{idea.duration}</span>
                </div>
              </div>

              {idea.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {idea.tags.map((tag, tagIndex) => (
                    <span
                      key={`${idea.id}-tag-${tagIndex}`}
                      className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}