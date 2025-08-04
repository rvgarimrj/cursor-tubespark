import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function HeroSectionSimple({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Transforme suas ideias em vídeos virais
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Use IA avançada para gerar ideias de vídeo personalizadas, analisar tendências e crescer seu canal do YouTube mais rápido que nunca.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link 
              href={`/${locale}/auth/signup`}
              className="rounded-md bg-youtube-red px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              <Sparkles className="inline-block mr-2 h-4 w-4" />
              Começar Gratuitamente
            </Link>
            
            <Link 
              href="#demo" 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-youtube-red dark:text-gray-300 dark:hover:text-white"
            >
              Ver demonstração <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}