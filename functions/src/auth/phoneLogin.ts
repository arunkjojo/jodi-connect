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

export const phoneLogin = onCall(async (request: { data: PhoneLoginData; }) => {
    try {
        const { phoneNumber, systemInfo } = request.data as PhoneLoginData;

        if (!phoneNumber) {
            throw new HttpsError("invalid-argument", "Phone number is required");
        }

        const auth = getAuth();
        const db = getFirestore();

        let user;
        let isNewUser = false;

        try {
            // Try to get existing user by phone number
            user = await auth.getUserByPhoneNumber(phoneNumber);
        } catch (error) {
            // User doesn't exist, create new user
            user = await auth.createUser({
                phoneNumber: phoneNumber,
            });
            isNewUser = true;
            logger.info(`New user created: ${user.uid}`);
            console.log('=========== New user created ===========', error);
        }

        // Store/update user data in Firestore
        const userData: {
            uid: string;
            phoneNumber: string;
            lastLogin: Date;
            systemInfo: any;
            isNewUser: boolean;
            updatedAt: Date;
            createdAt?: Date;
        } = {
            uid: user.uid,
            phoneNumber: phoneNumber,
            lastLogin: new Date(),
            systemInfo: systemInfo || {},
            isNewUser,
            updatedAt: new Date(),
        };

        if (isNewUser) {
            userData.createdAt = new Date();
        }

        await db.collection("users").doc(user.uid).set(userData, { merge: true });

        // Check if profile is complete
        const profileDoc = await db.collection("profiles").doc(user.uid).get();
        const profileComplete = profileDoc.exists && profileDoc.data()?.fullName;

        logger.info(`User login successful: ${user.uid}, Profile complete: ${profileComplete}`);

        return {
            success: true,
            userId: user.uid,
            isNewUser,
            profileComplete: !!profileComplete,
            message: isNewUser ? "Account created successfully" : "Login successful",
        };

    } catch (error) {
        logger.error("Phone login error:", error);
        throw new HttpsError("internal", "Login failed");
    }
});