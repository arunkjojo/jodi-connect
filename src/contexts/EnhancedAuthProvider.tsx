import React, { useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User as FirebaseUser,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { UserService } from '../services/firebase/userService';
import { EnhancedAuthContext } from './EnhancedAuthContext';
import { EnhancedAuthContextType, User } from '../types';
import toast from 'react-hot-toast';

interface EnhancedAuthProviderProps {
  children: ReactNode;
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Load user data when Firebase user changes
  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userData = await UserService.getUserById(firebaseUser.uid);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserData(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    try {
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          }
        });
        setRecaptchaVerifier(verifier);

        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return confirmationResult;
      } else {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return confirmationResult;
      }
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      return null;
    }
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<boolean> => {
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      
      if (firebaseUser) {
        // Check if user document exists
        let userData = await UserService.getUserById(firebaseUser.uid);
        
        if (!userData) {
          // Create initial user document
          userData = await UserService.createInitialUser(
            firebaseUser.uid,
            firebaseUser.phoneNumber || '',
            await firebaseUser.getIdToken()
          );
        }
        
        setUser(userData);
        toast.success('Phone number verified successfully!');
        return true;
      }
      
      return false;
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: unknown) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const value: EnhancedAuthContextType = {
    firebaseUser,
    user,
    loading,
    signInWithPhone,
    verifyOTP,
    logout,
    refreshUser,
    recaptchaVerifier
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};