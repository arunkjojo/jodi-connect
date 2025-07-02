import { createContext, useContext } from 'react';

export interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  addToFavorites: (profileId: string) => Promise<void>;
  removeFromFavorites: (profileId: string) => Promise<void>;
  isFavorite: (profileId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};