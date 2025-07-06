import { useState, useEffect } from 'react';

interface SystemInfo {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    timezone: string;
    ipAddress?: string;
    networkInfo?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
    };
}

export const useSystemInfo = () => {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSystemInfo = async () => {
            try {
                const info: SystemInfo = {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                };

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

                setSystemInfo(info);
            } catch (error) {
                console.error('Error getting system info:', error);
            } finally {
                setLoading(false);
            }
        };

        getSystemInfo();
    }, []);

    return { systemInfo, loading };
};