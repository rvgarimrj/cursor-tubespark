import type {
  ContentCalendar,
  TrendingTopic,
  User,
  UserAnalytics,
  VideoIdea,
  YouTubeChannel,
} from "@/types";
import { createClient } from "./server";

// User queries
export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>,
): Promise<User | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data;
}

// YouTube channel queries
export async function getUserYouTubeChannel(
  userId: string,
): Promise<YouTubeChannel | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("youtube_channels")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching YouTube channel:", error);
    return null;
  }

  return data;
}

export async function saveYouTubeChannel(
  channel: Omit<YouTubeChannel, "created_at" | "updated_at">,
): Promise<YouTubeChannel | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("youtube_channels")
    .upsert(channel, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Error saving YouTube channel:", error);
    return null;
  }

  return data;
}

// Video ideas queries
export async function getUserVideoIdeas(
  userId: string,
  limit = 50,
  offset = 0,
): Promise<VideoIdea[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("video_ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching video ideas:", error);
    return [];
  }

  return data || [];
}

export async function getVideoIdea(ideaId: string): Promise<VideoIdea | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("video_ideas")
    .select("*")
    .eq("id", ideaId)
    .single();

  if (error) {
    console.error("Error fetching video idea:", error);
    return null;
  }

  return data;
}

export async function saveVideoIdea(
  idea: Omit<VideoIdea, "id" | "created_at" | "updated_at">,
): Promise<VideoIdea | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("video_ideas")
    .insert(idea)
    .select()
    .single();

  if (error) {
    console.error("Error saving video idea:", error);
    return null;
  }

  return data;
}

export async function updateVideoIdea(
  ideaId: string,
  updates: Partial<VideoIdea>,
): Promise<VideoIdea | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("video_ideas")
    .update(updates)
    .eq("id", ideaId)
    .select()
    .single();

  if (error) {
    console.error("Error updating video idea:", error);
    return null;
  }

  return data;
}

export async function deleteVideoIdea(ideaId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("video_ideas")
    .delete()
    .eq("id", ideaId);

  if (error) {
    console.error("Error deleting video idea:", error);
    return false;
  }

  return true;
}

// Trending topics queries
export async function getTrendingTopics(
  category?: string,
  limit = 20,
): Promise<TrendingTopic[]> {
  const supabase = createClient();

  let query = supabase
    .from("trending_topics")
    .select("*")
    .order("search_volume", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching trending topics:", error);
    return [];
  }

  return data || [];
}

export async function saveTrendingTopic(
  topic: Omit<TrendingTopic, "id" | "created_at" | "updated_at">,
): Promise<TrendingTopic | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("trending_topics")
    .upsert(topic, { onConflict: "keyword" })
    .select()
    .single();

  if (error) {
    console.error("Error saving trending topic:", error);
    return null;
  }

  return data;
}

// Content calendar queries
export async function getUserContentCalendar(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<ContentCalendar[]> {
  const supabase = createClient();

  let query = supabase
    .from("content_calendar")
    .select(`
      *,
      video_ideas (
        id,
        title,
        category,
        status
      )
    `)
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: true });

  if (startDate) {
    query = query.gte("scheduled_date", startDate);
  }

  if (endDate) {
    query = query.lte("scheduled_date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching content calendar:", error);
    return [];
  }

  return data || [];
}

export async function saveContentCalendarItem(
  item: Omit<ContentCalendar, "id" | "created_at" | "updated_at">,
): Promise<ContentCalendar | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_calendar")
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error("Error saving content calendar item:", error);
    return null;
  }

  return data;
}

export async function updateContentCalendarItem(
  itemId: string,
  updates: Partial<ContentCalendar>,
): Promise<ContentCalendar | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("content_calendar")
    .update(updates)
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Error updating content calendar item:", error);
    return null;
  }

  return data;
}

// Analytics queries
export async function getUserAnalytics(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<UserAnalytics[]> {
  const supabase = createClient();

  let query = supabase
    .from("user_analytics")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (startDate) {
    query = query.gte("date", startDate);
  }

  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user analytics:", error);
    return [];
  }

  return data || [];
}

export async function incrementUserUsage(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_usage_count", {
    user_id: userId,
  });

  if (error) {
    console.error("Error incrementing user usage:", error);
    return false;
  }

  return true;
}

// Search and filtering helpers
export async function searchVideoIdeas(
  userId: string,
  searchTerm: string,
  filters?: {
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<VideoIdea[]> {
  const supabase = createClient();

  let query = supabase
    .from("video_ideas")
    .select("*")
    .eq("user_id", userId)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching video ideas:", error);
    return [];
  }

  return data || [];
}

// Statistics queries
export async function getUserStats(userId: string): Promise<{
  totalIdeas: number;
  ideasThisMonth: number;
  avgTrendScore: number;
  avgSeoScore: number;
  topCategories: Array<{ category: string; count: number }>;
}> {
  const supabase = createClient();

  // Get total ideas count
  const { count: totalIdeas } = await supabase
    .from("video_ideas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get ideas this month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { count: ideasThisMonth } = await supabase
    .from("video_ideas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", `${currentMonth}-01`);

  // Get average scores
  const { data: scores } = await supabase
    .from("video_ideas")
    .select("trend_score, seo_score")
    .eq("user_id", userId);

  const avgTrendScore = scores?.length
    ? scores.reduce((sum, item) => sum + item.trend_score, 0) / scores.length
    : 0;

  const avgSeoScore = scores?.length
    ? scores.reduce((sum, item) => sum + item.seo_score, 0) / scores.length
    : 0;

  // Get top categories
  const { data: categories } = await supabase
    .from("video_ideas")
    .select("category")
    .eq("user_id", userId);

  const categoryCount =
    categories?.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  const topCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalIdeas: totalIdeas || 0,
    ideasThisMonth: ideasThisMonth || 0,
    avgTrendScore: Math.round(avgTrendScore),
    avgSeoScore: Math.round(avgSeoScore),
    topCategories,
  };
}
