#!/usr/bin/env python3
"""
Exemplo avançado de implementação de ferramentas MCP
Demonstra uso de validação, tratamento de erros e profiling
"""

import asyncio
import json
import logging
import os
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, validator

# Simulação das importações dos templates (ajuste conforme necessário)
class ToolParameter:
    def __init__(self, name: str, type: str, description: str, required: bool = True, default=None, enum=None):
        self.name = name
        self.type = type
        self.description = description
        self.required = required
        self.default = default
        self.enum = enum

class ToolResult:
    def __init__(self, success: bool, content: Any, error: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        self.success = success
        self.content = content
        self.error = error
        self.metadata = metadata or {}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseMCPTool:
    """Classe base para ferramentas MCP (simplificada para exemplo)"""
    
    def __init__(self, name: str, description: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.description = description
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.{self.name}")
    
    def get_parameters(self) -> List[ToolParameter]:
        raise NotImplementedError
    
    async def execute(self, **kwargs) -> ToolResult:
        raise NotImplementedError
    
    def validate_parameters(self, **kwargs) -> Dict[str, Any]:
        """Validação básica de parâmetros"""
        parameters = self.get_parameters()
        validated = {}
        errors = []
        
        for param in parameters:
            value = kwargs.get(param.name)
            
            if param.required and value is None:
                errors.append(f"Parâmetro obrigatório '{param.name}' não fornecido")
                continue
            
            if value is None and param.default is not None:
                value = param.default
            
            validated[param.name] = value
        
        if errors:
            raise ValueError(f"Erro de validação: {'; '.join(errors)}")
        
        return validated
    
    async def safe_execute(self, **kwargs) -> ToolResult:
        """Executa ferramenta com tratamento de erros"""
        try:
            validated_params = self.validate_parameters(**kwargs)
            self.logger.info(f"Executando ferramenta '{self.name}'")
            result = await self.execute(**validated_params)
            return result
        except Exception as e:
            error_msg = f"Erro na execução da ferramenta '{self.name}': {str(e)}"
            self.logger.error(error_msg, exc_info=True)
            return ToolResult(success=False, content=None, error=error_msg)

# Validação com Pydantic
class FileOperationRequest(BaseModel):
    """Modelo de validação para operações de arquivo"""
    file_path: str = Field(..., description="Caminho do arquivo")
    encoding: str = Field("utf-8", description="Encoding do arquivo")
    max_size: int = Field(1024000, description="Tamanho máximo em bytes", gt=0, le=10*1024*1024)
    
    @validator('file_path')
    def validate_file_path(cls, v):
        if not v or not isinstance(v, str):
            raise ValueError("Caminho do arquivo deve ser uma string não vazia")
        
        # Validações de segurança básicas
        forbidden_patterns = ['../', '..\\', '/etc/', '/root/']
        for pattern in forbidden_patterns:
            if pattern in v:
                raise ValueError(f"Caminho contém padrão proibido: {pattern}")
        
        return v.strip()

class APICallRequest(BaseModel):
    """Modelo de validação para chamadas de API"""
    url: str = Field(..., description="URL da API")
    method: str = Field("GET", description="Método HTTP")
    headers: Dict[str, str] = Field(default_factory=dict)
    data: Optional[Dict[str, Any]] = Field(None)
    timeout: int = Field(30, gt=0, le=300)
    
    @validator('method')
    def validate_method(cls, v):
        allowed_methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        if v.upper() not in allowed_methods:
            raise ValueError(f"Método HTTP deve ser um de: {allowed_methods}")
        return v.upper()

# Implementações avançadas de ferramentas
class FileManagerTool(BaseMCPTool):
    """Ferramenta avançada para gerenciamento de arquivos"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(
            name="file_manager",
            description="Gerencia operações de arquivo com validação e segurança",
            config=config
        )
        self.allowed_extensions = self.config.get("allowed_extensions", [".txt", ".json", ".py", ".md"])
        self.base_directory = Path(self.config.get("base_directory", "."))
    
    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="operation",
                type="string",
                description="Operação a realizar",
                required=True,
                enum=["read", "write", "list", "delete", "create_dir"]
            ),
            ToolParameter(
                name="file_path",
                type="string",
                description="Caminho do arquivo",
                required=True
            ),
            ToolParameter(
                name="content",
                type="string",
                description="Conteúdo para operações de escrita",
                required=False
            ),
            ToolParameter(
                name="encoding",
                type="string",
                description="Encoding do arquivo",
                required=False,
                default="utf-8"
            )
        ]
    
    async def execute(self, operation: str, file_path: str, content: str = None, encoding: str = "utf-8") -> ToolResult:
        """Executa operação de arquivo"""
        try:
            # Valida caminho usando Pydantic
            request = FileOperationRequest(file_path=file_path, encoding=encoding)
            
            # Resolve caminho completo
            full_path = (self.base_directory / request.file_path).resolve()
            
            # Verifica se está dentro do diretório base
            if not str(full_path).startswith(str(self.base_directory.resolve())):
                raise ValueError("Caminho fora do diretório permitido")
            
            # Executa operação
            if operation == "read":
                return await self._read_file(full_path, request.encoding)
            elif operation == "write":
                if content is None:
                    raise ValueError("Conteúdo é obrigatório para operação de escrita")
                return await self._write_file(full_path, content, request.encoding)
            elif operation == "list":
                return await self._list_directory(full_path)
            elif operation == "delete":
                return await self._delete_file(full_path)
            elif operation == "create_dir":
                return await self._create_directory(full_path)
            else:
                raise ValueError(f"Operação '{operation}' não suportada")
                
        except Exception as e:
            return ToolResult(
                success=False,
                content=None,
                error=str(e)
            )
    
    async def _read_file(self, file_path: Path, encoding: str) -> ToolResult:
        """Lê arquivo"""
        if not file_path.exists():
            return ToolResult(success=False, content=None, error="Arquivo não encontrado")
        
        if not file_path.is_file():
            return ToolResult(success=False, content=None, error="Caminho não é um arquivo")
        
        # Verifica extensão
        if file_path.suffix not in self.allowed_extensions:
            return ToolResult(
                success=False,
                content=None,
                error=f"Extensão não permitida. Permitidas: {self.allowed_extensions}"
            )
        
        try:
            content = file_path.read_text(encoding=encoding)
            return ToolResult(
                success=True,
                content=content,
                metadata={
                    "file_size": file_path.stat().st_size,
                    "encoding": encoding,
                    "extension": file_path.suffix
                }
            )
        except Exception as e:
            return ToolResult(success=False, content=None, error=f"Erro ao ler arquivo: {e}")
    
    async def _write_file(self, file_path: Path, content: str, encoding: str) -> ToolResult:
        """Escreve arquivo"""
        try:
            # Cria diretório pai se não existir
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Escreve arquivo
            file_path.write_text(content, encoding=encoding)
            
            return ToolResult(
                success=True,
                content=f"Arquivo escrito com sucesso: {file_path}",
                metadata={
                    "file_size": len(content.encode(encoding)),
                    "encoding": encoding
                }
            )
        except Exception as e:
            return ToolResult(success=False, content=None, error=f"Erro ao escrever arquivo: {e}")
    
    async def _list_directory(self, dir_path: Path) -> ToolResult:
        """Lista diretório"""
        if not dir_path.exists():
            return ToolResult(success=False, content=None, error="Diretório não encontrado")
        
        if not dir_path.is_dir():
            return ToolResult(success=False, content=None, error="Caminho não é um diretório")
        
        try:
            items = []
            for item in dir_path.iterdir():
                item_info = {
                    "name": item.name,
                    "type": "directory" if item.is_dir() else "file",
                    "size": item.stat().st_size if item.is_file() else None,
                    "modified": item.stat().st_mtime
                }
                items.append(item_info)
            
            return ToolResult(
                success=True,
                content=json.dumps(items, indent=2),
                metadata={"item_count": len(items)}
            )
        except Exception as e:
            return ToolResult(success=False, content=None, error=f"Erro ao listar diretório: {e}")
    
    async def _delete_file(self, file_path: Path) -> ToolResult:
        """Deleta arquivo"""
        if not file_path.exists():
            return ToolResult(success=False, content=None, error="Arquivo não encontrado")
        
        try:
            if file_path.is_file():
                file_path.unlink()
                return ToolResult(success=True, content=f"Arquivo deletado: {file_path}")
            else:
                return ToolResult(success=False, content=None, error="Caminho não é um arquivo")
        except Exception as e:
            return ToolResult(success=False, content=None, error=f"Erro ao deletar arquivo: {e}")
    
    async def _create_directory(self, dir_path: Path) -> ToolResult:
        """Cria diretório"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            return ToolResult(success=True, content=f"Diretório criado: {dir_path}")
        except Exception as e:
            return ToolResult(success=False, content=None, error=f"Erro ao criar diretório: {e}")

class WebAPITool(BaseMCPTool):
    """Ferramenta para chamadas de API web"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(
            name="web_api",
            description="Realiza chamadas para APIs web com validação",
            config=config
        )
        self.allowed_domains = self.config.get("allowed_domains", [])
        self.default_headers = self.config.get("default_headers", {
            "User-Agent": "MCP-WebAPI-Tool/1.0"
        })
    
    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="url",
                type="string",
                description="URL da API",
                required=True
            ),
            ToolParameter(
                name="method",
                type="string",
                description="Método HTTP",
                required=False,
                default="GET",
                enum=["GET", "POST", "PUT", "DELETE", "PATCH"]
            ),
            ToolParameter(
                name="headers",
                type="object",
                description="Headers HTTP adicionais",
                required=False
            ),
            ToolParameter(
                name="data",
                type="object",
                description="Dados do request",
                required=False
            ),
            ToolParameter(
                name="timeout",
                type="integer",
                description="Timeout em segundos",
                required=False,
                default=30
            )
        ]
    
    async def execute(self, url: str, method: str = "GET", headers: Dict[str, str] = None, data: Dict[str, Any] = None, timeout: int = 30) -> ToolResult:
        """Executa chamada de API"""
        try:
            # Valida request usando Pydantic
            api_request = APICallRequest(
                url=url,
                method=method,
                headers=headers or {},
                data=data,
                timeout=timeout
            )
            
            # Verifica domínio se lista de permitidos estiver configurada
            if self.allowed_domains:
                from urllib.parse import urlparse
                domain = urlparse(api_request.url).netloc
                if domain not in self.allowed_domains:
                    raise ValueError(f"Domínio não permitido: {domain}")
            
            # Simula chamada HTTP (substitua por implementação real com aiohttp)
            await asyncio.sleep(0.1)  # Simula latência
            
            # Mock response para demonstração
            mock_response = {
                "status": "success",
                "method": api_request.method,
                "url": api_request.url,
                "timestamp": time.time(),
                "data": "Mock response data"
            }
            
            return ToolResult(
                success=True,
                content=json.dumps(mock_response, indent=2),
                metadata={
                    "method": api_request.method,
                    "url": api_request.url,
                    "timeout": api_request.timeout
                }
            )
            
        except Exception as e:
            return ToolResult(
                success=False,
                content=None,
                error=str(e)
            )

class DataProcessingTool(BaseMCPTool):
    """Ferramenta para processamento de dados"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        super().__init__(
            name="data_processor",
            description="Processa e analisa dados estruturados",
            config=config
        )
    
    def get_parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="operation",
                type="string",
                description="Operação de processamento",
                required=True,
                enum=["analyze", "transform", "validate", "summarize"]
            ),
            ToolParameter(
                name="data",
                type="string",
                description="Dados em formato JSON",
                required=True
            ),
            ToolParameter(
                name="options",
                type="object",
                description="Opções adicionais",
                required=False
            )
        ]
    
    async def execute(self, operation: str, data: str, options: Dict[str, Any] = None) -> ToolResult:
        """Executa processamento de dados"""
        try:
            # Parse dos dados JSON
            try:
                parsed_data = json.loads(data)
            except json.JSONDecodeError as e:
                return ToolResult(success=False, content=None, error=f"Dados JSON inválidos: {e}")
            
            options = options or {}
            
            if operation == "analyze":
                result = await self._analyze_data(parsed_data, options)
            elif operation == "transform":
                result = await self._transform_data(parsed_data, options)
            elif operation == "validate":
                result = await self._validate_data(parsed_data, options)
            elif operation == "summarize":
                result = await self._summarize_data(parsed_data, options)
            else:
                raise ValueError(f"Operação '{operation}' não suportada")
            
            return ToolResult(
                success=True,
                content=json.dumps(result, indent=2),
                metadata={"operation": operation, "data_size": len(data)}
            )
            
        except Exception as e:
            return ToolResult(success=False, content=None, error=str(e))
    
    async def _analyze_data(self, data: Any, options: Dict[str, Any]) -> Dict[str, Any]:
        """Analisa estrutura dos dados"""
        def analyze_structure(obj, depth=0):
            if isinstance(obj, dict):
                return {
                    "type": "object",
                    "keys": list(obj.keys()),
                    "key_count": len(obj),
                    "depth": depth,
                    "children": {k: analyze_structure(v, depth + 1) for k, v in obj.items()} if depth < 3 else {}
                }
            elif isinstance(obj, list):
                return {
                    "type": "array",
                    "length": len(obj),
                    "depth": depth,
                    "sample_items": [analyze_structure(item, depth + 1) for item in obj[:3]] if obj else []
                }
            else:
                return {
                    "type": type(obj).__name__,
                    "value": str(obj)[:100] if len(str(obj)) > 100 else str(obj),
                    "depth": depth
                }
        
        analysis = analyze_structure(data)
        analysis["total_size"] = len(json.dumps(data))
        
        return analysis
    
    async def _transform_data(self, data: Any, options: Dict[str, Any]) -> Any:
        """Transforma dados baseado nas opções"""
        transform_type = options.get("type", "uppercase_keys")
        
        if transform_type == "uppercase_keys" and isinstance(data, dict):
            return {k.upper(): v for k, v in data.items()}
        elif transform_type == "flatten" and isinstance(data, dict):
            result = {}
            def flatten(obj, prefix=""):
                for k, v in obj.items():
                    key = f"{prefix}.{k}" if prefix else k
                    if isinstance(v, dict):
                        flatten(v, key)
                    else:
                        result[key] = v
            flatten(data)
            return result
        else:
            return data
    
    async def _validate_data(self, data: Any, options: Dict[str, Any]) -> Dict[str, Any]:
        """Valida dados contra schema"""
        errors = []
        warnings = []
        
        # Validações básicas
        if isinstance(data, dict):
            required_fields = options.get("required_fields", [])
            for field in required_fields:
                if field not in data:
                    errors.append(f"Campo obrigatório ausente: {field}")
        
        # Mais validações podem ser adicionadas aqui
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "data_type": type(data).__name__
        }
    
    async def _summarize_data(self, data: Any, options: Dict[str, Any]) -> Dict[str, Any]:
        """Cria resumo dos dados"""
        summary = {
            "data_type": type(data).__name__,
            "size": len(json.dumps(data))
        }
        
        if isinstance(data, dict):
            summary.update({
                "key_count": len(data),
                "keys": list(data.keys())[:10],  # Primeiras 10 chaves
                "has_nested_objects": any(isinstance(v, (dict, list)) for v in data.values())
            })
        elif isinstance(data, list):
            summary.update({
                "length": len(data),
                "item_types": list(set(type(item).__name__ for item in data)),
                "sample_items": data[:3] if len(data) <= 3 else data[:3]
            })
        
        return summary

# Exemplo de uso
async def main():
    """Demonstra uso das ferramentas avançadas"""
    logger.info("=== Demonstração de Ferramentas MCP Avançadas ===")
    
    # Configuração para FileManagerTool
    file_config = {
        "allowed_extensions": [".txt", ".json", ".py", ".md"],
        "base_directory": "."
    }
    
    file_tool = FileManagerTool(config=file_config)
    
    # Teste de criação e leitura de arquivo
    logger.info("1. Testando FileManagerTool...")
    
    # Cria arquivo temporário
    write_result = await file_tool.safe_execute(
        operation="write",
        file_path="temp/test.txt",
        content="Conteúdo de teste para demonstração"
    )
    logger.info(f"Escrita: {write_result.success}, {write_result.content or write_result.error}")
    
    # Lê arquivo
    read_result = await file_tool.safe_execute(
        operation="read",
        file_path="temp/test.txt"
    )
    logger.info(f"Leitura: {read_result.success}, tamanho: {len(read_result.content) if read_result.success else 'N/A'}")
    
    # Teste WebAPITool
    logger.info("2. Testando WebAPITool...")
    api_tool = WebAPITool()
    
    api_result = await api_tool.safe_execute(
        url="https://api.example.com/data",
        method="GET"
    )
    logger.info(f"API call: {api_result.success}")
    
    # Teste DataProcessingTool
    logger.info("3. Testando DataProcessingTool...")
    data_tool = DataProcessingTool()
    
    sample_data = {
        "users": [
            {"id": 1, "name": "Alice", "age": 30},
            {"id": 2, "name": "Bob", "age": 25}
        ],
        "total": 2
    }
    
    analyze_result = await data_tool.safe_execute(
        operation="analyze",
        data=json.dumps(sample_data)
    )
    logger.info(f"Data analysis: {analyze_result.success}")
    
    if analyze_result.success:
        logger.info("Análise dos dados:")
        print(analyze_result.content)

if __name__ == "__main__":
    asyncio.run(main())