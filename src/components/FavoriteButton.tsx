import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FavoriteButtonProps {
  profileId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  profileId,
  size = 'md',
  variant = 'icon',
  className = ''
}) => {
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, loading } = useFavorites();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isCurrentlyFavorite = isFavorite(profileId);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (loading) {
      return;
    }

    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorites(profileId);
      } else {
        await addToFavorites(profileId);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${isCurrentlyFavorite
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          } ${className}`}
        aria-label={isCurrentlyFavorite ? t('favorites.removeFromFavorites') : t('favorites.addToFavorites')}
      >
        <Heart
          size={iconSizes[size]}
          className={`transition-colors ${isCurrentlyFavorite ? 'fill-current text-red-500' : ''
            }`}
        />
        <span className="text-sm">
          {isCurrentlyFavorite ? t('favorites.removeFromFavorites') : t('favorites.addToFavorites')}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${isCurrentlyFavorite
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        } ${className}`}
      aria-label={isCurrentlyFavorite ? t('favorites.removeFromFavorites') : t('favorites.addToFavorites')}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-all ${isCurrentlyFavorite ? 'fill-current' : ''
          }`}
      />
    </motion.button>
  );
};

export default FavoriteButton;