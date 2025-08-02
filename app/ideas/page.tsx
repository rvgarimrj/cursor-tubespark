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

const mockIdeas = [
  {
    id: "1",
    title: "10 AI Tools That Will Change Video Editing Forever",
    description: "Explore the latest AI-powered video editing tools that are revolutionizing content creation for YouTubers.",
    category: "Technology",
    channelType: "tech" as const,
    niche: "Technology",
    trendScore: 92,
    estimatedViews: "45K",
    difficulty: "Médio" as const,
    tags: ["AI", "Video Editing", "Tools", "Tech"],
    hooks: ["You won't believe what AI can do for video editing now"],
    duration: "8-12 min",
    thumbnailIdea: "Split screen showing before/after AI editing",
    createdAt: "2 hours ago",
    status: "generated" as const,
    isFavorited: false,
    engagementScore: 0,
    timeSpent: 0,
  },
  {
    id: "2", 
    title: "Why Everyone is Switching to This New Social Media Platform",
    description: "Dive into the emerging social media platform that's capturing everyone's attention and what it means for creators.",
    category: "Entertainment",
    channelType: "entertainment" as const,
    niche: "Social Media",
    trendScore: 87,
    estimatedViews: "38K",
    difficulty: "Fácil" as const,
    tags: ["Social Media", "Trends", "Platform"],
    hooks: ["This new platform is killing Instagram and TikTok"],
    duration: "6-10 min",
    thumbnailIdea: "Shocked face with platform logos",
    createdAt: "4 hours ago",
    status: "generated" as const,
    isFavorited: false,
    engagementScore: 0,
    timeSpent: 0,
  },
  {
    id: "3",
    title: "The Secret to Getting 1M Subscribers in 6 Months", 
    description: "Learn the proven strategies and tactics that successful YouTubers use to rapidly grow their subscriber base.",
    category: "Education",
    channelType: "educational" as const,
    niche: "YouTube Growth",
    trendScore: 94,
    estimatedViews: "62K",
    difficulty: "Médio" as const,
    tags: ["Growth", "YouTube", "Strategy"],
    hooks: ["I gained 1M subscribers in 6 months - here's exactly how"],
    duration: "10-15 min",
    thumbnailIdea: "Before/after subscriber count with arrow",
    createdAt: "1 day ago",
    status: "generated" as const,
    isFavorited: true,
    engagementScore: 15,
    timeSpent: 0,
  },
];

export default function IdeasPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState(mockIdeas);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<typeof mockIdeas[0] | null>(null);
  const [engagementTimers, setEngagementTimers] = useState<Record<string, number>>({});

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
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const newFavoriteState = !idea.isFavorited;
    
    setIdeas(prev => prev.map(i => 
      i.id === ideaId 
        ? { ...i, isFavorited: newFavoriteState, engagementScore: newFavoriteState ? i.engagementScore + 5 : i.engagementScore - 5 }
        : i
    ));

    await trackEngagement(ideaId, 'favorite', { favorited: newFavoriteState });
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
    // Update engagement score for successful script generation
    if (selectedIdea) {
      setIdeas(prev => prev.map(i => 
        i.id === selectedIdea.id ? { ...i, engagementScore: i.engagementScore + 10 } : i
      ));
    }
  };

  const generateNewIdea = async () => {
    setIsGenerating(true);
    
    try {
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
        // Save each idea to the database
        const savedIdeas = [];
        for (const idea of data.ideas) {
          try {
            const saveResponse = await fetch('/api/ideas/save', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idea }),
            });
            
            if (saveResponse.ok) {
              const savedData = await saveResponse.json();
              savedIdeas.push({
                ...savedData.idea,
                createdAt: "Just now",
                status: "generated" as const,
                isFavorited: false,
                engagementScore: 0,
                timeSpent: 0,
              });
            }
          } catch (error) {
            console.error('Error saving idea:', error);
          }
        }
        
        if (savedIdeas.length > 0) {
          setIdeas([...savedIdeas, ...ideas]);
        }
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Ideas</h1>
          <p className="text-gray-600">AI-powered video ideas tailored for your channel</p>
        </div>
        <button
          onClick={generateNewIdea}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative">
            {/* Engagement Score Badge */}
            {idea.engagementScore > 0 && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {idea.engagementScore}
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {idea.category}
                  </span>
                  <span className="text-xs text-gray-500">{idea.createdAt}</span>
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
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
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
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center space-x-2">
                {/* Favorite Button */}
                <button 
                  onClick={() => handleFavorite(idea.id)}
                  className={`p-2 rounded-lg transition-all ${
                    idea.isFavorited 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
                  }`}
                  title="Favoritar ideia"
                >
                  <Star className={`w-4 h-4 ${idea.isFavorited ? 'fill-current' : ''}`} />
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
              
              <div className="flex items-center space-x-2">
                {/* Create Script Button - Main CTA */}
                <button 
                  onClick={() => handleCreateScript(idea)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Criar Roteiro
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ideas.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-600 mb-4">Generate your first AI-powered video idea to get started</p>
          <button
            onClick={generateNewIdea}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Your First Idea
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
          idea={selectedIdea as any}
          onScriptGenerated={handleScriptGenerated}
        />
      )}
    </div>
  );
}