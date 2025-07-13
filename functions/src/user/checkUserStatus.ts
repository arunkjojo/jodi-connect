import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface CheckUserStatusData {
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

export const checkUserStatus = onCall(async (request) => {
    const { userId } = request.data as CheckUserStatusData;

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
        const currentStatus = userData?.status || 'pending';

        // Determine feature access based on status
        const canAccessFeatures = {
            viewProfiles: currentStatus === 'complete',
            favoriteUsers: currentStatus === 'complete',
            messaging: currentStatus === 'complete',
            fullDashboard: currentStatus === 'complete'
        };

        const response: UserStatusResponse = {
            status: currentStatus,
            user: { id: userDoc.id, ...userData },
            canAccessFeatures
        };

        logger.info(`User status checked. UID=${userId}, Status=${currentStatus}`);

        return response;
    } catch (error) {
        logger.error("Error checking user status", error);
        throw new HttpsError("internal", "Failed to check user status.");
    }
});