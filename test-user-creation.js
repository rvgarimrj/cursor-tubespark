#!/usr/bin/env node

/**
 * Test user creation without foreign key constraint
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

console.log("🧪 TESTING USER CREATION\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testUserCreation() {
  try {
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
    
    console.log(`Testing user creation for ID: ${testUserId}`);
    
    // Try to create the user using upsert (which should work even with FK constraint)
    const { data: testUser, error: testError } = await supabase
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

    if (testError) {
      console.error("❌ Error creating user:", testError);
      console.log("\n🔧 The foreign key constraint is still preventing user creation.");
      console.log("Please apply the migration manually in your Supabase SQL editor:");
      console.log("\n-- Drop the foreign key constraint");
      console.log("ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;");
    } else {
      console.log("✅ User creation successful!");
      console.log("User created:", testUser);
      
      // Clean up test user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', testUserId);
        
      if (deleteError) {
        console.log("⚠️ Warning: Could not clean up test user:", deleteError.message);
      } else {
        console.log("🧹 Test user cleaned up successfully");
      }
    }

  } catch (error) {
    console.error("❌ Error during test:", error.message);
  }
}

testUserCreation();