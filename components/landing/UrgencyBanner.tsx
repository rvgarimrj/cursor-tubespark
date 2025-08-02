'use client';

import { useState, useEffect } from 'react';

interface UrgencyBannerProps {
  message?: string;
  signupCount?: number;
}

export default function UrgencyBanner({ 
  message = "🚨 ÚLTIMAS 48 HORAS: 70% OFF + Bônus Exclusivos",
  signupCount = 1847 
}: UrgencyBannerProps) {
  const [currentCount, setCurrentCount] = useState(signupCount);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 15000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  // Format number consistently for both server and client
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="urgent-banner text-center py-3 text-white font-bold text-sm relative z-50 sticky top-0">
      <div className="container mx-auto px-4">
        <span className="inline-block">
          {message} | Já foram +{isClient ? formatNumber(currentCount) : formatNumber(signupCount)} inscrições hoje!
        </span>
      </div>
    </div>
  );
}