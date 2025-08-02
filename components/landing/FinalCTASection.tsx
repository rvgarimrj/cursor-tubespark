'use client';

import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

interface FinalCTASectionProps {
  locale: string;
}

const recentSignups = [
  "João M. - @TechBrasil",
  "Ana S. - @VidaSaudavel", 
  "Pedro L. - @GameReview",
  "Maria K. - @CozinhaFácil",
  "Carlos R. - @FitnessBR"
];

export default function FinalCTASection({ locale }: FinalCTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-red-600 to-yellow-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">
          Está Pronto Para<br/>
          Viralizar no YouTube?
        </h2>
        
        <p className="text-2xl text-white/90 mb-8 font-medium">
          Junte-se aos <strong>10.847 creators</strong> que já transformaram 
          seus canais com o TubeSpark
        </p>
        
        {/* Urgency Counter */}
        <div className="bg-black/30 rounded-2xl p-6 mb-8 inline-block">
          <div className="text-yellow-400 font-bold text-lg mb-2">⏰ OFERTA ESPECIAL ACABA EM:</div>
          <CountdownTimer size="lg" />
        </div>
        
        <div className="space-y-6">
          <Link
            href={`/${locale}/auth/signup`}
            className="group relative inline-block bg-white text-red-600 px-16 py-6 rounded-full text-2xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <span className="relative z-10">🚀 SIM, QUERO VIRALIZAR AGORA!</span>
          </Link>
          
          <div className="text-white/80">
            <div className="flex justify-center items-center space-x-8 text-sm">
              <span>✅ Acesso Imediato</span>
              <span>✅ Garantia 30 Dias</span>
              <span>✅ Suporte Incluído</span>
            </div>
          </div>
          
          {/* Final Social Proof */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mt-8">
            <div className="text-white/70 text-sm mb-3">Últimos a se inscrever:</div>
            <div className="flex justify-center items-center space-x-4 text-white text-sm flex-wrap gap-2">
              {recentSignups.map((signup, index) => (
                <span key={index} className="whitespace-nowrap">
                  👤 {signup}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}