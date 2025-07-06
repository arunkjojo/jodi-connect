import { useEffect, useState } from 'react';
import { FirebaseMessagingService } from '../services/firebase/messaging';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export const useFirebaseMessaging = () => {
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        const initializeMessaging = async () => {
            try {
                // Check current permission
                setPermission(Notification.permission);

                // Initialize FCM
                const fcmToken = await FirebaseMessagingService.initialize();
                setToken(fcmToken);

                if (fcmToken && user) {
                    // Store FCM token in user document
                    await updateDoc(doc(db, 'users', user.uid), {
                        fcmToken,
                        fcmTokenUpdatedAt: new Date(),
                    });
                }

                // Listen for foreground messages
                const unsubscribe = FirebaseMessagingService.onForegroundMessage((payload) => {
                    const { notification, data } = payload;

                    if (notification) {
                        FirebaseMessagingService.handleNotification(
                            data?.type || 'custom',
                            {
                                title: notification.title,
                                message: notification.body,
                                ...data,
                            }
                        );
                    }
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error initializing messaging:', error);
            }
        };

        if (user) {
            initializeMessaging();
        }
    }, [user]);

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission === 'granted') {
                const fcmToken = await FirebaseMessagingService.initialize();
                setToken(fcmToken);
                return fcmToken;
            }

            return null;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return null;
        }
    };

    return {
        token,
        permission,
        requestPermission,
        isSupported: 'Notification' in window,
    };
};