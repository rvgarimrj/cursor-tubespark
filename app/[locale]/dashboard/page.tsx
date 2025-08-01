"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from "@/lib/i18n/use-translation";
import { useUser } from '@stackframe/stack';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Video,
  Eye,
  Calendar,
  Target,
  Plus
} from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SavedIdea } from '@/types/ideas';

interface DashboardStats {
  ideasGenerated: number;
  ideasThisMonth: number;
  videosPlanned: number;
  trendsTracked: number;
  competitors: number;
  usage: {
    used: number;
    limit: number;
  };
}

export default function DashboardPage() {
  const { tDashboard, tCommon, locale } = useTranslation();
  const user = useUser();
  
  const [stats, setStats] = useState<DashboardStats>({
    ideasGenerated: 0,
    ideasThisMonth: 0,
    videosPlanned: 0,
    trendsTracked: 0,
    competitors: 0,
    usage: { used: 0, limit: 10 }
  });
  const [loading, setLoading] = useState(true);
  const [recentIdeas, setRecentIdeas] = useState<SavedIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Dashboard useEffect - user changed:', user);
    if (user) {
      console.log('👤 User details:', {
        id: user.id,
        email: user.primaryEmail,
        displayName: user.displayName
      });
      loadStats();
      loadRecentIdeas();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const loadRecentIdeas = async () => {
    if (!user) {
      console.log('❌ Dashboard: No user found for recent ideas');
      return;
    }
    
    console.log('✅ Dashboard: Loading recent ideas for user:', user.id);
    
    try {
      setIdeasLoading(true);
      
      console.log('🔗 Dashboard: Creating Supabase client...');
      const supabase = createClient();
      
      console.log('📡 Dashboard: Querying video_ideas table...');
      
      // First, test query without user filter to see all ideas
      console.log('🧪 Testing query without user filter...');
      const { data: allData, error: allError } = await supabase
        .from('video_ideas')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (allError) {
        console.error('❌ Error querying all ideas:', allError);
      } else {
        console.log('📊 All ideas in database:', allData?.length || 0);
        if (allData && allData.length > 0) {
          console.log('📝 All user IDs in database:');
          allData.forEach((idea, index) => {
            console.log(`  ${index + 1}. User ID: ${idea.user_id} | Title: ${idea.title}`);
          });
        }
      }
      
      // Now query with user filter
      const { data, error } = await supabase
        .from('video_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3); // Show only 3 most recent ideas

      if (error) {
        console.error('❌ Dashboard: Error loading recent ideas:', error);
        console.error('Dashboard: Error details:', JSON.stringify(error, null, 2));
        return;
      }

      console.log('✅ Dashboard: Raw database data:', data);
      console.log('📊 Dashboard: Found', data?.length || 0, 'recent ideas');

      const mappedIdeas = data.map(mapDatabaseToIdea);
      console.log('🔄 Dashboard: Mapped ideas:', mappedIdeas);
      
      setRecentIdeas(mappedIdeas);
      console.log('✅ Dashboard: Recent ideas set in state successfully');
    } catch (error) {
      console.error('❌ Dashboard: Error loading recent ideas:', error);
    } finally {
      setIdeasLoading(false);
      console.log('🏁 Dashboard: Recent ideas loading finished');
    }
  };

  const dashboardStats = [
    {
      title: tDashboard('home.stats.ideasGenerated'),
      value: loading ? "..." : stats.ideasGenerated.toString(),
      icon: Lightbulb,
      change: `+${stats.ideasThisMonth}`,
      changeType: "increase" as const,
    },
    {
      title: tDashboard('home.stats.videosPlanned'),
      value: loading ? "..." : stats.videosPlanned.toString(),
      icon: Video,
      change: "+0",
      changeType: "neutral" as const,
    },
    {
      title: tDashboard('home.stats.trendsTracked'),
      value: loading ? "..." : stats.trendsTracked.toString(),
      icon: TrendingUp,
      change: "Em breve",
      changeType: "neutral" as const,
    },
    {
      title: tDashboard('home.stats.competitors'),
      value: loading ? "..." : stats.competitors.toString(),
      icon: Users,
      change: "Em breve",
      changeType: "neutral" as const,
    },
  ];

  const quickActions = [
    {
      title: tDashboard('home.quickActions.generateIdea'),
      description: "Crie novas ideias de vídeo com IA",
      icon: Lightbulb,
      href: `/${locale}/ideas/new`,
      color: "bg-blue-500",
    },
    {
      title: tDashboard('home.quickActions.analyzeChannel'),
      description: "Get insights about your channel",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-green-500",
    },
    {
      title: tDashboard('home.quickActions.checkTrends'),
      description: "Discover trending topics",
      icon: TrendingUp,
      href: "/trends",
      color: "bg-purple-500",
    },
    {
      title: tDashboard('home.quickActions.scheduleVideo'),
      description: "Plan your content calendar",
      icon: Calendar,
      href: "/calendar",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {tDashboard('home.welcomeBack')}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {tDashboard('home.subtitle')}
        </p>
      </div>

      {/* Usage Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uso do Plano Gratuito
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {stats.usage.used}/{stats.usage.limit} ideias
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((stats.usage.used / stats.usage.limit) * 100, 100)}%` }}
          />
        </div>
        {stats.usage.used >= stats.usage.limit && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Limite atingido. Upgrade para Pro para ideias ilimitadas.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {stat.changeType === 'increase' ? 'este mês' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {tDashboard('home.quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer group block"
            >
              <div className={`h-12 w-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Ideas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tDashboard('home.recentIdeas.title')}
          </h2>
          <Link 
            href={`/${locale}/ideas`}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            {tDashboard('home.recentIdeas.viewAll')} →
          </Link>
        </div>
        
        {ideasLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Carregando ideias...</p>
          </div>
        ) : recentIdeas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {tDashboard('home.recentIdeas.noIdeas')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {tDashboard('home.recentIdeas.generateFirst')}
            </p>
            <Link 
              href={`/${locale}/ideas/new`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
            >
              {tDashboard('home.quickActions.generateIdea')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {idea.title}
                  </h3>
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
                    {idea.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={`${idea.id}-tag-${index}`}
                        className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {idea.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{idea.tags.length - 2}
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
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Salva
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}