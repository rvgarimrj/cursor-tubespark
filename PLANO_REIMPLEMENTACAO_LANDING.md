# Plano de Reimplementação - Nova Landing Page com i18n Funcional

## Objetivo
Reimplementar a nova landing page e sistema de parceria preservando o funcionamento do sistema i18n.

## Estratégia Passo a Passo

### Fase 1: Preparação (Pré-requisitos)
1. ✅ Sistema i18n funcionando (atual)
2. ✅ Backup do estado quebrado disponível
3. ✅ Documentação do problema

### Fase 2: Setup Inicial
```bash
# 1. Criar novo branch
git checkout -b feat/landing-page-v2-with-i18n

# 2. Verificar sistema atual
npm run dev
# Testar: localhost:3000/pt, /en, /es, /fr
```

### Fase 3: Implementação Incremental

#### Passo 1: Adicionar componentes da landing page
- [ ] Criar pasta `components/landing/` 
- [ ] Adicionar componentes um por um:
  - [ ] HeroSection.tsx
  - [ ] FeaturesSection.tsx
  - [ ] TestimonialsSection.tsx
  - [ ] PricingSection.tsx
  - [ ] FAQSection.tsx
  - [ ] CTASection.tsx

#### Passo 2: Adicionar traduções
- [ ] Expandir `lib/i18n/locales/pt.json` com textos da landing
- [ ] Expandir `lib/i18n/locales/en.json`
- [ ] Expandir `lib/i18n/locales/es.json`
- [ ] Expandir `lib/i18n/locales/fr.json`

**Estrutura sugerida**:
```json
{
  "landing": {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "cta": "..."
    },
    "features": {
      "title": "...",
      "items": [...]
    }
  }
}
```

#### Passo 3: Integrar componentes na página
- [ ] Modificar `app/[locale]/page.tsx` incrementalmente
- [ ] Usar `useTranslations('landing')` nos componentes
- [ ] Testar após cada componente adicionado

#### Passo 4: Sistema de Parceria
- [ ] Criar rotas API em `app/api/creators/`
- [ ] Adicionar páginas em `app/[locale]/creators/`
- [ ] Traduzir interface do sistema de parceria

### Fase 4: Testes Extensivos

#### Checklist de Testes i18n:
- [ ] Navegação direta: `/pt`, `/en`, `/es`, `/fr`
- [ ] Redirecionamento de `/` para locale padrão
- [ ] Seletor de idiomas funcionando
- [ ] Todas as traduções carregando
- [ ] Links internos preservando locale
- [ ] Páginas de auth com locale

#### Checklist de Funcionalidades:
- [ ] Landing page responsiva
- [ ] Sistema de parceria funcional
- [ ] Integração com Stripe
- [ ] Analytics e tracking

### Fase 5: Code Review e Merge

#### Antes do Merge:
1. [ ] Executar `npm run build`
2. [ ] Testar build de produção
3. [ ] Verificar todos os locales
4. [ ] Documentar mudanças

## Regras Críticas

### ❌ NÃO FAZER:
1. Não modificar `lib/i18n/config.ts`
2. Não criar `i18n/request.ts`
3. Não alterar `next.config.js` (exceto se necessário, com muito cuidado)
4. Não simplificar `app/[locale]/layout.tsx`
5. Não remover providers do layout

### ✅ SEMPRE FAZER:
1. Testar i18n após cada mudança
2. Commitar incrementalmente
3. Usar estrutura de tradução existente
4. Preservar `NextIntlClientProvider`
5. Manter rotas com prefixo de locale

## Estrutura de Commits Sugerida

```
feat(landing): add hero section component
feat(landing): add features section
feat(i18n): add landing page translations
feat(landing): integrate hero with i18n
feat(creators): add partnership system API
feat(creators): add partnership pages with i18n
test: verify i18n functionality across all pages
docs: update landing page implementation
```

## Comando de Emergência

Se algo quebrar:
```bash
# Voltar ao estado funcional
git reset --hard c3d7b25
```

## Resultado Esperado

✅ Nova landing page implementada
✅ Sistema de parceria funcional
✅ i18n funcionando em todas as páginas
✅ Todos os 4 idiomas suportados
✅ Build de produção sem erros