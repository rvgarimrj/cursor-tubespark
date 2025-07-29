#!/usr/bin/env node

/**
 * Teste específico do Supabase
 */

const fs = require("fs");

// Carregar .env.local
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

console.log("🗄️ TESTE DO SUPABASE\n");

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log(`📍 URL: ${url}`);
console.log(`🔑 Anon Key: ${anonKey?.substring(0, 30)}...`);

// Teste simples de conectividade
fetch(`${url}/rest/v1`, {
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  },
})
  .then((response) => {
    if (response.ok) {
      console.log("\n✅ CONEXÃO COM SUPABASE: OK");
      return response.text();
    } else {
      console.log(`\n❌ ERRO NA CONEXÃO: ${response.status}`);
      return response.text();
    }
  })
  .then((data) => {
    console.log(`📊 Resposta: ${data.substring(0, 100)}...`);

    // Testar se as tabelas existem
    return fetch(`${url}/rest/v1/users?select=count`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: "count=exact",
      },
    });
  })
  .then((response) => {
    if (response.ok) {
      console.log("\n✅ TABELA USERS: Existe");
    } else {
      console.log("\n❌ TABELA USERS: Não encontrada ou sem acesso");
      console.log("🔧 Execute a migration do banco de dados");
    }
  })
  .catch((error) => {
    console.log("\n❌ ERRO:", error.message);
    console.log("🔧 Verifique sua conexão com a internet");
  });
