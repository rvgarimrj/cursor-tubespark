# 📋 PLANO DETALHADO - FASE 2.5: TEMA E INTERNACIONALIZAÇÃO

## 📊 STATUS DA ANÁLISE

### ✅ Análise Completa da Estrutura Atual:
- **Framework**: Next.js 14.2.0 com App Router ✅
- **Styling**: Tailwind CSS com dark mode já configurado ✅
- **CSS Variables**: Cores para light/dark já definidas no globals.css ✅
- **Authentication**: Stack Auth implementado com providers ✅
- **Components**: Dashboard components já criados ✅
- **Dependencies**: Estrutura base preparada ✅

### 🎯 Objetivo da Fase 2.5:
Implementar sistema completo de temas (dark/light/auto) e internacionalização (PT/EN/ES/FR) com troca em tempo real, sem reload da página.

---

## 🗺️ IMPLEMENTAÇÃO STEP-BY-STEP

### **ETAPA 1: Setup de Dependências e Configuração Base**
**Duração estimada: 1-2 horas**

#### 1.1 Instalar Dependências Necessárias
```bash
npm install next-themes next-intl
npm install @types/node  # Se não estiver instalado
```

#### 1.2 Configuração do next.config.js
```javascript
// Adicionar configuração de i18n
const nextConfig = {
  experimental: {
    // Configurações para next-intl
  }
}
```

---

### **ETAPA 2: Sistema de Temas**
**Duração estimada: 3-4 horas**

#### 2.1 Criar Provider de Tema
**Arquivo**: `lib/theme/theme-provider.tsx`
```typescript
// Provider que envolve a aplicação com next-themes
// Configuração para persistir tema no localStorage
// Suporte a auto (baseado no sistema)
```

#### 2.2 Criar Hook Personalizado de Tema
**Arquivo**: `lib/theme/use-theme.ts`
```typescript
// Hook que abstrai a lógica do next-themes
// Funcionalidades de toggle e estado do tema
```

#### 2.3 Componente Toggle de Tema
**Arquivo**: `components/theme-toggle.tsx`
```typescript
// Botão toggle para header do dashboard
// Ícones: Sun/Moon/Auto
// Estados visuais claros
```

#### 2.4 Atualizar Layout Principal
**Arquivo**: `app/layout.tsx`
```typescript
// Envolver com ThemeProvider
// Configurar suppressHydrationWarning
// Manter classe 'dark' no html para Tailwind
```

#### 2.5 Atualizar Componentes Dashboard
**Arquivos**: `components/dashboard/header.tsx`, `components/dashboard/sidebar.tsx`
```typescript
// Adicionar toggle de tema no header
// Atualizar classes para suportar dark mode
// Testar todos os estados visuais
```

---

### **ETAPA 3: Sistema de Internacionalização**
**Duração estimada: 4-5 horas**

#### 3.1 Configuração do next-intl
**Arquivo**: `lib/i18n/config.ts`
```typescript
// Configuração de idiomas suportados
// Configuração de fallback
// Configuração de detecção de idioma
```

#### 3.2 Estrutura de Traduções
**Estrutura de pastas**:
```
lib/i18n/locales/
├── pt.json      # Português (padrão)
├── en.json      # Inglês
├── es.json      # Espanhol
└── fr.json      # Francês
```

#### 3.3 Hook Personalizado de Tradução
**Arquivo**: `lib/i18n/use-translation.ts`
```typescript
// Hook que simplifica o uso de traduções
// Funcionalidade de formatação
// Fallback automático
```

#### 3.4 Componente Seletor de Idioma
**Arquivo**: `components/language-selector.tsx`
```typescript
// Dropdown/select para escolha de idioma
// Bandeiras ou códigos de idioma
// Mudança sem reload
```

---

### **ETAPA 4: Roteamento por Idioma**
**Duração estimada: 2-3 horas**

#### 4.1 Reestruturar App Router
**Nova estrutura**:
```
app/
├── [locale]/           # Roteamento dinâmico por idioma
│   ├── page.tsx       # Home page
│   ├── dashboard/     # Dashboard pages
│   ├── auth/          # Auth pages
│   └── layout.tsx     # Layout com i18n
├── layout.tsx         # Root layout
└── globals.css
```

#### 4.2 Middleware para Redirecionamento
**Arquivo**: `middleware.ts` (atualizar)
```typescript
// Adicionar lógica de detecção de idioma
// Redirecionamento baseado em Accept-Language
// Manter autenticação funcionando
```

---

### **ETAPA 5: Traduções Completas**
**Duração estimada: 6-8 horas**

#### 5.1 Mapear Todos os Textos
- Páginas de autenticação (login, registro, forgot password, reset)
- Dashboard e navegação
- Componentes UI base
- Mensagens de erro/sucesso
- Tooltips e labels
- Placeholders de formulários

#### 5.2 Criar Estrutura JSON por Categoria
**Exemplo de pt.json**:
```json
{
  "auth": {
    "login": {
      "title": "Entrar na sua conta",
      "email": "E-mail",
      "password": "Senha",
      "submit": "Entrar",
      "forgotPassword": "Esqueceu a senha?",
      "errors": {
        "invalid": "Credenciais inválidas"
      }
    }
  },
  "dashboard": {
    "sidebar": {
      "dashboard": "Dashboard",
      "ideas": "Ideias",
      "trends": "Tendências"
    }
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "loading": "Carregando..."
  }
}
```

#### 5.3 Atualizar Todos os Componentes
- Substituir textos hardcoded por hooks de tradução
- Testar todos os idiomas
- Verificar formatação e contexto

---

### **ETAPA 6: Página de Configurações**
**Duração estimada: 3-4 horas**

#### 6.1 Criar Estrutura de Settings
**Arquivos**:
```
app/[locale]/dashboard/settings/
├── page.tsx              # Lista de configurações
├── appearance/
│   └── page.tsx          # Configurações de aparência
└── layout.tsx            # Layout de settings
```

#### 6.2 Interface de Configurações de Aparência
**Funcionalidades**:
- Seletor de tema (Light/Dark/Auto) com preview
- Seletor de idioma com aplicação imediata
- Preview das mudanças em tempo real
- Salvar preferências automaticamente

#### 6.3 Persistência de Preferências
- localStorage para tema
- Cookies para idioma (para SSR)
- Sincronização entre abas

---

### **ETAPA 7: Testes e Refinamentos**
**Duração estimada: 2-3 horas**

#### 7.1 Testes Funcionais
- [ ] Toggle de tema funciona em todas as páginas
- [ ] Mudança de idioma sem reload
- [ ] Persistência entre sessões
- [ ] Funcionamento em SSR/SSG
- [ ] Fallbacks funcionando

#### 7.2 Testes de UX
- [ ] Transições suaves
- [ ] Estados de loading
- [ ] Feedback visual claro
- [ ] Acessibilidade

#### 7.3 Testes Cross-browser
- [ ] Chrome/Safari/Firefox
- [ ] Mobile responsivo
- [ ] Dark mode do sistema

---

## 📁 ESTRUTURA FINAL DE ARQUIVOS

```
tubespark/
├── app/
│   ├── [locale]/                    # Roteamento por idioma
│   │   ├── auth/                   # Páginas de autenticação
│   │   ├── dashboard/              # Dashboard
│   │   │   └── settings/
│   │   │       └── appearance/     # Configurações de aparência
│   │   ├── layout.tsx              # Layout com i18n
│   │   └── page.tsx                # Home page
│   ├── globals.css                 # Estilos globais (já configurado)
│   └── layout.tsx                  # Root layout com providers
├── components/
│   ├── theme-toggle.tsx            # Toggle de tema
│   ├── language-selector.tsx       # Seletor de idioma
│   └── dashboard/                  # Componentes dashboard (atualizados)
├── lib/
│   ├── theme/
│   │   ├── theme-provider.tsx      # Provider de tema
│   │   └── use-theme.ts           # Hook de tema
│   └── i18n/
│       ├── config.ts              # Configuração i18n
│       ├── use-translation.ts     # Hook de tradução
│       └── locales/               # Arquivos de tradução
│           ├── pt.json            # Português
│           ├── en.json            # Inglês
│           ├── es.json            # Espanhol
│           └── fr.json            # Francês
├── middleware.ts                   # Middleware atualizado
├── next.config.js                  # Configuração Next.js
└── package.json                    # Dependências atualizadas
```

---

## 🎯 CRONOGRAMA DE IMPLEMENTAÇÃO

### **DIA 1-2: Setup e Temas**
- [x] Etapa 1: Setup de dependências
- [x] Etapa 2: Sistema de temas completo
- **Entregável**: Toggle de tema funcionando

### **DIA 3-4: Internacionalização Base**
- [x] Etapa 3: Sistema de i18n
- [x] Etapa 4: Roteamento por idioma
- **Entregável**: Mudança de idioma funcionando

### **DIA 5-7: Traduções**
- [x] Etapa 5: Traduções completas
- **Entregável**: Todas as páginas traduzidas

### **DIA 8-9: Configurações e Testes**
- [x] Etapa 6: Página de configurações
- [x] Etapa 7: Testes e refinamentos
- **Entregável**: Feature completa e testada

---

## 🔧 COMANDOS ÚTEIS PARA IMPLEMENTAÇÃO

### Setup Inicial:
```bash
# Instalar dependências
npm install next-themes next-intl

# Testar desenvolvimento
npm run dev

# Verificar tipos
npm run type-check
```

### Durante desenvolvimento:
```bash
# Verificar tradução específica
# Testar build de produção
npm run build

# Verificar se não há erros de hidratação
# Testar em diferentes idiomas e temas
```

---

## 🎨 DESIGN CONSIDERATIONS

### **Temas**:
- **Light**: Fundo branco, texto escuro (atual)
- **Dark**: Fundo escuro, texto claro (já configurado no CSS)
- **Auto**: Segue preferência do sistema

### **Idiomas**:
- **PT-BR**: Português brasileiro (padrão)
- **EN-US**: Inglês americano
- **ES-ES**: Espanhol europeu
- **FR-FR**: Francês francês

### **UX Patterns**:
- Toggle de tema no header do dashboard
- Seletor de idioma no header ou configurações
- Mudanças aplicadas imediatamente
- Estados de loading mínimos
- Feedback visual claro

---

## ✅ CRITÉRIOS DE SUCESSO

### **Funcionalidade**:
- [ ] Tema persiste entre sessões
- [ ] Idioma muda sem reload
- [ ] SSR funciona corretamente
- [ ] Todas as strings traduzidas
- [ ] Fallbacks funcionando

### **Performance**:
- [ ] Sem layout shift
- [ ] Mudanças instantâneas
- [ ] Bundle size otimizado
- [ ] Hydration sem erros

### **UX**:
- [ ] Interface intuitiva
- [ ] Transições suaves
- [ ] Estados claros
- [ ] Acessibilidade mantida

---

**Tempo total estimado**: 20-25 horas (1-2 semanas de trabalho)
**Complexidade**: Média-Alta
**Dependências**: Nenhuma externa
**Riscos**: Configuração de roteamento, testes de SSR

**Próxima sessão**: Começar pela Etapa 1 (Setup) e Etapa 2 (Temas)