import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

interface NotificationData {
    userId: string;
    type: "login" | "profile_complete" | "favorite_received" | "custom";
    title: string;
    body: string;
    data?: Record<string, string>;
}

export const sendNotification = onCall(async (request: { data: NotificationData; }) => {
    try {
        const { userId, type, title, body, data } = request.data as NotificationData;

        if (!userId || !type || !title || !body) {
            throw new HttpsError("invalid-argument", "Missing required fields");
        }

        const db = getFirestore();
        const messaging = getMessaging();

        // Get user's FCM token
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.data();

        if (!userData?.fcmToken) {
            logger.warn(`No FCM token found for user: ${userId}`);
            return { success: false, message: "No FCM token found" };
        }

        // Prepare notification payload
        const message = {
            token: userData.fcmToken,
            notification: {
                title,
                body,
            },
            data: {
                type,
                userId,
                timestamp: new Date().toISOString(),
                ...data,
            },
            webpush: {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    title,
                    body,
                    icon: "/pwa-192x192.png",
                    badge: "/pwa-192x192.png",
                    tag: type,
                    requireInteraction: type === "favorite_received",
                },
            },
        };

        // Send notification
        const response = await messaging.send(message);

        // Store notification in database
        await db.collection("notifications").add({
            userId,
            type,
            title,
            body,
            data: data || {},
            sent: true,
            messageId: response,
            createdAt: new Date(),
        });

        logger.info(`Notification sent to user ${userId}: ${response}`);

        return {
            success: true,
            messageId: response,
        };

    } catch (error) {
        logger.error("Send notification error:", error);
        throw new HttpsError("internal", "Failed to send notification");
    }
});