import { Sparkles, TrendingUp, Users, Zap, Play, BarChart3, Calendar, FileText, Target, Settings, Star } from "lucide-react";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import type { Locale } from "@/lib/i18n/config";
import { LanguageSelector } from "@/components/language-selector";
import { LandingAnimations } from "@/components/landing/LandingAnimations";
import { PricingSectionServer } from "@/components/pricing/PricingSectionServer";

export default async function LocaleHomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'landing' });
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TubeSpark
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#problema" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.problem')}
              </a>
              <a href="#solucao" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.solution')}
              </a>
              <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.howItWorks')}
              </a>
              <a href="#resultados" className="text-gray-300 hover:text-white transition-colors">
                {t('navigation.results')}
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link
                href={`/${locale}/auth/signin`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t('navigation.signin')}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                {t('navigation.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center hero-pattern pt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Social Proof Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full px-6 py-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-white"></div>
                </div>
                <span className="text-green-400 font-semibold text-sm">{t('hero.socialProof')}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">{t('hero.title')}</span><br />
              <span className="gradient-viral-text">{t('hero.titleHighlight')}</span><br />
              <span className="gradient-text">{t('hero.titleEnd')}</span>
            </h1>
            
            {/* Typing Animation Subheadline */}
            <div className="mb-8">
              <p className="text-xl sm:text-2xl text-gray-300 mb-4">
                {t('hero.subtitle')}
              </p>
              <div 
                className="text-lg sm:text-xl text-blue-400 font-medium typing-animation" 
                id="typingText"
                data-typing-text-0={t('hero.typingText1')}
                data-typing-text-1={t('hero.typingText2')}
                data-typing-text-2={t('hero.typingText3')}
                data-typing-text-3={t('hero.typingText4')}
              >
                {t('hero.typingAnimation')}
              </div>
            </div>
            
            {/* Interactive Dashboard Preview */}
            <div className="max-w-5xl mx-auto mb-12 relative">
              <div className="card-glass rounded-2xl p-6 sm:p-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 font-medium">{t('hero.dashboard.title')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{t('hero.dashboard.status')}</span>
                  </div>
                </div>
                
                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-blue-400 text-sm font-medium mb-2">{t('hero.dashboard.metrics.ideasGenerated')}</div>
                    <div className="text-3xl font-bold stats-counter" id="ideasCounter">{t('hero.dashboard.metrics.values.ideas')}</div>
                    <div className="text-green-400 text-xs">{t('hero.dashboard.metrics.changes.ideasToday')}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="text-purple-400 text-sm font-medium mb-2">{t('hero.dashboard.metrics.viralScore')}</div>
                    <div className="text-3xl font-bold stats-counter" id="viralScore">{t('hero.dashboard.metrics.values.viral')}</div>
                    <div className="text-green-400 text-xs">{t('hero.dashboard.metrics.changes.viralPercent')}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
                    <div className="text-green-400 text-sm font-medium mb-2">{t('hero.dashboard.metrics.ctrPrevisto')}</div>
                    <div className="text-3xl font-bold stats-counter" id="ctrScore">{t('hero.dashboard.metrics.values.ctr')}</div>
                    <div className="text-green-400 text-xs">{t('hero.dashboard.metrics.changes.ctrPercent')}</div>
                  </div>
                </div>
                
                {/* Live Generated Ideas */}
                <div className="space-y-4" id="liveIdeas">
                  <div className="idea-card p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 gradient-viral rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">🔥</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-2">"{t('hero.dashboard.suggestions.idea1.title')}"</div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">🔥 {t('hero.dashboard.suggestions.idea1.viral')}</span>
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">🎯 {t('hero.dashboard.suggestions.idea1.ctr')}</span>
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg">⚡ {t('hero.dashboard.suggestions.idea1.tag')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="idea-card p-4 bg-gradient-to-r from-green-600/10 to-teal-600/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">🚀</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-2">"{t('hero.dashboard.suggestions.idea2.title')}"</div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">🔥 {t('hero.dashboard.suggestions.idea2.viral')}</span>
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg">🎯 {t('hero.dashboard.suggestions.idea2.ctr')}</span>
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg">💡 {t('hero.dashboard.suggestions.idea2.tag')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive CTA */}
                <div className="mt-8 text-center">
                  <button className="btn-viral px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                    ⚡ {t('hero.dashboard.generateButton')}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link 
                href={`/${locale}/auth/signup`}
                className="btn-primary px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 w-full sm:w-auto"
              >
                🚀 {t('hero.ctaPrimary')}
              </Link>
              <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto">
                ▶️ {t('hero.ctaSecondary')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Side Stats */}
        <div className="absolute top-40 left-10 float-animation hidden lg:block">
          <div className="stats-card p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30">
            <div className="text-blue-400 font-bold text-lg">+180%</div>
            <div className="text-gray-400 text-xs">engagement médio</div>
          </div>
        </div>
        
        <div className="absolute top-32 right-10 float-animation hidden lg:block" style={{ animationDelay: '2s' }}>
          <div className="stats-card p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30">
            <div className="text-green-400 font-bold text-lg">3.2x</div>
            <div className="text-gray-400 text-xs">crescimento faster</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problema" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-white">{t('problem.title')}</span><br />
                <span className="text-red-400">{t('problem.titleHighlight')}</span>
              </h2>
              <p className="text-xl text-gray-300">
                {t('problem.subtitle')}
              </p>
            </div>
            
            {/* Problems Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="problem-highlight p-8 rounded-2xl">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-xl font-bold mb-4 text-white">{t('problem.creativeBlock.title')}</h3>
                <p className="text-gray-300 mb-4">
                  {t('problem.creativeBlock.description')}
                </p>
                <div className="text-red-400 text-sm font-medium">{t('problem.creativeBlock.stat')}</div>
              </div>
              
              <div className="problem-highlight p-8 rounded-2xl">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-4 text-white">{t('problem.timeWasted.title')}</h3>
                <p className="text-gray-300 mb-4">
                  {t('problem.timeWasted.description')}
                </p>
                <div className="text-red-400 text-sm font-medium">{t('problem.timeWasted.stat')}</div>
              </div>
              
              <div className="problem-highlight p-8 rounded-2xl">
                <div className="text-3xl mb-4">📉</div>
                <h3 className="text-xl font-bold mb-4 text-white">{t('problem.inconsistentViews.title')}</h3>
                <p className="text-gray-300 mb-4">
                  {t('problem.inconsistentViews.description')}
                </p>
                <div className="text-red-400 text-sm font-medium">{t('problem.inconsistentViews.stat')}</div>
              </div>
              
              <div className="problem-highlight p-8 rounded-2xl">
                <div className="text-3xl mb-4">😰</div>
                <h3 className="text-xl font-bold mb-4 text-white">{t('problem.blankPage.title')}</h3>
                <p className="text-gray-300 mb-4">
                  {t('problem.blankPage.description')}
                </p>
                <div className="text-red-400 text-sm font-medium">{t('problem.blankPage.stat')}</div>
              </div>
            </div>
            
            {/* Impact Stats */}
            <div className="text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">{t('problem.impact.title')}</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">73%</div>
                  <div className="text-gray-300">{t('problem.impact.stat1')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">15h/sem</div>
                  <div className="text-gray-300">{t('problem.impact.stat2')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400 mb-2">-40%</div>
                  <div className="text-gray-300">{t('problem.impact.stat3')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solucao" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{t('solution.title')}</span><br />
              <span className="gradient-text">{t('solution.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-300">
              {t('solution.subtitle')}
            </p>
          </div>
          
          {/* Solution Overview */}
          <div className="solution-highlight p-12 rounded-3xl mb-16">
            <div className="text-center mb-12">
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">{t('solution.overview.title')}</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">1</div>
                <h4 className="text-lg font-bold mb-3 text-white">{t('solution.overview.step1.title')}</h4>
                <p className="text-gray-300">{t('solution.overview.step1.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">2</div>
                <h4 className="text-lg font-bold mb-3 text-white">{t('solution.overview.step2.title')}</h4>
                <p className="text-gray-300">{t('solution.overview.step2.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">3</div>
                <h4 className="text-lg font-bold mb-3 text-white">{t('solution.overview.step3.title')}</h4>
                <p className="text-gray-300">{t('solution.overview.step3.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{t('features.title')}</span><br />
              <span className="gradient-text">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.ideaGenerator.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.ideaGenerator.description')}
              </p>
              <div className="text-blue-400 text-sm font-medium">
                ✨ {t('features.ideaGenerator.highlight')}
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 gradient-secondary rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.scriptWriter.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.scriptWriter.description')}
              </p>
              <div className="text-purple-400 text-sm font-medium">
                🎬 {t('features.scriptWriter.highlight')}
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.trendAnalysis.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.trendAnalysis.description')}
              </p>
              <div className="text-green-400 text-sm font-medium">
                📈 {t('features.trendAnalysis.highlight')}
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.competitorInsights.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.competitorInsights.description')}
              </p>
              <div className="text-yellow-400 text-sm font-medium">
                🎯 {t('features.competitorInsights.highlight')}
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.seoOptimization.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.seoOptimization.description')}
              </p>
              <div className="text-indigo-400 text-sm font-medium">
                🔍 {t('features.seoOptimization.highlight')}
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="feature-card p-8 rounded-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('features.contentCalendar.title')}</h3>
              <p className="text-gray-300 mb-4">
                {t('features.contentCalendar.description')}
              </p>
              <div className="text-pink-400 text-sm font-medium">
                📅 {t('features.contentCalendar.highlight')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="resultados" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="section-divider mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{t('results.title')}</span><br />
              <span className="gradient-text">{t('results.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-300">
              {t('results.subtitle')}
            </p>
          </div>
          
          {/* Success Metrics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center stats-card p-6 rounded-xl">
              <div className="text-4xl font-bold gradient-text mb-2">87%</div>
              <div className="text-gray-300">{t('results.metrics.creativeBlock')}</div>
            </div>
            <div className="text-center stats-card p-6 rounded-xl">
              <div className="text-4xl font-bold gradient-text mb-2">3.2x</div>
              <div className="text-gray-300">{t('results.metrics.viewsIncrease')}</div>
            </div>
            <div className="text-center stats-card p-6 rounded-xl">
              <div className="text-4xl font-bold gradient-text mb-2">75%</div>
              <div className="text-gray-300">{t('results.metrics.timeReduction')}</div>
            </div>
            <div className="text-center stats-card p-6 rounded-xl">
              <div className="text-4xl font-bold gradient-text mb-2">10k+</div>
              <div className="text-gray-300">{t('results.metrics.activeCreators')}</div>
            </div>
          </div>
          
          {/* User Stories */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold text-white">{t('results.testimonials.marina.name')}</div>
                  <div className="text-gray-400 text-sm">{t('results.testimonials.marina.channel')}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "{t('results.testimonials.marina.quote')}"
              </p>
              <div className="text-green-400 text-sm font-medium">
                📈 {t('results.testimonials.marina.result')}
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-semibold text-white">{t('results.testimonials.rafael.name')}</div>
                  <div className="text-gray-400 text-sm">{t('results.testimonials.rafael.channel')}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "{t('results.testimonials.rafael.quote')}"
              </p>
              <div className="text-green-400 text-sm font-medium">
                🔥 {t('results.testimonials.rafael.result')}
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <div className="font-semibold text-white">{t('results.testimonials.carla.name')}</div>
                  <div className="text-gray-400 text-sm">{t('results.testimonials.carla.channel')}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "{t('results.testimonials.carla.quote')}"
              </p>
              <div className="text-green-400 text-sm font-medium">
                🎯 {t('results.testimonials.carla.result')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSectionServer locale={locale} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t('cta.title')}
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          
          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-semibold">{t('cta.valueProps.immediate.title')}</div>
              <div className="text-gray-400 text-sm">{t('cta.valueProps.immediate.description')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white font-semibold">{t('cta.valueProps.personalized.title')}</div>
              <div className="text-gray-400 text-sm">{t('cta.valueProps.personalized.description')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-white font-semibold">{t('cta.valueProps.guaranteed.title')}</div>
              <div className="text-gray-400 text-sm">{t('cta.valueProps.guaranteed.description')}</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Link
              href={`/${locale}/auth/signup`}
              className="btn-primary px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 inline-block"
            >
              {t('cta.button')}
            </Link>
            
            <div className="text-gray-400 text-sm">
              ✨ {t('cta.guarantee')}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">TubeSpark</span>
            </div>
            
            <div className="text-gray-400 text-sm text-center">
              {t('footer.copyright')}
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.links.privacy')}</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.links.terms')}</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">{t('footer.links.support')}</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Client-side animations */}
      <LandingAnimations />
    </div>
  );
}