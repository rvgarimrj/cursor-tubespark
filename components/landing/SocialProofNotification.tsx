'use client';

import { useState, useEffect } from 'react';

interface SocialProofNotificationProps {
  enabled?: boolean;
}

const notifications = [
  "João M. acabou de se inscrever no plano Pro! 🚀",
  "Ana L. gerou +2.4M views com TubeSpark! 🔥", 
  "Carlos R. faturou R$18k este mês! 💰",
  "Maria S. triplicou os inscritos! 📈",
  "Pedro L. viralizou com 5M views! ⚡",
  "Sofia K. conseguiu 50k inscritos! 🎯",
  "Rafael B. monetizou em 1 semana! 💎",
  "Carla D. bateu 1M de views! 🌟"
];

export default function SocialProofNotification({ enabled = true }: SocialProofNotificationProps) {
  const [notification, setNotification] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setNotification(null);
        }, 300);
      }, 4000);
    };

    const interval = setInterval(showNotification, Math.random() * 7000 + 8000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!notification) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 ${
        isVisible 
          ? 'transform translate-x-0 opacity-100' 
          : 'transform translate-x-full opacity-0'
      }`}
    >
      <div className="text-sm font-medium">
        {notification}
      </div>
    </div>
  );
}