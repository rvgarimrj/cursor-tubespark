import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Carlos M.",
    handle: "@TechReviewBR",
    subscribers: "487k inscritos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    testimonial: "Meu último vídeo com roteiro do TubeSpark fez 2.4 milhões de views e me rendeu R$18k só em AdSense. Nunca pensei que seria tão fácil!",
    metrics: [
      { label: "📈 +340% views", color: "text-green-400" },
      { label: "💰 R$18k gerados", color: "text-blue-400" }
    ]
  },
  {
    id: 2,
    name: "Ana L.",
    handle: "@VidaFit",
    subscribers: "156k inscritos",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b125a1b5?w=100&h=100&fit=crop&crop=face",
    testimonial: "Desde que comecei a usar o TubeSpark, triplicaram meus inscritos. Os roteiros são simplesmente viciantes, minha audiência sempre pede mais!",
    metrics: [
      { label: "👥 +300% inscritos", color: "text-green-400" },
      { label: "⚡ +250% engajamento", color: "text-purple-400" }
    ]
  },
  {
    id: 3,
    name: "Rafael S.",
    handle: "@InvestSmart",
    subscribers: "823k inscritos",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    testimonial: "O sistema de roteiros YouTube-Native é revolucionário. Faturei R$120k no último mês só com os vídeos baseados nas ideias do TubeSpark.",
    metrics: [
      { label: "💰 R$120k/mês", color: "text-green-400" },
      { label: "🔥 Vídeos virais", color: "text-red-400" }
    ]
  }
];

const videoResults = [
  {
    views: "2.4M",
    timeframe: "views em 24h",
    title: "\"Como Investir R$100\"",
    gradient: "from-red-600/20 to-yellow-600/20",
    border: "border-red-600/30",
    textColor: "text-red-400"
  },
  {
    views: "847K",
    timeframe: "views em 3 dias",
    title: "\"Treino 5 Minutos\"",
    gradient: "from-green-600/20 to-blue-600/20",
    border: "border-green-600/30",
    textColor: "text-green-400"
  },
  {
    views: "1.2M",
    timeframe: "views em 1 semana",
    title: "\"Review iPhone 15\"",
    gradient: "from-purple-600/20 to-pink-600/20",
    border: "border-purple-600/30",
    textColor: "text-purple-400"
  },
  {
    views: "3.1M",
    timeframe: "views em 2 semanas",
    title: "\"Vida de YouTuber\"",
    gradient: "from-orange-600/20 to-red-600/20",
    border: "border-orange-600/30",
    textColor: "text-orange-400"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-yellow-400">YouTubers Reais,</span> Resultados Reais
          </h2>
          <p className="text-xl text-gray-400">Veja o que creators como você estão conseguindo com TubeSpark</p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="creator-avatar w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-yellow-400 text-sm">{testimonial.handle}</div>
                  <div className="text-gray-400 text-xs">{testimonial.subscribers}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "{testimonial.testimonial}"
              </p>
              <div className="flex items-center space-x-2 text-sm">
                {testimonial.metrics.map((metric, index) => (
                  <span key={index} className={metric.color}>
                    {metric.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Video Results */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8 text-yellow-400">🏆 Últimos Resultados dos Nossos Creators</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {videoResults.map((result, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${result.gradient} p-6 rounded-xl border ${result.border}`}
              >
                <div className={`text-3xl font-bold ${result.textColor}`}>{result.views}</div>
                <div className="text-sm text-gray-400">{result.timeframe}</div>
                <div className="text-xs text-yellow-400 mt-2">{result.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}