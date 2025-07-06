import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './config';

export class FirebaseMessagingService {
    private static messaging = getMessaging(app);
    private static vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    /**
     * Initialize FCM and request permission
     */
    static async initialize(): Promise<string | null> {
        try {
            // Request notification permission
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                const token = await getToken(this.messaging, {
                    vapidKey: this.vapidKey,
                });

                console.log('FCM Token:', token);
                return token;
            } else {
                console.warn('Notification permission denied');
                return null;
            }
        } catch (error) {
            console.error('Error initializing FCM:', error);
            return null;
        }
    }

    /**
     * Listen for foreground messages
     */
    static onForegroundMessage(callback: (payload: any) => void) {
        return onMessage(this.messaging, (payload) => {
            console.log('Foreground message received:', payload);
            callback(payload);
        });
    }

    /**
     * Show notification
     */
    static showNotification(title: string, options?: NotificationOptions) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                ...options,
            });
        }
    }

    /**
     * Handle notification types
     */
    static handleNotification(type: string, data: any) {
        switch (type) {
            case 'login_success':
                this.showNotification('Welcome back!', {
                    body: 'You have successfully logged in.',
                    tag: 'login',
                });
                break;

            case 'profile_complete':
                this.showNotification('Profile Complete!', {
                    body: 'Your profile has been successfully completed.',
                    tag: 'profile',
                });
                break;

            case 'favorite_received':
                this.showNotification('Someone liked your profile!', {
                    body: `${data.userName} added you to their favorites.`,
                    tag: 'favorite',
                });
                break;

            case 'custom_reminder':
                this.showNotification(data.title, {
                    body: data.message,
                    tag: 'reminder',
                });
                break;

            default:
                console.log('Unknown notification type:', type);
        }
    }
}