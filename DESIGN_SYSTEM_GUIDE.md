# TubeSpark Design System Guide

Este guia apresenta o sistema de design unificado da TubeSpark, baseado na identidade visual da landing page e aplicável a toda a aplicação.

## 🎨 Visão Geral

O design system da TubeSpark foi criado para garantir consistência visual em toda a aplicação, seguindo a identidade estabelecida na landing page com:
- **Paleta de cores**: Gradientes azul-roxo (#667eea → #764ba2) como primário
- **Tipografia**: Inter font family com hierarquia clara
- **Componentes**: Glass morphism e hover effects consistentes
- **Layout**: Containers e seções padronizados

## 🛠 Como Usar

### Importando Componentes

```tsx
import { 
  Button, 
  Card, 
  H1, 
  H2, 
  GradientText,
  Section,
  Container 
} from '@/components/design-system';
```

### 1. Layout e Estrutura

#### Container e Seção
```tsx
<Section background="hero">
  <Container>
    <H1>Título da Página</H1>
  </Container>
</Section>
```

#### Page Wrapper (para páginas completas)
```tsx
<PageWrapper>
  <Header>
    {/* Header content */}
  </Header>
  
  <Section>
    {/* Main content */}
  </Section>
  
  <Footer>
    {/* Footer content */}
  </Footer>
</PageWrapper>
```

### 2. Tipografia

#### Hierarquia de Títulos
```tsx
<HeroTitle>Título Principal (Hero)</HeroTitle>
<H1>Título H1</H1>
<H2>Título H2</H2>
<H3>Título H3</H3>
<H4>Título H4</H4>

{/* Texto com gradiente */}
<GradientText>Texto Destacado</GradientText>

{/* Texto do corpo */}
<BodyText variant="primary">Texto principal</BodyText>
<BodyText variant="secondary">Texto secundário</BodyText>
<BodyText variant="muted">Texto esmaecido</BodyText>
```

#### Seções com Cabeçalho Padronizado
```tsx
<SectionHeader 
  title="Como Funciona"
  titleHighlight="Nossa Plataforma"
  subtitle="Descubra como a TubeSpark pode transformar seu canal"
/>
```

### 3. Botões

#### Variantes de Botão
```tsx
{/* Botão primário com gradiente */}
<Button variant="primary">Começar Agora</Button>

{/* Botão secundário */}
<Button variant="secondary">Saiba Mais</Button>

{/* Botão fantasma */}
<Button variant="ghost">Cancelar</Button>

{/* Botão de contorno */}
<Button variant="outline">Ver Mais</Button>

{/* CTA Button (Call to Action) */}
<CTAButton href="/signup">
  Começar Gratuitamente
</CTAButton>

{/* Botão com gradiente personalizado */}
<GradientButton gradient="secondary">
  Ação Especial
</GradientButton>
```

### 4. Cards

#### Card Básico
```tsx
<Card variant="base">
  <H3>Título do Card</H3>
  <BodyText>Conteúdo do card aqui.</BodyText>
</Card>
```

#### Feature Card (para funcionalidades)
```tsx
<FeatureCard
  icon={<Sparkles className="w-7 h-7 text-white" />}
  title="Geração de Ideias"
  description="IA avançada que cria ideias personalizadas para seu nicho"
  highlight="Mais de 10.000 ideias geradas"
/>
```

#### Stats Card (para métricas)
```tsx
<StatsCard
  value="87%"
  label="Redução do bloqueio criativo"
  change="+15% este mês"
  changeType="increase"
/>
```

#### Problem Card (para destacar problemas)
```tsx
<ProblemCard
  emoji="🧠"
  title="Bloqueio Criativo"
  description="73% dos criadores enfrentam dificuldades para gerar ideias consistentes"
  stat="Mais de 2 horas perdidas por semana"
/>
```

### 5. Formulários

#### Inputs
```tsx
<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error="Email inválido"
/>

<Textarea
  label="Descrição"
  placeholder="Conte-nos sobre seu canal"
  rows={4}
/>

<Select
  label="Categoria"
  options={[
    { value: "tech", label: "Tecnologia" },
    { value: "lifestyle", label: "Lifestyle" }
  ]}
/>
```

#### Search Input
```tsx
<SearchInput
  placeholder="Buscar ideias..."
  onSearch={(value) => console.log(value)}
/>
```

### 6. Badges e Labels

```tsx
<Badge variant="primary" icon={<div />}>
  Novo
</Badge>

<Badge variant="success">
  Ativo
</Badge>

<Badge variant="error">
  Erro
</Badge>
```

### 7. Grids de Layout

#### Feature Grid
```tsx
<FeatureGrid columns={3}>
  <FeatureCard {...feature1} />
  <FeatureCard {...feature2} />
  <FeatureCard {...feature3} />
</FeatureGrid>
```

#### Stats Grid
```tsx
<StatsGrid>
  <StatsCard {...stat1} />
  <StatsCard {...stat2} />
  <StatsCard {...stat3} />
  <StatsCard {...stat4} />
</StatsGrid>
```

## 🎯 Padrões de Uso

### Páginas do Dashboard
```tsx
export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <H1>Bem-vindo de volta! 👋</H1>
          <BodyText variant="secondary">
            Vamos criar conteúdo incrível hoje
          </BodyText>
        </div>

        <StatsGrid>
          <StatsCard value="12" label="Ideias geradas" />
          <StatsCard value="5" label="Vídeos planejados" />
        </StatsGrid>

        <FeatureGrid columns={2}>
          <FeatureCard
            icon={<Lightbulb />}
            title="Gerar Nova Ideia"
            description="Crie uma nova ideia com IA"
          />
        </FeatureGrid>
      </div>
    </PageWrapper>
  );
}
```

### Páginas de Autenticação
```tsx
export default function SignInPage() {
  return (
    <PageWrapper>
      <Section background="hero">
        <Container>
          <Card variant="glass" className="max-w-md mx-auto">
            <H2 className="text-center mb-6">Entrar</H2>
            
            <FormGroup>
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
              />
              
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
              />
              
              <Button variant="primary" className="w-full">
                Entrar
              </Button>
            </FormGroup>
          </Card>
        </Container>
      </Section>
    </PageWrapper>
  );
}
```

## 🎨 Customização

### Classes CSS Disponíveis

```css
/* Gradientes da marca */
.gradient-primary    /* Azul → Roxo */
.gradient-secondary  /* Rosa → Vermelho */
.gradient-text       /* Texto com gradiente */

/* Efeitos */
.feature-card        /* Card com glassmorphism */
.stats-card         /* Card de estatísticas */
.btn-primary        /* Botão com gradiente */
.hero-pattern       /* Padrão de fundo do hero */
.glow               /* Efeito de brilho */

/* Animações */
.float-animation    /* Animação flutuante */
.animate-pulse-slow /* Pulse lento */
```

### Design Tokens

```tsx
import { designTokens } from '@/lib/design-system/tokens';

// Usar cores
designTokens.colors.primary.start     // #667eea
designTokens.colors.primary.end       // #764ba2
designTokens.colors.background.card   // rgba(255, 255, 255, 0.05)

// Usar tipografia
designTokens.typography.fontSize.hero // text-5xl md:text-7xl
```

## ✅ Migração de Páginas Existentes

### Antes (Inconsistente)
```tsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
  <h2 className="text-2xl font-bold text-red-600">Título</h2>
  <button className="bg-red-600 text-white px-4 py-2 rounded">
    Ação
  </button>
</div>
```

### Depois (Com Design System)
```tsx
<Card variant="base">
  <H2>Título</H2>
  <Button variant="primary">Ação</Button>
</Card>
```

## 🚀 Benefícios

1. **Consistência Visual**: Todas as páginas seguem a mesma identidade
2. **Produtividade**: Componentes prontos aceleram o desenvolvimento
3. **Manutenibilidade**: Mudanças centralizadas no design system
4. **Experiência do Usuário**: Interface coesa e profissional
5. **Escalabilidade**: Fácil adição de novas páginas e funcionalidades

---

Para dúvidas ou sugestões sobre o design system, consulte a documentação dos componentes individuais em `/components/design-system/`.