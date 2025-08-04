# Relatório de Rollback - Sistema i18n

**Data**: 3 de Agosto de 2025
**Problema**: Sistema de internacionalização (i18n) parou de funcionar após implementação da nova landing page

## Resumo do Problema

O sistema i18n deixou de funcionar após o commit `b5bf12f` que implementou o novo sistema de parceria e redesign da landing page. 

## Análise da Causa

### Arquivos Conflitantes
1. **Duplicação de configuração**: 
   - Arquivo original: `lib/i18n/config.ts` (com função getRequestConfig)
   - Arquivo duplicado criado: `i18n/request.ts`
   - O `next.config.js` foi alterado para apontar para o arquivo duplicado

2. **Modificações no layout**:
   - O arquivo `app/[locale]/layout.tsx` foi simplificado demais, removendo providers essenciais

3. **Estrutura de arquivos alterada**:
   - Mudanças na estrutura de pastas quebraram as importações

## Solução Aplicada

1. **Rollback para commit funcional**: 
   - Executado: `git reset --hard c3d7b25`
   - Este commit é anterior às mudanças da landing page

2. **Limpeza**:
   - Removido arquivo duplicado `i18n/request.ts`
   - Mantida configuração original em `lib/i18n/config.ts`

## Estado Atual

✅ **Sistema i18n funcionando corretamente**:
- Redirecionamento automático para locale padrão (pt)
- Traduções carregando corretamente em todos os idiomas
- Seletor de idiomas funcional
- Rotas com prefixo de locale funcionando (/pt, /en, /es, /fr)

## Recomendações para Reimplementação

Ao reimplementar a nova landing page, seguir estas diretrizes:

1. **Não modificar a estrutura i18n existente**:
   - Manter `lib/i18n/config.ts` como arquivo principal
   - Não criar arquivos duplicados de configuração

2. **Preservar providers no layout**:
   - Manter `NextIntlClientProvider` no layout
   - Não simplificar demais o arquivo de layout

3. **Testar incrementalmente**:
   - Implementar mudanças em pequenos commits
   - Testar i18n após cada mudança significativa

4. **Usar a estrutura existente**:
   - Utilizar `landingTranslations` para textos da landing page
   - Seguir o padrão existente de tradução

## Backup

Foi criado um branch de backup antes do rollback:
- Branch: `backup-before-rollback`
- Contém o estado com a nova landing page (mas i18n quebrado)

## Próximos Passos

1. Criar novo branch para reimplementar a landing page
2. Aplicar mudanças preservando a estrutura i18n
3. Testar extensivamente antes de fazer merge