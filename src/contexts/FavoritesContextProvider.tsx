import React, { useState, useEffect, ReactNode } from 'react';
import { useEnhancedAuth } from './EnhancedAuthContext';
import { db } from '../services/firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, enableNetwork, disableNetwork } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FavoritesContext } from './FavoritesContext';
import { FavoritesContextType } from '../types';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { user } = useEnhancedAuth();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Handle network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      enableNetwork(db).catch(console.error);
    };

    const handleOffline = () => {
      setIsOffline(true);
      disableNetwork(db).catch(console.error);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadFavorites = React.useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFavorites(docSnap.data().profileIds || []);
      }
      setIsOffline(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
      } else {
        console.error('Error loading favorites:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, loadFavorites]);

  const addToFavorites = async (profileId: string) => {
    if (!user) {
      toast.error(t('favorites.loginRequired') || 'Please login to add favorites');
      return;
    }

    if (isOffline) {
      toast.error('Cannot add to favorites while offline');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          profileIds: arrayUnion(profileId),
          updatedAt: new Date()
        });
      } else {
        await setDoc(docRef, {
          profileIds: [profileId],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      setFavorites(prev => [...prev, profileId]);
      toast.success(t('favorites.addedToFavorites') || 'Added to favorites!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        toast.error('Cannot add to favorites while offline');
      } else {
        console.error('Error adding to favorites:', error);
        toast.error(t('common.error') || 'Error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (profileId: string) => {
    if (!user) {
      toast.error('Please login to remove favorites');
      return;
    }

    if (isOffline) {
      toast.error('Cannot remove from favorites while offline');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'favorites', user.uid);
      await updateDoc(docRef, {
        profileIds: arrayRemove(profileId),
        updatedAt: new Date()
      });

      setFavorites(prev => prev.filter(id => id !== profileId));
      toast.success(t('favorites.removedFromFavorites') || 'Removed from favorites!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        toast.error('Cannot remove from favorites while offline');
      } else {
        console.error('Error removing from favorites:', error);
        toast.error(t('common.error') || 'Error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (profileId: string): boolean => {
    return favorites.includes(profileId) && !!user;
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};