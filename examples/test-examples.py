#!/usr/bin/env python3
"""
Exemplos práticos de testes para projetos MCP
Demonstra uso dos templates de teste da coleção
"""

import asyncio
import json
import pytest
import tempfile
import uuid
from pathlib import Path
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, patch

# Imports simulados dos templates (ajuste conforme necessário)
from advanced_tool_implementation import FileManagerTool, WebAPITool, DataProcessingTool, ToolResult

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
    def assert_valid_tool_result(result: ToolResult, should_succeed: bool = True):
        """Valida resultado de ferramenta"""
        assert isinstance(result, ToolResult)
        assert result.success == should_succeed
        
        if should_succeed:
            assert result.content is not None
            assert result.error is None
        else:
            assert result.error is not None

# Fixtures
@pytest.fixture
def temp_dir():
    """Fixture para diretório temporário"""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)

@pytest.fixture
def sample_json_data():
    """Fixture com dados JSON de exemplo"""
    return {
        "users": [
            {"id": 1, "name": "Alice", "email": "alice@example.com", "age": 30},
            {"id": 2, "name": "Bob", "email": "bob@example.com", "age": 25}
        ],
        "metadata": {
            "total": 2,
            "created_at": "2023-01-01T00:00:00Z"
        }
    }

@pytest.fixture
def file_manager_config(temp_dir):
    """Fixture com configuração para FileManagerTool"""
    return {
        "allowed_extensions": [".txt", ".json", ".py", ".md"],
        "base_directory": str(temp_dir)
    }

@pytest.fixture
def file_manager_tool(file_manager_config):
    """Fixture com FileManagerTool configurado"""
    return FileManagerTool(config=file_manager_config)

@pytest.fixture
def web_api_tool():
    """Fixture com WebAPITool configurado"""
    config = {
        "allowed_domains": ["api.example.com", "jsonplaceholder.typicode.com"],
        "default_headers": {"User-Agent": "MCP-Test/1.0"}
    }
    return WebAPITool(config=config)

@pytest.fixture
def data_processing_tool():
    """Fixture com DataProcessingTool"""
    return DataProcessingTool()

# Testes para FileManagerTool
class TestFileManagerTool:
    """Testes para FileManagerTool"""
    
    @pytest.mark.asyncio
    async def test_write_and_read_file(self, file_manager_tool, temp_dir):
        """Testa escrita e leitura de arquivo"""
        test_content = "Conteúdo de teste para arquivo"
        test_path = "test_file.txt"
        
        # Escreve arquivo
        write_result = await file_manager_tool.safe_execute(
            operation="write",
            file_path=test_path,
            content=test_content
        )
        
        MCPTestHelper.assert_valid_tool_result(write_result, should_succeed=True)
        assert "sucesso" in write_result.content.lower()
        
        # Verifica se arquivo foi criado
        full_path = temp_dir / test_path
        assert full_path.exists()
        assert full_path.read_text() == test_content
        
        # Lê arquivo
        read_result = await file_manager_tool.safe_execute(
            operation="read",
            file_path=test_path
        )
        
        MCPTestHelper.assert_valid_tool_result(read_result, should_succeed=True)
        assert read_result.content == test_content
        assert read_result.metadata["file_size"] == len(test_content.encode("utf-8"))
    
    @pytest.mark.asyncio
    async def test_read_nonexistent_file(self, file_manager_tool):
        """Testa leitura de arquivo inexistente"""
        result = await file_manager_tool.safe_execute(
            operation="read",
            file_path="arquivo_inexistente.txt"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "não encontrado" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_invalid_extension(self, file_manager_tool):
        """Testa arquivo com extensão não permitida"""
        # Primeiro cria um arquivo com extensão não permitida
        temp_path = Path(file_manager_tool.base_directory) / "test.exe"
        temp_path.write_text("test content")
        
        result = await file_manager_tool.safe_execute(
            operation="read",
            file_path="test.exe"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "extensão não permitida" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_list_directory(self, file_manager_tool, temp_dir):
        """Testa listagem de diretório"""
        # Cria alguns arquivos de teste
        (temp_dir / "file1.txt").write_text("content1")
        (temp_dir / "file2.json").write_text('{"key": "value"}')
        (temp_dir / "subdir").mkdir()
        
        result = await file_manager_tool.safe_execute(
            operation="list",
            file_path="."
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        # Parse do resultado JSON
        items = json.loads(result.content)
        assert len(items) >= 3  # Pelo menos os arquivos que criamos
        
        file_names = [item["name"] for item in items]
        assert "file1.txt" in file_names
        assert "file2.json" in file_names
        assert "subdir" in file_names
    
    @pytest.mark.asyncio
    async def test_create_directory(self, file_manager_tool, temp_dir):
        """Testa criação de diretório"""
        new_dir = "novo_diretorio"
        
        result = await file_manager_tool.safe_execute(
            operation="create_dir",
            file_path=new_dir
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        assert (temp_dir / new_dir).exists()
        assert (temp_dir / new_dir).is_dir()
    
    @pytest.mark.asyncio
    async def test_delete_file(self, file_manager_tool, temp_dir):
        """Testa deleção de arquivo"""
        test_file = temp_dir / "arquivo_para_deletar.txt"
        test_file.write_text("conteúdo temporário")
        
        assert test_file.exists()
        
        result = await file_manager_tool.safe_execute(
            operation="delete",
            file_path="arquivo_para_deletar.txt"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        assert not test_file.exists()
    
    @pytest.mark.asyncio
    async def test_security_path_traversal(self, file_manager_tool):
        """Testa proteção contra path traversal"""
        malicious_paths = [
            "../../../etc/passwd",
            "..\\..\\windows\\system32",
            "/etc/passwd",
            "C:\\Windows\\System32"
        ]
        
        for malicious_path in malicious_paths:
            result = await file_manager_tool.safe_execute(
                operation="read",
                file_path=malicious_path
            )
            
            MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
            assert any(forbidden in result.error.lower() for forbidden in ["proibido", "permitido", "fora"])

# Testes para WebAPITool
class TestWebAPITool:
    """Testes para WebAPITool"""
    
    @pytest.mark.asyncio
    async def test_valid_api_call(self, web_api_tool):
        """Testa chamada de API válida"""
        result = await web_api_tool.safe_execute(
            url="https://api.example.com/users",
            method="GET"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        # Parse do resultado JSON
        response_data = json.loads(result.content)
        assert response_data["status"] == "success"
        assert response_data["method"] == "GET"
        assert result.metadata["method"] == "GET"
    
    @pytest.mark.asyncio
    async def test_invalid_url(self, web_api_tool):
        """Testa URL inválida"""
        result = await web_api_tool.safe_execute(
            url="not-a-valid-url",
            method="GET"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "inválida" in result.error.lower() or "invalid" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_invalid_method(self, web_api_tool):
        """Testa método HTTP inválido"""
        result = await web_api_tool.safe_execute(
            url="https://api.example.com/users",
            method="INVALID"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "método" in result.error.lower() or "method" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_post_with_data(self, web_api_tool):
        """Testa POST com dados"""
        post_data = {"name": "Test User", "email": "test@example.com"}
        
        result = await web_api_tool.safe_execute(
            url="https://api.example.com/users",
            method="POST",
            data=post_data,
            headers={"Content-Type": "application/json"}
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        response_data = json.loads(result.content)
        assert response_data["method"] == "POST"
    
    @pytest.mark.asyncio
    async def test_domain_restriction(self, web_api_tool):
        """Testa restrição de domínio"""
        # Tenta acessar domínio não permitido
        result = await web_api_tool.safe_execute(
            url="https://malicious-site.com/api"
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "domínio" in result.error.lower() or "domain" in result.error.lower()

# Testes para DataProcessingTool
class TestDataProcessingTool:
    """Testes para DataProcessingTool"""
    
    @pytest.mark.asyncio
    async def test_analyze_operation(self, data_processing_tool, sample_json_data):
        """Testa operação de análise"""
        result = await data_processing_tool.safe_execute(
            operation="analyze",
            data=json.dumps(sample_json_data)
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        analysis = json.loads(result.content)
        assert analysis["type"] == "object"
        assert "users" in analysis["keys"]
        assert "metadata" in analysis["keys"]
        assert analysis["key_count"] == 2
    
    @pytest.mark.asyncio
    async def test_transform_uppercase_keys(self, data_processing_tool):
        """Testa transformação de chaves para maiúscula"""
        test_data = {"name": "test", "value": 123}
        
        result = await data_processing_tool.safe_execute(
            operation="transform",
            data=json.dumps(test_data),
            options={"type": "uppercase_keys"}
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        transformed = json.loads(result.content)
        assert "NAME" in transformed
        assert "VALUE" in transformed
        assert transformed["NAME"] == "test"
        assert transformed["VALUE"] == 123
    
    @pytest.mark.asyncio
    async def test_transform_flatten(self, data_processing_tool):
        """Testa achatamento de estrutura aninhada"""
        nested_data = {
            "user": {
                "profile": {
                    "name": "Alice",
                    "age": 30
                },
                "settings": {
                    "theme": "dark"
                }
            }
        }
        
        result = await data_processing_tool.safe_execute(
            operation="transform",
            data=json.dumps(nested_data),
            options={"type": "flatten"}
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        flattened = json.loads(result.content)
        assert "user.profile.name" in flattened
        assert "user.profile.age" in flattened
        assert "user.settings.theme" in flattened
        assert flattened["user.profile.name"] == "Alice"
    
    @pytest.mark.asyncio
    async def test_validate_with_required_fields(self, data_processing_tool):
        """Testa validação com campos obrigatórios"""
        test_data = {"name": "Alice", "age": 30}
        
        # Validação que deve passar
        result = await data_processing_tool.safe_execute(
            operation="validate",
            data=json.dumps(test_data),
            options={"required_fields": ["name", "age"]}
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        validation = json.loads(result.content)
        assert validation["valid"] is True
        assert len(validation["errors"]) == 0
        
        # Validação que deve falhar
        result = await data_processing_tool.safe_execute(
            operation="validate",
            data=json.dumps(test_data),
            options={"required_fields": ["name", "email", "age"]}
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        validation = json.loads(result.content)
        assert validation["valid"] is False
        assert len(validation["errors"]) == 1
        assert "email" in validation["errors"][0]
    
    @pytest.mark.asyncio
    async def test_summarize_dict(self, data_processing_tool, sample_json_data):
        """Testa resumo de dicionário"""
        result = await data_processing_tool.safe_execute(
            operation="summarize",
            data=json.dumps(sample_json_data)
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        summary = json.loads(result.content)
        assert summary["data_type"] == "dict"
        assert summary["key_count"] == 2
        assert "users" in summary["keys"]
        assert "metadata" in summary["keys"]
        assert summary["has_nested_objects"] is True
    
    @pytest.mark.asyncio
    async def test_summarize_list(self, data_processing_tool):
        """Testa resumo de lista"""
        test_list = [1, 2, "three", {"four": 4}, [5, 6]]
        
        result = await data_processing_tool.safe_execute(
            operation="summarize",
            data=json.dumps(test_list)
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=True)
        
        summary = json.loads(result.content)
        assert summary["data_type"] == "list"
        assert summary["length"] == 5
        assert "int" in summary["item_types"]
        assert "str" in summary["item_types"]
        assert "dict" in summary["item_types"]
        assert "list" in summary["item_types"]
    
    @pytest.mark.asyncio
    async def test_invalid_json(self, data_processing_tool):
        """Testa JSON inválido"""
        invalid_json = '{"name": "test", "age":}'
        
        result = await data_processing_tool.safe_execute(
            operation="analyze",
            data=invalid_json
        )
        
        MCPTestHelper.assert_valid_tool_result(result, should_succeed=False)
        assert "json" in result.error.lower() and "inválido" in result.error.lower()

# Testes parametrizados
@pytest.mark.parametrize("operation,data,should_succeed", [
    ("analyze", '{"key": "value"}', True),
    ("analyze", '{"users": [1, 2, 3]}', True),
    ("transform", '{"name": "test"}', True),
    ("validate", '{"id": 1}', True),
    ("summarize", '[1, 2, 3]', True),
    ("invalid_op", '{"key": "value"}', False),
    ("analyze", 'invalid json', False),
])
@pytest.mark.asyncio
async def test_data_processing_scenarios(data_processing_tool, operation, data, should_succeed):
    """Testa diferentes cenários de processamento"""
    result = await data_processing_tool.safe_execute(
        operation=operation,
        data=data
    )
    
    MCPTestHelper.assert_valid_tool_result(result, should_succeed=should_succeed)

# Testes de integração
class TestToolIntegration:
    """Testes de integração entre ferramentas"""
    
    @pytest.mark.asyncio
    async def test_file_and_data_processing_integration(self, file_manager_tool, data_processing_tool, temp_dir, sample_json_data):
        """Testa integração entre file manager e data processing"""
        # 1. Escreve dados JSON em arquivo
        json_content = json.dumps(sample_json_data, indent=2)
        
        write_result = await file_manager_tool.safe_execute(
            operation="write",
            file_path="data.json",
            content=json_content
        )
        MCPTestHelper.assert_valid_tool_result(write_result, should_succeed=True)
        
        # 2. Lê arquivo
        read_result = await file_manager_tool.safe_execute(
            operation="read",
            file_path="data.json"
        )
        MCPTestHelper.assert_valid_tool_result(read_result, should_succeed=True)
        
        # 3. Processa dados lidos
        analyze_result = await data_processing_tool.safe_execute(
            operation="analyze",
            data=read_result.content
        )
        MCPTestHelper.assert_valid_tool_result(analyze_result, should_succeed=True)
        
        # 4. Verifica análise
        analysis = json.loads(analyze_result.content)
        assert analysis["type"] == "object"
        assert "users" in analysis["keys"]

# Benchmarks simples
class TestPerformance:
    """Testes de performance básicos"""
    
    @pytest.mark.asyncio
    async def test_file_operations_performance(self, file_manager_tool, temp_dir):
        """Testa performance de operações de arquivo"""
        import time
        
        # Testa múltiplas escritas
        start_time = time.time()
        
        for i in range(10):
            await file_manager_tool.safe_execute(
                operation="write",
                file_path=f"perf_test_{i}.txt",
                content=f"Content for file {i}"
            )
        
        write_time = time.time() - start_time
        
        # Testa múltiplas leituras
        start_time = time.time()
        
        for i in range(10):
            await file_manager_tool.safe_execute(
                operation="read",
                file_path=f"perf_test_{i}.txt"
            )
        
        read_time = time.time() - start_time
        
        # Assertivas de performance básicas
        assert write_time < 5.0  # Menos de 5 segundos para 10 escritas
        assert read_time < 2.0   # Menos de 2 segundos para 10 leituras
        
        print(f"Write time: {write_time:.2f}s, Read time: {read_time:.2f}s")

# Configuração de testes
def pytest_configure(config):
    """Configuração do pytest"""
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: marks tests as integration tests")

if __name__ == "__main__":
    # Permite executar testes diretamente
    pytest.main([__file__, "-v"])