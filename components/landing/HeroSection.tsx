'use client';

import { Play } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  locale: string;
  onCtaClick?: () => void;
}

export default function HeroSection({ locale, onCtaClick }: HeroSectionProps) {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        {/* Social Proof Alert */}
        <div className="mb-8 inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">
            +127 novos YouTubers se inscreveram nas últimas 3 horas
          </span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="text-white">O Segredo dos YouTubers</span><br/>
          <span className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
            que FATURAM R$100k+
          </span><br/>
          <span className="text-white">por Mês</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          <strong className="text-yellow-400">Sistema comprovado</strong> usado por +10.847 criadores para transformar 
          <strong className="text-red-400"> ideias simples em roteiros virais</strong> que geram milhões de views
        </p>
        
        {/* Video/Demo */}
        <div className="mb-12 relative max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-red-600 to-yellow-600 p-1 rounded-2xl">
            <div className="bg-black rounded-xl p-8 md:p-16">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
                <div>
                  <p className="text-left">
                    <span className="text-yellow-400 font-bold">▶ ASSISTA:</span><br/>
                    <span className="text-lg text-white">Como João passou de 1k para 1M</span><br/>
                    <span className="text-lg text-white">de inscritos em 6 meses</span>
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">🔥 +47.392 visualizações | ⏱️ 2:43 min</p>
            </div>
          </div>
        </div>
        
        {/* CTA Principal */}
        <div className="space-y-6">
          <Link 
            href={`/${locale}/auth/signup`}
            onClick={onCtaClick}
            className="group relative inline-block youtube-red-gradient px-12 py-6 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl text-white"
          >
            <span className="relative z-10">🚀 QUERO ROTEIROS VIRAIS AGORA</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          
          <p className="text-gray-400 text-sm">
            ✅ Sem mensalidades ocultas | ✅ Garantia 30 dias | ✅ Acesso imediato
          </p>
          
          {/* Social Proof Numbers */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="number-counter text-3xl font-black">+1.2M</div>
              <div className="text-gray-400 text-sm">Views Geradas</div>
            </div>
            <div className="text-center">
              <div className="number-counter text-3xl font-black">847</div>
              <div className="text-gray-400 text-sm">Creators Ativos</div>
            </div>
            <div className="text-center">
              <div className="number-counter text-3xl font-black">4.9★</div>
              <div className="text-gray-400 text-sm">Avaliação</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 float hidden lg:block">
        <div className="bg-red-600/20 backdrop-blur p-4 rounded-xl border border-red-600/30">
          <div className="text-yellow-400 font-bold">+2.4M views</div>
          <div className="text-xs text-gray-400">Canal @TechReview</div>
        </div>
      </div>
      
      <div className="absolute top-40 right-20 float-delayed hidden lg:block">
        <div className="bg-green-600/20 backdrop-blur p-4 rounded-xl border border-green-600/30">
          <div className="text-green-400 font-bold">R$47k faturado</div>
          <div className="text-xs text-gray-400">Canal @LifeHacks</div>
        </div>
      </div>
    </section>
  );
}