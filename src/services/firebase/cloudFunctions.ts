import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

// Cloud function interfaces
interface PhoneLoginRequest {
    phoneNumber: string;
    systemInfo?: {
        userAgent: string;
        platform: string;
        ipAddress?: string;
        timezone: string;
    };
}

interface PhoneLoginResponse {
    success: boolean;
    userId: string;
    isNewUser: boolean;
    profileComplete: boolean;
    message: string;
}

interface UserStatusResponse {
    profileComplete: boolean;
    currentPlan: {
        type: 'free' | 'basic' | 'premium';
        expiresAt?: Date;
        features: string[];
    };
    planHistory: Array<{
        planType: string;
        startDate: Date;
        endDate?: Date;
        status: 'active' | 'expired' | 'cancelled';
    }>;
}

// Cloud function calls
export const phoneLogin = async (data: PhoneLoginRequest): Promise<PhoneLoginResponse> => {
    const loginFunction = httpsCallable(functions, 'phoneLogin');
    const result = await loginFunction(data);
    return result.data as PhoneLoginResponse;
};

export const checkUserStatus = async (userId: string): Promise<UserStatusResponse> => {
    const statusFunction = httpsCallable(functions, 'checkUserStatus');
    const result = await statusFunction({ userId });
    return result.data as UserStatusResponse;
};

export const updateUserProfile = async (profileData: any) => {
    const updateFunction = httpsCallable(functions, 'updateUserProfile');
    const result = await updateFunction(profileData);
    return result.data;
};

export const sendNotification = async (data: {
    userId: string;
    type: 'login' | 'profile_complete' | 'favorite_received' | 'custom';
    title: string;
    body: string;
    data?: Record<string, string>;
}) => {
    const notificationFunction = httpsCallable(functions, 'sendNotification');
    const result = await notificationFunction(data);
    return result.data;
};