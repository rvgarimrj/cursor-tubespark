# MCP & AI Agent Development Templates Collection

Esta coleção contém snippets de código e templates reutilizáveis para desenvolvimento de projetos MCP (Model Context Protocol) e agentes AI. Todos os exemplos seguem as melhores práticas atuais com typing adequado e tratamento de erros robusto.

## Índice

1. [Templates de Inicialização de Projetos MCP](#1-templates-de-inicialização-de-projetos-mcp)
2. [Snippets de Conexão e Comunicação com Claude via MCP](#2-snippets-de-conexão-e-comunicação-com-claude-via-mcp)
3. [Padrões de Estrutura de Arquivos e Configuração](#3-padrões-de-estrutura-de-arquivos-e-configuração)
4. [Templates de Handlers e Tools Comuns](#4-templates-de-handlers-e-tools-comuns)
5. [Exemplos de Validação e Tratamento de Erros](#5-exemplos-de-validação-e-tratamento-de-erros)
6. [Patterns para Logging e Debugging](#6-patterns-para-logging-e-debugging)
7. [Snippets para Testes Unitários e Integração](#7-snippets-para-testes-unitários-e-integração)

---

## 1. Templates de Inicialização de Projetos MCP

### 1.1 Template Base para Servidor MCP (Python)

```python
#!/usr/bin/env python3
"""
Template base para servidor MCP em Python
Use este template como ponto de partida para novos projetos MCP
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Sequence
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.server import NotificationOptions, Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    CallToolRequest,
    CallToolResult,
    ListToolsRequest,
    ListToolsResult,
    TextContent,
    Tool,
)

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MCPServer:
    """
    Classe base para servidores MCP
    Extenda esta classe para implementar funcionalidades específicas
    """
    
    def __init__(self, name: str = "mcp-server", version: str = "0.1.0"):
        self.name = name
        self.version = version
        self.server = Server(name)
        self._setup_handlers()
    
    def _setup_handlers(self) -> None:
        """Configura os handlers básicos do servidor"""
        self.server.list_tools = self.list_tools
        self.server.call_tool = self.call_tool
    
    async def list_tools(self) -> ListToolsResult:
        """
        Lista todas as ferramentas disponíveis
        Override este método para adicionar suas ferramentas
        """
        return ListToolsResult(
            tools=[
                Tool(
                    name="echo",
                    description="Ecoa a mensagem fornecida",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "message": {
                                "type": "string",
                                "description": "Mensagem para ecoar"
                            }
                        },
                        "required": ["message"]
                    }
                )
            ]
        )
    
    async def call_tool(self, request: CallToolRequest) -> CallToolResult:
        """
        Executa uma ferramenta específica
        Override este método para implementar suas ferramentas
        """
        if request.params.name == "echo":
            message = request.params.arguments.get("message", "")
            return CallToolResult(
                content=[TextContent(type="text", text=f"Echo: {message}")]
            )
        
        raise ValueError(f"Ferramenta desconhecida: {request.params.name}")
    
    async def run(self) -> None:
        """Inicia o servidor MCP"""
        logger.info(f"Iniciando servidor MCP: {self.name} v{self.version}")
        
        async with stdio_server(StdioServerParameters(
            server=self.server,
            initialization_options=InitializationOptions(
                server_name=self.name,
                server_version=self.version,
            )
        )) as (read_stream, write_stream):
            await self.server.run(
                read_stream, 
                write_stream, 
                InitializationOptions(
                    server_name=self.name,
                    server_version=self.version,
                )
            )

# Exemplo de uso
if __name__ == "__main__":
    server = MCPServer("my-mcp-server", "1.0.0")
    asyncio.run(server.run())
```

### 1.2 Template para Cliente MCP (Python)

```python
#!/usr/bin/env python3
"""
Template base para cliente MCP em Python
Use para criar clientes que se conectam a servidores MCP
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MCPClient:
    """
    Cliente MCP reutilizável
    Facilita a conexão e comunicação com servidores MCP
    """
    
    def __init__(self, server_command: List[str]):
        self.server_command = server_command
        self.session: Optional[ClientSession] = None
        self.exit_stack: Optional[AsyncExitStack] = None
    
    async def connect(self) -> None:
        """Estabelece conexão com o servidor MCP"""
        logger.info(f"Conectando ao servidor: {' '.join(self.server_command)}")
        
        self.exit_stack = AsyncExitStack()
        
        # Inicia o processo do servidor
        transport = await self.exit_stack.enter_async_context(
            stdio_client(StdioServerParameters(
                command=self.server_command[0],
                args=self.server_command[1:] if len(self.server_command) > 1 else None,
            ))
        )
        
        # Cria a sessão do cliente
        stdio, write = transport
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(stdio, write)
        )
        
        # Inicializa a sessão
        await self.session.initialize()
        logger.info("Conexão estabelecida com sucesso")
    
    async def disconnect(self) -> None:
        """Fecha a conexão com o servidor"""
        if self.exit_stack:
            await self.exit_stack.aclose()
            self.exit_stack = None
            self.session = None
            logger.info("Conexão encerrada")
    
    async def list_tools(self) -> List[Dict[str, Any]]:
        """Lista todas as ferramentas disponíveis no servidor"""
        if not self.session:
            raise RuntimeError("Cliente não conectado")
        
        result = await self.session.list_tools()
        return [tool.model_dump() for tool in result.tools]
    
    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """Chama uma ferramenta específica no servidor"""
        if not self.session:
            raise RuntimeError("Cliente não conectado")
        
        result = await self.session.call_tool(name, arguments)
        return result.content
    
    async def __aenter__(self):
        await self.connect()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.disconnect()

# Exemplo de uso
async def main():
    server_command = ["python", "my_mcp_server.py"]
    
    async with MCPClient(server_command) as client:
        # Lista ferramentas disponíveis
        tools = await client.list_tools()
        print("Ferramentas disponíveis:", tools)
        
        # Chama uma ferramenta
        result = await client.call_tool("echo", {"message": "Hello, MCP!"})
        print("Resultado:", result)

if __name__ == "__main__":
    asyncio.run(main())
```

### 1.3 Template Package.json para Projetos Node.js

```json
{
  "name": "mcp-project-template",
  "version": "1.0.0",
  "description": "Template para projetos MCP em Node.js",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "mcp-server": "dist/server.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/server.ts",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "type-check": "tsc --noEmit"
  },
  "keywords": [
    "mcp",
    "ai",
    "agent",
    "claude"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "eslint": "^8.54.0",
    "jest": "^29.7.0",
    "tsx": "^4.6.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 2. Snippets de Conexão e Comunicação com Claude via MCP

### 2.1 Configuração Claude Desktop (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "python",
      "args": ["/path/to/your/mcp_server.py"],
      "env": {
        "API_KEY": "your-api-key-here",
        "DEBUG": "true"
      }
    },
    "filesystem-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
      "env": {}
    },
    "git-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/path/to/repo"],
      "env": {}
    }
  },
  "globalShortcuts": {
    "claude": "Cmd+Shift+Space"
  }
}
```

### 2.2 Handler para Comunicação Bidirecional

```python
"""
Handler para comunicação bidirecional com Claude
Permite envio e recebimento de mensagens em tempo real
"""

import asyncio
import json
from typing import Any, Callable, Dict, Optional
from mcp.server import Server
from mcp.server.models import InitializationOptions

class BidirectionalMCPHandler:
    """
    Handler para comunicação bidirecional entre servidor MCP e Claude
    """
    
    def __init__(self, server: Server):
        self.server = server
        self.message_handlers: Dict[str, Callable] = {}
        self.connection_callbacks: List[Callable] = []
    
    def on_message(self, message_type: str):
        """Decorator para registrar handlers de mensagem"""
        def decorator(func: Callable):
            self.message_handlers[message_type] = func
            return func
        return decorator
    
    def on_connection(self, callback: Callable):
        """Registra callback para quando conexão é estabelecida"""
        self.connection_callbacks.append(callback)
    
    async def handle_notification(self, method: str, params: Any) -> None:
        """Processa notificações recebidas"""
        if method in self.message_handlers:
            await self.message_handlers[method](params)
    
    async def send_notification(self, method: str, params: Any) -> None:
        """Envia notificação para Claude"""
        # Implementação depende da versão específica do MCP SDK
        pass
    
    async def initialize_connection(self) -> None:
        """Inicializa a conexão e executa callbacks"""
        for callback in self.connection_callbacks:
            await callback()

# Exemplo de uso
handler = BidirectionalMCPHandler(server)

@handler.on_message("user_input")
async def handle_user_input(params):
    """Processa entrada do usuário"""
    user_message = params.get("message", "")
    # Processar mensagem e responder
    response = f"Processado: {user_message}"
    await handler.send_notification("response", {"message": response})

@handler.on_connection
async def on_connection_established():
    """Executado quando conexão é estabelecida"""
    print("Conexão com Claude estabelecida!")
```

### 2.3 Sistema de Heartbeat e Reconexão

```python
"""
Sistema de heartbeat e reconexão automática para servidores MCP
Garante conexão estável com Claude
"""

import asyncio
import logging
from typing import Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class MCPHeartbeat:
    """
    Sistema de heartbeat para manter conexão ativa com Claude
    """
    
    def __init__(self, interval: int = 30, timeout: int = 10):
        self.interval = interval  # Intervalo entre heartbeats em segundos
        self.timeout = timeout    # Timeout para resposta em segundos
        self.last_heartbeat: Optional[datetime] = None
        self.is_running = False
        self._heartbeat_task: Optional[asyncio.Task] = None
    
    async def start(self, session) -> None:
        """Inicia o sistema de heartbeat"""
        if self.is_running:
            return
        
        self.is_running = True
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop(session))
        logger.info("Sistema de heartbeat iniciado")
    
    async def stop(self) -> None:
        """Para o sistema de heartbeat"""
        self.is_running = False
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass
        logger.info("Sistema de heartbeat parado")
    
    async def _heartbeat_loop(self, session) -> None:
        """Loop principal do heartbeat"""
        while self.is_running:
            try:
                await self._send_heartbeat(session)
                await asyncio.sleep(self.interval)
            except Exception as e:
                logger.error(f"Erro no heartbeat: {e}")
                await asyncio.sleep(5)  # Retry em 5 segundos
    
    async def _send_heartbeat(self, session) -> None:
        """Envia heartbeat para Claude"""
        try:
            # Implementação específica do heartbeat
            start_time = datetime.now()
            
            # Exemplo: ping usando call_tool
            await session.call_tool("ping", {})
            
            self.last_heartbeat = datetime.now()
            response_time = (self.last_heartbeat - start_time).total_seconds()
            
            if response_time > self.timeout:
                logger.warning(f"Heartbeat lento: {response_time}s")
            
        except Exception as e:
            logger.error(f"Falha no heartbeat: {e}")
            raise

class MCPReconnector:
    """
    Sistema de reconexão automática para clientes MCP
    """
    
    def __init__(self, max_retries: int = 5, retry_delay: int = 2):
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.retry_count = 0
    
    async def connect_with_retry(self, connect_func, *args, **kwargs):
        """Conecta com retry automático"""
        while self.retry_count < self.max_retries:
            try:
                return await connect_func(*args, **kwargs)
            except Exception as e:
                self.retry_count += 1
                if self.retry_count >= self.max_retries:
                    logger.error(f"Falha na conexão após {self.max_retries} tentativas")
                    raise
                
                delay = self.retry_delay * (2 ** (self.retry_count - 1))  # Backoff exponencial
                logger.warning(f"Tentativa {self.retry_count} falhou: {e}. Retry em {delay}s")
                await asyncio.sleep(delay)
    
    def reset(self):
        """Reseta contador de retry"""
        self.retry_count = 0
```

---

## 3. Padrões de Estrutura de Arquivos e Configuração

### 3.1 Estrutura de Projeto MCP Padrão

```
mcp-project/
├── src/
│   ├── __init__.py
│   ├── server.py              # Servidor MCP principal
│   ├── client.py              # Cliente MCP (opcional)
│   ├── tools/                 # Ferramentas MCP
│   │   ├── __init__.py
│   │   ├── base.py           # Classe base para ferramentas
│   │   ├── file_tools.py     # Ferramentas de arquivo
│   │   └── api_tools.py      # Ferramentas de API
│   ├── handlers/             # Handlers de evento
│   │   ├── __init__.py
│   │   ├── tool_handler.py
│   │   └── resource_handler.py
│   ├── utils/                # Utilitários
│   │   ├── __init__.py
│   │   ├── validation.py     # Validação de dados
│   │   ├── logging.py        # Configuração de logging
│   │   └── config.py         # Gestão de configuração
│   └── models/               # Modelos de dados
│       ├── __init__.py
│       ├── requests.py       # Modelos de request
│       └── responses.py      # Modelos de response
├── tests/                    # Testes
│   ├── __init__.py
│   ├── test_server.py
│   ├── test_tools.py
│   └── fixtures/             # Fixtures de teste
├── config/                   # Arquivos de configuração
│   ├── development.json
│   ├── production.json
│   └── claude_desktop_config.json
├── docs/                     # Documentação
│   ├── README.md
│   ├── API.md
│   └── examples/
├── requirements.txt          # Dependências Python
├── pyproject.toml           # Configuração do projeto
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore
└── README.md
```

### 3.2 Sistema de Configuração Flexível

```python
"""
Sistema de configuração flexível para projetos MCP
Suporta múltiplos ambientes e fontes de configuração
"""

import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional, Union
import logging

logger = logging.getLogger(__name__)

@dataclass
class MCPConfig:
    """
    Configuração centralizada para servidores MCP
    """
    # Configurações do servidor
    server_name: str = "mcp-server"
    server_version: str = "1.0.0"
    debug: bool = False
    
    # Configurações de logging
    log_level: str = "INFO"
    log_file: Optional[str] = None
    
    # Configurações de ferramentas
    tools_enabled: list = field(default_factory=list)
    tools_config: Dict[str, Any] = field(default_factory=dict)
    
    # Configurações de API
    api_keys: Dict[str, str] = field(default_factory=dict)
    api_endpoints: Dict[str, str] = field(default_factory=dict)
    
    # Configurações de recursos
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: list = field(default_factory=lambda: ['.txt', '.json', '.py'])
    
    @classmethod
    def load_from_file(cls, config_path: Union[str, Path]) -> 'MCPConfig':
        """Carrega configuração de arquivo JSON"""
        config_path = Path(config_path)
        
        if not config_path.exists():
            logger.warning(f"Arquivo de configuração não encontrado: {config_path}")
            return cls()
        
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            return cls(**data)
        except Exception as e:
            logger.error(f"Erro ao carregar configuração: {e}")
            return cls()
    
    @classmethod
    def load_from_env(cls) -> 'MCPConfig':
        """Carrega configuração de variáveis de ambiente"""
        config = cls()
        
        # Mapeamento de variáveis de ambiente
        env_mapping = {
            'MCP_SERVER_NAME': 'server_name',
            'MCP_SERVER_VERSION': 'server_version',
            'MCP_DEBUG': 'debug',
            'MCP_LOG_LEVEL': 'log_level',
            'MCP_LOG_FILE': 'log_file',
            'MCP_MAX_FILE_SIZE': 'max_file_size',
        }
        
        for env_var, attr_name in env_mapping.items():
            value = os.getenv(env_var)
            if value is not None:
                # Conversão de tipos
                if attr_name == 'debug':
                    value = value.lower() in ('true', '1', 'yes')
                elif attr_name == 'max_file_size':
                    value = int(value)
                
                setattr(config, attr_name, value)
        
        # Carrega API keys de variáveis de ambiente
        for key, value in os.environ.items():
            if key.startswith('MCP_API_KEY_'):
                api_name = key[12:].lower()  # Remove 'MCP_API_KEY_'
                config.api_keys[api_name] = value
        
        return config
    
    @classmethod
    def load(cls, config_path: Optional[Union[str, Path]] = None, 
             environment: str = 'development') -> 'MCPConfig':
        """
        Carrega configuração com prioridade:
        1. Variáveis de ambiente
        2. Arquivo de configuração específico do ambiente
        3. Arquivo de configuração padrão
        4. Configuração padrão
        """
        # Configuração base
        config = cls()
        
        # Carrega de arquivo se especificado
        if config_path:
            file_config = cls.load_from_file(config_path)
            config = cls._merge_configs(config, file_config)
        else:
            # Tenta carregar arquivo específico do ambiente
            env_config_path = Path(f"config/{environment}.json")
            if env_config_path.exists():
                file_config = cls.load_from_file(env_config_path)
                config = cls._merge_configs(config, file_config)
        
        # Sobrescreve com variáveis de ambiente
        env_config = cls.load_from_env()
        config = cls._merge_configs(config, env_config)
        
        return config
    
    @staticmethod
    def _merge_configs(base: 'MCPConfig', override: 'MCPConfig') -> 'MCPConfig':
        """Merge duas configurações, dando prioridade ao override"""
        merged_data = {}
        
        for field_name in base.__dataclass_fields__:
            base_value = getattr(base, field_name)
            override_value = getattr(override, field_name)
            
            # Para dicionários, faz merge
            if isinstance(base_value, dict) and isinstance(override_value, dict):
                merged_data[field_name] = {**base_value, **override_value}
            # Para listas, usa override se não estiver vazia
            elif isinstance(base_value, list) and isinstance(override_value, list):
                merged_data[field_name] = override_value if override_value else base_value
            # Para outros tipos, usa override se não for o valor padrão
            else:
                default_value = base.__dataclass_fields__[field_name].default
                if callable(default_value):
                    default_value = default_value()
                
                merged_data[field_name] = override_value if override_value != default_value else base_value
        
        return MCPConfig(**merged_data)
    
    def setup_logging(self) -> None:
        """Configura logging baseado nas configurações"""
        log_level = getattr(logging, self.log_level.upper())
        
        handlers = []
        
        # Handler para console
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        handlers.append(console_handler)
        
        # Handler para arquivo se especificado
        if self.log_file:
            file_handler = logging.FileHandler(self.log_file)
            file_handler.setLevel(log_level)
            handlers.append(file_handler)
        
        # Configuração do formato
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        for handler in handlers:
            handler.setFormatter(formatter)
        
        # Configura o logger root
        logging.basicConfig(
            level=log_level,
            handlers=handlers,
            force=True
        )

# Exemplo de uso
def get_config(environment: str = None) -> MCPConfig:
    """Factory function para obter configuração"""
    if environment is None:
        environment = os.getenv('MCP_ENVIRONMENT', 'development')
    
    config = MCPConfig.load(environment=environment)
    config.setup_logging()
    
    return config
```

---

## 4. Templates de Handlers e Tools Comuns

### 4.1 Classe Base para Ferramentas MCP

```python
"""
Classe base para ferramentas MCP com validação e tratamento de erros
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Type
from dataclasses import dataclass
import logging
from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

class ToolParameter(BaseModel):
    """Modelo para parâmetros de ferramentas"""
    name: str
    type: str
    description: str
    required: bool = True
    default: Any = None
    enum: Optional[List[Any]] = None

@dataclass
class ToolResult:
    """Resultado da execução de uma ferramenta"""
    success: bool
    content: Any
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class BaseMCPTool(ABC):
    """
    Classe base para todas as ferramentas MCP
    Fornece estrutura comum e validação de parâmetros
    """
    
    def __init__(self, name: str, description: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.description = description
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.{self.name}")
    
    @abstractmethod
    def get_parameters(self) -> List[ToolParameter]:
        """Retorna lista de parâmetros aceitos pela ferramenta"""
        pass
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Executa a ferramenta com os parâmetros fornecidos"""
        pass
    
    def get_schema(self) -> Dict[str, Any]:
        """Gera schema JSON para a ferramenta"""
        parameters = self.get_parameters()
        
        properties = {}
        required = []
        
        for param in parameters:
            param_schema = {
                "type": param.type,
                "description": param.description
            }
            
            if param.enum:
                param_schema["enum"] = param.enum
            
            if param.default is not None:
                param_schema["default"] = param.default
            
            properties[param.name] = param_schema
            
            if param.required:
                required.append(param.name)
        
        return {
            "type": "object",
            "properties": properties,
            "required": required
        }
    
    def validate_parameters(self, **kwargs) -> Dict[str, Any]:
        """Valida parâmetros de entrada"""
        parameters = self.get_parameters()
        validated = {}
        errors = []
        
        for param in parameters:
            value = kwargs.get(param.name)
            
            # Verifica se parâmetro obrigatório está presente
            if param.required and value is None:
                errors.append(f"Parâmetro obrigatório '{param.name}' não fornecido")
                continue
            
            # Usa valor padrão se não fornecido
            if value is None and param.default is not None:
                value = param.default
            
            # Valida enum se especificado
            if param.enum and value not in param.enum:
                errors.append(f"Valor '{value}' inválido para '{param.name}'. Valores aceitos: {param.enum}")
                continue
            
            validated[param.name] = value
        
        if errors:
            raise ValueError(f"Erro de validação: {'; '.join(errors)}")
        
        return validated
    
    async def safe_execute(self, **kwargs) -> ToolResult:
        """Executa ferramenta com tratamento de erros"""
        try:
            # Valida parâmetros
            validated_params = self.validate_parameters(**kwargs)
            
            # Log da execução
            self.logger.info(f"Executando ferramenta '{self.name}' com parâmetros: {validated_params}")
            
            # Executa ferramenta
            result = await self.execute(**validated_params)
            
            # Log do resultado
            if result.success:
                self.logger.info(f"Ferramenta '{self.name}' executada com sucesso")
            else:
                self.logger.warning(f"Ferramenta '{self.name}' falhou: {result.error}")
            
            return result
            
        except Exception as e:
            error_msg = f"Erro na execução da ferramenta '{self.name}': {str(e)}"
            self.logger.error(error_msg, exc_info=True)
            
            return ToolResult(
                success=False,
                content=None,
                error=error_msg
            )

# Exemplo de implementação
class FileReadTool(BaseMCPTool):
    """Ferramenta para leitura de arquivos"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(
            name="read_file",
            description="Lê o conteúdo de um arquivo",
            config=config
        )
    
    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="file_path",
                type="string",
                description="Caminho para o arquivo a ser lido",
                required=True
            ),
            ToolParameter(
                name="encoding",
                type="string",
                description="Encoding do arquivo",
                required=False,
                default="utf-8"
            ),
            ToolParameter(
                name="max_size",
                type="integer",
                description="Tamanho máximo em bytes",
                required=False,
                default=1024000  # 1MB
            )
        ]
    
    async def execute(self, file_path: str, encoding: str = "utf-8", max_size: int = 1024000) -> ToolResult:
        """Executa leitura do arquivo"""
        try:
            from pathlib import Path
            
            path = Path(file_path)
            
            # Verifica se arquivo existe
            if not path.exists():
                return ToolResult(
                    success=False,
                    content=None,
                    error=f"Arquivo não encontrado: {file_path}"
                )
            
            # Verifica tamanho
            if path.stat().st_size > max_size:
                return ToolResult(
                    success=False,
                    content=None,
                    error=f"Arquivo muito grande: {path.stat().st_size} bytes (máximo: {max_size})"
                )
            
            # Lê arquivo
            content = path.read_text(encoding=encoding)
            
            return ToolResult(
                success=True,
                content=content,
                metadata={
                    "file_size": path.stat().st_size,
                    "encoding": encoding
                }
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                content=None,
                error=f"Erro ao ler arquivo: {str(e)}"
            )
```

### 4.2 Registry de Ferramentas

```python
"""
Registry para gerenciar ferramentas MCP
Permite registro, descoberta e execução dinâmica de ferramentas
"""

from typing import Dict, List, Type, Optional, Any
import importlib
import inspect
from pathlib import Path

from .base import BaseMCPTool, ToolResult

class ToolRegistry:
    """
    Registry centralizado para ferramentas MCP
    """
    
    def __init__(self):
        self._tools: Dict[str, BaseMCPTool] = {}
        self._tool_classes: Dict[str, Type[BaseMCPTool]] = {}
    
    def register_tool(self, tool: BaseMCPTool) -> None:
        """Registra uma instância de ferramenta"""
        if tool.name in self._tools:
            raise ValueError(f"Ferramenta '{tool.name}' já está registrada")
        
        self._tools[tool.name] = tool
        self._tool_classes[tool.name] = type(tool)
    
    def register_tool_class(self, tool_class: Type[BaseMCPTool], **kwargs) -> None:
        """Registra uma classe de ferramenta e cria instância"""
        tool_instance = tool_class(**kwargs)
        self.register_tool(tool_instance)
    
    def unregister_tool(self, name: str) -> None:
        """Remove ferramenta do registry"""
        self._tools.pop(name, None)
        self._tool_classes.pop(name, None)
    
    def get_tool(self, name: str) -> Optional[BaseMCPTool]:
        """Obtém ferramenta por nome"""
        return self._tools.get(name)
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """Lista todas as ferramentas registradas"""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "schema": tool.get_schema()
            }
            for tool in self._tools.values()
        ]
    
    def get_tool_names(self) -> List[str]:
        """Retorna nomes de todas as ferramentas"""
        return list(self._tools.keys())
    
    async def execute_tool(self, name: str, **kwargs) -> ToolResult:
        """Executa ferramenta por nome"""
        tool = self.get_tool(name)
        if not tool:
            return ToolResult(
                success=False,
                content=None,
                error=f"Ferramenta '{name}' não encontrada"
            )
        
        return await tool.safe_execute(**kwargs)
    
    def auto_discover_tools(self, module_path: str) -> int:
        """
        Descobre e registra automaticamente ferramentas em um módulo
        Retorna número de ferramentas descobertas
        """
        discovered_count = 0
        
        try:
            module = importlib.import_module(module_path)
            
            for name, obj in inspect.getmembers(module):
                if (inspect.isclass(obj) and 
                    issubclass(obj, BaseMCPTool) and 
                    obj != BaseMCPTool):
                    
                    try:
                        # Tenta criar instância com configuração padrão
                        tool_instance = obj()
                        self.register_tool(tool_instance)
                        discovered_count += 1
                    except Exception as e:
                        print(f"Erro ao registrar ferramenta {name}: {e}")
        
        except ImportError as e:
            print(f"Erro ao importar módulo {module_path}: {e}")
        
        return discovered_count
    
    def auto_discover_from_directory(self, directory: Path) -> int:
        """
        Descobre ferramentas em todos os arquivos Python de um diretório
        """
        discovered_count = 0
        
        for py_file in directory.glob("*.py"):
            if py_file.name.startswith("__"):
                continue
            
            module_name = py_file.stem
            try:
                spec = importlib.util.spec_from_file_location(module_name, py_file)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                
                for name, obj in inspect.getmembers(module):
                    if (inspect.isclass(obj) and 
                        issubclass(obj, BaseMCPTool) and 
                        obj != BaseMCPTool):
                        
                        try:
                            tool_instance = obj()
                            self.register_tool(tool_instance)
                            discovered_count += 1
                        except Exception as e:
                            print(f"Erro ao registrar ferramenta {name}: {e}")
            
            except Exception as e:
                print(f"Erro ao processar arquivo {py_file}: {e}")
        
        return discovered_count

# Registry global
tool_registry = ToolRegistry()

# Decorador para registro automático
def mcp_tool(name: str = None, description: str = None, config: Dict[str, Any] = None):
    """
    Decorador para registro automático de ferramentas MCP
    """
    def decorator(cls):
        # Registra a classe quando o módulo é importado
        tool_name = name or cls.__name__.lower().replace('tool', '')
        tool_description = description or cls.__doc__ or f"Ferramenta {tool_name}"
        tool_config = config or {}
        
        try:
            tool_instance = cls(
                name=tool_name,
                description=tool_description,
                config=tool_config
            )
            tool_registry.register_tool(tool_instance)
        except Exception as e:
            print(f"Erro ao registrar ferramenta {cls.__name__}: {e}")
        
        return cls
    
    return decorator

# Exemplo de uso do decorador
@mcp_tool(name="echo", description="Ecoa a mensagem fornecida")
class EchoTool(BaseMCPTool):
    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="message",
                type="string",
                description="Mensagem para ecoar",
                required=True
            )
        ]
    
    async def execute(self, message: str) -> ToolResult:
        return ToolResult(
            success=True,
            content=f"Echo: {message}"
        )
```

---

## 5. Exemplos de Validação e Tratamento de Erros

### 5.1 Sistema de Validação com Pydantic

```python
"""
Sistema robusto de validação usando Pydantic para projetos MCP
"""

from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, validator, ValidationError
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

# Modelos de validação para requests MCP
class MCPRequestBase(BaseModel):
    """Modelo base para requests MCP"""
    method: str = Field(..., description="Método MCP")
    params: Dict[str, Any] = Field(default_factory=dict, description="Parâmetros do request")
    id: Optional[Union[str, int]] = Field(None, description="ID do request")
    
    @validator('method')
    def validate_method(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Método deve ser uma string não vazia")
        return v.strip()

class ToolCallRequest(MCPRequestBase):
    """Validação para chamadas de ferramenta"""
    method: str = Field("tools/call", const=True)
    params: 'ToolCallParams'
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ToolCallParams(BaseModel):
    """Parâmetros para chamada de ferramenta"""
    name: str = Field(..., description="Nome da ferramenta")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Argumentos da ferramenta")
    
    @validator('name')
    def validate_tool_name(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Nome da ferramenta deve ser uma string não vazia")
        # Validar formato do nome (apenas letras, números e underscore)
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError("Nome da ferramenta deve conter apenas letras, números, hífens e underscores")
        return v.strip()

class FileOperationParams(BaseModel):
    """Validação para operações de arquivo"""
    file_path: str = Field(..., description="Caminho do arquivo")
    encoding: str = Field("utf-8", description="Encoding do arquivo")
    max_size: int = Field(10*1024*1024, description="Tamanho máximo em bytes", gt=0, le=100*1024*1024)
    
    @validator('file_path')
    def validate_file_path(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Caminho do arquivo deve ser uma string não vazia")
        
        # Validações básicas de segurança
        forbidden_patterns = ['../', '..\\', '/etc/', '/root/', 'C:\\Windows\\']
        for pattern in forbidden_patterns:
            if pattern in v:
                raise ValueError(f"Caminho contém padrão proibido: {pattern}")
        
        return v.strip()
    
    @validator('encoding')
    def validate_encoding(cls, v):
        import codecs
        try:
            codecs.lookup(v)
        except LookupError:
            raise ValueError(f"Encoding '{v}' não é suportado")
        return v

class APICallParams(BaseModel):
    """Validação para chamadas de API"""
    url: str = Field(..., description="URL da API")
    method: str = Field("GET", description="Método HTTP")
    headers: Dict[str, str] = Field(default_factory=dict, description="Headers HTTP")
    data: Optional[Dict[str, Any]] = Field(None, description="Dados do request")
    timeout: int = Field(30, description="Timeout em segundos", gt=0, le=300)
    
    @validator('url')
    def validate_url(cls, v):
        import re
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(v):
            raise ValueError("URL inválida")
        
        return v
    
    @validator('method')
    def validate_method(cls, v):
        allowed_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
        if v.upper() not in allowed_methods:
            raise ValueError(f"Método HTTP deve ser um de: {allowed_methods}")
        return v.upper()

# Sistema de tratamento de erros
class MCPError(Exception):
    """Classe base para erros MCP"""
    def __init__(self, message: str, code: int = -1, data: Any = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.data = data
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": {
                "code": self.code,
                "message": self.message,
                "data": self.data
            }
        }

class ValidationError(MCPError):
    """Erro de validação"""
    def __init__(self, message: str, validation_errors: List[str] = None):
        super().__init__(message, code=-32602)  # Invalid params
        self.validation_errors = validation_errors or []
        self.data = {"validation_errors": self.validation_errors}

class ToolNotFoundError(MCPError):
    """Ferramenta não encontrada"""
    def __init__(self, tool_name: str):
        super().__init__(f"Ferramenta '{tool_name}' não encontrada", code=-32601)
        self.tool_name = tool_name

class ToolExecutionError(MCPError):
    """Erro na execução de ferramenta"""
    def __init__(self, tool_name: str, error_message: str):
        super().__init__(f"Erro na execução da ferramenta '{tool_name}': {error_message}", code=-32603)
        self.tool_name = tool_name

# Decorador para validação automática
def validate_request(model_class):
    """Decorador para validação automática de requests"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            try:
                # Assume que o primeiro argumento é o request data
                request_data = args[1] if len(args) > 1 else kwargs.get('request')
                
                if request_data:
                    # Valida usando o modelo Pydantic
                    validated_data = model_class.parse_obj(request_data)
                    # Substitui os dados originais pelos validados
                    if len(args) > 1:
                        args = (args[0], validated_data, *args[2:])
                    else:
                        kwargs['request'] = validated_data
                
                return await func(*args, **kwargs)
                
            except ValidationError as e:
                error_details = []
                for error in e.errors():
                    field = '.'.join(str(x) for x in error['loc'])
                    error_details.append(f"{field}: {error['msg']}")
                
                raise ValidationError(
                    "Dados de entrada inválidos",
                    validation_errors=error_details
                )
        
        return wrapper
    return decorator

# Handler de erro global
class ErrorHandler:
    """Handler centralizado para tratamento de erros"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def handle_error(self, error: Exception, context: str = "") -> Dict[str, Any]:
        """Trata erro e retorna resposta padronizada"""
        if isinstance(error, MCPError):
            self.logger.warning(f"MCP Error {context}: {error.message}")
            return error.to_dict()
        
        elif isinstance(error, ValidationError):
            self.logger.warning(f"Validation Error {context}: {error}")
            return ValidationError(str(error)).to_dict()
        
        else:
            # Erro genérico
            error_msg = f"Erro interno do servidor: {str(error)}"
            self.logger.error(f"Unexpected error {context}: {error}", exc_info=True)
            
            return MCPError(error_msg, code=-32603).to_dict()
    
    def log_and_handle(self, error: Exception, context: str = "") -> Dict[str, Any]:
        """Log detalhado do erro e retorna resposta tratada"""
        self.logger.error(
            f"Error in {context}: {type(error).__name__}: {str(error)}",
            exc_info=True,
            extra={
                "error_type": type(error).__name__,
                "context": context,
                "error_details": str(error)
            }
        )
        
        return self.handle_error(error, context)

# Exemplo de uso
@validate_request(ToolCallRequest)
async def handle_tool_call(server, request: ToolCallRequest):
    """Handler com validação automática"""
    try:
        tool_name = request.params.name
        arguments = request.params.arguments
        
        # Execute tool logic here
        result = await execute_tool(tool_name, **arguments)
        
        return {
            "result": result,
            "id": request.id
        }
        
    except Exception as e:
        error_handler = ErrorHandler()
        return error_handler.log_and_handle(e, f"tool_call:{tool_name}")
```

### 5.2 Circuit Breaker Pattern

```python
"""
Implementação do Circuit Breaker pattern para proteger contra falhas em cascade
"""

import asyncio
import time
from enum import Enum
from typing import Any, Callable, Optional, Dict
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Blocking requests
    HALF_OPEN = "half_open"  # Testing if service recovered

@dataclass
class CircuitBreakerConfig:
    """Configuração do Circuit Breaker"""
    failure_threshold: int = 5          # Número de falhas para abrir o circuito
    recovery_timeout: int = 60          # Tempo em segundos para tentar recuperação
    success_threshold: int = 3          # Sucessos consecutivos para fechar circuito
    timeout: int = 30                   # Timeout para operações em segundos

class CircuitBreakerError(Exception):
    """Exceção quando o circuit breaker está aberto"""
    pass

class CircuitBreaker:
    """
    Circuit Breaker para proteger recursos externos
    """
    
    def __init__(self, name: str, config: CircuitBreakerConfig = None):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0
        self.logger = logging.getLogger(f"{__name__}.{name}")
    
    def _can_attempt(self) -> bool:
        """Verifica se pode tentar executar operação"""
        if self.state == CircuitState.CLOSED:
            return True
        
        if self.state == CircuitState.OPEN:
            # Verifica se é hora de tentar recuperação
            if time.time() - self.last_failure_time >= self.config.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
                self.success_count = 0
                self.logger.info(f"Circuit breaker {self.name} mudou para HALF_OPEN")
                return True
            return False
        
        if self.state == CircuitState.HALF_OPEN:
            return True
        
        return False
    
    def _on_success(self):
        """Chamado quando operação é bem-sucedida"""
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.config.success_threshold:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                self.logger.info(f"Circuit breaker {self.name} mudou para CLOSED")
        elif self.state == CircuitState.CLOSED:
            self.failure_count = 0
    
    def _on_failure(self):
        """Chamado quando operação falha"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.state == CircuitState.CLOSED:
            if self.failure_count >= self.config.failure_threshold:
                self.state = CircuitState.OPEN
                self.logger.warning(f"Circuit breaker {self.name} mudou para OPEN após {self.failure_count} falhas")
        elif self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.OPEN
            self.logger.warning(f"Circuit breaker {self.name} voltou para OPEN após falha na recuperação")
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """Executa função protegida pelo circuit breaker"""
        if not self._can_attempt():
            raise CircuitBreakerError(f"Circuit breaker {self.name} está OPEN")
        
        try:
            # Executa com timeout
            result = await asyncio.wait_for(
                func(*args, **kwargs),
                timeout=self.config.timeout
            )
            
            self._on_success()
            return result
            
        except Exception as e:
            self._on_failure()
            raise e
    
    def get_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do circuit breaker"""
        return {
            "name": self.name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "last_failure_time": self.last_failure_time,
            "config": {
                "failure_threshold": self.config.failure_threshold,
                "recovery_timeout": self.config.recovery_timeout,
                "success_threshold": self.config.success_threshold,
                "timeout": self.config.timeout
            }
        }

# Registry de Circuit Breakers
class CircuitBreakerRegistry:
    """Registry para gerenciar múltiplos circuit breakers"""
    
    def __init__(self):
        self._breakers: Dict[str, CircuitBreaker] = {}
    
    def get_or_create(self, name: str, config: CircuitBreakerConfig = None) -> CircuitBreaker:
        """Obtém ou cria um circuit breaker"""
        if name not in self._breakers:
            self._breakers[name] = CircuitBreaker(name, config)
        return self._breakers[name]
    
    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Obtém estatísticas de todos os circuit breakers"""
        return {name: breaker.get_stats() for name, breaker in self._breakers.items()}
    
    def reset_all(self):
        """Reseta todos os circuit breakers"""
        for breaker in self._breakers.values():
            breaker.state = CircuitState.CLOSED
            breaker.failure_count = 0
            breaker.success_count = 0

# Instância global
circuit_breaker_registry = CircuitBreakerRegistry()

# Decorador para circuit breaker
def circuit_breaker(name: str, config: CircuitBreakerConfig = None):
    """Decorador para aplicar circuit breaker a funções"""
    def decorator(func):
        breaker = circuit_breaker_registry.get_or_create(name, config)
        
        async def wrapper(*args, **kwargs):
            return await breaker.call(func, *args, **kwargs)
        
        # Preserva metadados da função original
        wrapper.__name__ = func.__name__
        wrapper.__doc__ = func.__doc__
        wrapper.circuit_breaker = breaker
        
        return wrapper
    
    return decorator

# Exemplo de uso
@circuit_breaker("external_api", CircuitBreakerConfig(failure_threshold=3, recovery_timeout=30))
async def call_external_api(url: str) -> Dict[str, Any]:
    """Função protegida por circuit breaker"""
    import aiohttp
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status >= 400:
                raise Exception(f"API retornou status {response.status}")
            return await response.json()
```

---

## 6. Patterns para Logging e Debugging

### 6.1 Sistema de Logging Estruturado

```python
"""
Sistema de logging estruturado para projetos MCP
Suporta logging JSON, correlação de requests e métricas
"""

import json
import logging
import sys
import time
import uuid
from contextlib import contextmanager
from typing import Any, Dict, Optional, Union
from datetime import datetime
from pathlib import Path
import threading

# Thread-local storage para contexto de request
_context = threading.local()

class StructuredFormatter(logging.Formatter):
    """Formatter para logs estruturados em JSON"""
    
    def format(self, record: logging.LogRecord) -> str:
        # Dados básicos do log
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Adiciona contexto de request se disponível
        if hasattr(_context, 'request_id'):
            log_entry["request_id"] = _context.request_id
        
        if hasattr(_context, 'user_id'):
            log_entry["user_id"] = _context.user_id
        
        if hasattr(_context, 'session_id'):
            log_entry["session_id"] = _context.session_id
        
        # Adiciona campos extras do record
        extra_fields = getattr(record, 'extra_fields', {})
        if extra_fields:
            log_entry.update(extra_fields)
        
        # Adiciona informações de exceção se presente
        if record.exc_info:
            log_entry["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
                "traceback": self.formatException(record.exc_info)
            }
        
        # Adiciona stack trace se disponível
        if hasattr(record, 'stack_info') and record.stack_info:
            log_entry["stack_trace"] = record.stack_info
        
        return json.dumps(log_entry, ensure_ascii=False)

class MCPLogger:
    """
    Logger personalizado para projetos MCP
    Fornece métodos convenientes e contexto estruturado
    """
    
    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(name)
        self._setup_logger()
    
    def _setup_logger(self):
        """Configura o logger com handlers apropriados"""
        level = self.config.get('level', 'INFO')
        self.logger.setLevel(getattr(logging, level.upper()))
        
        # Remove handlers existentes
        for handler in self.logger.handlers[:]:
            self.logger.removeHandler(handler)
        
        # Handler para console
        if self.config.get('console', True):
            console_handler = logging.StreamHandler(sys.stdout)
            
            if self.config.get('structured', True):
                console_handler.setFormatter(StructuredFormatter())
            else:
                console_handler.setFormatter(
                    logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
                )
            
            self.logger.addHandler(console_handler)
        
        # Handler para arquivo
        log_file = self.config.get('file')
        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(StructuredFormatter())
            self.logger.addHandler(file_handler)
        
        # Evita propagação dupla
        self.logger.propagate = False
    
    def _log_with_extra(self, level: str, message: str, **kwargs):
        """Log com campos extras"""
        extra_fields = {k: v for k, v in kwargs.items() if v is not None}
        
        getattr(self.logger, level.lower())(
            message,
            extra={'extra_fields': extra_fields}
        )
    
    def debug(self, message: str, **kwargs):
        """Log debug com campos extras"""
        self._log_with_extra('DEBUG', message, **kwargs)
    
    def info(self, message: str, **kwargs):
        """Log info com campos extras"""
        self._log_with_extra('INFO', message, **kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning com campos extras"""
        self._log_with_extra('WARNING', message, **kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error com campos extras"""
        self._log_with_extra('ERROR', message, **kwargs)
    
    def critical(self, message: str, **kwargs):
        """Log critical com campos extras"""
        self._log_with_extra('CRITICAL', message, **kwargs)
    
    def exception(self, message: str, **kwargs):
        """Log exception com stack trace"""
        extra_fields = {k: v for k, v in kwargs.items() if v is not None}
        
        self.logger.exception(
            message,
            extra={'extra_fields': extra_fields}
        )

@contextmanager
def log_context(request_id: str = None, user_id: str = None, session_id: str = None, **kwargs):
    """Context manager para adicionar contexto aos logs"""
    # Salva contexto anterior
    old_context = getattr(_context, '__dict__', {}).copy()
    
    # Define novo contexto
    if request_id:
        _context.request_id = request_id
    elif not hasattr(_context, 'request_id'):
        _context.request_id = str(uuid.uuid4())
    
    if user_id:
        _context.user_id = user_id
    
    if session_id:
        _context.session_id = session_id
    
    # Adiciona campos extras
    for key, value in kwargs.items():
        setattr(_context, key, value)
    
    try:
        yield
    finally:
        # Restaura contexto anterior
        _context.__dict__.clear()
        _context.__dict__.update(old_context)

class RequestLogger:
    """Logger especializado para requests MCP"""
    
    def __init__(self, logger: MCPLogger):
        self.logger = logger
    
    def log_request_start(self, method: str, params: Dict[str, Any] = None):
        """Log início de request"""
        self.logger.info(
            f"Request iniciado: {method}",
            method=method,
            params=params,
            event_type="request_start"
        )
    
    def log_request_end(self, method: str, duration: float, success: bool = True, error: str = None):
        """Log fim de request"""
        self.logger.info(
            f"Request finalizado: {method}",
            method=method,
            duration_ms=duration * 1000,
            success=success,
            error=error,
            event_type="request_end"
        )
    
    def log_tool_execution(self, tool_name: str, params: Dict[str, Any], duration: float, success: bool, result: Any = None, error: str = None):
        """Log execução de ferramenta"""
        self.logger.info(
            f"Ferramenta executada: {tool_name}",
            tool_name=tool_name,
            params=params,
            duration_ms=duration * 1000,
            success=success,
            result_type=type(result).__name__ if result else None,
            error=error,
            event_type="tool_execution"
        )

@contextmanager
def measure_time():
    """Context manager para medir tempo de execução"""
    start_time = time.time()
    try:
        yield lambda: time.time() - start_time
    finally:
        pass

# Decorador para logging automático de funções
def log_execution(logger: MCPLogger, log_params: bool = True, log_result: bool = False):
    """Decorador para logging automático de execução de funções"""
    def decorator(func):
        async def async_wrapper(*args, **kwargs):
            func_name = f"{func.__module__}.{func.__name__}"
            
            with measure_time() as get_duration:
                try:
                    logger.debug(
                        f"Iniciando execução: {func_name}",
                        function=func_name,
                        args=args if log_params else len(args),
                        kwargs=kwargs if log_params else list(kwargs.keys()),
                        event_type="function_start"
                    )
                    
                    result = await func(*args, **kwargs)
                    
                    logger.debug(
                        f"Execução concluída: {func_name}",
                        function=func_name,
                        duration_ms=get_duration() * 1000,
                        success=True,
                        result=result if log_result else type(result).__name__,
                        event_type="function_end"
                    )
                    
                    return result
                    
                except Exception as e:
                    logger.error(
                        f"Erro na execução: {func_name}",
                        function=func_name,
                        duration_ms=get_duration() * 1000,
                        success=False,
                        error=str(e),
                        error_type=type(e).__name__,
                        event_type="function_error"
                    )
                    raise
        
        def sync_wrapper(*args, **kwargs):
            func_name = f"{func.__module__}.{func.__name__}"
            
            with measure_time() as get_duration:
                try:
                    logger.debug(
                        f"Iniciando execução: {func_name}",
                        function=func_name,
                        args=args if log_params else len(args),
                        kwargs=kwargs if log_params else list(kwargs.keys()),
                        event_type="function_start"
                    )
                    
                    result = func(*args, **kwargs)
                    
                    logger.debug(
                        f"Execução concluída: {func_name}",
                        function=func_name,
                        duration_ms=get_duration() * 1000,
                        success=True,
                        result=result if log_result else type(result).__name__,
                        event_type="function_end"
                    )
                    
                    return result
                    
                except Exception as e:
                    logger.error(
                        f"Erro na execução: {func_name}",
                        function=func_name,
                        duration_ms=get_duration() * 1000,
                        success=False,
                        error=str(e),
                        error_type=type(e).__name__,
                        event_type="function_error"
                    )
                    raise
        
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

# Exemplo de configuração de logging
def setup_logging(config: Dict[str, Any]) -> MCPLogger:
    """Configura sistema de logging para aplicação MCP"""
    return MCPLogger("mcp-server", config)

# Exemplo de uso
if __name__ == "__main__":
    # Configuração de logging
    logging_config = {
        "level": "DEBUG",
        "console": True,
        "structured": True,
        "file": "mcp-server.log"
    }
    
    logger = setup_logging(logging_config)
    request_logger = RequestLogger(logger)
    
    # Exemplo de uso com contexto
    async def example_handler():
        with log_context(request_id="req-123", user_id="user-456"):
            logger.info("Processando request", action="process_request")
            
            with measure_time() as get_duration:
                # Simula processamento
                await asyncio.sleep(0.1)
            
            request_logger.log_request_end("example_method", get_duration(), success=True)
    
    # Exemplo com decorador
    @log_execution(logger, log_params=True, log_result=True)
    async def example_tool(param1: str, param2: int):
        """Ferramenta de exemplo"""
        return f"Resultado: {param1} - {param2}"
```

### 6.2 Sistema de Debugging e Profiling

```python
"""
Sistema de debugging e profiling para projetos MCP
Inclui debug remoto, profiling de performance e ferramentas de diagnóstico
"""

import asyncio
import cProfile
import functools
import inspect
import io
import json
import pstats
import sys
import time
import traceback
import weakref
from contextlib import contextmanager
from typing import Any, Callable, Dict, List, Optional, Set
from dataclasses import dataclass, field
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Métricas de performance"""
    function_name: str
    call_count: int = 0
    total_time: float = 0.0
    min_time: float = float('inf')
    max_time: float = 0.0
    avg_time: float = 0.0
    last_called: Optional[datetime] = None
    errors: int = 0
    
    def add_execution(self, duration: float, success: bool = True):
        """Adiciona nova execução às métricas"""
        self.call_count += 1
        self.total_time += duration
        self.min_time = min(self.min_time, duration)
        self.max_time = max(self.max_time, duration)
        self.avg_time = self.total_time / self.call_count
        self.last_called = datetime.now()
        
        if not success:
            self.errors += 1

class PerformanceProfiler:
    """Profiler de performance para funções MCP"""
    
    def __init__(self):
        self.metrics: Dict[str, PerformanceMetrics] = {}
        self.active_calls: Dict[str, float] = {}
        self.enabled = True
    
    def start_profiling(self, function_name: str) -> str:
        """Inicia profiling de uma função"""
        if not self.enabled:
            return ""
        
        call_id = f"{function_name}_{id(self)}_{time.time()}"
        self.active_calls[call_id] = time.time()
        return call_id
    
    def end_profiling(self, call_id: str, function_name: str, success: bool = True):
        """Finaliza profiling de uma função"""
        if not self.enabled or call_id not in self.active_calls:
            return
        
        duration = time.time() - self.active_calls.pop(call_id)
        
        if function_name not in self.metrics:
            self.metrics[function_name] = PerformanceMetrics(function_name)
        
        self.metrics[function_name].add_execution(duration, success)
    
    def get_metrics(self) -> Dict[str, Dict[str, Any]]:
        """Retorna métricas coletadas"""
        return {
            name: {
                "call_count": metrics.call_count,
                "total_time": metrics.total_time,
                "avg_time": metrics.avg_time,
                "min_time": metrics.min_time if metrics.min_time != float('inf') else 0,
                "max_time": metrics.max_time,
                "error_rate": (metrics.errors / metrics.call_count) if metrics.call_count > 0 else 0,
                "last_called": metrics.last_called.isoformat() if metrics.last_called else None
            }
            for name, metrics in self.metrics.items()
        }
    
    def reset_metrics(self):
        """Reseta todas as métricas"""
        self.metrics.clear()
        self.active_calls.clear()
    
    def get_top_functions(self, by: str = "total_time", limit: int = 10) -> List[Dict[str, Any]]:
        """Retorna top funções por critério especificado"""
        valid_criteria = ["total_time", "avg_time", "call_count", "max_time", "error_rate"]
        if by not in valid_criteria:
            raise ValueError(f"Critério deve ser um de: {valid_criteria}")
        
        metrics_list = []
        for name, metrics in self.metrics.items():
            metric_dict = {
                "name": name,
                "total_time": metrics.total_time,
                "avg_time": metrics.avg_time,
                "call_count": metrics.call_count,
                "max_time": metrics.max_time,
                "error_rate": (metrics.errors / metrics.call_count) if metrics.call_count > 0 else 0
            }
            metrics_list.append(metric_dict)
        
        return sorted(metrics_list, key=lambda x: x[by], reverse=True)[:limit]

# Instância global do profiler
global_profiler = PerformanceProfiler()

def profile(profiler: PerformanceProfiler = None):
    """Decorador para profiling automático de funções"""
    if profiler is None:
        profiler = global_profiler
    
    def decorator(func):
        func_name = f"{func.__module__}.{func.__name__}"
        
        if asyncio.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                call_id = profiler.start_profiling(func_name)
                try:
                    result = await func(*args, **kwargs)
                    profiler.end_profiling(call_id, func_name, True)
                    return result
                except Exception as e:
                    profiler.end_profiling(call_id, func_name, False)
                    raise
            return async_wrapper
        else:
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                call_id = profiler.start_profiling(func_name)
                try:
                    result = func(*args, **kwargs)
                    profiler.end_profiling(call_id, func_name, True)
                    return result
                except Exception as e:
                    profiler.end_profiling(call_id, func_name, False)
                    raise
            return sync_wrapper
    
    return decorator

class MCPDebugger:
    """Sistema de debugging para servidores MCP"""
    
    def __init__(self, enabled: bool = False):
        self.enabled = enabled
        self.breakpoints: Set[str] = set()
        self.watch_variables: Dict[str, Any] = {}
        self.call_stack: List[Dict[str, Any]] = []
        self.debug_session_active = False
    
    def enable(self):
        """Habilita debugging"""
        self.enabled = True
        logger.info("MCP Debugger habilitado")
    
    def disable(self):
        """Desabilita debugging"""
        self.enabled = False
        self.debug_session_active = False
        logger.info("MCP Debugger desabilitado")
    
    def add_breakpoint(self, location: str):
        """Adiciona breakpoint (formato: módulo.função:linha)"""
        if self.enabled:
            self.breakpoints.add(location)
            logger.info(f"Breakpoint adicionado: {location}")
    
    def remove_breakpoint(self, location: str):
        """Remove breakpoint"""
        if location in self.breakpoints:
            self.breakpoints.remove(location)
            logger.info(f"Breakpoint removido: {location}")
    
    def watch_variable(self, name: str, value: Any):
        """Adiciona variável para monitoramento"""
        if self.enabled:
            old_value = self.watch_variables.get(name)
            if old_value != value:
                logger.debug(f"Variável alterada: {name} = {value} (anterior: {old_value})")
                self.watch_variables[name] = value
    
    def trace_call(self, func_name: str, args: tuple, kwargs: dict):
        """Rastreia chamada de função"""
        if not self.enabled:
            return
        
        call_info = {
            "function": func_name,
            "args": args,
            "kwargs": kwargs,
            "timestamp": datetime.now().isoformat(),
            "stack_depth": len(self.call_stack)
        }
        
        self.call_stack.append(call_info)
        logger.debug(f"Função chamada: {func_name} (profundidade: {len(self.call_stack)})")
    
    def trace_return(self, func_name: str, result: Any = None, exception: Exception = None):
        """Rastreia retorno de função"""
        if not self.enabled or not self.call_stack:
            return
        
        call_info = self.call_stack.pop()
        duration = time.time() - time.fromisoformat(call_info["timestamp"]).timestamp()
        
        if exception:
            logger.debug(f"Função {func_name} lançou exceção: {exception} (duração: {duration:.3f}s)")
        else:
            logger.debug(f"Função {func_name} retornou: {type(result).__name__} (duração: {duration:.3f}s)")
    
    def get_call_stack(self) -> List[Dict[str, Any]]:
        """Retorna call stack atual"""
        return self.call_stack.copy()
    
    def dump_state(self) -> Dict[str, Any]:
        """Dump do estado atual do debugger"""
        return {
            "enabled": self.enabled,
            "breakpoints": list(self.breakpoints),
            "watch_variables": self.watch_variables.copy(),
            "call_stack_depth": len(self.call_stack),
            "debug_session_active": self.debug_session_active
        }

# Instância global do debugger
global_debugger = MCPDebugger()

def debug_trace(debugger: MCPDebugger = None):
    """Decorador para tracing automático de funções"""
    if debugger is None:
        debugger = global_debugger
    
    def decorator(func):
        func_name = f"{func.__module__}.{func.__name__}"
        
        if asyncio.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                debugger.trace_call(func_name, args, kwargs)
                try:
                    result = await func(*args, **kwargs)
                    debugger.trace_return(func_name, result)
                    return result
                except Exception as e:
                    debugger.trace_return(func_name, exception=e)
                    raise
            return async_wrapper
        else:
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                debugger.trace_call(func_name, args, kwargs)
                try:
                    result = func(*args, **kwargs)
                    debugger.trace_return(func_name, result)
                    return result
                except Exception as e:
                    debugger.trace_return(func_name, exception=e)
                    raise
            return sync_wrapper
    
    return decorator

@contextmanager
def debug_context(name: str, variables: Dict[str, Any] = None):
    """Context manager para debugging com variáveis"""
    if global_debugger.enabled:
        logger.debug(f"Entrando em contexto de debug: {name}")
        
        if variables:
            for var_name, var_value in variables.items():
                global_debugger.watch_variable(f"{name}.{var_name}", var_value)
    
    try:
        yield
    finally:
        if global_debugger.enabled:
            logger.debug(f"Saindo de contexto de debug: {name}")

class MCPProfiler:
    """Profiler completo usando cProfile para análise detalhada"""
    
    def __init__(self):
        self.profiler = None
        self.stats = None
        self.is_running = False
    
    def start(self):
        """Inicia profiling detalhado"""
        if self.is_running:
            return
        
        self.profiler = cProfile.Profile()
        self.profiler.enable()
        self.is_running = True
        logger.info("Profiling detalhado iniciado")
    
    def stop(self):
        """Para profiling e coleta estatísticas"""
        if not self.is_running:
            return
        
        self.profiler.disable()
        self.stats = pstats.Stats(self.profiler)
        self.is_running = False
        logger.info("Profiling detalhado parado")
    
    def get_stats(self, sort_by: str = 'cumulative', limit: int = 20) -> str:
        """Retorna estatísticas formatadas"""
        if not self.stats:
            return "Nenhuma estatística disponível"
        
        output = io.StringIO()
        stats = self.stats
        stats.sort_stats(sort_by)
        stats.print_stats(limit, file=output)
        
        return output.getvalue()
    
    def save_stats(self, filename: str):
        """Salva estatísticas em arquivo"""
        if self.stats:
            self.stats.dump_stats(filename)
            logger.info(f"Estatísticas salvas em: {filename}")

# Ferramentas de diagnóstico
class DiagnosticTools:
    """Ferramentas de diagnóstico para servidores MCP"""
    
    @staticmethod
    def get_memory_usage() -> Dict[str, Any]:
        """Retorna informações de uso de memória"""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        
        return {
            "rss": memory_info.rss,  # Resident Set Size
            "vms": memory_info.vms,  # Virtual Memory Size
            "percent": process.memory_percent(),
            "available": psutil.virtual_memory().available,
            "total": psutil.virtual_memory().total
        }
    
    @staticmethod
    def get_cpu_usage() -> Dict[str, Any]:
        """Retorna informações de uso de CPU"""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        
        return {
            "percent": process.cpu_percent(interval=1),
            "times": process.cpu_times()._asdict(),
            "system_percent": psutil.cpu_percent(interval=1),
            "core_count": psutil.cpu_count()
        }
    
    @staticmethod
    def get_system_info() -> Dict[str, Any]:
        """Retorna informações do sistema"""
        import platform
        import sys
        
        return {
            "python_version": sys.version,
            "platform": platform.platform(),
            "architecture": platform.architecture(),
            "processor": platform.processor(),
            "hostname": platform.node()
        }
    
    @staticmethod
    def health_check() -> Dict[str, Any]:
        """Executa health check completo"""
        return {
            "timestamp": datetime.now().isoformat(),
            "memory": DiagnosticTools.get_memory_usage(),
            "cpu": DiagnosticTools.get_cpu_usage(),
            "system": DiagnosticTools.get_system_info(),
            "profiler_metrics": global_profiler.get_metrics(),
            "debugger_state": global_debugger.dump_state()
        }

# Exemplo de uso integrado
@profile()
@debug_trace()
async def example_mcp_function(param1: str, param2: int) -> str:
    """Função de exemplo com profiling e debugging"""
    with debug_context("example_function", {"param1": param1, "param2": param2}):
        global_debugger.watch_variable("processing_step", "validation")
        
        # Simula validação
        if not param1:
            raise ValueError("param1 não pode ser vazio")
        
        global_debugger.watch_variable("processing_step", "processing")
        
        # Simula processamento
        await asyncio.sleep(0.1)
        result = f"Processado: {param1} - {param2}"
        
        global_debugger.watch_variable("processing_step", "completed")
        global_debugger.watch_variable("result", result)
        
        return result
```

---

## 7. Snippets para Testes Unitários e Integração

### 7.1 Framework de Testes para MCP

```python
"""
Framework de testes para projetos MCP
Inclui fixtures, mocks e utilitários para testes unitários e de integração
"""

import asyncio
import json
import pytest
import tempfile
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from unittest.mock import AsyncMock, MagicMock, patch
import logging

# Configuração de logging para testes
logging.basicConfig(level=logging.DEBUG)

# Fixtures básicas
@pytest.fixture
def temp_dir():
    """Fixture para diretório temporário"""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)

@pytest.fixture
def sample_config():
    """Fixture com configuração de exemplo"""
    return {
        "server_name": "test-mcp-server",
        "server_version": "1.0.0",
        "debug": True,
        "log_level": "DEBUG",
        "tools_enabled": ["echo", "file_read"],
        "max_file_size": 1024000
    }

@pytest.fixture
def mock_mcp_request():
    """Fixture com request MCP de exemplo"""
    return {
        "jsonrpc": "2.0",
        "id": str(uuid.uuid4()),
        "method": "tools/call",
        "params": {
            "name": "echo",
            "arguments": {"message": "test message"}
        }
    }

@pytest.fixture
async def mcp_server(sample_config):
    """Fixture com servidor MCP configurado"""
    from your_project.server import MCPServer  # Ajuste o import
    
    server = MCPServer(
        name=sample_config["server_name"],
        version=sample_config["server_version"]
    )
    
    yield server
    
    # Cleanup se necessário
    # await server.cleanup()

class MockMCPClient:
    """Mock client para testes de integração"""
    
    def __init__(self):
        self.connected = False
        self.tools = []
        self.call_history = []
    
    async def connect(self):
        """Simula conexão"""
        self.connected = True
    
    async def disconnect(self):
        """Simula desconexão"""
        self.connected = False
    
    async def list_tools(self) -> List[Dict[str, Any]]:
        """Retorna lista mock de ferramentas"""
        return self.tools
    
    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """Simula chamada de ferramenta"""
        call_record = {
            "name": name,
            "arguments": arguments,
            "timestamp": asyncio.get_event_loop().time()
        }
        self.call_history.append(call_record)
        
        # Retorna resposta mock baseada no nome da ferramenta
        if name == "echo":
            return {"content": [{"type": "text", "text": f"Echo: {arguments.get('message', '')}"}]}
        elif name == "error_tool":
            raise Exception("Simulated error")
        else:
            return {"content": [{"type": "text", "text": f"Mock response for {name}"}]}

@pytest.fixture
def mock_client():
    """Fixture com cliente mock"""
    return MockMCPClient()

# Utilitários de teste
class MCPTestHelper:
    """Helper class para testes MCP"""
    
    @staticmethod
    def create_tool_call_request(tool_name: str, arguments: Dict[str, Any] = None, request_id: str = None) -> Dict[str, Any]:
        """Cria request de chamada de ferramenta"""
        return {
            "jsonrpc": "2.0",
            "id": request_id or str(uuid.uuid4()),
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments or {}
            }
        }
    
    @staticmethod
    def create_list_tools_request(request_id: str = None) -> Dict[str, Any]:
        """Cria request para listar ferramentas"""
        return {
            "jsonrpc": "2.0",
            "id": request_id or str(uuid.uuid4()),
            "method": "tools/list"
        }
    
    @staticmethod
    def assert_valid_mcp_response(response: Dict[str, Any], request_id: str = None):
        """Valida estrutura de resposta MCP"""
        assert "jsonrpc" in response
        assert response["jsonrpc"] == "2.0"
        
        if request_id:
            assert response.get("id") == request_id
        
        # Deve ter resultado ou erro, mas não ambos
        has_result = "result" in response
        has_error = "error" in response
        assert has_result != has_error, "Resposta deve ter 'result' ou 'error', mas não ambos"
    
    @staticmethod
    def assert_tool_schema_valid(tool_schema: Dict[str, Any]):
        """Valida schema de ferramenta"""
        required_fields = ["name", "description", "inputSchema"]
        for field in required_fields:
            assert field in tool_schema, f"Campo obrigatório '{field}' ausente no schema"
        
        # Valida inputSchema
        input_schema = tool_schema["inputSchema"]
        assert input_schema.get("type") == "object", "inputSchema deve ser do tipo 'object'"
        assert "properties" in input_schema, "inputSchema deve ter 'properties'"

# Decoradores para testes
def async_test(func):
    """Decorador para testes assíncronos"""
    def wrapper(*args, **kwargs):
        return asyncio.run(func(*args, **kwargs))
    return wrapper

def timeout_test(seconds: int = 5):
    """Decorador para timeout em testes"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            return await asyncio.wait_for(func(*args, **kwargs), timeout=seconds)
        return wrapper
    return decorator

# Mocks comuns
class MockToolRegistry:
    """Mock do registry de ferramentas"""
    
    def __init__(self):
        self.tools = {}
        self.execution_history = []
    
    def register_mock_tool(self, name: str, response: Any = None, error: Exception = None):
        """Registra ferramenta mock"""
        self.tools[name] = {
            "response": response,
            "error": error
        }
    
    async def execute_tool(self, name: str, **kwargs):
        """Executa ferramenta mock"""
        self.execution_history.append({"name": name, "kwargs": kwargs})
        
        if name not in self.tools:
            raise ValueError(f"Ferramenta '{name}' não encontrada")
        
        tool_config = self.tools[name]
        if tool_config["error"]:
            raise tool_config["error"]
        
        return tool_config["response"]
    
    def list_tools(self):
        """Lista ferramentas mock"""
        return [
            {
                "name": name,
                "description": f"Mock tool {name}",
                "inputSchema": {"type": "object", "properties": {}}
            }
            for name in self.tools.keys()
        ]

# Classes de teste base
class BaseMCPTest:
    """Classe base para testes MCP"""
    
    def setup_method(self):
        """Setup executado antes de cada teste"""
        self.helper = MCPTestHelper()
    
    def teardown_method(self):
        """Cleanup executado após cada teste"""
        pass
    
    async def assert_tool_execution_success(self, tool_name: str, arguments: Dict[str, Any], expected_result: Any = None):
        """Assertiva para execução bem-sucedida de ferramenta"""
        # Override este método nas subclasses
        pass

class MCPServerTest(BaseMCPTest):
    """Classe base para testes de servidor MCP"""
    
    def setup_method(self):
        super().setup_method()
        self.server = None
        self.mock_registry = MockToolRegistry()
    
    async def setup_server(self, config: Dict[str, Any] = None):
        """Configura servidor para teste"""
        # Override este método nas subclasses
        pass

# Exemplos de testes
class TestMCPTools:
    """Testes para ferramentas MCP"""
    
    @pytest.mark.asyncio
    async def test_echo_tool(self):
        """Testa ferramenta echo"""
        from your_project.tools import EchoTool  # Ajuste o import
        
        tool = EchoTool()
        result = await tool.safe_execute(message="Hello, World!")
        
        assert result.success is True
        assert "Hello, World!" in result.content
    
    @pytest.mark.asyncio
    async def test_echo_tool_validation_error(self):
        """Testa validação de parâmetros"""
        from your_project.tools import EchoTool  # Ajuste o import
        
        tool = EchoTool()
        result = await tool.safe_execute()  # Sem parâmetros obrigatórios
        
        assert result.success is False
        assert "obrigatório" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_file_read_tool(self, temp_dir):
        """Testa ferramenta de leitura de arquivo"""
        from your_project.tools import FileReadTool  # Ajuste o import
        
        # Cria arquivo temporário
        test_file = temp_dir / "test.txt"
        test_content = "Conteúdo de teste"
        test_file.write_text(test_content)
        
        tool = FileReadTool()
        result = await tool.safe_execute(file_path=str(test_file))
        
        assert result.success is True
        assert result.content == test_content
    
    @pytest.mark.asyncio
    async def test_file_read_tool_not_found(self):
        """Testa leitura de arquivo inexistente"""
        from your_project.tools import FileReadTool  # Ajuste o import
        
        tool = FileReadTool()
        result = await tool.safe_execute(file_path="/arquivo/inexistente.txt")
        
        assert result.success is False
        assert "não encontrado" in result.error.lower()

class TestMCPServer:
    """Testes para servidor MCP"""
    
    @pytest.mark.asyncio
    async def test_server_initialization(self, sample_config):
        """Testa inicialização do servidor"""
        from your_project.server import MCPServer  # Ajuste o import
        
        server = MCPServer(
            name=sample_config["server_name"],
            version=sample_config["server_version"]
        )
        
        assert server.name == sample_config["server_name"]
        assert server.version == sample_config["server_version"]
    
    @pytest.mark.asyncio
    async def test_list_tools(self, mcp_server):
        """Testa listagem de ferramentas"""
        result = await mcp_server.list_tools()
        
        assert hasattr(result, 'tools')
        assert len(result.tools) > 0
        
        # Valida schema das ferramentas
        for tool in result.tools:
            MCPTestHelper.assert_tool_schema_valid(tool.dict())
    
    @pytest.mark.asyncio
    async def test_tool_call_success(self, mcp_server):
        """Testa chamada bem-sucedida de ferramenta"""
        request = MCPTestHelper.create_tool_call_request(
            "echo",
            {"message": "test"}
        )
        
        # Simula processamento do request
        # Este exemplo assume uma interface específica - ajuste conforme necessário
        result = await mcp_server.call_tool(request)
        
        assert result is not None
        # Adicione mais assertivas baseadas na estrutura real da resposta

class TestMCPIntegration:
    """Testes de integração MCP"""
    
    @pytest.mark.asyncio
    async def test_client_server_communication(self, mock_client):
        """Testa comunicação cliente-servidor"""
        # Configura cliente mock
        mock_client.tools = [
            {
                "name": "echo",
                "description": "Echo tool",
                "inputSchema": {"type": "object", "properties": {"message": {"type": "string"}}}
            }
        ]
        
        await mock_client.connect()
        assert mock_client.connected is True
        
        # Lista ferramentas
        tools = await mock_client.list_tools()
        assert len(tools) == 1
        assert tools[0]["name"] == "echo"
        
        # Chama ferramenta
        result = await mock_client.call_tool("echo", {"message": "test"})
        assert result is not None
        
        # Verifica histórico
        assert len(mock_client.call_history) == 1
        assert mock_client.call_history[0]["name"] == "echo"

# Parametrized tests
@pytest.mark.parametrize("tool_name,arguments,expected_success", [
    ("echo", {"message": "test"}, True),
    ("echo", {}, False),  # Parâmetro obrigatório ausente
    ("nonexistent", {"param": "value"}, False),  # Ferramenta inexistente
])
@pytest.mark.asyncio
async def test_tool_execution_scenarios(tool_name, arguments, expected_success, mock_client):
    """Testa diferentes cenários de execução de ferramentas"""
    mock_client.tools = [{"name": "echo", "description": "Echo", "inputSchema": {}}]
    
    try:
        result = await mock_client.call_tool(tool_name, arguments)
        success = True
    except Exception:
        success = False
    
    assert success == expected_success

# Benchmarks
@pytest.mark.benchmark
@pytest.mark.asyncio
async def test_tool_performance(benchmark):
    """Benchmark de performance de ferramentas"""
    from your_project.tools import EchoTool  # Ajuste o import
    
    tool = EchoTool()
    
    async def run_tool():
        return await tool.safe_execute(message="benchmark test")
    
    result = await benchmark(run_tool)
    assert result.success is True

# Fixtures para dados de teste
@pytest.fixture
def sample_json_data():
    """Fixture com dados JSON de exemplo"""
    return {
        "users": [
            {"id": 1, "name": "Alice", "email": "alice@example.com"},
            {"id": 2, "name": "Bob", "email": "bob@example.com"}
        ],
        "settings": {
            "theme": "dark",
            "notifications": True
        }
    }

@pytest.fixture
def mock_api_responses():
    """Fixture com respostas mock de API"""
    return {
        "success": {
            "status_code": 200,
            "data": {"message": "Success"}
        },
        "error": {
            "status_code": 500,
            "data": {"error": "Internal Server Error"}
        },
        "not_found": {
            "status_code": 404,
            "data": {"error": "Not Found"}
        }
    }

# Context managers para testes
@pytest.fixture
def mock_file_system(temp_dir):
    """Mock do sistema de arquivos"""
    class MockFileSystem:
        def __init__(self, base_dir):
            self.base_dir = Path(base_dir)
        
        def create_file(self, path: str, content: str):
            file_path = self.base_dir / path
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(content)
            return file_path
        
        def create_dir(self, path: str):
            dir_path = self.base_dir / path
            dir_path.mkdir(parents=True, exist_ok=True)
            return dir_path
    
    return MockFileSystem(temp_dir)

# Utilitário para testes de erro
@pytest.fixture
def error_scenarios():
    """Cenários de erro para testes"""
    return {
        "validation_error": ValueError("Parâmetro inválido"),
        "permission_error": PermissionError("Acesso negado"),
        "timeout_error": asyncio.TimeoutError("Operação expirou"),
        "connection_error": ConnectionError("Falha na conexão")
    }
```

### 7.2 Testes de Carga e Performance

```python
"""
Testes de carga e performance para servidores MCP
Inclui stress testing, load testing e profiling de performance
"""

import asyncio
import concurrent.futures
import random
import statistics
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional
import pytest
import aiohttp
import psutil
import logging

logger = logging.getLogger(__name__)

@dataclass
class LoadTestResult:
    """Resultado de teste de carga"""
    total_requests: int
    successful_requests: int
    failed_requests: int
    total_time: float
    requests_per_second: float
    avg_response_time: float
    min_response_time: float
    max_response_time: float
    percentiles: Dict[int, float] = field(default_factory=dict)
    error_details: List[str] = field(default_factory=list)

@dataclass
class PerformanceMetrics:
    """Métricas de performance"""
    cpu_usage: List[float] = field(default_factory=list)
    memory_usage: List[float] = field(default_factory=list)
    response_times: List[float] = field(default_factory=list)
    error_rate: float = 0.0
    throughput: float = 0.0

class LoadTestRunner:
    """Runner para testes de carga"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def setup(self):
        """Configura o runner"""
        self.session = aiohttp.ClientSession()
    
    async def cleanup(self):
        """Limpa recursos"""
        if self.session:
            await self.session.close()
    
    async def single_request(self, endpoint: str, method: str = "POST", data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Executa uma única requisição"""
        url = f"{self.base_url}{endpoint}" if self.base_url else endpoint
        
        start_time = time.time()
        try:
            async with self.session.request(method, url, json=data) as response:
                response_data = await response.json()
                return {
                    "success": True,
                    "status_code": response.status,
                    "response_time": time.time() - start_time,
                    "data": response_data
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    async def load_test(
        self,
        endpoint: str,
        num_requests: int,
        concurrent_requests: int,
        test_data_generator: Callable = None,
        method: str = "POST"
    ) -> LoadTestResult:
        """Executa teste de carga"""
        
        if test_data_generator is None:
            test_data_generator = self._default_test_data_generator
        
        start_time = time.time()
        results = []
        
        # Divide as requisições em batches concorrentes
        semaphore = asyncio.Semaphore(concurrent_requests)
        
        async def make_request():
            async with semaphore:
                test_data = test_data_generator()
                return await self.single_request(endpoint, method, test_data)
        
        # Executa todas as requisições
        tasks = [make_request() for _ in range(num_requests)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        total_time = time.time() - start_time
        
        # Processa resultados
        successful_requests = 0
        failed_requests = 0
        response_times = []
        error_details = []
        
        for result in results:
            if isinstance(result, Exception):
                failed_requests += 1
                error_details.append(str(result))
            elif result.get("success", False):
                successful_requests += 1
                response_times.append(result["response_time"])
            else:
                failed_requests += 1
                error_details.append(result.get("error", "Unknown error"))
        
        # Calcula estatísticas
        if response_times:
            avg_response_time = statistics.mean(response_times)
            min_response_time = min(response_times)
            max_response_time = max(response_times)
            
            # Calcula percentis
            percentiles = {}
            for p in [50, 90, 95, 99]:
                percentiles[p] = statistics.quantiles(response_times, n=100)[p-1] if len(response_times) > 1 else response_times[0]
        else:
            avg_response_time = min_response_time = max_response_time = 0.0
            percentiles = {}
        
        return LoadTestResult(
            total_requests=num_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            total_time=total_time,
            requests_per_second=num_requests / total_time if total_time > 0 else 0,
            avg_response_time=avg_response_time,
            min_response_time=min_response_time,
            max_response_time=max_response_time,
            percentiles=percentiles,
            error_details=error_details[:10]  # Limita a 10 erros
        )
    
    def _default_test_data_generator(self) -> Dict[str, Any]:
        """Gerador padrão de dados de teste"""
        return {
            "jsonrpc": "2.0",
            "id": random.randint(1, 1000000),
            "method": "tools/call",
            "params": {
                "name": "echo",
                "arguments": {
                    "message": f"test_message_{random.randint(1, 1000)}"
                }
            }
        }

class PerformanceMonitor:
    """Monitor de performance do sistema"""
    
    def __init__(self, interval: float = 1.0):
        self.interval = interval
        self.monitoring = False
        self.metrics = PerformanceMetrics()
    
    async def start_monitoring(self):
        """Inicia monitoramento"""
        self.monitoring = True
        asyncio.create_task(self._monitor_loop())
    
    def stop_monitoring(self):
        """Para monitoramento"""
        self.monitoring = False
    
    async def _monitor_loop(self):
        """Loop de monitoramento"""
        process = psutil.Process()
        
        while self.monitoring:
            try:
                # CPU usage
                cpu_percent = process.cpu_percent()
                self.metrics.cpu_usage.append(cpu_percent)
                
                # Memory usage
                memory_info = process.memory_info()
                memory_percent = process.memory_percent()
                self.metrics.memory_usage.append(memory_percent)
                
                await asyncio.sleep(self.interval)
                
            except Exception as e:
                logger.error(f"Erro no monitoramento: {e}")
                break
    
    def get_summary(self) -> Dict[str, Any]:
        """Retorna resumo das métricas"""
        return {
            "cpu": {
                "avg": statistics.mean(self.metrics.cpu_usage) if self.metrics.cpu_usage else 0,
                "max": max(self.metrics.cpu_usage) if self.metrics.cpu_usage else 0,
                "min": min(self.metrics.cpu_usage) if self.metrics.cpu_usage else 0
            },
            "memory": {
                "avg": statistics.mean(self.metrics.memory_usage) if self.metrics.memory_usage else 0,
                "max": max(self.metrics.memory_usage) if self.metrics.memory_usage else 0,
                "min": min(self.metrics.memory_usage) if self.metrics.memory_usage else 0
            },
            "samples": len(self.metrics.cpu_usage)
        }

# Fixtures para testes de performance
@pytest.fixture
async def load_test_runner():
    """Fixture para runner de teste de carga"""
    runner = LoadTestRunner("http://localhost:8000")
    await runner.setup()
    yield runner
    await runner.cleanup()

@pytest.fixture
def performance_monitor():
    """Fixture para monitor de performance"""
    monitor = PerformanceMonitor()
    yield monitor
    monitor.stop_monitoring()

# Testes de carga
class TestMCPLoadTesting:
    """Testes de carga para MCP"""
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_light_load(self, load_test_runner):
        """Teste de carga leve"""
        result = await load_test_runner.load_test(
            endpoint="/mcp",
            num_requests=50,
            concurrent_requests=5
        )
        
        # Assertivas básicas
        assert result.successful_requests > 0
        assert result.requests_per_second > 0
        assert result.avg_response_time < 1.0  # Menos de 1 segundo em média
        
        # Log dos resultados
        logger.info(f"Light load test: {result.successful_requests}/{result.total_requests} successful")
        logger.info(f"RPS: {result.requests_per_second:.2f}")
        logger.info(f"Avg response time: {result.avg_response_time:.3f}s")
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_medium_load(self, load_test_runner):
        """Teste de carga média"""
        result = await load_test_runner.load_test(
            endpoint="/mcp",
            num_requests=200,
            concurrent_requests=20
        )
        
        # Assertivas
        assert result.successful_requests > result.total_requests * 0.95  # 95% de sucesso
        assert result.requests_per_second > 10  # Pelo menos 10 RPS
        assert result.avg_response_time < 2.0  # Menos de 2 segundos em média
        
        logger.info(f"Medium load test: {result.successful_requests}/{result.total_requests} successful")
        logger.info(f"RPS: {result.requests_per_second:.2f}")
        logger.info(f"P95 response time: {result.percentiles.get(95, 0):.3f}s")
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_heavy_load_with_monitoring(self, load_test_runner, performance_monitor):
        """Teste de carga pesada com monitoramento"""
        # Inicia monitoramento
        await performance_monitor.start_monitoring()
        
        try:
            result = await load_test_runner.load_test(
                endpoint="/mcp",
                num_requests=500,
                concurrent_requests=50
            )
            
            # Para monitoramento
            performance_monitor.stop_monitoring()
            monitoring_summary = performance_monitor.get_summary()
            
            # Assertivas de carga
            assert result.successful_requests > result.total_requests * 0.9  # 90% de sucesso
            
            # Assertivas de performance do sistema
            assert monitoring_summary["cpu"]["avg"] < 80  # CPU média abaixo de 80%
            assert monitoring_summary["memory"]["avg"] < 80  # Memória média abaixo de 80%
            
            logger.info(f"Heavy load test: {result.successful_requests}/{result.total_requests} successful")
            logger.info(f"System CPU avg: {monitoring_summary['cpu']['avg']:.1f}%")
            logger.info(f"System Memory avg: {monitoring_summary['memory']['avg']:.1f}%")
            
        finally:
            performance_monitor.stop_monitoring()
    
    @pytest.mark.asyncio
    async def test_stress_test_gradual_increase(self, load_test_runner):
        """Teste de stress com aumento gradual de carga"""
        results = []
        
        for concurrent in [5, 10, 20, 50, 100]:
            logger.info(f"Testing with {concurrent} concurrent requests...")
            
            result = await load_test_runner.load_test(
                endpoint="/mcp",
                num_requests=100,
                concurrent_requests=concurrent
            )
            
            results.append({
                "concurrent": concurrent,
                "result": result
            })
            
            # Para se a taxa de erro for muito alta
            error_rate = result.failed_requests / result.total_requests
            if error_rate > 0.5:  # Mais de 50% de erros
                logger.warning(f"High error rate ({error_rate:.1%}) at {concurrent} concurrent requests")
                break
        
        # Analisa resultados
        for test_result in results:
            concurrent = test_result["concurrent"]
            result = test_result["result"]
            error_rate = result.failed_requests / result.total_requests
            
            logger.info(f"Concurrent {concurrent}: {result.requests_per_second:.1f} RPS, "
                       f"{error_rate:.1%} error rate, "
                       f"{result.avg_response_time:.3f}s avg response time")

class TestMCPPerformanceBenchmarks:
    """Benchmarks de performance para componentes MCP"""
    
    @pytest.mark.benchmark
    async def test_tool_execution_benchmark(self, benchmark):
        """Benchmark de execução de ferramenta"""
        from your_project.tools import EchoTool  # Ajuste o import
        
        tool = EchoTool()
        
        async def run_tool():
            return await tool.safe_execute(message="benchmark test")
        
        result = await benchmark.pedantic(run_tool, rounds=100, iterations=1)
        
        # Assertivas de performance
        assert result.success is True
        # benchmark.extra_info["ops_per_second"] = 1 / benchmark.stats["mean"]
    
    @pytest.mark.benchmark
    async def test_request_processing_benchmark(self, benchmark, mcp_server):
        """Benchmark de processamento de request"""
        request_data = {
            "jsonrpc": "2.0",
            "id": "benchmark",
            "method": "tools/call",
            "params": {
                "name": "echo",
                "arguments": {"message": "benchmark"}
            }
        }
        
        async def process_request():
            # Ajuste conforme sua implementação
            return await mcp_server.handle_request(request_data)
        
        result = await benchmark.pedantic(process_request, rounds=50, iterations=1)
        assert result is not None

# Utilitários para análise de performance
class PerformanceAnalyzer:
    """Analisador de resultados de performance"""
    
    @staticmethod
    def analyze_load_test_results(results: List[LoadTestResult]) -> Dict[str, Any]:
        """Analisa múltiplos resultados de teste de carga"""
        if not results:
            return {}
        
        total_requests = sum(r.total_requests for r in results)
        total_successful = sum(r.successful_requests for r in results)
        total_failed = sum(r.failed_requests for r in results)
        
        all_response_times = []
        for result in results:
            # Aproximação - idealmente teria os tempos individuais
            avg_time = result.avg_response_time
            for _ in range(result.successful_requests):
                all_response_times.append(avg_time)
        
        return {
            "summary": {
                "total_requests": total_requests,
                "success_rate": total_successful / total_requests if total_requests > 0 else 0,
                "avg_rps": statistics.mean([r.requests_per_second for r in results]),
                "avg_response_time": statistics.mean(all_response_times) if all_response_times else 0
            },
            "performance_trends": {
                "rps_trend": [r.requests_per_second for r in results],
                "response_time_trend": [r.avg_response_time for r in results]
            }
        }
    
    @staticmethod
    def generate_performance_report(analysis: Dict[str, Any]) -> str:
        """Gera relatório de performance"""
        summary = analysis.get("summary", {})
        trends = analysis.get("performance_trends", {})
        
        report = f"""
Performance Test Report
=======================

Summary:
- Total Requests: {summary.get('total_requests', 0):,}
- Success Rate: {summary.get('success_rate', 0):.1%}
- Average RPS: {summary.get('avg_rps', 0):.1f}
- Average Response Time: {summary.get('avg_response_time', 0):.3f}s

Trends:
- RPS Range: {min(trends.get('rps_trend', [0])):.1f} - {max(trends.get('rps_trend', [0])):.1f}
- Response Time Range: {min(trends.get('response_time_trend', [0])):.3f}s - {max(trends.get('response_time_trend', [0])):.3f}s
        """
        
        return report.strip()

# Configuração para testes lentos
def pytest_configure(config):
    """Configuração do pytest"""
    config.addinivalue_line("markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')")
    config.addinivalue_line("markers", "benchmark: marks tests as benchmarks")

# Custom markers para diferentes tipos de teste
pytestmark = [
    pytest.mark.asyncio,
    pytest.mark.filterwarnings("ignore::DeprecationWarning")
]
```

---

Esta coleção abrangente de templates e snippets fornece uma base sólida para desenvolvimento de projetos MCP e agentes AI. Cada seção inclui:

- **Código bem documentado** com comentários explicativos
- **Typing adequado** seguindo as melhores práticas do Python
- **Tratamento robusto de erros** e validação
- **Padrões modernos** de desenvolvimento assíncrono
- **Estruturas reutilizáveis** que podem ser facilmente adaptadas

Os templates cobrem desde a inicialização básica de projetos até sistemas avançados de debugging e testes de performance, proporcionando um kit completo para desenvolvimento profissional de soluções MCP.