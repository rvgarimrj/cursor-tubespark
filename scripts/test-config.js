#!/usr/bin/env node

/**
 * Script para testar todas as configurações da aplicação TubeSpark
 */

const https = require('https');
const crypto = require('crypto');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  logInfo('Testando conexão com Supabase...');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    logError('Variáveis do Supabase não encontradas');
    return false;
  }

  try {
    // Test anon key
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    if (response.ok) {
      logSuccess('Conexão com Supabase funcionando');
      return true;
    } else {
      logError(`Erro na conexão Supabase: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao conectar com Supabase: ${error.message}`);
    return false;
  }
}

async function testYouTubeAPI() {
  logInfo('Testando YouTube Data API...');
  
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    logError('YOUTUBE_API_KEY não encontrada');
    return false;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${apiKey}&maxResults=1`
    );

    const data = await response.json();

    if (response.ok && data.items) {
      logSuccess('YouTube Data API funcionando');
      return true;
    } else {
      logError(`Erro na YouTube API: ${data.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao testar YouTube API: ${error.message}`);
    return false;
  }
}

async function testOpenAI() {
  logInfo('Testando OpenAI API...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    logWarning('OPENAI_API_KEY não encontrada (opcional)');
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
      logSuccess('OpenAI API funcionando');
      return true;
    } else {
      const error = await response.json();
      logError(`Erro na OpenAI API: ${error.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao testar OpenAI API: ${error.message}`);
    return false;
  }
}

async function testAnthropic() {
  logInfo('Testando Anthropic API...');
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    logWarning('ANTHROPIC_API_KEY não encontrada (opcional)');
    return false;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    });

    if (response.ok) {
      logSuccess('Anthropic API funcionando');
      return true;
    } else {
      const error = await response.json();
      logError(`Erro na Anthropic API: ${error.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao testar Anthropic API: ${error.message}`);
    return false;
  }
}

async function testGroq() {
  logInfo('Testando Groq API...');
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    logWarning('GROQ_API_KEY não encontrada (opcional)');
    return false;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      logSuccess('Groq API funcionando');
      return true;
    } else {
      const error = await response.json();
      logError(`Erro na Groq API: ${error.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Erro ao testar Groq API: ${error.message}`);
    return false;
  }
}

function testStripe() {
  logInfo('Verificando configuração Stripe...');
  
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let valid = true;
  
  if (!publishableKey || !publishableKey.startsWith('pk_')) {
    logError('STRIPE_PUBLISHABLE_KEY inválida ou não encontrada');
    valid = false;
  }
  
  if (!secretKey || !secretKey.startsWith('sk_')) {
    logError('STRIPE_SECRET_KEY inválida ou não encontrada');
    valid = false;
  }
  
  if (!webhookSecret || !webhookSecret.startsWith('whsec_')) {
    logError('STRIPE_WEBHOOK_SECRET inválida ou não encontrada');
    valid = false;
  }
  
  if (valid) {
    logSuccess('Configuração Stripe válida');
  }
  
  return valid;
}

function testStackAuth() {
  logInfo('Verificando configuração Stack Auth...');
  
  const projectId = process.env.STACK_AUTH_PROJECT_ID;
  const clientId = process.env.STACK_AUTH_CLIENT_ID;
  const clientSecret = process.env.STACK_AUTH_CLIENT_SECRET;
  
  let valid = true;
  
  if (!projectId) {
    logError('STACK_AUTH_PROJECT_ID não encontrada');
    valid = false;
  }
  
  if (!clientId || !clientId.startsWith('pck_')) {
    logError('STACK_AUTH_CLIENT_ID inválida ou não encontrada');
    valid = false;
  }
  
  if (!clientSecret || !clientSecret.startsWith('ssk_')) {
    logError('STACK_AUTH_CLIENT_SECRET inválida ou não encontrada');
    valid = false;
  }
  
  if (valid) {
    logSuccess('Configuração Stack Auth válida');
  }
  
  return valid;
}

function testWebhookSecrets() {
  logInfo('Verificando Webhook Secrets...');
  
  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const youtubeSecret = process.env.YOUTUBE_WEBHOOK_SECRET;
  
  let valid = true;
  
  if (!stripeSecret || !stripeSecret.startsWith('whsec_')) {
    logError('STRIPE_WEBHOOK_SECRET inválida');
    valid = false;
  } else {
    logSuccess('STRIPE_WEBHOOK_SECRET válida');
  }
  
  if (!youtubeSecret || !youtubeSecret.startsWith('yt_webhook_')) {
    logError('YOUTUBE_WEBHOOK_SECRET inválida');
    valid = false;
  } else {
    logSuccess('YOUTUBE_WEBHOOK_SECRET válida');
  }
  
  return valid;
}

async function main() {
  log('\n🧪 TESTE DE CONFIGURAÇÃO - TUBESPARK\n', 'bold');
  
  const results = {
    supabase: await testSupabase(),
    youtube: await testYouTubeAPI(),
    openai: await testOpenAI(),
    anthropic: await testAnthropic(),
    groq: await testGroq(),
    stripe: testStripe(),
    stackAuth: testStackAuth(),
    webhooks: testWebhookSecrets()
  };

  log('\n📊 RESUMO DOS TESTES:\n', 'bold');
  
  Object.entries(results).forEach(([service, passed]) => {
    if (passed) {
      logSuccess(`${service.toUpperCase()}: Funcionando`);
    } else {
      logError(`${service.toUpperCase()}: Com problemas`);
    }
  });

  const totalTests = Object.values(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  log(`\n📈 RESULTADO: ${passedTests}/${totalTests} testes passaram\n`, 'bold');
  
  if (passedTests >= 6) {
    logSuccess('✅ Aplicação pronta para ser testada!');
    logInfo('Execute: npm run dev');
  } else {
    logWarning('⚠️  Algumas configurações precisam ser ajustadas');
  }
}

// Executar testes
main().catch(console.error);