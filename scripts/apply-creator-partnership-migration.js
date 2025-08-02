#!/usr/bin/env node

/**
 * Script to apply Creator Partnership System migration (006)
 * Creates complete affiliate/creator partnership system for $0→$50k MRR growth
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

console.log("🚀 APPLYING CREATOR PARTNERSHIP SYSTEM MIGRATION\n");
console.log("📈 Goal: $0 → $50k MRR in 6 months via creator partnerships\n");

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
    const migrationSQL = fs.readFileSync("lib/supabase/migrations/006_add_creator_partnership_system.sql", "utf8");
    
    console.log("📜 Creator Partnership System Migration includes:");
    console.log("  ✅ 6 new tables: affiliates, coupons, coupon_uses, commissions, activities");
    console.log("  ✅ Tier system: Bronze (20%), Silver (25%), Gold (30%)");
    console.log("  ✅ Automated commission engine");
    console.log("  ✅ Coupon validation system");
    console.log("  ✅ Performance tracking");
    console.log("  ✅ ROW Level Security policies");
    console.log("  ✅ Dashboard functions\n");

    console.log("🚀 Applying migration...\n");

    // Since direct SQL execution via client is limited, we'll need to execute manually
    // But let's try to apply smaller chunks if possible
    
    // Split migration into logical sections
    const sections = migrationSQL.split('-- ================================');
    
    console.log("⚠️ This migration contains complex database changes including:");
    console.log("  - Custom ENUM types");
    console.log("  - 6 new tables with relationships");
    console.log("  - Complex functions and triggers");
    console.log("  - RLS policies");
    console.log("\n📋 MANUAL APPLICATION REQUIRED:");
    console.log("Please copy and paste the following SQL into your Supabase SQL Editor:\n");
    
    console.log("=" * 80);
    console.log(migrationSQL);
    console.log("=" * 80);
    
    console.log("\n✨ After applying this migration, you'll have:");
    console.log("  🎯 Complete creator partnership system");
    console.log("  💰 Tier-based commission structure");
    console.log("  🎟️ Intelligent coupon system");
    console.log("  📊 Performance tracking dashboard");
    console.log("  🔒 Secure RLS policies");
    console.log("  ⚡ Automated commission engine");
    
    console.log("\n🔥 Next Steps:");
    console.log("  1. Apply this migration in Supabase SQL Editor");
    console.log("  2. Test creator application API");
    console.log("  3. Implement creator dashboard");
    console.log("  4. Set up Stripe Connect for payments");
    console.log("  5. Launch creator recruitment campaign");

  } catch (error) {
    console.error("❌ Error reading migration:", error.message);
  }
}

applyMigration();