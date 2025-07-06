import React from 'react';

interface MobileLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    showNavigation = true,
    className = ''
}) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className={`max-w-md mx-auto bg-white min-h-screen relative ${className}`}>
                {children}
                {showNavigation && <div className="pb-20" />}
            </div>
        </div>
    );
};

export default MobileLayout;