// src/auth/phoneLogin.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface PhoneLoginData {
    phoneNumber: string;
    systemInfo?: {
        userAgent: string;
        platform: string;
        ipAddress?: string;
        timezone: string;
    };
}

export const phoneLogin = onCall(async (request) => {
    const { phoneNumber, systemInfo } = request.data as PhoneLoginData;

    if (!phoneNumber) {
        throw new HttpsError("invalid-argument", "Phone number is required.");
    }

    const auth = getAuth();
    const db = getFirestore();

    let user;
    let isNewUser = false;

    try {
        // Try to find existing user
        user = await auth.getUserByPhoneNumber(phoneNumber);
    } catch (err: any) {
        if (err.code === "auth/user-not-found") {
            user = await auth.createUser({ phoneNumber });
            isNewUser = true;
            logger.info(`New user created: UID=${user.uid}, Phone=${phoneNumber}`);
        } else {
            logger.error("Auth error while getting/creating user", err);
            throw new HttpsError("internal", "Failed to fetch or create user.");
        }
    }

    // Prepare Firestore user data
    const userRef = db.collection("users").doc(user.uid);
    const userData = {
        uid: user.uid,
        phoneNumber,
        lastLogin: new Date(),
        systemInfo: systemInfo || {},
        isNewUser,
        updatedAt: new Date(),
        ...(isNewUser && { createdAt: new Date() }),
    };

    try {
        await userRef.set(userData, { merge: true });
    } catch (err) {
        logger.error("Firestore error while storing user data", err);
        throw new HttpsError("internal", "Failed to store user data.");
    }

    // Check profile status
    let profileComplete = false;
    try {
        const profileSnap = await db.collection("profiles").doc(user.uid).get();
        profileComplete = !!profileSnap.exists && !!profileSnap.data()?.fullName;
    } catch (err) {
        logger.warn("Profile check failed (not critical)", err);
    }

    logger.info(`User login successful. UID=${user.uid}, ProfileComplete=${profileComplete}`);

    return {
        success: true,
        userId: user.uid,
        isNewUser,
        profileComplete,
        message: isNewUser ? "Account created successfully." : "Login successful.",
    };
});
