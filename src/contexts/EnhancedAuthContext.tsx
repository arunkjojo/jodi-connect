import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { User, UserStatus } from '../types/user';
import toast from 'react-hot-toast';


const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (!context) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};