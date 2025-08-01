import { createSupabaseServerClient } from './client';
import { VideoIdea, SavedIdea, VideoIdeaInput } from '@/types/ideas';

export class IdeasService {
  static async saveIdea(idea: VideoIdea, userId: string): Promise<SavedIdea> {
    const supabase = createSupabaseServerClient();
    
    // Ensure user exists before saving idea (prevents FK constraint error)
    await this.ensureUserExists(userId);
    
    const { data, error } = await supabase
      .from('video_ideas')
      .insert({
        user_id: userId,
        title: idea.title,
        description: idea.description,
        category: idea.niche,
        tags: idea.tags,
        estimated_views: parseInt(idea.estimatedViews.replace(/[^\d]/g, '')) || 0,
        difficulty_score: idea.difficulty === 'Fácil' ? 25 : idea.difficulty === 'Médio' ? 50 : 75,
        trend_score: idea.trendScore,
        thumbnail_ideas: [idea.thumbnailIdea],
        target_audience: idea.channelType,
        estimated_duration: idea.duration,
        status: 'draft'
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error saving idea:', error);
      throw new Error('Failed to save idea');
    }

    // Increment user usage count
    await this.incrementUsageCount(userId);

    return {
      ...idea,
      userId,
      savedAt: data.created_at,
      status: 'saved'
    };
  }

  static async getUserIdeas(userId: string): Promise<SavedIdea[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user ideas:', error);
      throw new Error('Failed to fetch ideas');
    }

    return data.map(this.mapDatabaseToIdea);
  }

  static async getIdeaById(ideaId: string, userId: string): Promise<SavedIdea | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching idea:', error);
      throw new Error('Failed to fetch idea');
    }

    return this.mapDatabaseToIdea(data);
  }

  static async updateIdea(ideaId: string, userId: string, updates: Partial<VideoIdea>): Promise<SavedIdea> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('video_ideas')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.niche,
        tags: updates.tags,
        status: updates.status === 'saved' ? 'draft' : updates.status
      })
      .eq('id', ideaId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating idea:', error);
      throw new Error('Failed to update idea');
    }

    return this.mapDatabaseToIdea(data);
  }

  static async deleteIdea(ideaId: string, userId: string): Promise<void> {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from('video_ideas')
      .delete()
      .eq('id', ideaId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting idea:', error);
      throw new Error('Failed to delete idea');
    }
  }

  static async getUserStats(userId: string) {
    const supabase = createSupabaseServerClient();
    const { data: ideas, error: ideasError } = await supabase
      .from('video_ideas')
      .select('id, status, created_at')
      .eq('user_id', userId);

    if (ideasError) {
      console.error('Error fetching user stats:', ideasError);
      throw new Error('Failed to fetch user stats');
    }

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalIdeas: ideas.length,
      ideasThisMonth: ideas.filter(idea => new Date(idea.created_at) >= currentMonth).length,
      draftIdeas: ideas.filter(idea => idea.status === 'draft').length,
      plannedIdeas: ideas.filter(idea => idea.status === 'planned').length,
      publishedIdeas: ideas.filter(idea => idea.status === 'published').length
    };
  }

  static async incrementUsageCount(userId: string): Promise<void> {
    const supabase = createSupabaseServerClient();
    
    // Ensure user exists before incrementing
    await this.ensureUserExists(userId);
    
    const { error } = await supabase.rpc('increment_usage_count', {
      user_id: userId
    });

    if (error) {
      console.error('Error incrementing usage count:', error);
      // Don't throw error - this is not critical
    }
  }

  // Helper function to ensure user exists in database
  private static async ensureUserExists(userId: string): Promise<void> {
    const supabase = createSupabaseServerClient();
    
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    // If user doesn't exist, create them using upsert
    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('User not found, creating:', userId);
      
      const { error: createError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: 'user@example.com',
          name: 'User',
          usage_count: 0,
          usage_limit: 10,
          subscription_plan: 'free'
        }, {
          onConflict: 'id'
        });

      if (createError) {
        console.error('Error creating user:', createError);
        throw new Error('Failed to create user');
      }
      
      console.log('User created successfully:', userId);
    }
  }

  static async getUserUsage(userId: string): Promise<{ used: number; limit: number }> {
    const supabase = createSupabaseServerClient();
    
    // Ensure user exists first
    await this.ensureUserExists(userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('usage_count, usage_limit')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user usage:', error);
      return { used: 0, limit: 10 }; // Default fallback
    }

    return {
      used: data.usage_count || 0,
      limit: data.usage_limit || 10
    };
  }

  private static mapDatabaseToIdea(dbIdea: any): SavedIdea {
    return {
      id: dbIdea.id,
      title: dbIdea.title,
      description: dbIdea.description || '',
      trendScore: dbIdea.trend_score || 50,
      estimatedViews: `${dbIdea.estimated_views || 10000}+`,
      difficulty: dbIdea.difficulty_score <= 25 ? 'Fácil' : dbIdea.difficulty_score <= 50 ? 'Médio' : 'Difícil',
      tags: dbIdea.tags || [],
      hooks: [], // Not stored in DB yet
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
  }
}