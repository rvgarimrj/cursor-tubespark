#!/usr/bin/env python3
"""
Exemplo prático de servidor MCP básico
Demonstra o uso dos templates da coleção
"""

import asyncio
import logging
from typing import Any, Dict, List

from mcp import types
from mcp.server import Server
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

# Configuração de logging estruturado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BasicMCPServer:
    """
    Exemplo de servidor MCP básico implementando os templates da coleção
    """
    
    def __init__(self):
        self.server = Server("basic-mcp-example")
        self.tools_registry = {}
        self._setup_handlers()
        self._register_tools()
    
    def _setup_handlers(self):
        """Configura handlers do servidor"""
        self.server.list_tools = self.list_tools
        self.server.call_tool = self.call_tool
    
    def _register_tools(self):
        """Registra ferramentas disponíveis"""
        self.tools_registry = {
            "echo": {
                "handler": self._handle_echo,
                "schema": Tool(
                    name="echo",
                    description="Ecoa a mensagem fornecida pelo usuário",
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
            },
            "calculator": {
                "handler": self._handle_calculator,
                "schema": Tool(
                    name="calculator",
                    description="Realiza operações matemáticas básicas",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "operation": {
                                "type": "string",
                                "enum": ["add", "subtract", "multiply", "divide"],
                                "description": "Operação a ser realizada"
                            },
                            "a": {
                                "type": "number",
                                "description": "Primeiro número"
                            },
                            "b": {
                                "type": "number",
                                "description": "Segundo número"
                            }
                        },
                        "required": ["operation", "a", "b"]
                    }
                )
            },
            "text_analyzer": {
                "handler": self._handle_text_analyzer,
                "schema": Tool(
                    name="text_analyzer",
                    description="Analisa texto fornecendo estatísticas básicas",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "text": {
                                "type": "string",
                                "description": "Texto para análise"
                            },
                            "include_words": {
                                "type": "boolean",
                                "description": "Incluir contagem de palavras",
                                "default": True
                            }
                        },
                        "required": ["text"]
                    }
                )
            }
        }
    
    async def list_tools(self) -> ListToolsResult:
        """Lista todas as ferramentas disponíveis"""
        tools = [tool_info["schema"] for tool_info in self.tools_registry.values()]
        logger.info(f"Listando {len(tools)} ferramentas disponíveis")
        return ListToolsResult(tools=tools)
    
    async def call_tool(self, request: CallToolRequest) -> CallToolResult:
        """Executa uma ferramenta específica"""
        tool_name = request.params.name
        arguments = request.params.arguments or {}
        
        logger.info(f"Executando ferramenta: {tool_name} com argumentos: {arguments}")
        
        if tool_name not in self.tools_registry:
            error_msg = f"Ferramenta '{tool_name}' não encontrada"
            logger.error(error_msg)
            return CallToolResult(
                content=[TextContent(type="text", text=f"Erro: {error_msg}")]
            )
        
        try:
            # Executa o handler da ferramenta
            handler = self.tools_registry[tool_name]["handler"]
            result = await handler(**arguments)
            
            logger.info(f"Ferramenta {tool_name} executada com sucesso")
            return CallToolResult(
                content=[TextContent(type="text", text=str(result))]
            )
            
        except Exception as e:
            error_msg = f"Erro na execução da ferramenta '{tool_name}': {str(e)}"
            logger.error(error_msg, exc_info=True)
            return CallToolResult(
                content=[TextContent(type="text", text=f"Erro: {error_msg}")]
            )
    
    async def _handle_echo(self, message: str) -> str:
        """Handler para ferramenta echo"""
        if not message:
            raise ValueError("Mensagem não pode estar vazia")
        
        return f"Echo: {message}"
    
    async def _handle_calculator(self, operation: str, a: float, b: float) -> str:
        """Handler para ferramenta calculator"""
        operations = {
            "add": lambda x, y: x + y,
            "subtract": lambda x, y: x - y,
            "multiply": lambda x, y: x * y,
            "divide": lambda x, y: x / y if y != 0 else None
        }
        
        if operation not in operations:
            raise ValueError(f"Operação '{operation}' não suportada")
        
        if operation == "divide" and b == 0:
            raise ValueError("Divisão por zero não é permitida")
        
        result = operations[operation](a, b)
        return f"{a} {operation} {b} = {result}"
    
    async def _handle_text_analyzer(self, text: str, include_words: bool = True) -> str:
        """Handler para ferramenta text_analyzer"""
        if not text:
            raise ValueError("Texto não pode estar vazio")
        
        # Análise básica do texto
        char_count = len(text)
        line_count = text.count('\n') + 1
        
        analysis = {
            "characters": char_count,
            "lines": line_count,
            "characters_no_spaces": len(text.replace(' ', ''))
        }
        
        if include_words:
            words = text.split()
            analysis["words"] = len(words)
            analysis["avg_word_length"] = sum(len(word) for word in words) / len(words) if words else 0
        
        # Formata resultado
        result_lines = []
        result_lines.append("=== Análise de Texto ===")
        for key, value in analysis.items():
            if isinstance(value, float):
                result_lines.append(f"{key.replace('_', ' ').title()}: {value:.2f}")
            else:
                result_lines.append(f"{key.replace('_', ' ').title()}: {value}")
        
        return "\n".join(result_lines)
    
    async def run(self):
        """Inicia o servidor MCP"""
        logger.info("Iniciando servidor MCP básico...")
        
        async with stdio_server(
            server=self.server,
            initialization_options=InitializationOptions(
                server_name="basic-mcp-example",
                server_version="1.0.0"
            )
        ) as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="basic-mcp-example",
                    server_version="1.0.0"
                )
            )

async def main():
    """Função principal"""
    server = BasicMCPServer()
    await server.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Servidor interrompido pelo usuário")
    except Exception as e:
        logger.error(f"Erro fatal: {e}", exc_info=True)