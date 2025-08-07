"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/use-translation';
import { SavedIdea } from '@/types/ideas';
import { useUser } from '@stackframe/stack';
import { Lightbulb, Plus, Calendar, Eye, TrendingUp, Save, Trash2, Search, Grid, List, Star } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export default function IdeasPage({
  params: { locale },
  searchParams
}: {
  params: { locale: string };
  searchParams?: { filter?: string };
}) {
  const { t, tDashboard, tCommon } = useTranslation();
  const user = useUser();
  
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(searchParams?.filter || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    if (user) {
      loadIdeas();
    }
  }, [user]);

  // Listen for favorite changes from other pages
  useEffect(() => {
    const handleFavoriteChange = (event: CustomEvent) => {
      const { ideaId, isFavorite } = event.detail;
      handleFavoriteToggle(ideaId, isFavorite);
    };

    window.addEventListener('favoriteChanged' as any, handleFavoriteChange);
    
    return () => {
      window.removeEventListener('favoriteChanged' as any, handleFavoriteChange);
    };
  }, []);

  // Helper function to map database idea to SavedIdea
  const mapDatabaseToIdea = (dbIdea: any): SavedIdea => {
    return {
      id: dbIdea.id,
      title: dbIdea.title,
      description: dbIdea.description || '',
      trendScore: dbIdea.trend_score || 50,
      estimatedViews: `${dbIdea.estimated_views || 10000}+`,
      difficulty: dbIdea.difficulty_score <= 25 ? 'Fácil' : dbIdea.difficulty_score <= 50 ? 'Médio' : 'Difícil',
      tags: dbIdea.tags || [],
      hooks: [],
      duration: dbIdea.estimated_duration || '5-10 min',
      thumbnailIdea: dbIdea.thumbnail_ideas?.[0] || 'Thumbnail needed',
      niche: dbIdea.category || 'General',
      channelType: dbIdea.target_audience || 'other',
      createdAt: dbIdea.created_at,
      status: dbIdea.status === 'draft' ? 'saved' : dbIdea.status,
      userId: dbIdea.user_id,
      savedAt: dbIdea.created_at,
      notes: dbIdea.script_outline,
      scheduledDate: dbIdea.best_posting_time,
      isFavorite: dbIdea.is_favorited || false
    };
  };

  const loadIdeas = async () => {
    if (!user) {
      console.log('❌ No user found, skipping idea loading');
      return;
    }
    
    console.log('✅ Loading ideas for user:', user.id);
    console.log('User object:', user);
    
    try {
      setLoading(true);
      setError('');
      
      // Try direct Supabase connection first
      console.log('🔗 Creating Supabase client...');
      const supabase = createClient();
      
      console.log('📡 Querying video_ideas table...');
      const { data, error } = await supabase
        .from('video_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to fetch ideas: ${error.message}`);
      }

      console.log('✅ Raw database data:', data);
      console.log('📊 Found', data?.length || 0, 'ideas');
      
      if (!data || data.length === 0) {
        console.log('📝 No ideas found for user');
        setIdeas([]);
        return;
      }
      
      const mappedIdeas = data.map(mapDatabaseToIdea);
      console.log('🔄 Mapped ideas:', mappedIdeas);
      
      setIdeas(mappedIdeas);
      console.log('✅ Ideas set in state successfully');
    } catch (error) {
      console.error('❌ Error loading ideas:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar ideias');
    } finally {
      setLoading(false);
      console.log('🏁 Loading finished');
    }
  };

  // Filter and sort ideas
  const getFilteredAndSortedIdeas = () => {
    let filteredIdeas = ideas;

    // Apply search filter
    if (searchTerm) {
      filteredIdeas = filteredIdeas.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'highViral':
        filteredIdeas = filteredIdeas.filter(idea => idea.trendScore >= 70);
        break;
      case 'favorites':
        filteredIdeas = filteredIdeas.filter(idea => idea.isFavorite === true);
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredIdeas = filteredIdeas.filter(idea => new Date(idea.savedAt) >= oneWeekAgo);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'viralScore':
        filteredIdeas.sort((a, b) => b.trendScore - a.trendScore);
        break;
      case 'alphabetical':
        filteredIdeas.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'creationDate':
        filteredIdeas.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
        break;
      default: // 'newest'
        filteredIdeas.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        break;
    }

    return filteredIdeas;
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!user || !confirm('Tem certeza que deseja excluir esta ideia?')) return;

    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao excluir ideia');
      }

      setIdeas(ideas.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error('Error deleting idea:', error);
      setError('Erro ao excluir ideia');
    }
  };

  const handleFavoriteToggle = (ideaId: string, newState: boolean) => {
    // Update local state
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { ...idea, isFavorite: newState }
        : idea
    ));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-white/5 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-32 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl animate-pulse"></div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="h-12 w-full max-w-md bg-white/5 rounded-xl animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-800/30 p-1 rounded-lg gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-16 bg-white/10 rounded-lg animate-pulse"></div>
                ))}
              </div>
              <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse"></div>
              <div className="flex items-center bg-gray-800/30 p-1 rounded-lg gap-1">
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Cards Skeleton */}
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/5 backdrop-filter backdrop-blur-20 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-green-500/15 rounded-lg animate-pulse"></div>
                    <div className="h-6 w-24 bg-blue-500/15 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header - Following mockup design with improved responsive */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t('ideas.myIdeas.title')}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {t('ideas.myIdeas.subtitle')}
            </p>
          </div>
          
          <Link
            href={`/${locale}/ideas/new`}
            className="btn-viral px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 text-sm sm:text-base whitespace-nowrap mx-auto sm:mx-0"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            {t('ideas.myIdeas.newIdea')}
          </Link>
        </div>
        
        {/* Filters and Search - Following mockup design with improved responsive */}
        <div className="flex flex-col gap-4">
          <div className="search-bar relative w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg">
            <input 
              type="text" 
              placeholder={t('ideas.myIdeas.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center bg-gray-800/30 p-1 rounded-lg overflow-x-auto">
              {[
                { key: 'all', label: t('ideas.myIdeas.filters.all') },
                { key: 'highViral', label: t('ideas.myIdeas.filters.highViral') },
                { key: 'favorites', label: t('ideas.myIdeas.filters.favorites') },
                { key: 'recent', label: t('ideas.myIdeas.filters.recent') }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 border border-transparent whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/10 text-blue-400 border-blue-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer focus:outline-none focus:border-blue-500 min-w-0 flex-shrink"
              >
                <option value="newest" className="bg-gray-800">{t('ideas.myIdeas.sorting.newest')}</option>
                <option value="viralScore" className="bg-gray-800">{t('ideas.myIdeas.sorting.viralScore')}</option>
                <option value="alphabetical" className="bg-gray-800">{t('ideas.myIdeas.sorting.alphabetical')}</option>
                <option value="creationDate" className="bg-gray-800">{t('ideas.myIdeas.sorting.creationDate')}</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-800/30 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'}`}
                  title={t('ideas.myIdeas.viewMode.list')}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'}`}
                  title={t('ideas.myIdeas.viewMode.grid')}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Ideas List */}
      {(() => {
        const filteredIdeas = getFilteredAndSortedIdeas();
        
        if (filteredIdeas.length === 0) {
          return (
            <div className="bg-white/5 backdrop-filter backdrop-blur-20 border border-white/10 rounded-2xl p-12 text-center">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {ideas.length === 0 ? t('ideas.myIdeas.empty.title') : t('ideas.myIdeas.search.noResults')}
              </h3>
              <p className="text-gray-400 mb-6">
                {ideas.length === 0 ? t('ideas.myIdeas.empty.subtitle') : 'Tente ajustar seus filtros ou termo de busca'}
              </p>
              {ideas.length === 0 && (
                <Link
                  href={`/${locale}/ideas/new`}
                  className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  {t('ideas.myIdeas.empty.action')}
                </Link>
              )}
            </div>
          );
        }

        return (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
            {filteredIdeas.map((idea) => {
              const getViralScoreClass = (score: number) => {
                if (score >= 80) return 'high';
                if (score >= 60) return 'medium';
                return 'low';
              };

              const viralScoreClass = getViralScoreClass(idea.trendScore);
              const viralScoreColor = viralScoreClass === 'high' ? 'text-green-400 bg-green-500/15 border-green-500/20' :
                                      viralScoreClass === 'medium' ? 'text-yellow-400 bg-yellow-500/15 border-yellow-500/20' :
                                      'text-gray-400 bg-gray-500/15 border-gray-500/20';

              return (
                <div
                  key={idea.id}
                  className={`idea-card relative overflow-hidden bg-white/5 backdrop-filter backdrop-blur-20 border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer hover:bg-white/8 hover:border-blue-500/30 hover:transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] ${
                    viralScoreClass === 'high' ? 'border-t-4 border-t-green-500' :
                    viralScoreClass === 'medium' ? 'border-t-4 border-t-yellow-500' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Idea Icon/Emoji */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <span className="text-white font-bold text-xl sm:text-2xl">🔥</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">
                          {idea.title}
                        </h3>
                        
                        {/* Action Menu */}
                        <div className="flex items-center gap-2 self-center sm:self-start">
                          {/* Favorite Button */}
                          <FavoriteButton
                            ideaId={idea.id}
                            isFavorite={idea.isFavorite || false}
                            onToggle={handleFavoriteToggle}
                          />
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDeleteIdea(idea.id)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                            title={t('ideas.myIdeas.card.delete')}
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {idea.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-4">
                        <div className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border ${viralScoreColor}`}>
                          <TrendingUp className="w-3 h-3" />
                          <span className="whitespace-nowrap">{idea.trendScore}/100</span>
                        </div>
                        
                        <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-medium">
                          <Eye className="w-3 h-3" />
                          <span className="whitespace-nowrap">{idea.estimatedViews}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4 justify-center sm:justify-start">
                          {idea.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={`${idea.id}-tag-${index}`}
                              className="bg-white/10 border border-white/10 text-gray-300 text-xs px-2 py-1 rounded-md font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {idea.tags.length > 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +{idea.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-white/10 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center sm:justify-start">
                          <Calendar className="h-3 w-3" />
                          <span className="whitespace-nowrap">{new Date(idea.savedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                            idea.status === 'saved' ? 'bg-blue-500/15 text-blue-400' :
                            idea.status === 'planned' ? 'bg-yellow-500/15 text-yellow-400' :
                            idea.status === 'published' ? 'bg-green-500/15 text-green-400' :
                            'bg-gray-500/15 text-gray-400'
                          }`}>
                            {idea.status === 'saved' ? t('ideas.myIdeas.status.saved') :
                             idea.status === 'planned' ? t('ideas.myIdeas.status.planned') :
                             idea.status === 'published' ? t('ideas.myIdeas.status.published') : 
                             t('ideas.myIdeas.status.draft')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}