"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  ideaId: string;
  isFavorite: boolean;
  onToggle?: (ideaId: string, newState: boolean) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({ 
  ideaId, 
  isFavorite, 
  onToggle, 
  className = '',
  size = 'md'
}: FavoriteButtonProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;

    setIsToggling(true);
    const newState = !localFavorite;
    
    // Optimistic update
    setLocalFavorite(newState);

    try {
      const response = await fetch(`/api/ideas/${ideaId}/favorite`, {
        method: 'PATCH'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao favoritar ideia');
      }

      // Update with server response
      setLocalFavorite(data.isFavorite);
      
      // Notify parent component
      onToggle?.(ideaId, data.isFavorite);

      // Emit event for cross-page sync
      window.dispatchEvent(new CustomEvent('favoriteChanged', {
        detail: { ideaId, isFavorite: data.isFavorite }
      }));

    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      setLocalFavorite(!newState);
    } finally {
      setIsToggling(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isToggling}
      className={`${buttonSizeClasses[size]} rounded-lg transition-all duration-200 ${
        localFavorite 
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-yellow-500'
      } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={localFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Star 
        className={`${sizeClasses[size]} transition-all duration-200 ${
          localFavorite ? 'fill-current' : ''
        } ${isToggling ? 'animate-pulse' : ''}`} 
      />
    </button>
  );
}