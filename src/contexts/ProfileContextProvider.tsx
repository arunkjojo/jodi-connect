import React, { useState, useEffect, ReactNode } from 'react';
import { useEnhancedAuth } from './EnhancedAuthContext';
import { db } from '../services/firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { ProfileContext } from './ProfileContext';
import { ProfileContextType, UserProfile } from '../types';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useEnhancedAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
  const loadUserProfile = React.useCallback(async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      }
      setIsOffline(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        console.warn('Firebase is offline. Profile will be loaded when connection is restored.');
      } else {
        console.error('Error loading profile:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [loadUserProfile, user]);

  const createProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    if (isOffline) {
      console.warn('Cannot create profile while offline');
      return false;
    }

    try {
      const newProfile = {
        ...profileData,
        id: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'profiles', user.uid), newProfile);
      setProfile(newProfile as UserProfile);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        console.warn('Cannot create profile while offline');
      } else {
        console.error('Error creating profile:', error);
      }
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    if (isOffline) {
      console.warn('Cannot update profile while offline');
      return false;
    }

    try {
      const updatedData = {
        ...profileData,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'profiles', user.uid), updatedData);
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        console.warn('Cannot update profile while offline');
      } else {
        console.error('Error updating profile:', error);
      }
      return false;
    }
  };

  const getProfile = async (userId: string): Promise<UserProfile | null> => {
    if (isOffline) {
      console.warn('Cannot fetch profile while offline');
      return null;
    }
    
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        console.warn('Cannot fetch profile while offline');
      } else {
        console.error('Error getting profile:', error);
      }
      return null;
    }
  };

  const searchProfiles = async (filters: Partial<UserProfile>): Promise<UserProfile[]> => {
    if (isOffline) {
      console.warn('Cannot search profiles while offline');
      return [];
    }
    
    try {
      const profilesRef = collection(db, 'profiles');
      let q = query(profilesRef);

      // Add filters based on search criteria
      if (filters.gender) {
        q = query(q, where('gender', '==', filters.gender));
      }
      if (filters.religion) {
        q = query(q, where('religion', '==', filters.religion));
      }
      if (filters.state) {
        q = query(q, where('state', '==', filters.state));
      }

      const querySnapshot = await getDocs(q);
      const profiles: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() } as UserProfile);
      });

      return profiles;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('offline') || errorMessage.includes('unavailable')) {
        setIsOffline(true);
        console.warn('Cannot search profiles while offline');
      } else {
        console.error('Error searching profiles:', error);
      }
      return [];
    }
  };

  const value: ProfileContextType = {
    profile,
    loading,
    isOffline,
    createProfile,
    updateProfile,
    getProfile,
    searchProfiles
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};