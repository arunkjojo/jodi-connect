import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface UserStatusData {
    userId: string;
}

export const checkUserStatus = onCall(async (request: { data: UserStatusData; }) => {
    try {
        const { userId } = request.data as UserStatusData;

        if (!userId) {
            throw new HttpsError("invalid-argument", "User ID is required");
        }

        const db = getFirestore();

        // Check profile completion
        const profileDoc = await db.collection("profiles").doc(userId).get();
        const profileData = profileDoc.data();

        const profileComplete = !!(
            profileData?.fullName &&
            profileData?.dateOfBirth &&
            profileData?.gender &&
            profileData?.state &&
            profileData?.district
        );

        // Get current plan
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.data();

        const currentPlan = userData?.currentPlan || {
            type: "free",
            features: ["basic_search", "limited_profiles"],
        };

        // Get plan history
        const planHistorySnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("planHistory")
            .orderBy("startDate", "desc")
            .get();

        const planHistory = planHistorySnapshot.docs.map((doc: { id: any; data: () => any; }) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`User status checked: ${userId}, Profile complete: ${profileComplete}`);

        return {
            profileComplete,
            currentPlan,
            planHistory,
        };

    } catch (error) {
        logger.error("Check user status error:", error);
        throw new HttpsError("internal", "Failed to check user status");
    }
});