#!/usr/bin/env node

/**
 * Teste de conectividade das APIs de autenticação
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

console.log('🔍 TESTE DE CONECTIVIDADE DE AUTENTICAÇÃO - TUBESPARK\n');

// Test Supabase
async function testSupabase() {
  console.log('1. 📊 TESTANDO SUPABASE:');
  
  const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    console.log('   ❌ Variáveis não configuradas');
    return false;
  }
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    
    if (response.ok) {
      console.log('   ✅ Supabase conectado com sucesso');
      return true;
    } else {
      console.log(`   ❌ Erro Supabase: ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

// Test Stack Auth API
async function testStackAuth() {
  console.log('\n2. 🔐 TESTANDO STACK AUTH:');
  
  const baseUrl = envVars.NEXT_PUBLIC_STACK_URL;
  const projectId = envVars.NEXT_PUBLIC_STACK_PROJECT_ID;
  const publishableKey = envVars.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
  
  if (!baseUrl || !projectId || !publishableKey) {
    console.log('   ❌ Variáveis não configuradas');
    console.log(`   📍 Base URL: ${baseUrl || 'NÃO CONFIGURADA'}`);
    console.log(`   📍 Project ID: ${projectId || 'NÃO CONFIGURADA'}`);
    console.log(`   📍 Client Key: ${publishableKey ? 'CONFIGURADA' : 'NÃO CONFIGURADA'}`);
    return false;
  }
  
  try {
    // Tentar acessar a API do Stack Auth
    const response = await fetch(`${baseUrl}/api/v1/projects/${projectId}/config`, {
      headers: {
        'X-Stack-Publishable-Client-Key': publishableKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('   ✅ Stack Auth API conectada');
      return true;
    } else {
      console.log(`   ❌ Erro Stack Auth: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.log(`   📄 Resposta: ${errorText.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

// Test YouTube API
async function testYouTubeAPI() {
  console.log('\n3. 📺 TESTANDO YOUTUBE API:');
  
  const apiKey = envVars.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.log('   ❌ API Key não configurada');
    return false;
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${apiKey}&maxResults=1`
    );
    
    const data = await response.json();
    
    if (response.ok && data.items) {
      console.log('   ✅ YouTube API funcionando');
      console.log(`   📊 Encontrados ${data.items.length} resultados de teste`);
      return true;
    } else {
      console.log(`   ❌ Erro YouTube API: ${data.error?.message || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

// Test OpenAI API
async function testOpenAI() {
  console.log('\n4. 🤖 TESTANDO OPENAI API:');
  
  const apiKey = envVars.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('   ⚠️  API Key não configurada (opcional)');
    return false;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ OpenAI API funcionando');
      console.log(`   📊 ${data.data?.length || 0} modelos disponíveis`);
      return true;
    } else {
      const error = await response.json();
      console.log(`   ❌ Erro OpenAI: ${error.error?.message || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

async function main() {
  const results = [];
  
  results.push(await testSupabase());
  results.push(await testStackAuth());
  results.push(await testYouTubeAPI());
  results.push(await testOpenAI());
  
  const totalTests = results.length;
  const passedTests = results.filter(Boolean).length;
  
  console.log(`\n📈 RESULTADO FINAL: ${passedTests}/${totalTests} APIs funcionando\n`);
  
  if (passedTests >= 2) {
    console.log('✅ Aplicação tem APIs essenciais funcionando');
  } else {
    console.log('⚠️  Muitas APIs com problemas - verificar configurações');
  }
  
  return passedTests >= 2;
}

main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});