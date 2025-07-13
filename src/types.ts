import {
    RecaptchaVerifier,
    ConfirmationResult,
    User as FirebaseUser
} from 'firebase/auth';

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    icon: string;
}

export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    source: string;
    color: string;
}

export interface HowItWorksStep {
    number: number;
    title: string;
    description: string;
    icon: string;
    plans?: string;
    chargesNow?: string;
    confirmedMatch?: string;
}

export interface NavigationItem {
    path: string;
    icon: string;
    label: string;
}

export interface UserProfile {
    id: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    location?: string;
    isOnline?: boolean;
    email?: string;
    phone?: string;
    bio?: string;
    motherTongue?: string;
    height?: number;
    income?: string;
    familyDetails?: string;
    profileCreatedBy?: string;
    genderPreference?: string;
    agePreference?: string;
    state: string;
    district: string;
    city: string;
    aboutMe: string;
    religion: string;
    caste: string;
    maritalStatus: string;
    detailedIntroduction: string;
    photos: string[];
    idVerified: boolean;
    interests: string[];
    occupation: string;
    education: string;
    diet: string;
    smoking: string;
    drinking: string;
    createdAt: Date;
    updatedAt: Date;
    hobies?: string[];
    languages?: string[];
    lookingFor?: string;
}

export interface ProfileCardData {
    id: string;
    name: string;
    age: number;
    location: string;
    isOnline?: boolean;
    photo?: string;
    occupation?: string;
}

export interface SearchFilters {
    quickSearch: string;
    ageRange: [number, number];
    locationRadius: number;
    specificCity: string;
    religion: string;
    caste: string;
    motherTongue: string;
    maritalStatus: string;
    dietaryPreferences: string[];
    smokingHabits: string[];
    drinkingHabits: string[];
    relationshipGoals: string[];
    interests: string[];
}

export interface AuthContextType {
    user: any | null;
    loading: boolean;
    signInWithPhone: (phoneNumber: string) => Promise<any>;
    verifyOTP: (confirmationResult: any, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
    recaptchaVerifier: any | null;
}

export interface ProfileContextType {
    profile: UserProfile | null;
    loading: boolean;
  isOffline?: boolean;
    createProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
    updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
    getProfile: (userId: string) => Promise<UserProfile | null>;
    searchProfiles: (filters: Partial<UserProfile>) => Promise<UserProfile[]>;
}

export interface FavoritesContextType {
    favorites: string[];
    loading: boolean;
    addToFavorites: (profileId: string) => Promise<void>;
    removeFromFavorites: (profileId: string) => Promise<void>;
    isFavorite: (profileId: string) => boolean;
}

export interface SystemInfo {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    timezone: string;
    ipAddress?: string;
    networkInfo?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
    };
    deviceMemory?: number;
    hardwareConcurrency?: number;
    cookieEnabled: boolean;
    onlineStatus: boolean;
}

export type UserStatus = 'pending' | 'basic' | 'moreDetails' | 'user-photo' | 'user-verification' | 'partial' | 'complete';

export interface User {
  id: string;
  mobileNumber: string;
  token: string;
  status: UserStatus;
  referralCode: string;
  usedReferralCode?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  districtId?: string;
  city?: string;
  aboutMe?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  detailedIntroduction?: string;
  photoUrl?: string;
  verificationDocumentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileFormData {
  // Basic Details
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  districtId?: string;
  city?: string;
  aboutMe?: string;
  
  // Additional Details
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  detailedIntroduction?: string;
  
  // Files
  profilePhoto?: File;
  verificationDocument?: File;
  
  // Referral
  usedReferralCode?: string;
}

export interface UserStatusResponse {
  status: UserStatus;
  user: User;
  canAccessFeatures: {
    viewProfiles: boolean;
    favoriteUsers: boolean;
    messaging: boolean;
    fullDashboard: boolean;
  };
}

export interface EnhancedAuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  recaptchaVerifier: RecaptchaVerifier | null;
}