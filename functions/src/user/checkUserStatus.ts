// src/user/checkUserStatus.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface UserStatusData {
    userId: string;
}

export const checkUserStatus = onCall(async (request) => {
    const { userId } = request.data as UserStatusData;

    if (!userId) {
        throw new HttpsError("invalid-argument", "User ID is required.");
    }

    const db = getFirestore();

    try {
        // Fetch profile info
        const profileDoc = await db.collection("profiles").doc(userId).get();
        const profile = profileDoc.data();

        const profileComplete = !!(
            profile?.fullName &&
            profile?.dateOfBirth &&
            profile?.gender &&
            profile?.state &&
            profile?.district
        );

        // Fetch current plan
        const userDoc = await db.collection("users").doc(userId).get();
        const user = userDoc.data();

        const currentPlan = user?.currentPlan || {
            type: "free",
            features: ["basic_search", "limited_profiles"],
        };

        // Fetch plan history
        const planHistorySnap = await db
            .collection("users")
            .doc(userId)
            .collection("planHistory")
            .orderBy("startDate", "desc")
            .get();

        const planHistory = planHistorySnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        logger.info(`User status fetched. UID=${userId}, ProfileComplete=${profileComplete}`);

        return {
            profileComplete,
            currentPlan,
            planHistory,
        };
    } catch (error) {
        logger.error("Error while checking user status", error);
        throw new HttpsError("internal", "Failed to fetch user status.");
    }
});
