#!/usr/bin/env node

/**
 * Teste simples das APIs do TubeSpark
 */

const fs = require('fs');

// Carregar .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('🧪 TESTE RÁPIDO DAS APIS - TUBESPARK\n');

// Test 1: Supabase URL
console.log('1. 📊 SUPABASE:');
if (envVars.NEXT_PUBLIC_SUPABASE_URL && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('   ✅ URL e chaves configuradas');
  console.log(`   📍 URL: ${envVars.NEXT_PUBLIC_SUPABASE_URL}`);
} else {
  console.log('   ❌ Configuração incompleta');
}

// Test 2: YouTube API
console.log('\n2. 📺 YOUTUBE API:');
if (envVars.YOUTUBE_API_KEY && envVars.YOUTUBE_CLIENT_ID) {
  console.log('   ✅ Chaves configuradas');
  console.log(`   🔑 API Key: ${envVars.YOUTUBE_API_KEY.substring(0, 20)}...`);
} else {
  console.log('   ❌ Chaves não encontradas');
}

// Test 3: OpenAI
console.log('\n3. 🤖 OPENAI:');
if (envVars.OPENAI_API_KEY) {
  console.log('   ✅ Chave configurada');
  console.log(`   🔑 Key: ${envVars.OPENAI_API_KEY.substring(0, 20)}...`);
} else {
  console.log('   ❌ Chave não encontrada');
}

// Test 4: Anthropic
console.log('\n4. 🧠 ANTHROPIC:');
if (envVars.ANTHROPIC_API_KEY) {
  console.log('   ✅ Chave configurada');
  console.log(`   🔑 Key: ${envVars.ANTHROPIC_API_KEY.substring(0, 20)}...`);
} else {
  console.log('   ❌ Chave não encontrada');
}

// Test 5: Stack Auth
console.log('\n5. 🔐 STACK AUTH:');
if (envVars.STACK_AUTH_PROJECT_ID && envVars.STACK_AUTH_CLIENT_ID) {
  console.log('   ✅ Configuração completa');
  console.log(`   📍 Project ID: ${envVars.STACK_AUTH_PROJECT_ID}`);
} else {
  console.log('   ❌ Configuração incompleta');
}

// Test 6: Stripe
console.log('\n6. 💳 STRIPE:');
if (envVars.STRIPE_PUBLISHABLE_KEY && envVars.STRIPE_SECRET_KEY) {
  console.log('   ✅ Chaves configuradas');
  console.log(`   🔑 Publishable: ${envVars.STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...`);
} else {
  console.log('   ❌ Chaves não encontradas');
}

// Test 7: Webhooks
console.log('\n7. 🔗 WEBHOOKS:');
if (envVars.STRIPE_WEBHOOK_SECRET && envVars.YOUTUBE_WEBHOOK_SECRET) {
  console.log('   ✅ Secrets configurados');
  console.log('   🔐 Stripe e YouTube secrets encontrados');
} else {
  console.log('   ❌ Alguns secrets não configurados');
}

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Execute: npm run dev (se tudo estiver ✅)');
console.log('2. Acesse: http://localhost:3000');
console.log('3. Verifique se não há erros no console\n');

// Verificar se pode rodar
const essentials = [
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  envVars.YOUTUBE_API_KEY,
  envVars.OPENAI_API_KEY || envVars.ANTHROPIC_API_KEY
];

if (essentials.every(Boolean)) {
  console.log('🚀 PRONTO PARA TESTAR! Execute: npm run dev');
} else {
  console.log('⚠️  CONFIGURAÇÃO INCOMPLETA - Verifique as chaves em falta');
}