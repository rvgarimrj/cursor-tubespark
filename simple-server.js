const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>Servidor funcionando!</h1>
        <p>Teste simples em <a href="http://localhost:3000">localhost:3000</a></p>
      </body>
    </html>
  `);
});

server.listen(3000, 'localhost', () => {
  console.log('Servidor rodando em http://localhost:3000');
});