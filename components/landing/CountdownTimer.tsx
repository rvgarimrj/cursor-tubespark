'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownTimer({ 
  className = '',
  showLabels = true,
  size = 'md'
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 47,
    seconds: 12
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const distance = tomorrow.getTime() - now;
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl md:text-4xl',
    lg: 'text-4xl md:text-6xl'
  };

  const timeString = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className={`text-center ${className}`}>
      <div className={`font-bold text-white ${sizeClasses[size]}`}>
        {timeString}
      </div>
      {showLabels && (
        <div className="text-white/70 text-sm mt-2">
          horas : minutos : segundos
        </div>
      )}
    </div>
  );
}