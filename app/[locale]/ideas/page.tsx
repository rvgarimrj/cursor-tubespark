"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/use-translation';
import { SavedIdea } from '@/types/ideas';
import { useUser } from '@stackframe/stack';
import { Lightbulb, Plus, Calendar, Eye, TrendingUp, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function IdeasPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const { tDashboard, tCommon } = useTranslation();
  const user = useUser();
  
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadIdeas();
    }
  }, [user]);

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
      scheduledDate: dbIdea.best_posting_time
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Minhas Ideias
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas ideias de vídeo criadas com IA
          </p>
        </div>
        <Link
          href={`/${locale}/ideas/new`}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Ideia
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Ideas Grid */}
      {ideas.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma ideia salva ainda
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crie sua primeira ideia de vídeo com nossa IA
          </p>
          <Link
            href={`/${locale}/ideas/new`}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Gerar Primeira Ideia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {idea.title}
                </h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded"
                    title="Excluir ideia"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {idea.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {idea.trendScore}/100
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {idea.estimatedViews}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {idea.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={`${idea.id}-tag-${index}`}
                      className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{idea.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(idea.savedAt).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    idea.status === 'saved' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    idea.status === 'planned' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                    idea.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {idea.status === 'saved' ? 'Salva' :
                     idea.status === 'planned' ? 'Planejada' :
                     idea.status === 'published' ? 'Publicada' : 'Rascunho'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}