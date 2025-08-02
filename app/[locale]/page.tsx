"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { landingTranslations, type LandingTranslationKey } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LocaleHomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const validLocale = locale as Locale;
  const t = (key: LandingTranslationKey) => landingTranslations[validLocale]?.[key] || landingTranslations.pt[key];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation states
  const [mounted, setMounted] = useState(false);
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Typing animation
  useEffect(() => {
    if (!mounted || !typingRef.current) return;

    const texts = [
      'Gere ideias virais baseadas em ciência...',
      'Analise competidores automaticamente...',
      'Crie roteiros que engajam...',
      'Descubra trends antes dos outros...'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    function typeText() {
      if (!typingRef.current) return;

      const currentText = texts[textIndex];
      
      if (!isDeleting) {
        typingRef.current.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 2000);
          return;
        }
      } else {
        typingRef.current.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      timeoutId = setTimeout(typeText, isDeleting ? 50 : 100);
    }

    const initialTimeout = setTimeout(typeText, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, [mounted]);

  // Counter animation
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const ideas = document.getElementById('ideasCounter');
      const viral = document.getElementById('viralScore');
      const ctr = document.getElementById('ctrScore');
      
      if (ideas) ideas.textContent = String(Math.floor(Math.random() * 3) + 45);
      if (viral) viral.textContent = String(Math.floor(Math.random() * 8) + 90);
      if (ctr) ctr.textContent = (Math.random() * 2 + 7).toFixed(1);
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Generate new idea demo
  const generateNewIdea = () => {
    const demoIdeas = [
      {
        emoji: "🔥",
        title: "Como Fazer R$ 10.000 com IA em 30 Dias (Tutorial Completo)",
        viral: 97,
        ctr: 9.8,
        tag: "Money"
      },
      {
        emoji: "🚀", 
        title: "Testei TODAS as IAs de 2025 - Só Uma Prestou",
        viral: 93,
        ctr: 8.7,
        tag: "Review"
      },
      {
        emoji: "💡",
        title: "O Segredo dos YouTubers de 1M+ Subs que Ninguém Conta",
        viral: 95,
        ctr: 9.1,
        tag: "Secret"
      }
    ];

    const idea = demoIdeas[Math.floor(Math.random() * demoIdeas.length)];
    const container = document.getElementById('liveIdeas');
    if (!container) return;
    
    const newIdea = document.createElement('div');
    newIdea.className = 'idea-card p-4 bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded-xl';
    newIdea.innerHTML = `
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-gradient-viral rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold">${idea.emoji}</span>
        </div>
        <div class="flex-1">
          <div class="text-white font-semibold mb-2">"${idea.title}"</div>
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">🔥 ${idea.viral}% Viral</span>
            <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">🎯 ${idea.ctr}% CTR</span>
            <span class="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg">⚡ ${idea.tag}</span>
          </div>
        </div>
      </div>
    `;
    
    container.insertBefore(newIdea, container.firstChild);
    if (container.children.length > 3 && container.lastChild) {
      container.removeChild(container.lastChild);
    }
  };

  // AI Demo simulation
  const runAIDemo = () => {
    const output = document.getElementById('aiOutput');
    if (!output) return;
    
    // Loading state
    output.innerHTML = `
      <div class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400">Analisando seu canal...</p>
      </div>
    `;
    
    setTimeout(() => {
      output.innerHTML = `
        <div class="space-y-4">
          <div class="text-white font-bold text-lg mb-4">💡 Ideia Personalizada Gerada:</div>
          <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <div class="text-white font-semibold mb-2">"5 IAs que Vão REVOLUCIONAR Seu Canal em 2025 (+ Setup Gratuito)"</div>
            <div class="text-gray-300 text-sm mb-3">Baseado na sua audiência de tech e histórico de tutoriais</div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-green-500/20 text-green-400 p-2 rounded">🔥 Viral Score: 96%</div>
              <div class="bg-blue-500/20 text-blue-400 p-2 rounded">🎯 CTR: 9.2%</div>
              <div class="bg-purple-500/20 text-purple-400 p-2 rounded">📈 Trend: Alto</div>
              <div class="bg-yellow-500/20 text-yellow-400 p-2 rounded">⏰ Timing: Perfeito</div>
            </div>
          </div>
          <div class="text-xs text-gray-400">
            ✅ Análise baseada em 50k+ dados do seu nicho
          </div>
        </div>
      `;
    }, 2000);
  };

  // Start generating ideas
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(generateNewIdea, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center pulse-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">TubeSpark</span>
                <div className="text-xs text-gray-400 hidden sm:block">IA para YouTubers</div>
              </div>
            </div>
            
            <nav className="hidden lg:flex space-x-8">
              <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors font-medium">Como Funciona</a>
              <a href="#resultados" className="text-gray-300 hover:text-white transition-colors font-medium">Resultados</a>
              <a href="#precos" className="text-gray-300 hover:text-white transition-colors font-medium">Preços</a>
              <a href="#creators" className="text-gray-300 hover:text-white transition-colors font-medium">Para Creators</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
              <Link href={`/${locale}/auth/signin`} className="hidden sm:block text-gray-300 hover:text-white transition-colors font-medium">
                Entrar
              </Link>
              <Link href={`/${locale}/auth/signup`} className="btn-primary px-6 py-2 rounded-xl font-semibold transition-all duration-300">
                Começar Grátis
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 lg:hidden ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold gradient-text">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <nav className="space-y-6">
              <a href="#como-funciona" className="block text-gray-300 hover:text-white transition-colors font-medium">Como Funciona</a>
              <a href="#resultados" className="block text-gray-300 hover:text-white transition-colors font-medium">Resultados</a>
              <a href="#precos" className="block text-gray-300 hover:text-white transition-colors font-medium">Preços</a>
              <a href="#creators" className="block text-gray-300 hover:text-white transition-colors font-medium">Para Creators</a>
              <div className="border-t border-gray-800 pt-6">
                <Link href={`/${locale}/auth/signin`} className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium mb-4">
                  Entrar
                </Link>
                <Link href={`/${locale}/auth/signup`} className="w-full btn-primary py-3 rounded-xl font-semibold">
                  Começar Grátis
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center hero-pattern pt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          
          {/* Social Proof Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full px-6 py-3">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-white"></div>
              </div>
              <span className="text-green-400 font-semibold text-sm">+10.247 creators usando hoje</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Transforme</span><br/>
            <span className="gradient-viral-text">Bloqueio Criativo</span><br/>
            <span className="text-white">em</span> <span className="gradient-text">Vídeos Virais</span>
          </h1>
          
          {/* Typing Animation Subheadline */}
          <div className="mb-8">
            <p className="text-xl sm:text-2xl text-gray-300 mb-4">
              A única IA treinada especificamente para YouTubers
            </p>
            <div className="text-lg sm:text-xl text-blue-400 font-medium typing-animation" ref={typingRef}>
              Gere ideias virais baseadas em ciência...
            </div>
          </div>
          
          {/* Interactive Demo Preview */}
          <div className="max-w-5xl mx-auto mb-12 relative">
            <div className="card-glass rounded-2xl p-6 sm:p-8">
              {/* Demo Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 font-medium">TubeSpark AI Dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Gerando em tempo real</span>
                </div>
              </div>
              
              {/* Live Ideas Generator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-blue-400 text-sm font-medium mb-2">Ideias Geradas</div>
                  <div className="text-3xl font-bold stats-counter" id="ideasCounter">47</div>
                  <div className="text-green-400 text-xs">+12 hoje</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                  <div className="text-purple-400 text-sm font-medium mb-2">Viral Score</div>
                  <div className="text-3xl font-bold stats-counter" id="viralScore">94</div>
                  <div className="text-green-400 text-xs">% média</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-400 text-sm font-medium mb-2">CTR Previsto</div>
                  <div className="text-3xl font-bold stats-counter" id="ctrScore">8.4</div>
                  <div className="text-green-400 text-xs">% estimado</div>
                </div>
              </div>
              
              {/* Live Generated Ideas */}
              <div className="space-y-4" id="liveIdeas">
                <div className="idea-card p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-viral rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">🔥</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold mb-2">"Como Fazer R$ 10.000 com IA em 30 Dias (Tutorial Completo)"</div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">🔥 97% Viral</span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">🎯 9.8% CTR</span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg">⚡ Money</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href={`/${locale}/auth/signup`} className="btn-primary px-8 py-4 rounded-xl font-bold transition-all duration-300">
                  Começar Grátis
                </Link>
                <button className="border-2 border-gray-600 px-8 py-4 rounded-xl font-semibold text-gray-300 hover:border-blue-500 hover:text-white transition-all duration-300">
                  Ver Demo
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text stats-counter">10k+</div>
              <div className="text-gray-400 text-sm">Creators Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-viral-text stats-counter">2.4M</div>
              <div className="text-gray-400 text-sm">Ideias Geradas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 stats-counter">87%</div>
              <div className="text-gray-400 text-sm">Taxa de Implementação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 stats-counter">4.9</div>
              <div className="text-gray-400 text-sm">⭐ Avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems vs Solutions Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Por que 87% dos YouTubers</span><br/>
              <span className="gradient-viral-text">Param no Primeiro Ano?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dados de 10k+ criadores revelam os 4 bloqueios que matam 73% dos canais no primeiro ano
            </p>
          </div>
          
          {/* Problems vs Solutions Grid */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Problems Side */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-red-400 mb-4">❌ Métodos Tradicionais</h3>
                <p className="text-gray-400">Como 87% dos creators fazem (e falham)</p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🧠</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Bloqueio Criativo Constante</h4>
                    <p className="text-gray-300 text-sm mb-3">3-5 horas olhando tela em branco, sem saber sobre o que falar</p>
                    <div className="text-red-400 text-xs font-medium">💸 15h/semana perdidas = R$ 3.000/mês</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📉</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Views Inconsistentes</h4>
                    <p className="text-gray-300 text-sm mb-3">Apostando no "achômetro" sem dados científicos</p>
                    <div className="text-red-400 text-xs font-medium">📊 Apenas 1-2% CTR vs 8%+ possível</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">⏰</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Pesquisa Manual Infinita</h4>
                    <p className="text-gray-300 text-sm mb-3">Analisando competidores, trends e títulos manualmente</p>
                    <div className="text-red-400 text-xs font-medium">⚡ 5h pesquisa vs 30s com IA</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">😰</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Roteiros que Não Engajam</h4>
                    <p className="text-gray-300 text-sm mb-3">Estrutura aleatória sem base em psicologia</p>
                    <div className="text-red-400 text-xs font-medium">📱 40% drop-off vs 67% retenção</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Solutions Side */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold gradient-text mb-4">✅ TubeSpark AI</h3>
                <p className="text-gray-400">Framework científico que funciona</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🚀</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Ideias Infinitas em 30s</h4>
                    <p className="text-gray-300 text-sm mb-3">IA treinada com 2.4M+ ideias virais personalizadas para seu nicho</p>
                    <div className="text-green-400 text-xs font-medium">⚡ 100+ ideias/mês vs 0 no bloqueio</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/10 to-teal-600/10 border border-green-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📈</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Predição Viral Científica</h4>
                    <p className="text-gray-300 text-sm mb-3">Score baseado em neurociência e dados do YouTube</p>
                    <div className="text-green-400 text-xs font-medium">🔥 85%+ score = viral garantido</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Análise Automática 24/7</h4>
                    <p className="text-gray-300 text-sm mb-3">Trends, competitors e oportunidades em tempo real</p>
                    <div className="text-green-400 text-xs font-medium">🤖 Always-on vs pesquisa manual</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🎬</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Roteiros YouTube-Native</h4>
                    <p className="text-gray-300 text-sm mb-3">Framework baseado em psicologia para máxima retenção</p>
                    <div className="text-green-400 text-xs font-medium">📱 +42% retenção comprovada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transformation Stats */}
          <div className="mt-20 text-center">
            <div className="card-glass p-8 rounded-3xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-8">Transformação Comprovada</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold gradient-viral-text mb-2">+180%</div>
                  <div className="text-gray-300 text-sm">Engagement médio</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">3.2x</div>
                  <div className="text-gray-300 text-sm">Crescimento</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                  <div className="text-gray-300 text-sm">Implementação</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">94%</div>
                  <div className="text-gray-300 text-sm">Score viral médio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Como Funciona a</span><br/>
              <span className="gradient-text">Revolução da IA</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Framework científico que transforma bloqueio criativo em sistema de produção viral
            </p>
          </div>
          
          {/* Step by Step Process */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <div className="card-glass p-8 rounded-2xl text-center transition-all duration-300">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Análise do Seu Canal</h3>
              <p className="text-gray-300 mb-6">Nossa IA analisa seu nicho, audiência e performance em segundos para entender seu DNA criativo.</p>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Analisando...</div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-400">Nicho: Tech</span>
                  <span className="text-green-400">Audiência: 25-35</span>
                  <span className="text-purple-400">Estilo: Tutorial</span>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-8 rounded-2xl text-center transition-all duration-300">
              <div className="w-16 h-16 gradient-viral rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Geração Inteligente</h3>
              <p className="text-gray-300 mb-6">Combinamos trends atuais + seu estilo + dados científicos para criar ideias com alta probabilidade viral.</p>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Gerando ideias...</div>
                <div className="space-y-1 text-xs">
                  <div className="text-green-400">✓ Viral Score: 94%</div>
                  <div className="text-blue-400">✓ CTR Previsto: 8.4%</div>
                  <div className="text-purple-400">✓ Match: 98%</div>
                </div>
              </div>
            </div>
            
            <div className="card-glass p-8 rounded-2xl text-center transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Produção Otimizada</h3>
              <p className="text-gray-300 mb-6">Roteiros estruturados com base em neurociência, SEO otimizado e timing perfeito para publicação.</p>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Roteiro pronto!</div>
                <div className="space-y-1 text-xs">
                  <div className="text-green-400">Hook: 15s</div>
                  <div className="text-blue-400">Body: 8min</div>
                  <div className="text-purple-400">CTA: 30s</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-12 rounded-3xl border border-blue-500/30">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">
              📱 Processo Simples em 3 Passos
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
                <h4 className="text-xl font-bold mb-3 text-white">Conecta Seu Canal</h4>
                <p className="text-gray-300">Nossa IA analisa seus dados, audiência e performance para personalizar tudo</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
                <h4 className="text-xl font-bold mb-3 text-white">Gera Roteiros Virais</h4>
                <p className="text-gray-300">Em segundos você tem roteiros completos otimizados para seu nicho específico</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
                <h4 className="text-xl font-bold mb-3 text-white">Publica e Viraliza</h4>
                <p className="text-gray-300">Segue o roteiro e assiste suas views, inscritos e receita dispararem</p>
              </div>
            </div>
          </div>
          
          {/* Live Demo Integration */}
          <div className="card-glass p-8 rounded-3xl mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">🧪 Veja a IA Trabalhando</h3>
              <p className="text-gray-300">Demonstração em tempo real do nosso algoritmo</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Side */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">💬 Você diz para a IA:</h4>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
                  <div className="text-gray-300 text-sm">"Sou um YouTuber de tecnologia com 50k subs. Minha audiência gosta de reviews e tutoriais. Preciso de uma ideia que possa viralizar sobre IA."</div>
                </div>
                <button onClick={runAIDemo} className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full">
                  🚀 Processar com IA
                </button>
              </div>
              
              {/* Output Side */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">🎯 IA responde em 3 segundos:</h4>
                <div id="aiOutput" className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4 min-h-[200px]">
                  <div className="text-gray-400 text-center py-8">
                    Clique em "Processar com IA" para ver a mágica acontecer...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Proof Section */}
      <section id="resultados" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Resultados que</span><br/>
              <span className="gradient-viral-text">Falam por Si</span>
            </h2>
            <p className="text-xl text-gray-300">
              Dados reais de +10k creators que usam TubeSpark
            </p>
          </div>
          
          {/* Main Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="card-glass p-6 rounded-xl text-center">
              <div className="text-4xl font-bold gradient-text mb-2 stats-counter">2.4M+</div>
              <div className="text-gray-300 text-sm mb-1">Ideias geradas</div>
              <div className="text-green-400 text-xs">+1.2k hoje</div>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-center">
              <div className="text-4xl font-bold gradient-viral-text mb-2 stats-counter">180%</div>
              <div className="text-gray-300 text-sm mb-1">↑ Engagement médio</div>
              <div className="text-green-400 text-xs">vs. método tradicional</div>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-green-400 mb-2 stats-counter">87%</div>
              <div className="text-gray-300 text-sm mb-1">Taxa implementação</div>
              <div className="text-green-400 text-xs">ideias → vídeos</div>
            </div>
            
            <div className="card-glass p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2 stats-counter">10.2k+</div>
              <div className="text-gray-300 text-sm mb-1">Creators ativos</div>
              <div className="text-green-400 text-xs">usam mensalmente</div>
            </div>
          </div>
          
          {/* Case Studies */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="card-glass p-8 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <div>
                  <div className="text-white font-semibold">TechMaster</div>
                  <div className="text-gray-400 text-sm">200k subs</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">"Saí de 2k para 200k subs em 8 meses usando só as ideias do TubeSpark. Meu CTR médio subiu de 3% para 9%."</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">+9.900% crescimento</span>
                <span className="text-blue-400">9% CTR médio</span>
              </div>
            </div>
            
            <div className="card-glass p-8 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
                <div>
                  <div className="text-white font-semibold">CodeGirl</div>
                  <div className="text-gray-400 text-sm">85k subs</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">"Nunca mais tive bloqueio criativo. Gero 20+ ideias por semana e sei exatamente quais vão viralizar."</p>
              <div className="flex justify-between text-sm">
                <span className="text-purple-400">20+ ideias/sem</span>
                <span className="text-yellow-400">95% score médio</span>
              </div>
            </div>
            
            <div className="card-glass p-8 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                <div>
                  <div className="text-white font-semibold">StartupBoy</div>
                  <div className="text-gray-400 text-sm">500k subs</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">"Meu último vídeo com ideia do TubeSpark fez 2.8M views. O algoritmo é insano de preciso."</p>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">2.8M views</span>
                <span className="text-green-400">viral confirmado</span>
              </div>
            </div>
          </div>
          
          {/* Before vs After Comparison */}
          <div className="card-glass p-12 rounded-3xl">
            <h3 className="text-2xl font-bold text-center text-white mb-12">Antes vs Depois do TubeSpark</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Before */}
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-6 text-center">❌ Antes (Método Tradicional)</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-gray-300">Tempo para ter ideias</span>
                    <span className="text-red-400 font-semibold">3-5 horas</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-gray-300">CTR médio</span>
                    <span className="text-red-400 font-semibold">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-gray-300">Taxa de retenção</span>
                    <span className="text-red-400 font-semibold">34%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-gray-300">Vídeos virais/mês</span>
                    <span className="text-red-400 font-semibold">0-1</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-gray-300">Burnout criativo</span>
                    <span className="text-red-400 font-semibold">Constante</span>
                  </div>
                </div>
              </div>
              
              {/* After */}
              <div>
                <h4 className="text-lg font-semibold gradient-text mb-6 text-center">✅ Depois (TubeSpark AI)</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-gray-300">Tempo para ter ideias</span>
                    <span className="text-green-400 font-semibold">30 segundos</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-gray-300">CTR médio</span>
                    <span className="text-green-400 font-semibold">8.4%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-gray-300">Taxa de retenção</span>
                    <span className="text-green-400 font-semibold">67%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-gray-300">Vídeos virais/mês</span>
                    <span className="text-green-400 font-semibold">3-5</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-gray-300">Burnout criativo</span>
                    <span className="text-green-400 font-semibold">Zero</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transformation Arrow */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-8 py-4">
                <span className="text-white font-semibold">Transformação Média:</span>
                <span className="gradient-text font-bold text-xl">+340% Performance</span>
                <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Comece Grátis,</span><br/>
              <span className="gradient-text">Escale Quando Quiser</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Planos pensados para cada estágio da sua jornada como creator
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            
            {/* Free Plan */}
            <div className="card-glass p-8 rounded-2xl text-center transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Grátis</h3>
                <p className="text-gray-400 mb-6">Para experimentar a ferramenta</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">R$0</span>
                  <span className="text-gray-400 text-lg">/sempre</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-green-400 text-sm font-medium">✨ Sem cartão de crédito</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">100 ideias personalizadas/mês</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">20 roteiros básicos/mês</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Análise de viral score</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Suporte da comunidade</span>
                </li>
              </ul>
              
              <Link href={`/${locale}/auth/signup`} className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-300">
                Começar Grátis Agora
              </Link>
            </div>
            
            {/* Pro Plan - RECOMMENDED */}
            <div className="card-glass border-2 border-blue-500 rounded-2xl p-8 text-center relative transform scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-bold">
                🔥 MAIS POPULAR
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">Para creators sérios</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold gradient-text">R$29</span>
                  <span className="text-gray-400 text-lg">,99/mês</span>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-blue-400 text-sm font-medium">💰 Melhor custo-benefício</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Ideias ilimitadas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Roteiros ilimitados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Análise de competidores</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Timing de publicação</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Suporte prioritário</span>
                </li>
              </ul>
              
              <Link href={`/${locale}/auth/signup`} className="block w-full btn-primary py-4 rounded-xl font-semibold transition-all duration-300">
                Escolher Pro
              </Link>
            </div>
            
            {/* Business Plan */}
            <div className="card-glass p-8 rounded-2xl text-center transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
                <p className="text-gray-400 mb-6">Para equipes e agências</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-purple-400">R$99</span>
                  <span className="text-gray-400 text-lg">,99/mês</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-purple-400 text-sm font-medium">🏢 Multi-usuários</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300 font-medium">Tudo do Pro +</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">5 usuários inclusos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">API de integração</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">White label</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Relatórios avançados</span>
                </li>
              </ul>
              
              <Link href={`/${locale}/auth/signup`} className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300">
                Escolher Business
              </Link>
            </div>
          </div>
          
          {/* Money Back Guarantee */}
          <div className="text-center mb-16">
            <div className="card-glass p-8 rounded-2xl max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Garantia de 30 dias</div>
                    <div className="text-gray-400 text-sm">100% do dinheiro de volta</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Setup em 2 minutos</div>
                    <div className="text-gray-400 text-sm">Comece agora mesmo</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v18M3 12h18"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Cancele quando quiser</div>
                    <div className="text-gray-400 text-sm">Sem contratos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-white mb-8">❓ Perguntas Frequentes</h3>
            <div className="space-y-4">
              <details className="card-glass p-6 rounded-xl">
                <summary className="text-lg font-semibold text-white cursor-pointer flex items-center justify-between">
                  <span>Como funciona o período gratuito?</span>
                  <svg className="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="text-gray-300 mt-4">
                  O plano gratuito é para sempre! Você tem acesso a 100 ideias personalizadas e 20 roteiros básicos por mês, 
                  sem tempo limite. É perfeito para testar a ferramenta e ver os resultados.
                </p>
              </details>
              
              <details className="card-glass p-6 rounded-xl">
                <summary className="text-lg font-semibold text-white cursor-pointer flex items-center justify-between">
                  <span>O que torna o TubeSpark diferente de outras ferramentas?</span>
                  <svg className="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="text-gray-300 mt-4">
                  Somos a única IA treinada especificamente para YouTube com base científica. Nosso algoritmo analisa 
                  neurociência, psicologia e dados reais de 2.4M+ ideias para predizer viral score com 94% de precisão.
                </p>
              </details>
              
              <details className="card-glass p-6 rounded-xl">
                <summary className="text-lg font-semibold text-white cursor-pointer flex items-center justify-between">
                  <span>Funciona para qualquer nicho?</span>
                  <svg className="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="text-gray-300 mt-4">
                  Sim! Nossa IA foi treinada com dados de todos os nichos: tech, lifestyle, gaming, educação, entretenimento, 
                  etc. Quanto mais específico você for sobre seu nicho, mais precisas serão as sugestões.
                </p>
              </details>
              
              <details className="card-glass p-6 rounded-xl">
                <summary className="text-lg font-semibold text-white cursor-pointer flex items-center justify-between">
                  <span>Posso cancelar a qualquer momento?</span>
                  <svg className="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="text-gray-300 mt-4">
                  Claro! Não há contratos ou taxas de cancelamento. Você pode cancelar com um clique e continuar 
                  usando até o final do período pago. Também oferecemos 30 dias de garantia total.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Partnership Section */}
      <section id="creators" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Programa de</span><br/>
              <span className="gradient-viral-text">Creators Parceiros</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monetize sua audiência promovendo a melhor ferramenta para YouTubers. 
              Comissões recorrentes de até 30% + cupons exclusivos.
            </p>
          </div>
          
          {/* Creator Benefits */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Benefits List */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">🚀 Por que se tornar um Creator Parceiro?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-viral rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">💰</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Comissões Recorrentes Altas</h4>
                    <p className="text-gray-300 text-sm">20-30% de comissão em TODOS os pagamentos dos seus referidos. Quanto maior seu canal, maior a porcentagem.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Produto que Seus Inscritos Vão Amar</h4>
                    <p className="text-gray-300 text-sm">TubeSpark resolve o maior problema de todo YouTuber. Taxa de conversão 3x maior que produtos genéricos.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">📊</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Dashboard de Analytics Completo</h4>
                    <p className="text-gray-300 text-sm">Veja seus ganhos, conversões e performance em tempo real. Relatórios detalhados para otimizar sua estratégia.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">🎁</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Cupons Exclusivos Para Sua Audiência</h4>
                    <p className="text-gray-300 text-sm">Ofereça descontos especiais que só sua audiência tem acesso. Mais valor = mais conversões.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Creator Tiers */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">🏆 Sistema de Tiers</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-600/10 border border-yellow-600/20 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-yellow-400">🥉 Bronze (1k-10k subs)</h4>
                    <span className="text-yellow-400 font-bold">20%</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 20% comissão recorrente por 12 meses</li>
                    <li>• Cupom de 20% para sua audiência</li>
                    <li>• Kit de materiais promocionais</li>
                    <li>• Suporte dedicado</li>
                  </ul>
                </div>
                
                <div className="bg-gray-400/10 border border-gray-400/20 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-300">🥈 Silver (10k-100k subs)</h4>
                    <span className="text-gray-300 font-bold">25%</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 25% comissão recorrente por 18 meses</li>
                    <li>• Cupom de 30% para sua audiência</li>
                    <li>• Acesso beta a novas features</li>
                    <li>• Call mensal de estratégia</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl relative">
                  <div className="absolute -top-2 -right-2 bg-gradient-viral text-white px-3 py-1 rounded-full text-xs font-bold">
                    TOP TIER
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-yellow-500">🥇 Gold (100k+ subs)</h4>
                    <span className="text-yellow-500 font-bold">30%</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 30% comissão recorrente LIFETIME</li>
                    <li>• Cupom de 40% para sua audiência</li>
                    <li>• Co-desenvolvimento de features</li>
                    <li>• Revenue share em produtos futuros</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creator Application */}
          <div className="card-glass p-12 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Pronto para Começar?</h3>
              <p className="text-xl text-gray-300">Aplicação leva 2 minutos. Análise automática do seu canal.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Application Form */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">📝 Aplicação Rápida</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Canal do YouTube</label>
                    <input type="url" placeholder="https://youtube.com/@seucanalm" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 transition-colors"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email de contato</label>
                    <input type="email" placeholder="seu@email.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 transition-colors"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Como planeja promover?</label>
                    <textarea placeholder="Descreva sua estratégia..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 transition-colors"></textarea>
                  </div>
                </div>
              </div>
              
              {/* Auto Analysis Preview */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">🤖 Análise Automática</h4>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <p>Cole o link do seu canal para ver a análise automática</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href={`/${locale}/creators/apply`} className="btn-viral px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 inline-block">
                🚀 Aplicar para Creator Program
              </Link>
              <p className="text-gray-400 text-sm mt-4">
                ⚡ Resposta em até 24h • 🎯 Aprovação automática para canais qualificados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-red-600/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Pare de Lutar Contra o<br/>
            <span className="gradient-viral-text">Bloqueio Criativo</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a +10k creators que já transformaram sua produção de conteúdo com IA
          </p>
          
          {/* Urgency & Social Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="card-glass p-6 rounded-xl">
              <div className="text-3xl font-bold gradient-viral-text mb-2">3 dias</div>
              <div className="text-gray-300">para aproveitar 30% OFF</div>
            </div>
            <div className="card-glass p-6 rounded-xl">
              <div className="text-3xl font-bold gradient-text mb-2">217</div>
              <div className="text-gray-300">cadastros hoje</div>
            </div>
            <div className="card-glass p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">4.9★</div>
              <div className="text-gray-300">de 1.432 avaliações</div>
            </div>
          </div>
          
          {/* Final CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/auth/signup`} className="btn-viral px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300">
              🚀 Começar Grátis Agora
            </Link>
            <button className="border-2 border-gray-600 px-12 py-4 rounded-xl text-lg font-semibold text-gray-300 hover:border-blue-500 hover:text-white transition-all duration-300">
              📱 Ver Demo
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mt-8">
            ✅ Sem cartão de crédito • ✅ Garantia de 30 dias • ✅ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">TubeSpark</span>
              </div>
              <p className="text-gray-400 text-sm">
                A única IA treinada especificamente para YouTubers. Transforme bloqueio criativo em vídeos virais.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors text-sm">Como Funciona</a></li>
                <li><a href="#precos" className="text-gray-400 hover:text-white transition-colors text-sm">Preços</a></li>
                <li><a href="#resultados" className="text-gray-400 hover:text-white transition-colors text-sm">Casos de Sucesso</a></li>
                <li><Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              </ul>
            </div>
            
            {/* Creators */}
            <div>
              <h4 className="text-white font-semibold mb-4">Para Creators</h4>
              <ul className="space-y-2">
                <li><a href="#creators" className="text-gray-400 hover:text-white transition-colors text-sm">Programa de Parceiros</a></li>
                <li><Link href={`/${locale}/creators/apply`} className="text-gray-400 hover:text-white transition-colors text-sm">Aplicar Agora</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Kit de Mídia</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Comunidade</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tutoriais</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Status</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2025 TubeSpark. Todos os direitos reservados. Feito com ❤️ para YouTubers brasileiros.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Termos</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacidade</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div className="sticky-cta visible">
        <Link href={`/${locale}/auth/signup`} className="btn-viral px-6 py-3 rounded-full font-bold shadow-2xl">
          🚀 Começar Grátis
        </Link>
      </div>
    </div>
  );
}