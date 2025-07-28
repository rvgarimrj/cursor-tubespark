#!/usr/bin/env python3
"""
Script para executar testes MCP com diferentes configurações
Demonstra uso dos templates de teste da coleção
"""

import argparse
import asyncio
import json
import logging
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TestRunner:
    """Runner para executar testes MCP com diferentes configurações"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.test_results = {}
    
    def run_unit_tests(self, test_path: str = "examples/test-examples.py") -> Dict[str, any]:
        """Executa testes unitários"""
        logger.info("Executando testes unitários...")
        
        cmd = [
            sys.executable, "-m", "pytest",
            str(self.project_root / test_path),
            "-v",
            "--tb=short",
            "--durations=10"
        ]
        
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result.returncode == 0,
                "duration": duration,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e),
                "returncode": -1
            }
    
    def run_integration_tests(self, test_path: str = "examples/test-examples.py") -> Dict[str, any]:
        """Executa testes de integração"""
        logger.info("Executando testes de integração...")
        
        cmd = [
            sys.executable, "-m", "pytest",
            str(self.project_root / test_path),
            "-v",
            "-m", "integration",
            "--tb=short"
        ]
        
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result.returncode == 0,
                "duration": duration,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e),
                "returncode": -1
            }
    
    def run_performance_tests(self, test_path: str = "examples/test-examples.py") -> Dict[str, any]:
        """Executa testes de performance"""
        logger.info("Executando testes de performance...")
        
        cmd = [
            sys.executable, "-m", "pytest",
            str(self.project_root / test_path),
            "-v",
            "-k", "performance",
            "--tb=short",
            "--durations=0"
        ]
        
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result.returncode == 0,
                "duration": duration,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e),
                "returncode": -1
            }
    
    def run_lint_checks(self) -> Dict[str, any]:
        """Executa verificações de lint"""
        logger.info("Executando verificações de lint...")
        
        # Verifica se flake8 está disponível
        try:
            subprocess.run(["flake8", "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("flake8 não encontrado, pulando verificações de lint")
            return {"success": True, "skipped": True, "message": "flake8 não encontrado"}
        
        cmd = [
            "flake8",
            str(self.project_root / "examples"),
            "--max-line-length=120",
            "--ignore=E501,W503"
        ]
        
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result.returncode == 0,
                "duration": duration,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e),
                "returncode": -1
            }
    
    def run_type_checks(self) -> Dict[str, any]:
        """Executa verificações de tipo"""
        logger.info("Executando verificações de tipo...")
        
        # Verifica se mypy está disponível
        try:
            subprocess.run(["mypy", "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("mypy não encontrado, pulando verificações de tipo")
            return {"success": True, "skipped": True, "message": "mypy não encontrado"}
        
        cmd = [
            "mypy",
            str(self.project_root / "examples"),
            "--ignore-missing-imports",
            "--strict-optional"
        ]
        
        start_time = time.time()
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result.returncode == 0,
                "duration": duration,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e),
                "returncode": -1
            }
    
    async def test_server_startup(self, server_script: str = "examples/basic-mcp-server.py") -> Dict[str, any]:
        """Testa inicialização do servidor"""
        logger.info(f"Testando inicialização do servidor: {server_script}")
        
        cmd = [sys.executable, str(self.project_root / server_script)]
        
        start_time = time.time()
        try:
            # Inicia processo do servidor
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.project_root
            )
            
            # Aguarda um pouco para ver se o servidor inicia corretamente
            try:
                await asyncio.wait_for(process.wait(), timeout=5.0)
                # Se chegou aqui, o processo terminou (pode ser erro)
                stdout, stderr = await process.communicate()
                
                return {
                    "success": process.returncode == 0,
                    "duration": time.time() - start_time,
                    "stdout": stdout.decode() if stdout else "",
                    "stderr": stderr.decode() if stderr else "",
                    "returncode": process.returncode,
                    "message": "Servidor terminou inesperadamente"
                }
                
            except asyncio.TimeoutError:
                # Timeout é esperado - significa que servidor está rodando
                process.terminate()
                try:
                    await asyncio.wait_for(process.wait(), timeout=2.0)
                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                
                return {
                    "success": True,
                    "duration": 5.0,  # Tempo de timeout
                    "message": "Servidor iniciou corretamente (timeout esperado)"
                }
                
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
    
    def generate_coverage_report(self, test_path: str = "examples/test-examples.py") -> Dict[str, any]:
        """Gera relatório de cobertura"""
        logger.info("Gerando relatório de cobertura...")
        
        # Verifica se coverage está disponível
        try:
            subprocess.run(["coverage", "--version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("coverage não encontrado, pulando relatório de cobertura")
            return {"success": True, "skipped": True, "message": "coverage não encontrado"}
        
        # Executa testes com coverage
        cmd_test = [
            "coverage", "run", "-m", "pytest",
            str(self.project_root / test_path),
            "-v"
        ]
        
        start_time = time.time()
        try:
            # Executa testes
            result_test = subprocess.run(
                cmd_test,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result_test.returncode != 0:
                return {
                    "success": False,
                    "error": "Falha ao executar testes para cobertura",
                    "stderr": result_test.stderr
                }
            
            # Gera relatório
            cmd_report = ["coverage", "report", "-m"]
            result_report = subprocess.run(
                cmd_report,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            duration = time.time() - start_time
            
            return {
                "success": result_report.returncode == 0,
                "duration": duration,
                "report": result_report.stdout,
                "stderr": result_report.stderr
            }
            
        except Exception as e:
            return {
                "success": False,
                "duration": time.time() - start_time,
                "error": str(e)
            }
    
    def run_all_tests(self, include_slow: bool = False) -> Dict[str, Dict[str, any]]:
        """Executa todos os tipos de teste"""
        logger.info("=== Executando bateria completa de testes ===")
        
        results = {}
        
        # Testes unitários
        results["unit_tests"] = self.run_unit_tests()
        
        # Verificações de código
        results["lint_checks"] = self.run_lint_checks()
        results["type_checks"] = self.run_type_checks()
        
        # Testes de performance (apenas se solicitado)
        if include_slow:
            results["performance_tests"] = self.run_performance_tests()
            results["integration_tests"] = self.run_integration_tests()
        
        # Relatório de cobertura
        results["coverage_report"] = self.generate_coverage_report()
        
        # Teste de inicialização do servidor
        server_test = asyncio.run(self.test_server_startup())
        results["server_startup"] = server_test
        
        return results
    
    def print_summary(self, results: Dict[str, Dict[str, any]]):
        """Imprime resumo dos resultados"""
        logger.info("\n=== RESUMO DOS TESTES ===")
        
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result.get("success", False) or result.get("skipped", False))
        
        logger.info(f"Total de categorias testadas: {total_tests}")
        logger.info(f"Categorias bem-sucedidas: {passed_tests}")
        logger.info(f"Taxa de sucesso: {(passed_tests/total_tests)*100:.1f}%")
        
        print("\nDetalhes por categoria:")
        for category, result in results.items():
            status = "✅ PASSOU" if result.get("success", False) else "❌ FALHOU"
            if result.get("skipped", False):
                status = "⏭️ PULADO"
            
            duration = result.get("duration", 0)
            print(f"  {category}: {status} ({duration:.2f}s)")
            
            if not result.get("success", False) and not result.get("skipped", False):
                error = result.get("error", result.get("stderr", "Erro desconhecido"))
                print(f"    Erro: {error[:100]}...")
    
    def save_results_json(self, results: Dict[str, Dict[str, any]], output_file: Path):
        """Salva resultados em arquivo JSON"""
        logger.info(f"Salvando resultados em: {output_file}")
        
        # Adiciona metadados
        results_with_meta = {
            "timestamp": time.time(),
            "project_root": str(self.project_root),
            "python_version": sys.version,
            "results": results
        }
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results_with_meta, f, indent=2, ensure_ascii=False)
            logger.info("Resultados salvos com sucesso")
        except Exception as e:
            logger.error(f"Erro ao salvar resultados: {e}")

def main():
    """Função principal"""
    parser = argparse.ArgumentParser(description="Executa testes MCP")
    parser.add_argument("--project-root", type=Path, default=Path.cwd(),
                        help="Diretório raiz do projeto")
    parser.add_argument("--include-slow", action="store_true",
                        help="Inclui testes lentos (performance e integração)")
    parser.add_argument("--output", type=Path,
                        help="Arquivo para salvar resultados JSON")
    parser.add_argument("--category", choices=["unit", "lint", "type", "performance", "integration", "coverage", "server"],
                        help="Executa apenas uma categoria específica")
    
    args = parser.parse_args()
    
    # Verifica se o diretório do projeto existe
    if not args.project_root.exists():
        logger.error(f"Diretório do projeto não encontrado: {args.project_root}")
        sys.exit(1)
    
    runner = TestRunner(args.project_root)
    
    # Executa categoria específica ou todos os testes
    if args.category:
        logger.info(f"Executando categoria: {args.category}")
        
        if args.category == "unit":
            results = {"unit_tests": runner.run_unit_tests()}
        elif args.category == "lint":
            results = {"lint_checks": runner.run_lint_checks()}
        elif args.category == "type":
            results = {"type_checks": runner.run_type_checks()}
        elif args.category == "performance":
            results = {"performance_tests": runner.run_performance_tests()}
        elif args.category == "integration":
            results = {"integration_tests": runner.run_integration_tests()}
        elif args.category == "coverage":
            results = {"coverage_report": runner.generate_coverage_report()}
        elif args.category == "server":
            server_result = asyncio.run(runner.test_server_startup())
            results = {"server_startup": server_result}
    else:
        # Executa todos os testes
        results = runner.run_all_tests(include_slow=args.include_slow)
    
    # Imprime resumo
    runner.print_summary(results)
    
    # Salva resultados se solicitado
    if args.output:
        runner.save_results_json(results, args.output)
    
    # Exit code baseado no sucesso geral
    all_passed = all(
        result.get("success", False) or result.get("skipped", False)
        for result in results.values()
    )
    
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()