# MCP Context7 - Snippets de Código Padronizados

## Índice de Snippets
1. [MCP Server Implementation](#mcp-server-implementation)
2. [MCP Client Implementation](#mcp-client-implementation) 
3. [Tools Definition](#tools-definition)
4. [Resources Management](#resources-management)
5. [Error Handling Patterns](#error-handling-patterns)
6. [Authentication & Security](#authentication--security)
7. [Testing Patterns](#testing-patterns)
8. [Configuration Templates](#configuration-templates)

---

## MCP Server Implementation

### TypeScript Server Template
```typescript
/**
 * MCP Server Implementation Template
 * Padrão Context7 para servidores MCP
 */
import { 
  Server, 
  StdioServerTransport,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk';

interface Context7ServerConfig {
  name: string;
  version: string;
  description?: string;
  capabilities?: string[];
}

export class Context7MCPServer {
  private server: Server;
  private config: Context7ServerConfig;

  constructor(config: Context7ServerConfig) {
    this.config = config;
    this.server = new Server({
      name: config.name,
      version: config.version,
    });
    
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: await this.getAvailableTools()
      };
    });

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return await this.executeTool(name, args);
    });

    // Resources handler
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: await this.getAvailableResources()
      };
    });

    // Resource reading handler
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      return await this.readResource(uri);
    });
  }

  private async getAvailableTools() {
    // Implementar lista de tools disponíveis
    return [];
  }

  private async executeTool(name: string, args: any) {
    // Implementar execução de tools
    throw new Error(`Tool ${name} not implemented`);
  }

  private async getAvailableResources() {
    // Implementar lista de recursos disponíveis
    return [];
  }

  private async readResource(uri: string) {
    // Implementar leitura de recursos
    throw new Error(`Resource ${uri} not found`);
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log(`Context7 MCP Server ${this.config.name} started`);
  }
}
```

### Python Server Template
```python
"""
MCP Server Implementation Template - Python
Padrão Context7 para servidores MCP em Python
"""
import asyncio
from typing import Any, Dict, List, Optional
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, Resource, TextContent

class Context7MCPServer:
    """Servidor MCP padrão Context7"""
    
    def __init__(self, name: str, version: str, description: Optional[str] = None):
        self.name = name
        self.version = version
        self.description = description
        self.server = Server(name)
        self._setup_handlers()
    
    def _setup_handlers(self) -> None:
        """Configura os handlers do servidor"""
        
        @self.server.list_tools()
        async def list_tools() -> List[Tool]:
            """Lista as tools disponíveis"""
            return await self._get_available_tools()
        
        @self.server.call_tool()
        async def call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Executa uma tool específica"""
            return await self._execute_tool(name, arguments)
        
        @self.server.list_resources()
        async def list_resources() -> List[Resource]:
            """Lista os recursos disponíveis"""
            return await self._get_available_resources()
        
        @self.server.read_resource()
        async def read_resource(uri: str) -> str:
            """Lê um recurso específico"""
            return await self._read_resource(uri)
    
    async def _get_available_tools(self) -> List[Tool]:
        """Implementar lista de tools disponíveis"""
        return []
    
    async def _execute_tool(self, name: str, arguments: Dict[str, Any]) -> List[TextContent]:
        """Implementar execução de tools"""
        raise NotImplementedError(f"Tool {name} not implemented")
    
    async def _get_available_resources(self) -> List[Resource]:
        """Implementar lista de recursos disponíveis"""
        return []
    
    async def _read_resource(self, uri: str) -> str:
        """Implementar leitura de recursos"""
        raise NotImplementedError(f"Resource {uri} not found")
    
    async def start(self) -> None:
        """Inicia o servidor"""
        async with stdio_server() as streams:
            await self.server.run(
                streams[0], 
                streams[1], 
                self.server.create_initialization_options()
            )
```

---

## MCP Client Implementation

### TypeScript Client Template
```typescript
/**
 * MCP Client Implementation Template
 * Padrão Context7 para clientes MCP
 */
import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio';

interface Context7ClientConfig {
  serverCommand: string;
  serverArgs: string[];
  name: string;
  version: string;
}

export class Context7MCPClient {
  private client: Client;
  private transport: StdioClientTransport;
  private config: Context7ClientConfig;

  constructor(config: Context7ClientConfig) {
    this.config = config;
    this.transport = new StdioClientTransport({
      command: config.serverCommand,
      args: config.serverArgs
    });
    
    this.client = new Client(
      { name: config.name, version: config.version },
      { capabilities: {} }
    );
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect(this.transport);
      console.log(`Context7 MCP Client connected to server`);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw error;
    }
  }

  async listTools(): Promise<any[]> {
    try {
      const response = await this.client.request(
        { method: 'tools/list' },
        {}
      );
      return response.tools || [];
    } catch (error) {
      console.error('Failed to list tools:', error);
      throw error;
    }
  }

  async callTool(name: string, args: any): Promise<any> {
    try {
      const response = await this.client.request(
        { method: 'tools/call' },
        { name, arguments: args }
      );
      return response;
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error);
      throw error;
    }
  }

  async listResources(): Promise<any[]> {
    try {
      const response = await this.client.request(
        { method: 'resources/list' },
        {}
      );
      return response.resources || [];
    } catch (error) {
      console.error('Failed to list resources:', error);
      throw error;
    }
  }

  async readResource(uri: string): Promise<string> {
    try {
      const response = await this.client.request(
        { method: 'resources/read' },
        { uri }
      );
      return response.contents?.[0]?.text || '';
    } catch (error) {
      console.error(`Failed to read resource ${uri}:`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log('Context7 MCP Client disconnected');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }
}
```

---

## Tools Definition

### Tool Definition Template
```typescript
/**
 * Tool Definition Pattern - Context7
 * Padrão para definição de tools MCP
 */
interface Context7Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

// Exemplo: File Operations Tool
export const fileOperationsTool: Context7Tool = {
  name: 'file_operations',
  description: 'Realiza operações seguras em arquivos',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['read', 'write', 'list', 'delete'],
        description: 'Tipo de operação a ser realizada'
      },
      path: {
        type: 'string',
        description: 'Caminho do arquivo ou diretório'
      },
      content: {
        type: 'string',
        description: 'Conteúdo para operações de escrita'
      }
    },
    required: ['operation', 'path']
  }
};

// Exemplo: Web Fetch Tool
export const webFetchTool: Context7Tool = {
  name: 'web_fetch',
  description: 'Busca conteúdo web de forma segura',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        format: 'uri',
        description: 'URL para fazer fetch'
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST'],
        default: 'GET',
        description: 'Método HTTP'
      },
      headers: {
        type: 'object',
        description: 'Headers HTTP adicionais'
      }
    },
    required: ['url']
  }
};

// Tool Execution Handler Pattern
export async function executeContext7Tool(
  toolName: string, 
  args: any
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  
  try {
    // Validação de entrada
    validateToolArgs(toolName, args);
    
    // Execução baseada no nome da tool
    switch (toolName) {
      case 'file_operations':
        return await handleFileOperations(args);
      case 'web_fetch':
        return await handleWebFetch(args);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error executing tool ${toolName}: ${error.message}`
      }]
    };
  }
}
```

---

## Resources Management

### Resource Definition Template
```typescript
/**
 * Resource Management Pattern - Context7
 * Padrão para gerenciamento de recursos MCP
 */
interface Context7Resource {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
}

export class Context7ResourceManager {
  private resources: Map<string, Context7Resource> = new Map();

  registerResource(resource: Context7Resource): void {
    this.resources.set(resource.uri, resource);
  }

  async listResources(): Promise<Context7Resource[]> {
    return Array.from(this.resources.values());
  }

  async readResource(uri: string): Promise<string> {
    const resource = this.resources.get(uri);
    if (!resource) {
      throw new Error(`Resource not found: ${uri}`);
    }

    // Implementar lógica de leitura baseada no tipo de recurso
    switch (resource.mimeType) {
      case 'text/plain':
        return await this.readTextFile(uri);
      case 'application/json':
        return await this.readJsonFile(uri);
      case 'text/markdown':
        return await this.readMarkdownFile(uri);
      default:
        return await this.readGenericFile(uri);
    }
  }

  private async readTextFile(uri: string): Promise<string> {
    // Implementar leitura de arquivo texto
    throw new Error('Text file reading not implemented');
  }

  private async readJsonFile(uri: string): Promise<string> {
    // Implementar leitura de arquivo JSON
    throw new Error('JSON file reading not implemented');
  }

  private async readMarkdownFile(uri: string): Promise<string> {
    // Implementar leitura de arquivo Markdown
    throw new Error('Markdown file reading not implemented');
  }

  private async readGenericFile(uri: string): Promise<string> {
    // Implementar leitura genérica de arquivo
    throw new Error('Generic file reading not implemented');
  }
}

// Exemplo de recursos pré-definidos
export const context7Resources: Context7Resource[] = [
  {
    uri: 'context7://project/readme',
    name: 'Project README',
    description: 'Documentação principal do projeto',
    mimeType: 'text/markdown'
  },
  {
    uri: 'context7://config/settings',
    name: 'Configuration Settings',
    description: 'Configurações do sistema',
    mimeType: 'application/json'
  },
  {
    uri: 'context7://logs/current',
    name: 'Current Logs',
    description: 'Logs atuais do sistema',
    mimeType: 'text/plain'
  }
];
```

---

## Error Handling Patterns

### Error Handling Template
```typescript
/**
 * Error Handling Patterns - Context7
 * Padrões padronizados para tratamento de erros
 */

// Tipos de erro personalizados
export class Context7Error extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'Context7Error';
  }
}

export class Context7ValidationError extends Context7Error {
  constructor(field: string, value: any, expected: string) {
    super(
      `Validation failed for field '${field}': expected ${expected}, got ${value}`,
      'VALIDATION_ERROR',
      { field, value, expected }
    );
    this.name = 'Context7ValidationError';
  }
}

export class Context7ConnectionError extends Context7Error {
  constructor(endpoint: string, originalError: Error) {
    super(
      `Failed to connect to ${endpoint}: ${originalError.message}`,
      'CONNECTION_ERROR',
      { endpoint, originalError }
    );
    this.name = 'Context7ConnectionError';
  }
}

// Error Handler Pattern
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Context7Error) {
      // Re-throw Context7 errors with additional context
      throw new Context7Error(
        `${context}: ${error.message}`,
        error.code,
        { ...error.details, context }
      );
    }
    
    // Wrap unknown errors
    throw new Context7Error(
      `${context}: ${error.message}`,
      'UNKNOWN_ERROR',
      { originalError: error, context }
    );
  }
}

// Retry Pattern with Exponential Backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1),
        maxDelay
      );
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Circuit Breaker Pattern
export class Context7CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Context7Error(
          'Circuit breaker is open',
          'CIRCUIT_OPEN'
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

---

## Authentication & Security

### Security Template
```typescript
/**
 * Authentication & Security Patterns - Context7
 * Padrões de segurança para implementações MCP
 */

// OAuth 2.0/2.1 Configuration
interface Context7AuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scopes: string[];
}

export class Context7AuthProvider {
  constructor(private config: Context7AuthConfig) {}

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Context7Error(
        'Token exchange failed',
        'AUTH_TOKEN_EXCHANGE_FAILED'
      );
    }

    return response.json();
  }
}

// Input Validation & Sanitization
export class Context7Validator {
  static sanitizeUri(uri: string): string {
    // Remove caracteres perigosos
    const sanitized = uri.replace(/[<>:"\\|?*]/g, '');
    
    // Validar protocolo
    if (!sanitized.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
      throw new Context7ValidationError('uri', uri, 'valid URI with protocol');
    }
    
    return sanitized;
  }

  static validateJsonInput(input: any, schema: any): boolean {
    // Implementar validação de schema JSON
    // Usar biblioteca como Ajv ou Zod
    return true; // Placeholder
  }

  static sanitizeHtml(input: string): string {
    // Sanitizar HTML para prevenir XSS
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

// Rate Limiting
export class Context7RateLimiter {
  private requests = new Map<string, number[]>();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000
  ) {}

  isAllowed(clientId: string): boolean {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];
    
    // Remove requests outside the window
    const validRequests = clientRequests.filter(
      time => now - time < this.windowMs
    );
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    return true;
  }
}

// Secure Headers Middleware
export function addSecurityHeaders(response: Response): Response {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  
  return response;
}
```

---

## Testing Patterns

### Testing Template
```typescript
/**
 * Testing Patterns - Context7
 * Padrões padronizados para testes MCP
 */

// Test Utilities
export class Context7TestUtils {
  static createMockServer(config: any = {}): Context7MCPServer {
    return new Context7MCPServer({
      name: 'test-server',
      version: '1.0.0',
      ...config
    });
  }

  static createMockClient(config: any = {}): Context7MCPClient {
    return new Context7MCPClient({
      serverCommand: 'node',
      serverArgs: ['test-server.js'],
      name: 'test-client',
      version: '1.0.0',
      ...config
    });
  }

  static async waitForConnection(client: Context7MCPClient, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, timeout);

      client.connect().then(() => {
        clearTimeout(timer);
        resolve();
      }).catch(reject);
    });
  }
}

// Integration Test Template
describe('Context7 MCP Integration Tests', () => {
  let server: Context7MCPServer;
  let client: Context7MCPClient;

  beforeAll(async () => {
    server = Context7TestUtils.createMockServer();
    client = Context7TestUtils.createMockClient();
    
    // Start server in background
    server.start();
    
    // Wait for connection
    await Context7TestUtils.waitForConnection(client);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  describe('Tools', () => {
    test('should list available tools', async () => {
      const tools = await client.listTools();
      expect(Array.isArray(tools)).toBe(true);
    });

    test('should execute tool successfully', async () => {
      const result = await client.callTool('test_tool', { input: 'test' });
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    });

    test('should handle tool execution errors', async () => {
      await expect(
        client.callTool('nonexistent_tool', {})
      ).rejects.toThrow();
    });
  });

  describe('Resources', () => {
    test('should list available resources', async () => {
      const resources = await client.listResources();
      expect(Array.isArray(resources)).toBe(true);
    });

    test('should read resource successfully', async () => {
      const content = await client.readResource('test://resource');
      expect(typeof content).toBe('string');
    });

    test('should handle missing resources', async () => {
      await expect(
        client.readResource('test://nonexistent')
      ).rejects.toThrow();
    });
  });
});

// Unit Test Template
describe('Context7 Error Handling', () => {
  test('should create Context7Error with correct properties', () => {
    const error = new Context7Error('Test message', 'TEST_CODE', { detail: 'test' });
    
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.details).toEqual({ detail: 'test' });
    expect(error.name).toBe('Context7Error');
  });

  test('should handle retry with exponential backoff', async () => {
    let attempts = 0;
    const operation = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Temporary failure');
      }
      return 'success';
    };

    const result = await withRetry(operation, { maxAttempts: 3 });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  test('should respect circuit breaker pattern', async () => {
    const circuitBreaker = new Context7CircuitBreaker(2, 1000);
    const failingOperation = async () => {
      throw new Error('Always fails');
    };

    // First two failures should work
    await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Always fails');
    await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Always fails');
    
    // Third should be circuit breaker error
    await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Circuit breaker is open');
  });
});

// Performance Test Template
describe('Context7 Performance Tests', () => {
  test('should handle concurrent requests', async () => {
    const client = Context7TestUtils.createMockClient();
    await Context7TestUtils.waitForConnection(client);

    const requests = Array(10).fill(null).map(
      () => client.listTools()
    );

    const results = await Promise.allSettled(requests);
    const successful = results.filter(r => r.status === 'fulfilled');
    
    expect(successful.length).toBe(10);
    
    await client.disconnect();
  });

  test('should complete operations within timeout', async () => {
    const client = Context7TestUtils.createMockClient();
    
    const startTime = Date.now();
    await Context7TestUtils.waitForConnection(client, 1000);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(1000);
    
    await client.disconnect();
  });
});
```

---

## Configuration Templates

### Package.json Template
```json
{
  "name": "context7-mcp-project",
  "version": "1.0.0",
  "description": "MCP Context7 Implementation",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "biome check .",
    "lint:fix": "biome check . --write",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@types/node": "^22.0.0",
    "jest": "^29.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.6.0"
  },
  "keywords": ["mcp", "context7", "ai", "llm"],
  "license": "MIT"
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Biome Configuration
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noUnusedTemplateLiteral": "error",
        "useConst": "error"
      },
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignore": ["dist/**", "node_modules/**"]
  }
}
```

---

## Uso dos Snippets

### Como Usar Este Guia

1. **Copie o template base** mais apropriado para sua implementação
2. **Customize as configurações** conforme suas necessidades específicas
3. **Implemente os métodos abstratos** com sua lógica de negócio
4. **Execute os testes** para validar a implementação
5. **Configure as ferramentas** de linting e formatação

### Convenções de Nomenclatura

- **Classes**: PascalCase (Context7MCPServer)
- **Métodos**: camelCase (executeContext7Tool)
- **Constantes**: UPPER_SNAKE_CASE (CONTEXT7_VERSION)
- **Arquivos**: kebab-case (mcp-server.ts)

### Estrutura de Projeto Recomendada

```
context7-project/
├── src/
│   ├── server/
│   │   ├── index.ts
│   │   ├── tools/
│   │   └── resources/
│   ├── client/
│   │   └── index.ts
│   ├── shared/
│   │   ├── types.ts
│   │   ├── errors.ts
│   │   └── utils.ts
│   └── __tests__/
├── dist/
├── docs/
└── config/
```

Este guia de snippets deve ser usado como referência pelos 3 agentes especializados para manter consistência e qualidade em todas as implementações MCP Context7.