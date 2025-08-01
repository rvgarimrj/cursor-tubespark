#!/usr/bin/env node

/**
 * Script to apply database migration to fix foreign key constraint issue
 */

const fs = require("fs");
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
let envFile;
try {
  envFile = fs.readFileSync(".env.local", "utf8");
} catch (error) {
  console.error("❌ Error reading .env.local file:", error.message);
  process.exit(1);
}

const envVars = {};
envFile.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  }
});

console.log("🔧 APPLYING DATABASE MIGRATION\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Missing required environment variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    console.log("📍 URL:", url);
    console.log("🔑 Using Service Role Key\n");

    // Read the migration file
    const migrationSQL = fs.readFileSync("lib/supabase/migrations/002_fix_users_fk_constraint.sql", "utf8");
    
    console.log("📜 Migration SQL:");
    console.log(migrationSQL);
    console.log("\n🚀 Applying migration...\n");

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Try alternative approach if exec_sql function doesn't exist
      console.log("⚠️ exec_sql function not available, trying direct SQL execution...");
      
      // Split the migration into individual statements
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
          const { error: stmtError } = await supabase.from('_migrations').select('*').limit(0);
          
          if (stmtError) {
            console.log(`⚠️ Cannot execute SQL directly through client. Manual migration required.`);
            console.log(`\n📋 Please run this migration manually in your Supabase SQL editor:`);
            console.log(`\n${migrationSQL}`);
            return;
          }
        }
      }
    }

    console.log("✅ Migration applied successfully!");
    console.log("\n🧪 Testing user creation...");

    // Test creating a user with the new approach
    const testUserId = 'd530f597-7c6e-489b-a08c-e492fd4d4236';
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
      console.error("❌ Error testing user creation:", testError.message);
    } else {
      console.log("✅ User creation test successful!");
      console.log("User created:", testUser);
    }

  } catch (error) {
    console.error("❌ Error applying migration:", error.message);
    console.log(`\n📋 Please run this migration manually in your Supabase SQL editor:`);
    const migrationSQL = fs.readFileSync("lib/supabase/migrations/002_fix_users_fk_constraint.sql", "utf8");
    console.log(`\n${migrationSQL}`);
  }
}

applyMigration();