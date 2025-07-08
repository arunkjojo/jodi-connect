import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FavoritesContext } from './FavoritesContext';
import { FavoritesContextType } from '../types';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = React.useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFavorites(docSnap.data().profileIds || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
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
      toast.error(t('favorites.loginRequired'));
      return;
    }

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
      toast.success(t('favorites.addedToFavorites'));
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error(t('common.error'));
    }
  };

  const removeFromFavorites = async (profileId: string) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'favorites', user.uid);
      await updateDoc(docRef, {
        profileIds: arrayRemove(profileId),
        updatedAt: new Date()
      });

      setFavorites(prev => prev.filter(id => id !== profileId));
      toast.success(t('favorites.removedFromFavorites'));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error(t('common.error'));
    }
  };

  const isFavorite = (profileId: string): boolean => {
    return favorites.includes(profileId);
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