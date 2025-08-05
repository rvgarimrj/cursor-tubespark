"use client";

import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  TrendingUp, 
  Eye, 
  Clock, 
  Plus, 
  Sparkles, 
  Star, 
  Share2, 
  Copy,
  FileText,
  Heart,
  MessageCircle
} from "lucide-react";
import ScriptGenerationModal from "@/components/scripts/ScriptGenerationModal";
import { useAuth } from "@/lib/auth";
import { IdeasService } from "@/lib/supabase/ideas";
import { createClient } from "@/lib/supabase/client";
import type { VideoIdea, SavedIdea } from "@/types/ideas";

export default function IdeasPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null);
  const [engagementTimers, setEngagementTimers] = useState<Record<string, number>>({});

  // Load user ideas from Supabase
  useEffect(() => {
    const loadIdeas = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userIdeas = await IdeasService.getUserIdeas(user.id);
        setIdeas(userIdeas);
      } catch (err) {
        console.error('Error loading ideas:', err);
        setError('Falha ao carregar ideias. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [user?.id]);

  // Track time spent on ideas
  useEffect(() => {
    const timers: Record<string, number> = {};
    ideas.forEach(idea => {
      if (!engagementTimers[idea.id]) {
        timers[idea.id] = Date.now();
      }
    });
    setEngagementTimers(prev => ({ ...prev, ...timers }));
  }, [ideas]);

  const trackEngagement = async (ideaId: string, type: string, value?: any) => {
    if (!user) return;

    try {
      await fetch('/api/engagement/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          engagementType: type,
          engagementValue: value
        })
      });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const handleFavorite = async (ideaId: string) => {
    if (!user?.id) return;
    
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const newFavoriteState = !idea.isFavorite;
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('video_ideas')
        .update({ is_favorited: newFavoriteState })
        .eq('id', ideaId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating favorite:', error);
        return;
      }

      // Update local state
      setIdeas(prev => prev.map(i => 
        i.id === ideaId 
          ? { ...i, isFavorite: newFavoriteState }
          : i
      ));

      // Track engagement
      await trackEngagement(ideaId, 'favorite', { favorited: newFavoriteState });
    } catch (error) {
      console.error('Error favoriting idea:', error);
    }
  };

  const handleShare = async (ideaId: string, platform: string = 'copy_link') => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    if (platform === 'copy_link') {
      await navigator.clipboard.writeText(`Check out this video idea: ${idea.title}`);
    }

    setIdeas(prev => prev.map(i => 
      i.id === ideaId ? { ...i, engagementScore: i.engagementScore + 2 } : i
    ));

    await trackEngagement(ideaId, 'share', { platform });
  };

  const handleCopy = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const textToCopy = `${idea.title}\n\n${idea.description}\n\nTags: ${idea.tags.join(', ')}`;
    await navigator.clipboard.writeText(textToCopy);

    setIdeas(prev => prev.map(i => 
      i.id === ideaId ? { ...i, engagementScore: i.engagementScore + 3 } : i
    ));

    await trackEngagement(ideaId, 'copy', { contentType: 'idea_full' });
  };

  const handleCreateScript = (idea: typeof mockIdeas[0]) => {
    setSelectedIdea(idea);
    setShowScriptModal(true);
    trackEngagement(idea.id, 'click_script', { fromLocation: 'idea_card' });
  };

  const handleScriptGenerated = (scriptId: string) => {
    // Track successful script generation
    if (selectedIdea) {
      trackEngagement(selectedIdea.id, 'script_generated', { scriptId });
    }
  };

  const generateNewIdea = async () => {
    if (!user?.id) {
      alert('Você precisa estar logado para gerar ideias.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate idea via API
      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: "Technology",
          channelType: "tech",
          audienceAge: "18-35",
          contentStyle: "educational",
          language: "pt-BR",
          trendingTopics: ["AI", "Content Creation"],
          count: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      
      if (data.success && data.ideas && data.ideas.length > 0) {
        // Save ideas using IdeasService
        const savedIdeas: SavedIdea[] = [];
        
        for (const idea of data.ideas) {
          try {
            const savedIdea = await IdeasService.saveIdea(idea, user.id);
            savedIdeas.push(savedIdea);
          } catch (error) {
            console.error('Error saving idea:', error);
          }
        }
        
        if (savedIdeas.length > 0) {
          // Add new ideas to the beginning of the list
          setIdeas(prev => [...savedIdeas, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      setError('Falha ao gerar ideias. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Video Ideas</h1>
          <p className="text-sm sm:text-base text-gray-600">AI-powered video ideas tailored for your channel</p>
        </div>
        <button
          onClick={generateNewIdea}
          disabled={isGenerating}
          className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Idea
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Carregando ideias...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Erro</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && !error && (
        <div className="grid gap-4 sm:gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow relative">
            {/* Idea Status Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {idea.status === 'saved' ? 'Salva' : 'Nova'}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {idea.niche}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(idea.savedAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    idea.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                    idea.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {idea.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h2>
                <p className="text-gray-600 mb-4">{idea.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Hook Preview */}
                {idea.hooks && idea.hooks.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Hook sugerido:</span>
                    </div>
                    <p className="text-sm text-amber-700 italic">"{idea.hooks[0]}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="font-medium text-green-600">{idea.trendScore}</span>
                  <span className="ml-1">Trend</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="font-medium">{idea.estimatedViews}</span>
                  <span className="ml-1">Est. Views</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-medium">{idea.duration}</span>
                </div>
              </div>
            </div>

            {/* Engagement Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 mt-4 gap-3">
              <div className="flex items-center gap-2">
                {/* Favorite Button */}
                <button 
                  onClick={() => handleFavorite(idea.id)}
                  className={`p-2 rounded-lg transition-all ${
                    idea.isFavorite 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
                  }`}
                  title="Favoritar ideia"
                >
                  <Star className={`w-4 h-4 ${idea.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Share Button */}
                <button 
                  onClick={() => handleShare(idea.id)}
                  className="p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-500 rounded-lg transition-all"
                  title="Compartilhar ideia"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Copy Button */}
                <button 
                  onClick={() => handleCopy(idea.id)}
                  className="p-2 text-gray-400 hover:bg-gray-100 hover:text-green-500 rounded-lg transition-all"
                  title="Copiar conteúdo"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-end sm:justify-start">
                {/* Create Script Button - Main CTA */}
                <button 
                  onClick={() => handleCreateScript(idea)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Criar Roteiro
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && ideas.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Nenhuma ideia ainda</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Gere sua primeira ideia com IA para começar</p>
          <button
            onClick={generateNewIdea}
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Gerar Primeira Ideia
          </button>
        </div>
      )}

      {/* Script Generation Modal */}
      {selectedIdea && (
        <ScriptGenerationModal
          isOpen={showScriptModal}
          onClose={() => {
            setShowScriptModal(false);
            setSelectedIdea(null);
          }}
          idea={selectedIdea}
          onScriptGenerated={handleScriptGenerated}
        />
      )}
    </div>
  );
}