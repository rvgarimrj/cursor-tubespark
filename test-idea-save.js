#!/usr/bin/env node

/**
 * Test idea saving to verify the database operations
 */

const fs = require("fs");
const { createClient } = require('@supabase/supabase-js');

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

console.log("🧪 TESTING IDEA SAVE PROCESS\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testIdeasSave() {
  try {
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
    
    console.log(`Testing with user ID: ${testUserId}\n`);
    
    // Step 1: Check if user exists in database
    console.log("1. Checking if user exists...");
    const { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single();

    if (userFetchError && userFetchError.code === 'PGRST116') {
      console.log("❌ User does not exist in database");
      
      // Try to create user
      console.log("2. Attempting to create user...");
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .upsert({
          id: testUserId,
          email: 'test@example.com',
          name: 'Test User',
          usage_count: 0,
          usage_limit: 10,
          subscription_plan: 'free'
        }, {
          onConflict: 'id'
        })
        .select();

      if (createError) {
        console.error("❌ Error creating user:", createError);
        return;
      } else {
        console.log("✅ User created successfully:", newUser);
      }
    } else if (userFetchError) {
      console.error("❌ Error fetching user:", userFetchError);
      return;
    } else {
      console.log("✅ User exists:", existingUser);
    }

    // Step 2: Test saving an idea
    console.log("\n3. Testing idea save...");
    const testIdea = {
      user_id: testUserId,
      title: 'Test Idea - ' + new Date().toISOString(),
      description: 'This is a test idea to verify the save functionality works',
      category: 'test',
      tags: ['test', 'automation'],
      estimated_views: 10000,
      difficulty_score: 50,
      trend_score: 75,
      thumbnail_ideas: ['Test thumbnail idea'],
      target_audience: 'test audience',
      estimated_duration: '5-10 min',
      status: 'draft'
    };

    const { data: savedIdea, error: saveError } = await supabase
      .from('video_ideas')
      .insert(testIdea)
      .select('*')
      .single();

    if (saveError) {
      console.error("❌ Error saving idea:", saveError);
      return;
    } else {
      console.log("✅ Idea saved successfully:", savedIdea);
    }

    // Step 3: Test fetching saved ideas
    console.log("\n4. Testing idea retrieval...");
    const { data: userIdeas, error: fetchError } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("❌ Error fetching ideas:", fetchError);
      return;
    } else {
      console.log(`✅ Found ${userIdeas.length} ideas for user:`, userIdeas.map(idea => ({ id: idea.id, title: idea.title })));
    }

    // Step 4: Clean up test data
    console.log("\n5. Cleaning up test data...");
    const { error: deleteError } = await supabase
      .from('video_ideas')
      .delete()
      .eq('id', savedIdea.id);

    if (deleteError) {
      console.log("⚠️ Could not clean up test idea:", deleteError.message);
    } else {
      console.log("🧹 Test idea cleaned up successfully");
    }

  } catch (error) {
    console.error("❌ Error during test:", error.message);
  }
}

testIdeasSave();