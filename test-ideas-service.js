#!/usr/bin/env node

/**
 * Test IdeasService.getUserIdeas method
 */

// Mock the ES modules environment for testing
globalThis.process = { env: {} };

const fs = require("fs");

// Load .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  }
});

// Set environment variables
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

const { createClient } = require('@supabase/supabase-js');

console.log("🧪 TESTING IdeasService.getUserIdeas()\n");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Replicate the mapDatabaseToIdea function from IdeasService
function mapDatabaseToIdea(dbIdea) {
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

async function testGetUserIdeas() {
  try {
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
    
    console.log(`Testing getUserIdeas for user: ${testUserId}\n`);
    
    // Replicate the IdeasService.getUserIdeas method
    const { data, error } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching user ideas:', error);
      return;
    }

    console.log(`✅ Raw database data (${data.length} ideas):`, data);

    // Map the data using the same function as IdeasService
    const mappedIdeas = data.map(mapDatabaseToIdea);
    
    console.log(`\n✅ Mapped ideas (${mappedIdeas.length} ideas):`, mappedIdeas.map(idea => ({
      id: idea.id,
      title: idea.title,
      status: idea.status,
      savedAt: idea.savedAt
    })));

  } catch (error) {
    console.error("❌ Error during test:", error.message, error.stack);
  }
}

testGetUserIdeas();