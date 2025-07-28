# Framework de Validação Context7 - Harmonia entre Agentes

## Objetivo
Este framework garante que todos os códigos gerados pelos 3 agentes especializados mantenham consistência, qualidade e harmonia, evitando conflitos e garantindo a interoperabilidade.

---

## Componentes do Framework

### 1. Validador de Consistência de Código

#### Métricas de Validação
```yaml
consistency_metrics:
  style_compliance:
    weight: 30
    checks:
      - "Naming conventions adherence"
      - "Indentation consistency" 
      - "Import organization"
      - "Comment style uniformity"
    
  architectural_alignment:
    weight: 25
    checks:
      - "Pattern consistency across modules"
      - "Error handling uniformity"
      - "Interface design coherence"
      - "Dependency management harmony"
    
  type_safety:
    weight: 25
    checks:
      - "TypeScript coverage"
      - "Type definition consistency"
      - "Generic usage patterns"
      - "Null safety compliance"
    
  documentation_quality:
    weight: 20
    checks:
      - "JSDoc/docstring completeness"
      - "README coherence"
      - "Code example validity"
      - "API documentation accuracy"
```

#### Implementação do Validador
```typescript
export interface ValidationResult {
  score: number;
  passed: boolean;
  issues: ValidationIssue[];
  recommendations: string[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  category: 'style' | 'architecture' | 'types' | 'documentation';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
}

export class Context7CodeValidator {
  private readonly rules: ValidationRule[];
  private readonly thresholds: QualityThresholds;

  constructor() {
    this.rules = this.loadValidationRules();
    this.thresholds = {
      minimumScore: 85,
      errorThreshold: 0,
      warningThreshold: 5,
      styleCompliance: 95,
      typeCompliance: 90
    };
  }

  async validateCodebase(basePath: string): Promise<ValidationResult> {
    const files = await this.scanFiles(basePath);
    const results = await Promise.all(
      files.map(file => this.validateFile(file))
    );

    return this.aggregateResults(results);
  }

  async validateFile(filePath: string): Promise<ValidationResult> {
    const content = await fs.readFile(filePath, 'utf-8');
    const ast = this.parseFile(filePath, content);
    
    const issues: ValidationIssue[] = [];
    
    // Style validation
    issues.push(...await this.validateStyle(filePath, content));
    
    // Architecture validation
    issues.push(...await this.validateArchitecture(filePath, ast));
    
    // Type validation
    issues.push(...await this.validateTypes(filePath, ast));
    
    // Documentation validation
    issues.push(...await this.validateDocumentation(filePath, ast));

    const score = this.calculateScore(issues);
    
    return {
      score,
      passed: score >= this.thresholds.minimumScore,
      issues,
      recommendations: this.generateRecommendations(issues)
    };
  }

  private async validateStyle(filePath: string, content: string): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Naming conventions
    const namingIssues = this.checkNamingConventions(filePath, content);
    issues.push(...namingIssues);
    
    // Indentation
    const indentationIssues = this.checkIndentation(filePath, content);
    issues.push(...indentationIssues);
    
    // Import organization
    const importIssues = this.checkImportOrganization(filePath, content);
    issues.push(...importIssues);
    
    return issues;
  }

  private checkNamingConventions(filePath: string, content: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check variable naming (camelCase for JS/TS)
      const varMatches = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
      if (varMatches) {
        varMatches.forEach(match => {
          const varName = match.split(/\s+/)[1];
          if (this.isTypeScript(filePath) && !this.isCamelCase(varName) && !this.isConstantCase(varName)) {
            issues.push({
              type: 'warning',
              category: 'style',
              file: filePath,
              line: index + 1,
              message: `Variable '${varName}' should use camelCase naming convention`,
              suggestion: `Rename to '${this.toCamelCase(varName)}'`,
              autoFixable: true
            });
          }
        });
      }
      
      // Check function naming
      const funcMatches = line.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
      if (funcMatches) {
        funcMatches.forEach(match => {
          const funcName = match.split(/\s+/)[1];
          if (!this.isCamelCase(funcName)) {
            issues.push({
              type: 'warning',
              category: 'style',
              file: filePath,
              line: index + 1,
              message: `Function '${funcName}' should use camelCase naming convention`,
              suggestion: `Rename to '${this.toCamelCase(funcName)}'`,
              autoFixable: true
            });
          }
        });
      }
    });
    
    return issues;
  }

  private checkIndentation(filePath: string, content: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const lines = content.split('\n');
    const expectedIndent = this.isTypeScript(filePath) ? 2 : 4;
    
    lines.forEach((line, index) => {
      if (line.trim() === '') return; // Skip empty lines
      
      const leadingSpaces = line.length - line.ltrimStart().length;
      if (leadingSpaces % expectedIndent !== 0) {
        issues.push({
          type: 'error',
          category: 'style',
          file: filePath,
          line: index + 1,
          message: `Inconsistent indentation: expected multiple of ${expectedIndent} spaces`,
          suggestion: `Use ${expectedIndent} spaces for indentation`,
          autoFixable: true
        });
      }
    });
    
    return issues;
  }

  private generateRecommendations(issues: ValidationIssue[]): string[] {
    const recommendations: string[] = [];
    const categoryCount = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    if (categoryCount.style > 5) {
      recommendations.push("Consider running automated code formatting with Biome or Prettier");
    }
    
    if (categoryCount.types > 3) {
      recommendations.push("Review TypeScript configuration and add stricter type checking");
    }
    
    if (categoryCount.architecture > 2) {
      recommendations.push("Consider refactoring to align with established architectural patterns");
    }
    
    if (categoryCount.documentation > 3) {
      recommendations.push("Add comprehensive JSDoc comments and update README documentation");
    }
    
    return recommendations;
  }
}
```

### 2. Detector de Conflitos Inter-Agentes

```typescript
export interface AgentConflict {
  id: string;
  type: 'naming' | 'architecture' | 'dependency' | 'style';
  severity: 'low' | 'medium' | 'high' | 'critical';
  agents: string[];
  description: string;
  files: string[];
  resolution: ConflictResolution;
}

export interface ConflictResolution {
  strategy: 'merge' | 'override' | 'manual' | 'vote';
  winner?: string;
  rationale: string;
  actions: string[];
}

export class Context7ConflictDetector {
  private agentSignatures: Map<string, CodeSignature> = new Map();

  async detectConflicts(agentOutputs: AgentOutput[]): Promise<AgentConflict[]> {
    const conflicts: AgentConflict[] = [];
    
    // Analyze each agent's output
    for (const output of agentOutputs) {
      const signature = await this.generateCodeSignature(output);
      this.agentSignatures.set(output.agentId, signature);
    }
    
    // Compare signatures for conflicts
    const agents = Array.from(this.agentSignatures.keys());
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agentA = agents[i];
        const agentB = agents[j];
        const conflictsAB = this.compareSignatures(
          this.agentSignatures.get(agentA)!,
          this.agentSignatures.get(agentB)!,
          agentA,
          agentB
        );
        conflicts.push(...conflictsAB);
      }
    }
    
    return conflicts;
  }

  private async generateCodeSignature(output: AgentOutput): Promise<CodeSignature> {
    return {
      agentId: output.agentId,
      namingPatterns: this.extractNamingPatterns(output.code),
      architecturalPatterns: this.extractArchitecturalPatterns(output.code),
      dependencies: this.extractDependencies(output.code),
      styleFingerprint: this.generateStyleFingerprint(output.code),
      exports: this.extractExports(output.code),
      imports: this.extractImports(output.code)
    };
  }

  private compareSignatures(
    sigA: CodeSignature, 
    sigB: CodeSignature,
    agentA: string,
    agentB: string
  ): AgentConflict[] {
    const conflicts: AgentConflict[] = [];
    
    // Check naming conflicts
    const namingConflict = this.checkNamingConflicts(sigA, sigB, agentA, agentB);
    if (namingConflict) conflicts.push(namingConflict);
    
    // Check architectural conflicts
    const archConflict = this.checkArchitecturalConflicts(sigA, sigB, agentA, agentB);
    if (archConflict) conflicts.push(archConflict);
    
    // Check dependency conflicts
    const depConflict = this.checkDependencyConflicts(sigA, sigB, agentA, agentB);
    if (depConflict) conflicts.push(depConflict);
    
    // Check style conflicts
    const styleConflict = this.checkStyleConflicts(sigA, sigB, agentA, agentB);
    if (styleConflict) conflicts.push(styleConflict);
    
    return conflicts;
  }

  resolveConflict(conflict: AgentConflict): ConflictResolution {
    switch (conflict.type) {
      case 'naming':
        return this.resolveNamingConflict(conflict);
      case 'architecture':
        return this.resolveArchitecturalConflict(conflict);
      case 'dependency':
        return this.resolveDependencyConflict(conflict);
      case 'style':
        return this.resolveStyleConflict(conflict);
      default:
        return {
          strategy: 'manual',
          rationale: 'Unknown conflict type requires manual resolution',
          actions: ['Manual review required']
        };
    }
  }
}
```

### 3. Harmonizador de Código

```typescript
export class Context7CodeHarmonizer {
  private validator: Context7CodeValidator;
  private conflictDetector: Context7ConflictDetector;
  private transformations: CodeTransformation[];

  constructor() {
    this.validator = new Context7CodeValidator();
    this.conflictDetector = new Context7ConflictDetector();
    this.transformations = this.loadTransformations();
  }

  async harmonizeCodebase(
    agentOutputs: AgentOutput[],
    targetStandards: CodingStandards
  ): Promise<HarmonizationResult> {
    
    // 1. Detect conflicts
    const conflicts = await this.conflictDetector.detectConflicts(agentOutputs);
    
    // 2. Resolve conflicts
    const resolutions = conflicts.map(conflict => 
      this.conflictDetector.resolveConflict(conflict)
    );
    
    // 3. Apply transformations
    const harmonizedCode = await this.applyTransformations(
      agentOutputs,
      resolutions,
      targetStandards
    );
    
    // 4. Validate result
    const validationResult = await this.validator.validateCodebase(harmonizedCode.basePath);
    
    return {
      conflicts,
      resolutions,
      harmonizedCode,
      validationResult,
      metrics: this.calculateHarmonizationMetrics(conflicts, validationResult)
    };
  }

  private async applyTransformations(
    outputs: AgentOutput[],
    resolutions: ConflictResolution[],
    standards: CodingStandards
  ): Promise<HarmonizedCodebase> {
    
    const codebase: HarmonizedCodebase = {
      basePath: outputs[0].basePath,
      files: new Map(),
      metadata: {
        harmonizedAt: new Date(),
        agentsContributed: outputs.map(o => o.agentId),
        conflictsResolved: resolutions.length
      }
    };

    // Merge code from all agents
    for (const output of outputs) {
      for (const [filePath, content] of output.files) {
        if (codebase.files.has(filePath)) {
          // Handle file collision
          const merged = await this.mergeFiles(
            codebase.files.get(filePath)!,
            content,
            resolutions
          );
          codebase.files.set(filePath, merged);
        } else {
          codebase.files.set(filePath, content);
        }
      }
    }

    // Apply style transformations
    for (const [filePath, content] of codebase.files) {
      const transformed = await this.applyStyleTransformations(
        filePath,
        content,
        standards
      );
      codebase.files.set(filePath, transformed);
    }

    return codebase;
  }

  private async mergeFiles(
    existingContent: string,
    newContent: string,
    resolutions: ConflictResolution[]
  ): Promise<string> {
    // Implement intelligent file merging
    // This could use AST-based merging for code files
    // or line-based merging for simple text files
    
    const existingAST = this.parseToAST(existingContent);
    const newAST = this.parseToAST(newContent);
    
    const mergedAST = this.mergeASTs(existingAST, newAST, resolutions);
    
    return this.generateCodeFromAST(mergedAST);
  }
}
```

---

## Configuração de Validação

### biome.json - Configuração Unificada
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noUnusedTemplateLiteral": "error",
        "useConst": "error",
        "useShorthandPropertyAssignment": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "complexity": {
        "noBannedTypes": "error",
        "noUselessThisAlias": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noArrayIndexKey": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  },
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignore": [
      "node_modules/**",
      "dist/**",
      "**/*.min.js"
    ]
  }
}
```

### validation-config.yaml
```yaml
validation_config:
  quality_gates:
    minimum_score: 85
    style_compliance: 95
    type_coverage: 90
    documentation_coverage: 80
    
  naming_conventions:
    typescript:
      variables: "camelCase"
      functions: "camelCase" 
      classes: "PascalCase"
      interfaces: "PascalCase"
      enums: "PascalCase"
      constants: "UPPER_SNAKE_CASE"
      files: "kebab-case"
      
    python:
      variables: "snake_case"
      functions: "snake_case"
      classes: "PascalCase" 
      constants: "UPPER_SNAKE_CASE"
      files: "snake_case"
      
  architectural_patterns:
    error_handling: "consistent_error_types"
    async_patterns: "promise_based"
    module_structure: "barrel_exports"
    dependency_injection: "constructor_based"
    
  documentation_requirements:
    public_functions: "required"
    public_classes: "required"
    complex_algorithms: "required"
    api_endpoints: "required"
    
  conflict_resolution:
    style_conflicts: "automated_fix"
    naming_conflicts: "team_vote"
    architectural_conflicts: "architect_decision"
    dependency_conflicts: "latest_stable"
```

---

## Scripts de Validação

### validate-harmony.sh
```bash
#!/bin/bash

echo "🔍 Context7 Harmony Validation Starting..."

# 1. Style validation
echo "📝 Checking code style..."
npx biome check . --reporter=github
STYLE_EXIT=$?

# 2. Type checking
echo "🔍 Type checking..."
npx tsc --noEmit
TYPE_EXIT=$?

# 3. Custom harmony validation
echo "🤝 Checking agent harmony..."
node scripts/validate-agent-harmony.js
HARMONY_EXIT=$?

# 4. Cross-validation
echo "🔄 Cross-validating agent outputs..."
node scripts/cross-validate-agents.js
CROSS_EXIT=$?

# Summary
echo ""
echo "📊 Validation Summary:"
echo "Style: $([ $STYLE_EXIT -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "Types: $([ $TYPE_EXIT -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "Harmony: $([ $HARMONY_EXIT -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "Cross-validation: $([ $CROSS_EXIT -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")"

# Exit with error if any validation failed
if [ $STYLE_EXIT -ne 0 ] || [ $TYPE_EXIT -ne 0 ] || [ $HARMONY_EXIT -ne 0 ] || [ $CROSS_EXIT -ne 0 ]; then
    echo ""
    echo "❌ Validation failed. Please fix issues before continuing."
    exit 1
fi

echo ""
echo "✅ All validations passed! Code is harmonized."
exit 0
```

### validate-agent-harmony.js
```javascript
#!/usr/bin/env node

const { Context7CodeValidator } = require('./dist/validation/validator');
const { Context7ConflictDetector } = require('./dist/validation/conflicts');
const path = require('path');

async function main() {
  console.log('🤝 Validating agent harmony...');
  
  const validator = new Context7CodeValidator();
  const conflictDetector = new Context7ConflictDetector();
  
  // Validate codebase
  const validationResult = await validator.validateCodebase(process.cwd());
  
  console.log(`📊 Overall Score: ${validationResult.score}/100`);
  console.log(`🎯 Quality Gates: ${validationResult.passed ? 'PASSED' : 'FAILED'}`);
  
  if (validationResult.issues.length > 0) {
    console.log('\n📋 Issues Found:');
    validationResult.issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${issue.file}:${issue.line} - ${issue.message}`);
      if (issue.suggestion) {
        console.log(`   💡 ${issue.suggestion}`);
      }
    });
  }
  
  if (validationResult.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    validationResult.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
  }
  
  process.exit(validationResult.passed ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
```

---

## Integração Contínua

### GitHub Action - Harmony Check
```yaml
name: Context7 Harmony Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  harmony-validation:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build validation tools
        run: npm run build
        
      - name: Run harmony validation
        run: ./scripts/validate-harmony.sh
        
      - name: Generate harmony report
        if: always()
        run: |
          node scripts/generate-harmony-report.js > harmony-report.md
          
      - name: Upload harmony report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: harmony-report
          path: harmony-report.md
          
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('harmony-report.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🤝 Context7 Harmony Report\n\n${report}`
            });
```

Este framework garante que os 3 agentes (Orchestrator, MCP Specialist, Library Researcher e Code Harmonizer) trabalhem em perfeita harmonia, produzindo código consistente, de alta qualidade e livre de conflitos.