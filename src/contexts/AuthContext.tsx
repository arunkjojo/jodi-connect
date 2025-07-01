import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  User,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  recaptchaVerifier: RecaptchaVerifier | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      return null;
    }
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<boolean> => {
    try {
      await confirmationResult.confirm(otp);
      toast.success('Phone number verified successfully!');
      return true;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithPhone,
    verifyOTP,
    logout,
    recaptchaVerifier
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};