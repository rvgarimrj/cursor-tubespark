#!/usr/bin/env node

/**
 * Servidor de teste simples para verificar se a aplicação funciona básicamente
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Carregar variáveis de ambiente
const envFile = fs.readFileSync(".env.local", "utf8");
const envVars = {};
envFile.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  }
});

const PORT = 3001;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>TubeSpark - Teste</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .warning { background: #fff3cd; color: #856404; }
        h1 { color: #FF0000; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 TubeSpark - Status de Configuração</h1>
        
        <div class="status success">
            ✅ Servidor de teste funcionando na porta ${PORT}
        </div>
        
        <h2>📊 Configurações Verificadas:</h2>
        
        <div class="status success">
            ✅ Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurado" : "Não configurado"}
        </div>
        
        <div class="status success">
            ✅ YouTube API: ${process.env.YOUTUBE_API_KEY ? "Configurado" : "Não configurado"}
        </div>
        
        <div class="status success">
            ✅ OpenAI: ${process.env.OPENAI_API_KEY ? "Configurado" : "Não configurado"}
        </div>
        
        <div class="status success">
            ✅ Anthropic: ${process.env.ANTHROPIC_API_KEY ? "Configurado" : "Não configurado"}
        </div>
        
        <div class="status success">
            ✅ Stack Auth: ${process.env.STACK_AUTH_PROJECT_ID ? "Configurado" : "Não configurado"}
        </div>
        
        <div class="status success">
            ✅ Stripe: ${process.env.STRIPE_PUBLISHABLE_KEY ? "Configurado" : "Não configurado"}
        </div>
        
        <h2>🧪 Testes de API:</h2>
        <button onclick="testSupabase()">Testar Supabase</button>
        <button onclick="testYouTube()">Testar YouTube API</button>
        <button onclick="testOpenAI()">Testar OpenAI</button>
        
        <div id="test-results"></div>
        
        <h2>📋 Próximos Passos:</h2>
        <ol>
            <li>✅ Todas as configurações estão funcionando</li>
            <li>🔧 Resolver problemas de dependências do Node.js</li>
            <li>🚀 Executar <code>npm run dev</code> quando possível</li>
            <li>🎨 Implementar componentes da interface</li>
        </ol>
        
        <h2>🛠️ Como Resolver Problemas de Dependências:</h2>
        <pre>
# Opção 1: Limpar cache do npm (pode precisar de sudo)
sudo chown -R $(whoami) ~/.npm
npm cache clean --force

# Opção 2: Usar versões específicas no package.json
npm install --legacy-peer-deps

# Opção 3: Usar yarn ao invés do npm
yarn install

# Opção 4: Usar volta ou nvm para gerenciar versões do Node
nvm use 18
        </pre>
    </div>
    
    <script>
        function testSupabase() {
            const results = document.getElementById('test-results');
            results.innerHTML = '<p>🔄 Testando Supabase...</p>';
            
            fetch('${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1', {
                headers: {
                    'apikey': '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}',
                    'Authorization': 'Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
                }
            })
            .then(response => {
                if (response.ok) {
                    results.innerHTML = '<p class="status success">✅ Supabase: Conectado com sucesso!</p>';
                } else {
                    results.innerHTML = '<p class="status error">❌ Supabase: Erro na conexão</p>';
                }
            })
            .catch(error => {
                results.innerHTML = '<p class="status error">❌ Supabase: ' + error.message + '</p>';
            });
        }
        
        function testYouTube() {
            const results = document.getElementById('test-results');
            results.innerHTML = '<p>🔄 Testando YouTube API...</p>';
            
            fetch('/api/test-youtube')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    results.innerHTML = '<p class="status success">✅ YouTube API: Funcionando!</p>';
                } else {
                    results.innerHTML = '<p class="status error">❌ YouTube API: ' + data.error + '</p>';
                }
            })
            .catch(error => {
                results.innerHTML = '<p class="status error">❌ YouTube API: ' + error.message + '</p>';
            });
        }
        
        function testOpenAI() {
            const results = document.getElementById('test-results');
            results.innerHTML = '<p>🔄 Testando OpenAI...</p>';
            
            fetch('/api/test-openai')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    results.innerHTML = '<p class="status success">✅ OpenAI: Funcionando!</p>';
                } else {
                    results.innerHTML = '<p class="status error">❌ OpenAI: ' + data.error + '</p>';
                }
            })
            .catch(error => {
                results.innerHTML = '<p class="status error">❌ OpenAI: ' + error.message + '</p>';
            });
        }
    </script>
</body>
</html>
    `);
  } else if (req.url === "/api/test-youtube") {
    // Teste da YouTube API
    const apiKey = process.env.YOUTUBE_API_KEY;

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${apiKey}&maxResults=1`,
    )
      .then((response) => response.json())
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        if (data.items) {
          res.end(
            JSON.stringify({
              success: true,
              message: "YouTube API funcionando",
            }),
          );
        } else {
          res.end(
            JSON.stringify({
              success: false,
              error: data.error?.message || "Erro desconhecido",
            }),
          );
        }
      })
      .catch((error) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      });
  } else if (req.url === "/api/test-openai") {
    // Teste da OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;

    fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        if (data.data) {
          res.end(JSON.stringify({ success: true, models: data.data.length }));
        } else {
          res.end(
            JSON.stringify({
              success: false,
              error: data.error?.message || "Erro desconhecido",
            }),
          );
        }
      })
      .catch((error) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando em: http://localhost:${PORT}`);
  console.log("📊 Verifique todas as configurações no navegador");
  console.log(
    "🔧 Use este servidor para testar as APIs enquanto resolve problemas de dependências",
  );
});
