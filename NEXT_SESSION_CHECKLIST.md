# 📋 CHECKLIST PARA PRÓXIMA SESSÃO DE DESENVOLVIMENTO

## 🎯 OBJETIVO DA SESSÃO
**Implementar Etapa 1 e 2 do Plano: Setup + Sistema de Temas**

---

## ⚡ PREPARAÇÃO PRÉ-SESSÃO

### Verificações Iniciais:
- [ ] Projeto rodando sem erros (`npm run dev`)
- [ ] Git com alterações commitadas
- [ ] Node.js e npm atualizados
- [ ] Editor configurado para TypeScript

### Backup de Segurança:
- [ ] Commit atual: "feat: implement complete password reset functionality"
- [ ] Branch main limpo
- [ ] Backup do layout.tsx atual
- [ ] Backup do globals.css atual

---

## 🚀 ETAPA 1: SETUP DE DEPENDÊNCIAS (30 min)

### 1.1 Instalar Dependências
```bash
cd /Users/user/AppsCalude/cursor-aitubespark/tubespark
npm install next-themes next-intl
```

### 1.2 Verificar Instalação
- [ ] Verificar package.json atualizado
- [ ] Testar `npm run dev` ainda funciona
- [ ] Verificar types disponíveis

### 1.3 Criar Estruturas de Pastas
```bash
mkdir -p lib/theme
mkdir -p lib/i18n/locales
mkdir -p components/ui
```

---

## 🎨 ETAPA 2: SISTEMA DE TEMAS (2-3 horas)

### 2.1 Criar Provider de Tema (45 min)
**Arquivo**: `lib/theme/theme-provider.tsx`

**Checklist de implementação**:
- [ ] Importar ThemeProvider do next-themes
- [ ] Configurar attribute="class" (para Tailwind)
- [ ] Configurar defaultTheme="system"
- [ ] Configurar enableSystem={true}
- [ ] Configurar storageKey="tubespark-theme"
- [ ] Adicionar suppressHydrationWarning
- [ ] Exportar componente funcional

**Teste básico**:
- [ ] Provider renderiza sem erros
- [ ] Console sem warnings de hydration

### 2.2 Criar Hook de Tema (30 min)
**Arquivo**: `lib/theme/use-theme.ts`

**Checklist de implementação**:
- [ ] Re-exportar useTheme do next-themes
- [ ] Adicionar types personalizados se necessário
- [ ] Criar helper functions (isLight, isDark, etc.)
- [ ] Documentar uso do hook

### 2.3 Componente Toggle de Tema (60 min)
**Arquivo**: `components/theme-toggle.tsx`

**Checklist de implementação**:
- [ ] Importar ícones Sun, Moon, Monitor do lucide-react
- [ ] Usar hook useTheme
- [ ] Implementar três estados: light, dark, system
- [ ] Adicionar tooltips descritivos
- [ ] Estilizar com classes Tailwind consistentes
- [ ] Adicionar animações suaves
- [ ] Adicionar aria-labels para acessibilidade

**Estados a implementar**:
- [ ] Light mode: ícone Sun, tooltip "Modo claro"
- [ ] Dark mode: ícone Moon, tooltip "Modo escuro"  
- [ ] System mode: ícone Monitor, tooltip "Seguir sistema"

### 2.4 Atualizar Layout Principal (30 min)
**Arquivo**: `app/layout.tsx`

**Checklist de implementação**:
- [ ] Importar ThemeProvider de lib/theme/theme-provider
- [ ] Envolver children com <ThemeProvider>
- [ ] Manter AuthProvider funcionando
- [ ] Adicionar suppressHydrationWarning no body
- [ ] Testar se não quebra autenticação

**Estrutura final**:
```tsx
<html lang="en">
  <body suppressHydrationWarning>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </body>
</html>
```

### 2.5 Atualizar Header do Dashboard (45 min)
**Arquivo**: `components/dashboard/header.tsx`

**Checklist de implementação**:
- [ ] Importar ThemeToggle
- [ ] Adicionar toggle na área do usuário (lado direito)
- [ ] Atualizar classes para suportar dark:*
- [ ] Testar todos os elementos visuais
- [ ] Verificar contraste em ambos os temas

**Classes a atualizar**:
- [ ] `bg-white` → `bg-white dark:bg-gray-900`
- [ ] `border-gray-200` → `border-gray-200 dark:border-gray-700`
- [ ] `text-gray-900` → `text-gray-900 dark:text-white`
- [ ] Todas as outras classes de cor

### 2.6 Atualizar Layout do Dashboard (30 min)
**Arquivo**: `app/dashboard/layout.tsx`

**Checklist de implementação**:
- [ ] Atualizar `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- [ ] Verificar se sidebar também foi atualizada
- [ ] Testar navegação entre páginas
- [ ] Verificar scroll e overflow

### 2.7 Testes do Sistema de Temas (30 min)

**Testes manuais obrigatórios**:
- [ ] Toggle funciona no header
- [ ] Mudança é instantânea (sem flash)
- [ ] Tema persiste após reload da página
- [ ] Tema persiste entre abas
- [ ] Modo system funciona (testar mudando tema do OS)
- [ ] Todas as cores estão corretas em dark mode
- [ ] Não há elementos "invisíveis" em dark mode
- [ ] Contraste adequado em ambos os temas

**Testes técnicos**:
- [ ] Console sem erros de hydration
- [ ] localStorage com chave 'tubespark-theme'
- [ ] Classes 'dark' aplicadas no html
- [ ] CSS variables funcionando

---

## 📝 ENTREGÁVEIS DA SESSÃO

### Arquivos Criados:
- [ ] `lib/theme/theme-provider.tsx`
- [ ] `lib/theme/use-theme.ts`
- [ ] `components/theme-toggle.tsx`

### Arquivos Modificados:
- [ ] `app/layout.tsx`
- [ ] `components/dashboard/header.tsx`
- [ ] `app/dashboard/layout.tsx`
- [ ] `package.json` (dependências)

### Funcionalidades Implementadas:
- [ ] ✅ Toggle de tema no header do dashboard
- [ ] ✅ Persistência do tema entre sessões
- [ ] ✅ Suporte a modo system (auto)
- [ ] ✅ Dark mode completo funcionando
- [ ] ✅ Transições suaves

---

## 🐛 TROUBLESHOOTING

### Problemas Comuns e Soluções:

**Erro de Hydration**:
- Verificar suppressHydrationWarning
- Verificar se useTheme não é chamado no SSR

**Tema não persiste**:
- Verificar storageKey no provider
- Verificar se localStorage está disponível

**Classes dark: não funcionam**:
- Verificar se attribute="class" está no provider
- Verificar se tailwind.config.ts tem darkMode: ["class"]

**Flash de tema incorreto**:
- Verificar se provider está no lugar correto
- Verificar se não há renderização condicional

---

## 📋 VALIDAÇÃO FINAL

### Critérios de Sucesso da Sessão:
- [ ] ✅ Dependências instaladas e funcionando
- [ ] ✅ Toggle de tema visível e funcional
- [ ] ✅ Dark mode aplicado em todos os componentes
- [ ] ✅ Tema persiste entre sessões
- [ ] ✅ Modo system funciona corretamente
- [ ] ✅ Sem erros no console
- [ ] ✅ Performance mantida

### Se Tudo Funcionou:
**✅ Commit**: "feat: implement complete theme system with dark/light/auto modes"

### Preparação para Próxima Sessão:
- [ ] Roadmap atualizado com progresso
- [ ] Issues identificados documentados
- [ ] Next steps claros para i18n

---

## 🎯 PRÓXIMOS PASSOS (Sessão Seguinte)

1. **Etapa 3**: Sistema de Internacionalização
2. **Etapa 4**: Roteamento por idioma
3. **Etapa 5**: Traduções básicas

**Tempo estimado da próxima sessão**: 3-4 horas
**Foco**: Configurar next-intl e idiomas básicos

---

**Data de criação**: 30 de Janeiro de 2025
**Estimativa de tempo**: 3-4 horas
**Sessão**: Setup + Temas (Etapas 1 e 2)