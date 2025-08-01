export interface VideoIdeaInput {
  niche: string;
  channelType: 'educational' | 'entertainment' | 'gaming' | 'lifestyle' | 'tech' | 'business' | 'other';
  audienceAge: '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  contentStyle: 'informativo' | 'divertido' | 'tutorial' | 'vlog' | 'review' | 'reação' | 'outros';
  keywords?: string;
  language: 'pt' | 'en' | 'es' | 'fr';
}

export interface VideoIdea {
  id: string;
  title: string;
  description: string;
  trendScore: number; // 0-100
  estimatedViews: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  tags: string[];
  hooks: string[];
  duration: string;
  thumbnailIdea: string;
  niche: string;
  channelType: string;
  createdAt: string;
  status: 'generated' | 'saved' | 'planned' | 'published' | 'error';
  userId?: string;
  isFavorite?: boolean;
}

export interface SavedIdea extends VideoIdea {
  userId: string;
  savedAt: string;
  notes?: string;
  scheduledDate?: string;
}