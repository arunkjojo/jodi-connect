import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface CheckUserProfileData {
    userId: string;
}

interface UserStatusResponse {
    status: string;
    user: any;
    canAccessFeatures: {
        viewProfiles: boolean;
        favoriteUsers: boolean;
        messaging: boolean;
        fullDashboard: boolean;
    };
}

export const checkUserProfile = onCall(async (request) => {
    const { userId } = request.data as CheckUserProfileData;

    if (!userId) {
        throw new HttpsError("invalid-argument", "User ID is required.");
    }

    const db = getFirestore();

    try {
        // Get user document
        const userDoc = await db.collection("users").doc(userId).get();
        
        if (!userDoc.exists) {
            throw new HttpsError("not-found", "User not found.");
        }

        const userData = userDoc.data();
        let finalStatus = userData?.status || 'pending';

        // Check if user has completed all required steps
        const hasBasicDetails = userData?.fullName && userData?.dateOfBirth && 
                               userData?.gender && userData?.districtId && userData?.city;
        const hasAdditionalDetails = userData?.religion && userData?.maritalStatus;
        const hasPhoto = userData?.photoUrl;
        const hasVerification = userData?.verificationDocumentUrl;

        if (hasBasicDetails && hasAdditionalDetails && hasPhoto && hasVerification) {
            // Check referral condition
            if (userData?.usedReferralCode) {
                // Find the user who owns this referral code
                const referralQuery = await db.collection("users")
                    .where("referralCode", "==", userData.usedReferralCode)
                    .limit(1)
                    .get();

                if (!referralQuery.empty) {
                    const referralUser = referralQuery.docs[0].data();
                    
                    // Check if referral user is female and has completed profile
                    if (referralUser.gender === 'Female' && referralUser.status === 'complete') {
                        finalStatus = 'complete';
                    } else {
                        finalStatus = 'partial';
                    }
                } else {
                    finalStatus = 'partial';
                }
            } else {
                finalStatus = 'partial';
            }

            // Update user status
            await db.collection("users").doc(userId).update({
                status: finalStatus,
                updatedAt: new Date()
            });
        }

        // Determine feature access
        const canAccessFeatures = {
            viewProfiles: finalStatus === 'complete',
            favoriteUsers: finalStatus === 'complete',
            messaging: finalStatus === 'complete',
            fullDashboard: finalStatus === 'complete'
        };

        const response: UserStatusResponse = {
            status: finalStatus,
            user: { id: userDoc.id, ...userData, status: finalStatus },
            canAccessFeatures
        };

        logger.info(`User profile checked. UID=${userId}, Status=${finalStatus}`);

        return response;
    } catch (error) {
        logger.error("Error checking user profile", error);
        throw new HttpsError("internal", "Failed to check user profile.");
    }
});