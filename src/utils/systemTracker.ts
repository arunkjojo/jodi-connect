import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { SystemInfo } from '../types';

export class SystemTracker {
    /**
     * Collect comprehensive system information
     */
    static async collectSystemInfo(): Promise<SystemInfo> {
        const info: SystemInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
        };

        // Get device memory if available
        if ('deviceMemory' in navigator) {
            info.deviceMemory = (navigator as any).deviceMemory;
        }

        // Get hardware concurrency
        if ('hardwareConcurrency' in navigator) {
            info.hardwareConcurrency = navigator.hardwareConcurrency;
        }

        // Get network information if available
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            info.networkInfo = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
            };
        }

        // Get IP address from external service
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            info.ipAddress = ipData.ip;
        } catch (error) {
            console.warn('Could not fetch IP address:', error);
        }

        return info;
    }

    /**
     * Store system information in Firestore
     */
    static async storeSystemInfo(userId: string, systemInfo: SystemInfo): Promise<void> {
        try {
            const systemLogRef = doc(db, 'systemLogs', `${userId}_${Date.now()}`);

            await setDoc(systemLogRef, {
                userId,
                systemInfo,
                timestamp: new Date(),
                sessionId: this.generateSessionId(),
            });

            // Also update the user document with latest system info
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                lastSystemInfo: systemInfo,
                lastSystemInfoUpdate: new Date(),
            });

        } catch (error) {
            console.error('Error storing system info:', error);
        }
    }

    /**
     * Track user activity and system changes
     */
    static startActivityTracking(userId: string): () => void {
        const trackActivity = async () => {
            const systemInfo = await this.collectSystemInfo();
            await this.storeSystemInfo(userId, systemInfo);
        };

        // Track on visibility change
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                trackActivity();
            }
        };

        // Track on online/offline status change
        const handleOnlineStatusChange = () => {
            trackActivity();
        };

        // Track on page focus
        const handleFocus = () => {
            trackActivity();
        };

        // Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);
        window.addEventListener('focus', handleFocus);

        // Initial tracking
        trackActivity();

        // Return cleanup function
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
            window.removeEventListener('focus', handleFocus);
        };
    }

    /**
     * Generate a unique session ID
     */
    private static generateSessionId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get browser fingerprint for enhanced tracking
     */
    static async getBrowserFingerprint(): Promise<string> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Browser fingerprint', 2, 2);
        }

        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL(),
        ].join('|');

        // Simple hash function
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return hash.toString(36);
    }
}