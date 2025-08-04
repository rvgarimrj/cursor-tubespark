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
  Plus,
  Sparkles,
  Activity
} from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SavedIdea } from '@/types/ideas';

// Importando componentes do design system
import {
  Container,
  H1,
  H2,
  BodyText,
  Card,
  FeatureCard,
  StatsCard,
  MetricsCard,
  ActionCard,
  IdeaCard,
  Button,
  StatsGrid,
  FeatureGrid
} from '@/components/design-system';

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
      href: `/${locale}/dashboard/ideas/new`,
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
    <div className="lg:ml-[280px] min-h-screen bg-[#0f172a] text-[#f8fafc] p-4 lg:p-6">
      <div className="space-y-6 lg:space-y-8">
        {/* Usage Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#94a3b8]">
              {tDashboard('home.usage.freePlanTitle')}
            </span>
            <span className="text-sm font-medium text-[#f8fafc]">
              {tDashboard('home.usage.ideasCount', {
                used: stats.usage.used.toString(),
                limit: stats.usage.limit.toString()
              })}
            </span>
          </div>
          <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.usage.used / stats.usage.limit) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#94a3b8]">
            <span>
              {tDashboard('home.usage.remainingIdeas', {
                remaining: (stats.usage.limit - stats.usage.used).toString()
              })}
            </span>
            <Link href="#" className="text-blue-400 hover:text-blue-300">
              {tDashboard('home.usage.upgradeLink')}
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <MetricsCard
            title={tDashboard('home.stats.ideasGenerated')}
            value={loading ? "..." : stats.ideasGenerated}
            change={tDashboard('home.stats.changes.thisMonth', { count: `+${stats.ideasThisMonth}` })}
            icon={<Lightbulb className="w-5 h-5" />}
          />
          <MetricsCard
            title={tDashboard('home.stats.viralScore')}
            value="94%"
            change={tDashboard('home.stats.changes.excellent')}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <MetricsCard
            title={tDashboard('home.stats.videosPlanned')}
            value={loading ? "..." : stats.videosPlanned}
            change={tDashboard('home.stats.changes.comingSoon')}
            icon={<Video className="w-5 h-5" />}
          />
          <MetricsCard
            title={tDashboard('home.stats.trendsTracked')}
            value={loading ? "..." : stats.trendsTracked}
            change={tDashboard('home.stats.changes.comingSoon')}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#f8fafc] mb-6">🚀 {tDashboard('home.quickActions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <ActionCard
              icon={<Lightbulb className="w-6 h-6 text-white" />}
              title={tDashboard('home.quickActions.generateIdea')}
              description={tDashboard('home.quickActions.descriptions.generateIdea')}
              buttonText={tDashboard('home.quickActions.buttons.createNow')}
              buttonVariant="primary"
              onClick={() => window.location.href = `/${locale}/dashboard/ideas/new`}
            />
            <ActionCard
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              title={tDashboard('home.quickActions.analyzeChannel')}
              description={tDashboard('home.quickActions.descriptions.analyzeChannel')}
              buttonText={tDashboard('home.quickActions.buttons.comingSoon')}
              buttonVariant="secondary"
              iconColor="green"
              onClick={() => {}}
            />
            <ActionCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title={tDashboard('home.quickActions.checkTrends')}
              description={tDashboard('home.quickActions.descriptions.checkTrends')}
              buttonText={tDashboard('home.quickActions.buttons.comingSoon')}
              buttonVariant="secondary"
              iconColor="purple"
              onClick={() => {}}
            />
            <ActionCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              title={tDashboard('home.quickActions.scheduleVideo')}
              description={tDashboard('home.quickActions.descriptions.scheduleVideo')}
              buttonText={tDashboard('home.quickActions.buttons.comingSoon')}
              buttonVariant="secondary"
              iconColor="orange"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Recent Ideas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#f8fafc]">💡 {tDashboard('home.recentIdeas.title')}</h2>
            <Link href={`/${locale}/dashboard/ideas`} className="text-blue-400 hover:text-blue-300 font-medium">
              {tDashboard('home.recentIdeas.viewAll')} →
            </Link>
          </div>
          
          {ideasLoading ? (
            <Card variant="glass" className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-[#94a3b8]">{tCommon('loading')}...</p>
            </Card>
          ) : recentIdeas.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="mb-2 text-lg text-[#f8fafc]">
                {tDashboard('home.recentIdeas.noIdeas')}
              </h2>
              <p className="text-[#94a3b8] mb-6">
                {tDashboard('home.recentIdeas.generateFirst')}
              </p>
              <Link
                href={`/${locale}/dashboard/ideas/new`}
                className="inline-flex items-center justify-center px-6 py-2.5 text-base rounded-lg font-medium transition-all duration-300 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold shadow-[0_8px_25px_rgba(102,126,234,0.3)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(102,126,234,0.4)] cubic-bezier(0.4, 0, 0.2, 1)"
              >
                {tDashboard('home.quickActions.generateIdea')}
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  title={idea.title}
                  description={idea.description}
                  viralScore={idea.trendScore}
                  estimatedViews={idea.estimatedViews}
                  tags={idea.tags}
                  date={new Date(idea.savedAt).toLocaleDateString('pt-BR')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}