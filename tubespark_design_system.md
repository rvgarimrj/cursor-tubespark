# 🎨 TubeSpark Design System
## Guia Completo de Identidade Visual e Componentes

**Versão**: 2.0  
**Data**: Agosto 2025  
**Objetivo**: Transformar o TubeSpark em uma experiência visual premium, moderna e alinhada com creators de YouTube

---

## 🎯 **Conceito de Design**

### **Personalidade da Marca**
- **Inovadora**: Cutting-edge, sempre à frente das tendências
- **Confiável**: Dados científicos, resultados comprovados
- **Energética**: Vibrante, criativa, inspiradora
- **Premium**: Sofisticada mas acessível, profissional
- **Creator-First**: Feita por e para criadores de conteúdo

### **Inspirações Visuais**
- **YouTube Studio**: Familiaridade para creators
- **Figma**: Interface limpa e funcional
- **Linear**: Minimalismo moderno
- **Notion**: Organização visual clara
- **Discord**: Comunidade e gaming aesthetics

---

## 🎨 **Sistema de Cores**

### **Paleta Principal**
```scss
// Primary Colors - Gradient Signature
$primary-start: #667eea;     // Azul vibrante
$primary-end: #764ba2;       // Roxo profundo
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Secondary Colors - Viral Energy  
$secondary-start: #ff6b6b;   // Vermelho viral
$secondary-end: #ff8e53;     // Laranja energia
$secondary-gradient: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);

// Accent Colors - Success & Growth
$accent-green: #10b981;      // Verde sucesso
$accent-blue: #3b82f6;       // Azul informação
$accent-purple: #8b5cf6;     // Roxo premium
$accent-yellow: #f59e0b;     // Amarelo atenção
```

### **Tema Escuro (Padrão)**
```scss
// Backgrounds
$bg-primary: #0f172a;        // Background principal
$bg-secondary: #1e293b;      // Cards e containers
$bg-tertiary: #334155;       // Elevated elements
$bg-overlay: rgba(15, 23, 42, 0.95); // Modals

// Surfaces
$surface-1: rgba(255, 255, 255, 0.05);  // Glass effect level 1
$surface-2: rgba(255, 255, 255, 0.08);  // Glass effect level 2
$surface-3: rgba(255, 255, 255, 0.12);  // Glass effect level 3

// Borders
$border-primary: rgba(255, 255, 255, 0.1);
$border-secondary: rgba(255, 255, 255, 0.06);
$border-accent: rgba(102, 126, 234, 0.3);

// Text
$text-primary: #f8fafc;      // Títulos principais
$text-secondary: #e2e8f0;    // Texto corpo
$text-tertiary: #94a3b8;     // Texto secundário
$text-muted: #64748b;        // Texto disabled
```

### **Tema Claro**
```scss
// Backgrounds
$bg-primary-light: #ffffff;
$bg-secondary-light: #f8fafc;
$bg-tertiary-light: #f1f5f9;

// Surfaces
$surface-1-light: rgba(0, 0, 0, 0.02);
$surface-2-light: rgba(0, 0, 0, 0.04);
$surface-3-light: rgba(0, 0, 0, 0.06);

// Borders
$border-primary-light: rgba(0, 0, 0, 0.08);
$border-secondary-light: rgba(0, 0, 0, 0.04);

// Text
$text-primary-light: #0f172a;
$text-secondary-light: #334155;
$text-tertiary-light: #64748b;
$text-muted-light: #94a3b8;
```

### **Status Colors**
```scss
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;

// Com variações de opacidade
$success-bg: rgba(16, 185, 129, 0.1);
$warning-bg: rgba(245, 158, 11, 0.1);
$error-bg: rgba(239, 68, 68, 0.1);
$info-bg: rgba(59, 130, 246, 0.1);
```

---

## 📝 **Tipografia**

### **Font Stack**
```scss
// Primary Font - Interface
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Secondary Font - Display/Headers  
$font-display: 'Cal Sans', 'Inter', sans-serif; // Para headlines especiais

// Monospace - Code/Metrics
$font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

### **Type Scale**
```scss
// Display - Para hero sections e páginas principais
$text-display-2xl: 72px; // line-height: 1.1, font-weight: 900
$text-display-xl: 60px;  // line-height: 1.1, font-weight: 800
$text-display-lg: 48px;  // line-height: 1.2, font-weight: 700

// Headings - Para seções e cards
$text-4xl: 36px;  // line-height: 1.25, font-weight: 700
$text-3xl: 30px;  // line-height: 1.3, font-weight: 700
$text-2xl: 24px;  // line-height: 1.35, font-weight: 600
$text-xl: 20px;   // line-height: 1.4, font-weight: 600
$text-lg: 18px;   // line-height: 1.45, font-weight: 500

// Body - Para texto corrido
$text-base: 16px; // line-height: 1.5, font-weight: 400
$text-sm: 14px;   // line-height: 1.5, font-weight: 400
$text-xs: 12px;   // line-height: 1.4, font-weight: 400
```

### **Font Weights**
```scss
$font-light: 300;
$font-normal: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
$font-extrabold: 800;
$font-black: 900;
```

---

## 🔘 **Componentes de Interface**

### **Botões**

#### **Botão Primário (CTA Principal)**
```scss
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

// Tamanhos
.btn-sm { padding: 8px 16px; font-size: 14px; border-radius: 8px; }
.btn-lg { padding: 16px 32px; font-size: 18px; border-radius: 16px; }
.btn-xl { padding: 20px 40px; font-size: 20px; border-radius: 20px; }
```

#### **Botão Secundário**
```scss
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: $text-primary;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }
}
```

#### **Botão Viral (Para ações especiais)**
```scss
.btn-viral {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  
  &:hover {
    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
  }
}
```

#### **Botão Ghost**
```scss
.btn-ghost {
  background: transparent;
  color: $text-secondary;
  border: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: $text-primary;
  }
}
```

### **Cards e Containers**

#### **Card Principal (Glass Effect)**
```scss
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
}

// Variações
.card-flat { border-radius: 12px; transform: none; }
.card-elevated { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); }
.card-bordered { border-width: 2px; }
```

#### **Container de Métricas**
```scss
.metrics-card {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: $primary-gradient;
  }
}
```

### **Formulários e Inputs**

#### **Input Principal**
```scss
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: $text-primary;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: $primary-start;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: $text-muted;
  }
}

// Estados
.input-error { border-color: $error; }
.input-success { border-color: $success; }
```

#### **Search Bar**
```scss
.search-bar {
  position: relative;
  
  .search-input {
    padding-left: 48px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:focus {
      border-color: $primary-start;
      background: rgba(255, 255, 255, 0.08);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: $text-muted;
  }
}
```

### **Badges e Tags**

#### **Status Badges**
```scss
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge-viral {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 142, 83, 0.15));
  color: #ff8e53;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.badge-trending {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.2);
}
```

#### **Viral Score Badge**
```scss
.viral-score {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  
  &.high { // 80%+
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  
  &.medium { // 60-79%
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
  
  &.low { // <60%
    background: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
  }
}
```

---

## 🎛️ **Layout e Spacing**

### **Spacing Scale**
```scss
$space-1: 4px;    // Micro spacing
$space-2: 8px;    // Small spacing
$space-3: 12px;   // Default spacing
$space-4: 16px;   // Medium spacing
$space-5: 20px;   // Large spacing
$space-6: 24px;   // XL spacing
$space-8: 32px;   // XXL spacing
$space-10: 40px;  // Section spacing
$space-12: 48px;  // Large section spacing
$space-16: 64px;  // Hero spacing
$space-20: 80px;  // Mega spacing
```

### **Border Radius**
```scss
$radius-sm: 6px;   // Small elements
$radius-md: 8px;   // Default
$radius-lg: 12px;  // Cards
$radius-xl: 16px;  // Large cards
$radius-2xl: 20px; // Containers
$radius-full: 9999px; // Pills/circles
```

### **Grid System**
```scss
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.grid {
  display: grid;
  gap: 24px;
  
  &.cols-1 { grid-template-columns: 1fr; }
  &.cols-2 { grid-template-columns: repeat(2, 1fr); }
  &.cols-3 { grid-template-columns: repeat(3, 1fr); }
  &.cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  // Responsive
  @media (max-width: 768px) {
    &.cols-2, &.cols-3, &.cols-4 {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 1024px) {
    &.cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
```

---

## 🎭 **Micro-interações e Animações**

### **Easing Functions**
```scss
$ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
$ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
$ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
$ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### **Transições Base**
```scss
.transition-base {
  transition: all 0.3s $ease-out-cubic;
}

.transition-fast {
  transition: all 0.15s $ease-out-quad;
}

.transition-slow {
  transition: all 0.5s $ease-out-cubic;
}
```

### **Hover Effects**
```scss
.hover-lift {
  transition: transform 0.3s $ease-out-cubic;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.hover-scale {
  transition: transform 0.2s $ease-out-quad;
  
  &:hover {
    transform: scale(1.02);
  }
}

.hover-glow {
  transition: box-shadow 0.3s $ease-out-cubic;
  
  &:hover {
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
  }
}
```

### **Loading States**
```scss
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.loading {
  animation: pulse 2s ease-in-out infinite;
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

## 📊 **Componentes Específicos do TubeSpark**

### **Card de Ideia**
```scss
.idea-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  .idea-title {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .idea-description {
    font-size: 14px;
    color: $text-tertiary;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .idea-metrics {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .idea-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
```

### **Viral Score Display**
```scss
.viral-score-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  
  .score-icon {
    width: 16px;
    height: 16px;
  }
  
  &.high-score {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15));
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  &.medium-score {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }
  
  &.low-score {
    background: rgba(107, 114, 128, 0.15);
    color: #9ca3af;
    border: 1px solid rgba(107, 114, 128, 0.2);
  }
}
```

### **Metrics Dashboard Card**
```scss
.metrics-dashboard-card {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.08) 0%, 
    rgba(118, 75, 162, 0.04) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: $primary-gradient;
  }
  
  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .metric-title {
      font-size: 14px;
      font-weight: 500;
      color: $text-tertiary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .metric-icon {
      width: 20px;
      height: 20px;
      color: $primary-start;
    }
  }
  
  .metric-value {
    font-size: 36px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 8px;
    font-family: $font-mono;
  }
  
  .metric-change {
    font-size: 12px;
    font-weight: 500;
    
    &.positive {
      color: $success;
    }
    
    &.negative {
      color: $error;
    }
    
    &.neutral {
      color: $text-muted;
    }
  }
}
```

### **Sidebar Navigation**
```scss
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    padding: 12px 16px;
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background: $primary-gradient;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .nav-section {
    margin-bottom: 32px;
    
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: $text-muted;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding: 0 16px;
    }
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    color: $text-tertiary;
    text-decoration: none;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: $text-primary;
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.10));
      color: $primary-start;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
    }
  }
}
```

---

## 📱 **Responsividade**

### **Breakpoints**
```scss
$breakpoint-sm: 640px;   // Mobile large
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop small
$breakpoint-xl: 1280px;  // Desktop large
$breakpoint-2xl: 1536px; // Desktop extra large

// Mixins
@mixin mobile {
  @media (max-width: #{$breakpoint-md - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: $breakpoint-md) and (max-width: #{$breakpoint-lg - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $breakpoint-lg) {
    @content;
  }
}
```

### **Mobile Optimizations**
```scss
// Mobile-first approach
.container {
  padding: 0 16px;
  
  @include tablet {
    padding: 0 32px;
  }
  
  @include desktop {
    padding: 0 48px;
  }
}

// Touch targets
.btn {
  min-height: 44px; // iOS guidelines
  min-width: 44px;
}

.nav-item {
  min-height: 48px;
}

// Mobile sidebar
@include mobile {
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    z-index: 50;
    transition: left 0.3s ease;
    
    &.open {
      left: 0;
    }
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
}
```

---

## 🌙 **Sistema de Temas**

### **CSS Custom Properties**
```scss
:root {
  // Dark theme (default)
  --color-bg-primary: #{$bg-primary};
  --color-bg-secondary: #{$bg-secondary};
  --color-text-primary: #{$text-primary};
  --color-text-secondary: #{$text-secondary};
  --color-border-primary: #{$border-primary};
  
  // Gradients
  --gradient-primary: #{$primary-gradient};
  --gradient-secondary: #{$secondary-gradient};
}

[data-theme="light"] {
  --color-bg-primary: #{$bg-primary-light};
  --color-bg-secondary: #{$bg-secondary-light};
  --color-text-primary: #{$text-primary-light};
  --color-text-secondary: #{$text-secondary-light};
  --color-border-primary: #{$border-primary-light};
}

// Usage
.component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
```

### **Theme Toggle Component**
```scss
.theme-toggle {
  width: 48px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &.light {
    background: $primary-gradient;
    
    &::before {
      transform: translateX(24px);
    }
  }
}
```

---

## 🎯 **Estados e Feedback**

### **Loading States**
```scss
.skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 25%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid $primary-start;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### **Empty States**
```scss
.empty-state {
  text-align: center;
  padding: 64px 32px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    opacity: 0.4;
  }
  
  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }
  
  .empty-description {
    font-size: 16px;
    color: $text-tertiary;
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

### **Toast Notifications**
```scss
.toast {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &.success {
    border-left: 4px solid $success;
  }
  
  &.error {
    border-left: 4px solid $error;
  }
  
  &.warning {
    border-left: 4px solid $warning;
  }
  
  &.info {
    border-left: 4px solid $info;
  }
}
```

---

## 📋 **Guidelines de Implementação**

### **Prioridades de Desenvolvimento**

#### **Fase 1: Fundação (1-2 semanas)**
1. ✅ Implementar sistema de cores e CSS custom properties
2. ✅ Criar componentes base (Button, Card, Input)
3. ✅ Configurar tipografia e spacing
4. ✅ Implementar tema claro/escuro

#### **Fase 2: Componentes Principais (2-3 semanas)**
1. ✅ Redesenhar Sidebar Navigation
2. ✅ Atualizar Dashboard principal
3. ✅ Criar componente de Card de Ideia
4. ✅ Implementar Metrics Cards

#### **Fase 3: Refinamentos (1-2 semanas)**
1. ✅ Adicionar micro-interações
2. ✅ Otimizar responsividade
3. ✅ Implementar estados de loading
4. ✅ Adicionar animations

### **Checklist de QA**

#### **Visual**
- [ ] Todas as cores seguem a paleta definida
- [ ] Spacing consistente em toda aplicação
- [ ] Tipografia aplicada corretamente
- [ ] Temas claro/escuro funcionando
- [ ] Componentes responsivos

#### **Interação**
- [ ] Hover states funcionando
- [ ] Loading states implementados
- [ ] Transições suaves
- [ ] Touch targets adequados (mobile)
- [ ] Keyboard navigation

#### **Acessibilidade**
- [ ] Contraste adequado (WCAG AA)
- [ ] Focus indicators visíveis
- [ ] Alt texts em imagens
- [ ] Aria labels apropriados

---

## 🎨 **Recursos e Assets**

### **Ícones**
- **Biblioteca recomendada**: Lucide React
- **Estilo**: Outline, 20px base, stroke-width: 1.5
- **Cores**: Seguir paleta de cores do sistema

### **Ilustrações**
- **Estilo**: Minimalista, line-art
- **Cores**: Monochrome com accent colors
- **Uso**: Empty states, onboarding, error pages

### **Imagens**
- **Formato**: WebP (fallback PNG)
- **Qualidade**: Responsive images
- **Lazy loading**: Implementar para performance

---

## 📝 **Documentação para Devs**

### **Estrutura de Arquivos**
```
src/
├── styles/
│   ├── globals.css
│   ├── variables.css
│   ├── components.css
│   └── utilities.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── features/
│       ├── IdeaCard.tsx
│       ├── MetricsCard.tsx
│       └── ViralScore.tsx
```

### **Naming Conventions**
- **CSS Classes**: kebab-case (.btn-primary)
- **CSS Custom Properties**: kebab-case (--color-bg-primary)
- **Component Props**: camelCase (primaryColor)
- **File Names**: PascalCase (Button.tsx)

### **Performance Guidelines**
- Use CSS-in-JS only when necessary
- Prefer CSS custom properties for theming
- Minimize JavaScript for styling
- Use transform and opacity for animations
- Implement lazy loading for heavy components

---

## 🚀 **Próximos Passos**

1. **Revisar este documento** com a equipe de design e desenvolvimento
2. **Criar protótipo** no Figma das principais páginas
3. **Implementar sistema base** (cores, tipografia, componentes)
4. **Redesenhar Dashboard** como piloto
5. **Expandir para outras páginas** seguindo o sistema
6. **Testar em diferentes dispositivos** e browsers
7. **Coletar feedback** dos usuários beta
8. **Iterar e refinar** baseado no feedback

---

**Status**: 🎯 Pronto para implementação  
**Estimativa Total**: 4-6 semanas para implementação completa  
**Impact**: Transformação completa da experiência visual do TubeSpark