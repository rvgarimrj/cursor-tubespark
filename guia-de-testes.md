# 📋 GUIA DE TESTES - TUBESPARK

**Para**: Equipe de Testes  
**Objetivo**: Validar funcionalidades implementadas  
**Tempo estimado**: 30-45 minutos

---

## 🚀 ANTES DE COMEÇAR

### Pré-requisitos
1. **Aplicação rodando**: Acesse http://localhost:3000
2. **Conta de teste**: Faça login com usuário válido
3. **Navegador**: Chrome ou Firefox (versão recente)

### Como usar este guia
- Siga os passos **exatamente** como descritos
- Marque ✅ ou ❌ para cada verificação
- Anote problemas encontrados na seção de observações

---

## 📝 TESTE 1: PÁGINA DE IDEIAS (ALTA PRIORIDADE)

### O que estamos testando
Verificar se a página de ideias carrega dados reais do banco (não mais dados falsos).

### Passos para testar
1. **Acesse**: http://localhost:3000/pt/ideas
2. **Aguarde**: A página carregar completamente
3. **Observe**: Se há ideias na tela ou mensagem "Nenhuma ideia ainda"

### Verificações
- [ ] ✅ Página carrega sem erros
- [ ] ✅ Se há ideias: mostram título, descrição, categoria
- [ ] ✅ Se não há ideias: mostra botão "Gerar Primeira Ideia"
- [ ] ✅ Não vejo dados como "10 AI Tools That Will Change Video Editing Forever" (eram dados falsos)

### ❌ Reprovar se
- Página não carrega
- Aparece erro na tela
- Dados parecem falsos/repetitivos

---

## 🎯 TESTE 2: GERAR NOVA IDEIA

### O que estamos testando
Verificar se o botão "Generate New Idea" realmente gera e salva ideias.

### Passos para testar
1. **Na página de ideias**, clique no botão **"Generate New Idea"**
2. **Aguarde**: Aparece "Generating..." com loading
3. **Espere**: Processo completar (pode demorar 10-30 segundos)
4. **Observe**: Nova ideia aparece no topo da lista

### Verificações
- [ ] ✅ Botão mostra loading ("Generating...")
- [ ] ✅ Nova ideia aparece após geração
- [ ] ✅ Ideia tem título único (não repetido)
- [ ] ✅ Ideia tem descrição, categoria, trend score
- [ ] ✅ Badge "Nova" aparece na ideia recém-criada

### ❌ Reprovar se
- Botão não funciona
- Erro aparece na tela
- Ideia não é salva/não aparece
- Loading nunca termina

---

## ⭐ TESTE 3: SISTEMA DE FAVORITOS

### O que estamos testando
Verificar se favoritar ideias funciona e os favoritos persistem.

### Passos para testar
1. **Encontre uma ideia** na lista
2. **Clique na estrela** (ícone de favorito)
3. **Observe**: Estrela fica amarela/preenchida
4. **Recarregue a página** (F5)
5. **Verifique**: Estrela continua amarela

### Verificações
- [ ] ✅ Clicar na estrela muda visual imediatamente
- [ ] ✅ Estrela fica amarela quando favoritada
- [ ] ✅ Após recarregar página, favorito permanece
- [ ] ✅ Clicar novamente desfavorita (estrela fica vazia)

### ❌ Reprovar se
- Estrela não muda ao clicar
- Favorito some após recarregar página
- Erro aparece ao favoritar

---

## 📊 TESTE 4: DASHBOARD COM DADOS REAIS

### O que estamos testando
Verificar se o dashboard mostra estatísticas verdadeiras do usuário.

### Passos para testar
1. **Acesse**: http://localhost:3000/pt/dashboard
2. **Observe os números** nos cards de estatísticas
3. **Compare** com quantas ideias você tem na página de ideias

### Verificações
- [ ] ✅ "Ideas Generated" mostra número correto de ideias
- [ ] ✅ Seção "Recent Ideas" mostra suas ideias reais
- [ ] ✅ Se não há ideias, mostra "Nenhuma ideia gerada ainda"
- [ ] ✅ Números fazem sentido (não são 24, 87, 8, 156K - eram falsos)

### ❌ Reprovar se
- Números não batem com realidade
- Mostra sempre os mesmos números falsos
- Seção "Recent Ideas" está vazia quando há ideias

---

## 🌍 TESTE 5: MÚLTIPLOS IDIOMAS

### O que estamos testando
Verificar se a aplicação funciona em português, inglês, espanhol e francês.

### Passos para testar
1. **Teste em Português**: http://localhost:3000/pt/ideas
2. **Teste em Inglês**: http://localhost:3000/en/ideas
3. **Teste em Espanhol**: http://localhost:3000/es/ideas
4. **Teste em Francês**: http://localhost:3000/fr/ideas

### Verificações para CADA idioma
- [ ] ✅ Página carrega sem erro
- [ ] ✅ Layout não quebra
- [ ] ✅ Botão "Generate New Idea" funciona
- [ ] ✅ Suas ideias aparecem normalmente

### ❌ Reprovar se
- Qualquer idioma não carrega
- Layout quebra em algum idioma
- Funcionalidades param de funcionar

---

## 📱 TESTE 6: VERSÃO MOBILE

### O que estamos testando
Verificar se funciona bem em celular/tablet.

### Passos para testar
1. **Abra DevTools** (F12 no Chrome)
2. **Clique no ícone de celular** (toggle device toolbar)
3. **Selecione**: iPhone SE ou similar
4. **Teste as páginas**: ideias e dashboard

### Verificações
- [ ] ✅ Texto permanece legível
- [ ] ✅ Botões são clicáveis facilmente
- [ ] ✅ Layout se reorganiza para tela pequena
- [ ] ✅ Todas as funcionalidades funcionam
- [ ] ✅ Menu lateral funciona no mobile

### ❌ Reprovar se
- Texto muito pequeno para ler
- Botões difíceis de tocar
- Layout quebrado/cortado
- Funcionalidades não funcionam

---

## 📄 TESTE 7: VISUALIZAR ROTEIROS

### O que estamos testando
Verificar se conseguimos ver roteiros gerados.

### Passos para testar (PRÉ-REQUISITO: ter uma ideia gerada)
1. **Na página de ideias**, clique em **"Criar Roteiro"** em uma ideia
2. **No modal que abre**, escolha "Básico" e clique **"Generate Script"**
3. **Aguarde** a geração completar
4. **Vá para**: http://localhost:3000/dashboard/scripts
5. **Clique em "Abrir Roteiro"** no roteiro criado

### Verificações
- [ ] ✅ Modal de geração abre corretamente
- [ ] ✅ Roteiro é gerado sem erros
- [ ] ✅ Lista de roteiros mostra o roteiro criado
- [ ] ✅ Página de visualização carrega corretamente
- [ ] ✅ Posso copiar seções do roteiro
- [ ] ✅ Botão "Download" funciona

### ❌ Reprovar se
- Modal não abre
- Roteiro não é gerado
- Página de visualização não carrega
- Botões não funcionam

---

## 📋 TESTE 8: LISTA DE ROTEIROS

### O que estamos testando
Verificar se a página de lista de roteiros funciona bem.

### Passos para testar (PRÉ-REQUISITO: ter pelo menos 1 roteiro)
1. **Acesse**: http://localhost:3000/dashboard/scripts
2. **Use a busca**: Digite parte do título de uma ideia
3. **Use o filtro**: Selecione "Básico" ou "Premium"

### Verificações
- [ ] ✅ Lista mostra roteiros existentes
- [ ] ✅ Busca filtra resultados em tempo real
- [ ] ✅ Filtro de tipo funciona
- [ ] ✅ Cards mostram informações corretas
- [ ] ✅ Botões "Visualizar" funcionam

### ❌ Reprovar se
- Lista não carrega
- Busca não funciona
- Filtros não filtram
- Links quebrados

---

## 💳 TESTE 9: PÁGINA DE PREÇOS

### O que estamos testando
Verificar se a página de pricing carrega e funciona.

### Passos para testar
1. **Acesse**: http://localhost:3000/pricing
2. **Observe** os 3 planos apresentados
3. **NÃO CLIQUE** em "Fazer Upgrade" (pode gerar cobrança real)

### Verificações
- [ ] ✅ Página carrega corretamente
- [ ] ✅ 3 planos visíveis: Starter ($9.99), Pro ($29.99), Business ($99.99)
- [ ] ✅ Features listadas para cada plano
- [ ] ✅ Design está bonito e profissional
- [ ] ✅ FAQ na parte inferior

### ❌ Reprovar se
- Página não carrega
- Preços não aparecem
- Layout quebrado
- Informações confusas

---

## 🔄 TESTE 10: TRACKING DE AÇÕES

### O que estamos testando
Verificar se o sistema registra as ações do usuário (invisível, mas importante).

### Passos para testar
1. **Execute estas ações**:
   - Favorite 2 ideias
   - Compartilhe 1 ideia (clique no botão share)
   - Copie conteúdo de 1 ideia
   - Clique em "Criar Roteiro" (pode cancelar)

### Verificações
- [ ] ✅ Todas as ações executam sem erro
- [ ] ✅ Console do navegador não mostra erros vermelhos
- [ ] ✅ Ações são rápidas e responsivas

### ❌ Reprovar se
- Qualquer ação gera erro
- Console mostra muitos erros vermelhos
- Ações são muito lentas

---

## 📊 RELATÓRIO FINAL

### Resumo dos Testes
- **Total de verificações**: ___/50
- **Testes aprovados**: ___/10
- **Testes reprovados**: ___/10

### Funcionalidades Críticas (DEVEM FUNCIONAR)
- [ ] Gerar ideias
- [ ] Favoritar ideias  
- [ ] Dashboard com dados reais
- [ ] Criar e visualizar roteiros

### Problemas Encontrados
```
1. _________________________________
2. _________________________________
3. _________________________________
```

### Observações Gerais
```
_____________________________________
_____________________________________
_____________________________________
```

### Aprovação Final
- [ ] ✅ **APROVADO** - Sistema pronto para uso
- [ ] ❌ **REPROVADO** - Necessita correções

**Testador**: ________________  
**Data**: ___/___/2025  
**Tempo gasto**: ___ minutos

---

## 🆘 EM CASO DE PROBLEMAS

### Se algo não funciona
1. **Recarregue a página** (F5)
2. **Verifique se está logado**
3. **Abra Console** (F12) e veja se há erros vermelhos
4. **Tire screenshot** do problema
5. **Anote os passos** que levaram ao erro

### Contatos para Suporte
- **Desenvolvedor**: [seu-contato]
- **Canal de comunicação**: [slack/teams/etc]

---

**Este guia foi criado para validar as 10 funcionalidades implementadas no TubeSpark. Siga todos os passos para garantir que o sistema está funcionando corretamente.**