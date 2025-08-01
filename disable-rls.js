#!/usr/bin/env node

/**
 * Disable RLS completely for video_ideas table as last resort
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

console.log("🔧 ATTEMPTING TO DISABLE RLS FOR video_ideas\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log("📍 URL:", url);
console.log("🔑 Using Service Role Key");

console.log("\n📋 Please execute this SQL in your Supabase SQL Editor:");
console.log("\n" + "=".repeat(60));
console.log("-- DISABLE RLS for video_ideas table");
console.log("ALTER TABLE public.video_ideas DISABLE ROW LEVEL SECURITY;");
console.log("=".repeat(60));

console.log("\n🎯 After executing the SQL above:");
console.log("1. Go to your Supabase Dashboard");
console.log("2. Open the SQL Editor");
console.log("3. Paste and run: ALTER TABLE public.video_ideas DISABLE ROW LEVEL SECURITY;");
console.log("4. Refresh your TubeSpark dashboard");

// Test current status
async function testCurrentStatus() {
  const browserClient = createClient(url, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
  
  console.log("\n🧪 Testing current access with browser client...");
  
  const { data, error } = await browserClient
    .from('video_ideas')
    .select('*')
    .eq('user_id', testUserId);

  if (error) {
    console.log("❌ Still blocked:", error.message);
    console.log("🔒 RLS is still preventing access");
  } else {
    console.log(`✅ Access granted! Found ${data.length} ideas`);
    if (data.length > 0) {
      console.log("📝 Ideas found:");
      data.forEach((idea, index) => {
        console.log(`  ${index + 1}. ${idea.title}`);
      });
    }
  }
}

testCurrentStatus().catch(console.error);