"use client";

import { useEffect, useRef, useState } from 'react';

export function useLandingAnimations() {
  const [mounted, setMounted] = useState(false);
  const typingRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<{ ideas: HTMLElement | null; viral: HTMLElement | null; ctr: HTMLElement | null }>({
    ideas: null,
    viral: null,
    ctr: null
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Typing animation effect
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

  // Counter animation effect
  useEffect(() => {
    if (!mounted) return;

    const animateCounters = () => {
      const ideas = document.getElementById('ideasCounter');
      const viral = document.getElementById('viralScore');
      const ctr = document.getElementById('ctrScore');
      
      countersRef.current = { ideas, viral, ctr };
      
      if (ideas && viral && ctr) {
        const interval = setInterval(() => {
          if (ideas) ideas.textContent = String(Math.floor(Math.random() * 3) + 45);
          if (viral) viral.textContent = String(Math.floor(Math.random() * 8) + 90);
          if (ctr) ctr.textContent = (Math.random() * 2 + 7).toFixed(1);
        }, 3000);

        return () => clearInterval(interval);
      }
    };

    const cleanup = animateCounters();
    return cleanup;
  }, [mounted]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    if (!mounted) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards for stagger animation
    const cards = document.querySelectorAll('.card-glass');
    cards.forEach((card, index) => {
      const element = card as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  return {
    mounted,
    typingRef,
    countersRef
  };
}

// Helper function for live ideas generation demo
export function generateDemoIdea() {
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
    },
    {
      emoji: "🎯",
      title: "5 IAs que Vão REVOLUCIONAR Seu Canal em 2025",
      viral: 96,
      ctr: 8.9,
      tag: "Future"
    },
    {
      emoji: "⚡",
      title: "Como Criar 100 Vídeos em 1 Dia com IA (Sem Aparecer)",
      viral: 92,
      ctr: 8.3,
      tag: "Automation"
    }
  ];

  return demoIdeas[Math.floor(Math.random() * demoIdeas.length)];
}

// CTA Functions for buttons
export const ctaFunctions = {
  startTrial: () => {
    // In a real app, this would redirect to the signup page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signup';
    }
  },
  
  openApp: () => {
    // In a real app, this would redirect to the login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
  },
  
  watchDemo: () => {
    // In a real app, this would open a demo video or modal
    if (typeof window !== 'undefined') {
      console.log('Demo functionality would be implemented here');
    }
  },
  
  choosePlan: (plan: string) => {
    // In a real app, this would redirect to checkout with plan
    if (typeof window !== 'undefined') {
      window.location.href = `/checkout?plan=${plan}`;
    }
  }
};