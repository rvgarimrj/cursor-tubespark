#!/usr/bin/env node

/**
 * Test Supabase client connection from browser environment
 */

// Mock browser environment
global.window = {};
global.document = {};
global.location = { hostname: 'localhost' };

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

const { createBrowserClient } = require('@supabase/ssr');

console.log("🧪 TESTING SUPABASE BROWSER CLIENT\n");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 URL:', url);
console.log('🔑 Anon Key:', anonKey ? `${anonKey.substring(0, 20)}...` : 'NOT SET');

// Create browser client (same as createClient() in lib/supabase/client.ts)
const supabase = createBrowserClient(url, anonKey);

async function testBrowserClient() {
  try {
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
    
    console.log(`\n📡 Testing query for user: ${testUserId}`);
    
    const { data, error } = await supabase
      .from('video_ideas')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Browser client error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a permission/auth issue
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('\n🔒 This might be a Row Level Security (RLS) issue');
        console.log('The browser client uses the anon key which has limited permissions');
        console.log('RLS policies might be blocking access to user data');
      }
      
      return;
    }

    console.log('✅ Browser client query successful!');
    console.log('📊 Found', data?.length || 0, 'ideas');
    
    if (data && data.length > 0) {
      console.log('📝 Ideas:');
      data.forEach((idea, index) => {
        console.log(`  ${index + 1}. ${idea.title}`);
      });
    }

  } catch (error) {
    console.error("❌ Error during test:", error.message);
  }
}

testBrowserClient();