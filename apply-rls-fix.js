#!/usr/bin/env node

/**
 * Apply RLS fix for Stack Auth integration
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

console.log("🔧 APPLYING RLS FIX FOR STACK AUTH\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role key for admin operations
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyRLSFix() {
  try {
    console.log("📍 URL:", url);
    console.log("🔑 Using Service Role Key\n");

    // Read the migration file
    const migrationSQL = fs.readFileSync("lib/supabase/migrations/003_fix_rls_for_stack_auth.sql", "utf8");
    
    console.log("📜 RLS Fix SQL:");
    console.log(migrationSQL);
    console.log("\n🚀 Applying RLS fix...\n");

    // Execute each statement individually
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        
        try {
          // Try using the SQL function if available
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`⚠️ Could not execute via RPC, trying direct method...`);
            // This won't work with DDL statements, but let's try
            const { error: directError } = await supabase.from('_dummy').select('1').limit(0);
            throw new Error('Cannot execute DDL statements via client');
          } else {
            console.log(`✅ Statement executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Error: ${err.message}`);
          console.log(`\n📋 Please run this SQL manually in your Supabase SQL editor:`);
          console.log(`\n${statement}\n`);
        }
      }
    }

    console.log("\n🧪 Testing access after RLS fix...");

    // Test with browser client (anon key)
    const browserClient = createClient(url, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
    
    const { data: testData, error: testError } = await browserClient
      .from('video_ideas')
      .select('*')
      .eq('user_id', testUserId)
      .limit(1);

    if (testError) {
      console.error("❌ Test failed:", testError.message);
      console.log("\n📋 Please run the full migration manually in your Supabase SQL editor:");
      console.log(`\n${migrationSQL}`);
    } else {
      console.log(`✅ Test successful! Found ${testData.length} ideas with browser client`);
    }

  } catch (error) {
    console.error("❌ Error applying RLS fix:", error.message);
    console.log(`\n📋 Please run this migration manually in your Supabase SQL editor:`);
    const migrationSQL = fs.readFileSync("lib/supabase/migrations/003_fix_rls_for_stack_auth.sql", "utf8");
    console.log(`\n${migrationSQL}`);
  }
}

applyRLSFix();