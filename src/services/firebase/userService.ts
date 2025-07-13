import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from './config';
import { User, UserStatus, ProfileFormData, UserStatusResponse } from '../../types/user';

export class UserService {
  /**
   * Generate a unique referral code
   */
  private static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'JC';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Create initial user document after phone authentication
   */
  static async createInitialUser(
    userId: string, 
    mobileNumber: string, 
    token: string
  ): Promise<User> {
    const referralCode = this.generateReferralCode();
    
    // Ensure referral code is unique
    let isUnique = false;
    let finalReferralCode = referralCode;
    
    while (!isUnique) {
      const existingUser = await this.getUserByReferralCode(finalReferralCode);
      if (!existingUser) {
        isUnique = true;
      } else {
        finalReferralCode = this.generateReferralCode();
      }
    }

    const userData: User = {
      id: userId,
      mobileNumber,
      token,
      status: 'pending',
      referralCode: finalReferralCode,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', userId), userData);
    return userData;
  }

  /**
   * Update user profile with basic details
   */
  static async updateBasicDetails(
    userId: string, 
    basicData: Pick<ProfileFormData, 'fullName' | 'dateOfBirth' | 'gender' | 'districtId' | 'city' | 'aboutMe'>
  ): Promise<void> {
    const updateData = {
      ...basicData,
      status: 'basic' as UserStatus,
      updatedAt: new Date()
    };

    await updateDoc(doc(db, 'users', userId), updateData);
  }

  /**
   * Update user profile with additional details
   */
  static async updateAdditionalDetails(
    userId: string, 
    additionalData: Pick<ProfileFormData, 'religion' | 'maritalStatus' | 'occupation' | 'education' | 'detailedIntroduction'>
  ): Promise<void> {
    const updateData = {
      ...additionalData,
      status: 'moreDetails' as UserStatus,
      updatedAt: new Date()
    };

    await updateDoc(doc(db, 'users', userId), updateData);
  }

  /**
   * Upload profile photo
   */
  static async uploadProfilePhoto(userId: string, photoFile: File): Promise<string> {
    const photoRef = ref(storage, `${userId}/photo`);
    const snapshot = await uploadBytes(photoRef, photoFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      photoUrl: downloadURL,
      status: 'user-photo' as UserStatus,
      updatedAt: new Date()
    });

    return downloadURL;
  }

  /**
   * Upload verification document
   */
  static async uploadVerificationDocument(userId: string, documentFile: File): Promise<string> {
    const docRef = ref(storage, `${userId}/verification`);
    const snapshot = await uploadBytes(docRef, documentFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      verificationDocumentUrl: downloadURL,
      status: 'user-verification' as UserStatus,
      updatedAt: new Date()
    });

    return downloadURL;
  }

  /**
   * Set used referral code
   */
  static async setUsedReferralCode(userId: string, referralCode: string): Promise<void> {
    await updateDoc(doc(db, 'users', userId), {
      usedReferralCode: referralCode,
      updatedAt: new Date()
    });
  }

  /**
   * Get user by referral code
   */
  static async getUserByReferralCode(referralCode: string): Promise<User | null> {
    const q = query(collection(db, 'users'), where('referralCode', '==', referralCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  /**
   * Check user profile completion and update final status
   */
  static async checkUserProfile(userId: string): Promise<UserStatusResponse> {
    const checkUserProfileFunction = httpsCallable(functions, 'checkUserProfile');
    const result = await checkUserProfileFunction({ userId });
    return result.data as UserStatusResponse;
  }

  /**
   * Check user status
   */
  static async checkUserStatus(userId: string): Promise<UserStatusResponse> {
    const checkUserStatusFunction = httpsCallable(functions, 'checkUserStatus');
    const result = await checkUserStatusFunction({ userId });
    return result.data as UserStatusResponse;
  }

  /**
   * Validate referral code
   */
  static async validateReferralCode(referralCode: string): Promise<boolean> {
    const user = await this.getUserByReferralCode(referralCode);
    return user !== null;
  }
}