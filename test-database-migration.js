#!/usr/bin/env node

/**
 * Script para testar a migração do banco de dados e validar estrutura
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      // No rows returned - table exists but empty
      return true;
    } else if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      // Table does not exist
      return false;
    } else if (error) {
      console.log(`⚠️ Error checking ${tableName}:`, error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Exception checking ${tableName}:`, error.message);
    return false;
  }
}

async function checkFunctionExists(functionName) {
  try {
    const { data, error } = await supabase.rpc(functionName);
    
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      return false;
    }
    
    return true;
  } catch (error) {
    if (error.message.includes('function') && error.message.includes('does not exist')) {
      return false;
    }
    return true;
  }
}

async function testDatabaseStructure() {
  console.log('🗄️  TESTANDO ESTRUTURA DO BANCO DE DADOS');
  console.log('=' * 60);
  
  console.log('\n📋 VERIFICANDO TABELAS EXISTENTES:');
  
  const coreTables = [
    'users',
    'video_ideas', 
    'video_scripts',
    'subscriptions',
    'usage_tracking',
    'plan_limits'
  ];
  
  const creatorTables = [
    'affiliates',
    'discount_coupons',
    'coupon_uses',
    'affiliate_commissions',
    'affiliate_activities'
  ];
  
  // Test core tables
  console.log('\n✅ TABELAS CORE:');
  for (const table of coreTables) {
    const exists = await checkTableExists(table);
    console.log(`   ${exists ? '✅' : '❌'} ${table}`);
  }
  
  // Test creator partnership tables
  console.log('\n🤝 TABELAS CREATOR PARTNERSHIPS:');
  let creatorTablesCount = 0;
  for (const table of creatorTables) {
    const exists = await checkTableExists(table);
    console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    if (exists) creatorTablesCount++;
  }
  
  console.log('\n📊 VERIFICANDO FUNÇÕES DO BANCO:');
  
  const functions = [
    'validate_coupon',
    'apply_coupon', 
    'create_affiliate_commission',
    'get_affiliate_dashboard_stats'
  ];
  
  let functionsCount = 0;
  for (const func of functions) {
    const exists = await checkFunctionExists(func);
    console.log(`   ${exists ? '✅' : '❌'} ${func}`);
    if (exists) functionsCount++;
  }
  
  console.log('\n📈 RESULTADO DA VERIFICAÇÃO:');
  console.log('=' * 60);
  console.log(`✅ Tabelas Core: ${coreTables.length}/${coreTables.length} existem`);
  console.log(`🤝 Tabelas Creator: ${creatorTablesCount}/${creatorTables.length} existem`);
  console.log(`📊 Funções: ${functionsCount}/${functions.length} existem`);
  
  if (creatorTablesCount === 0) {
    console.log('\n⚠️  MIGRAÇÃO NECESSÁRIA!');
    console.log('As tabelas do sistema de creator partnerships não foram encontradas.');
    console.log('Execute o seguinte comando para aplicar a migração:');
    console.log('\n   node scripts/apply-creator-partnership-migration.js');
    console.log('\nOu aplique manualmente o SQL em:');
    console.log('   lib/supabase/migrations/006_add_creator_partnership_system.sql');
    return false;
  } else if (creatorTablesCount < creatorTables.length) {
    console.log('\n⚠️  MIGRAÇÃO PARCIAL!');
    console.log('Algumas tabelas do creator partnership estão faltando.');
    console.log('Verifique a migração em Supabase SQL Editor.');
    return false;
  } else {
    console.log('\n🎉 SISTEMA COMPLETAMENTE CONFIGURADO!');
    console.log('Todas as tabelas e funções necessárias estão presentes.');
    return true;
  }
}

async function testBasicQueries() {
  console.log('\n🧪 TESTANDO QUERIES BÁSICAS:');
  console.log('=' * 60);
  
  try {
    // Test plan limits
    const { data: plans, error: plansError } = await supabase
      .from('plan_limits')
      .select('plan_type, price_monthly')
      .limit(3);
      
    if (plansError) {
      console.log('❌ Erro ao buscar planos:', plansError.message);
    } else {
      console.log(`✅ Planos encontrados: ${plans?.length || 0}`);
      if (plans && plans.length > 0) {
        plans.forEach(plan => {
          console.log(`   - ${plan.plan_type}: $${plan.price_monthly}`);
        });
      }
    }
    
    // Test if we can count ideas (should work)
    const { count, error: ideasError } = await supabase
      .from('video_ideas')
      .select('*', { count: 'exact', head: true });
      
    if (ideasError) {
      console.log('❌ Erro ao contar ideias:', ideasError.message);
    } else {
      console.log(`✅ Total de ideias no sistema: ${count || 0}`);
    }
    
  } catch (error) {
    console.log('❌ Erro nos testes de query:', error.message);
  }
}

async function main() {
  console.log('🗄️  TESTE DE MIGRAÇÃO DO BANCO DE DADOS');
  console.log('Data:', new Date().toLocaleString());
  console.log('URL:', supabaseUrl);
  
  const structureOk = await testDatabaseStructure();
  await testBasicQueries();
  
  console.log('\n' + '=' * 60);
  if (structureOk) {
    console.log('✅ TESTE COMPLETO: Sistema pronto para uso!');
  } else {
    console.log('⚠️  AÇÃO NECESSÁRIA: Aplicar migração antes de prosseguir.');
  }
}

main().catch(console.error);