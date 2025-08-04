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

// Importando componentes do design system
import {
  PageWrapper,
  Container,
  H1,
  H2,
  BodyText,
  Card,
  FeatureCard,
  StatsCard,
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

export default function DashboardPageNew() {
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

  const quickActions = [
    {
      title: tDashboard('home.quickActions.generateIdea'),
      description: "Crie novas ideias de vídeo com IA",
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      href: `/${locale}/ideas/new`,
    },
    {
      title: tDashboard('home.quickActions.analyzeChannel'),
      description: "Get insights about your channel",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      href: "/analytics",
    },
    {
      title: tDashboard('home.quickActions.checkTrends'),
      description: "Discover trending topics",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      href: "/trends",
    },
    {
      title: tDashboard('home.quickActions.scheduleVideo'),
      description: "Plan your content calendar",
      icon: <Calendar className="w-6 h-6 text-white" />,
      href: "/calendar",
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <div className="space-y-8">
          {/* Header com design system */}
          <div>
            <H1>{tDashboard('home.welcomeBack')}! 👋</H1>
            <BodyText variant="secondary" className="mt-2">
              {tDashboard('home.subtitle')}
            </BodyText>
          </div>

          {/* Usage Indicator com design system */}
          <Card variant="base" className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">
                Uso do Plano Gratuito
              </span>
              <span className="text-sm text-gray-400">
                {stats.usage.used}/{stats.usage.limit} ideias
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stats.usage.used / stats.usage.limit) * 100, 100)}%` }}
              />
            </div>
            {stats.usage.used >= stats.usage.limit && (
              <p className="text-xs text-red-400 mt-1">
                Limite atingido. Upgrade para Pro para ideias ilimitadas.
              </p>
            )}
          </Card>

          {/* Stats Grid com design system */}
          <StatsGrid>
            <StatsCard
              value={loading ? "..." : stats.ideasGenerated.toString()}
              label={tDashboard('home.stats.ideasGenerated')}
              change={`+${stats.ideasThisMonth}`}
              changeType="increase"
            />
            <StatsCard
              value={loading ? "..." : stats.videosPlanned.toString()}
              label={tDashboard('home.stats.videosPlanned')}
              change="+0"
              changeType="neutral"
            />
            <StatsCard
              value={loading ? "..." : stats.trendsTracked.toString()}
              label={tDashboard('home.stats.trendsTracked')}
              change="Em breve"
              changeType="neutral"
            />
            <StatsCard
              value={loading ? "..." : stats.competitors.toString()}
              label={tDashboard('home.stats.competitors')}
              change="Em breve"
              changeType="neutral"
            />
          </StatsGrid>

          {/* Quick Actions com design system */}
          <div>
            <H2 className="mb-6">
              {tDashboard('home.quickActions.title')}
            </H2>
            <FeatureGrid columns={4}>
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <FeatureCard
                    icon={action.icon}
                    title={action.title}
                    description={action.description}
                    className="cursor-pointer h-full"
                  />
                </Link>
              ))}
            </FeatureGrid>
          </div>

          {/* Recent Ideas com design system */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <H2>{tDashboard('home.recentIdeas.title')}</H2>
              <Link href={`/${locale}/ideas`}>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                  {tDashboard('home.recentIdeas.viewAll')} →
                </Button>
              </Link>
            </div>
            
            {ideasLoading ? (
              <Card variant="base" className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <BodyText variant="secondary" className="mt-4">Carregando ideias...</BodyText>
              </Card>
            ) : recentIdeas.length === 0 ? (
              <Card variant="base" className="p-8 text-center">
                <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-gray-400" />
                </div>
                <H2 className="mb-2 text-lg">
                  {tDashboard('home.recentIdeas.noIdeas')}
                </H2>
                <BodyText variant="secondary" className="mb-6">
                  {tDashboard('home.recentIdeas.generateFirst')}
                </BodyText>
                <Button variant="primary" href={`/${locale}/ideas/new`}>
                  {tDashboard('home.quickActions.generateIdea')}
                </Button>
              </Card>
            ) : (
              <FeatureGrid columns={3}>
                {recentIdeas.map((idea) => (
                  <Card key={idea.id} variant="hover">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <H2 className="text-lg line-clamp-2">
                        {idea.title}
                      </H2>
                    </div>

                    {/* Description */}
                    <BodyText variant="secondary" className="text-sm mb-4 line-clamp-3">
                      {idea.description}
                    </BodyText>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <BodyText variant="muted">
                          {idea.trendScore}/100
                        </BodyText>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <BodyText variant="muted">
                          {idea.estimatedViews}
                        </BodyText>
                      </div>
                    </div>

                    {/* Tags */}
                    {idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {idea.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={`${idea.id}-tag-${index}`}
                            className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {idea.tags.length > 2 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{idea.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(idea.savedAt).toLocaleDateString('pt-BR')}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        Salva
                      </span>
                    </div>
                  </Card>
                ))}
              </FeatureGrid>
            )}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}