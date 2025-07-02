import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, ProfileContextType, ProfileContext } from './ProfileContext';


interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = React.useCallback(async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
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
      console.error('Error creating profile:', error);
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedData = {
        ...profileData,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'profiles', user.uid), updatedData);
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  };

  const searchProfiles = async (filters: Partial<UserProfile>): Promise<UserProfile[]> => {
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
      console.error('Error searching profiles:', error);
      return [];
    }
  };

  const value: ProfileContextType = {
    profile,
    loading,
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