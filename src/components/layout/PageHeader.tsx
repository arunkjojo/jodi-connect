import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector';

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    showMenu?: boolean;
    showLanguage?: boolean;
    gradient?: boolean;
    onBack?: () => void;
    onMenu?: () => void;
    rightContent?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    showBack = false,
    showMenu = false,
    showLanguage = false,
    gradient = false,
    onBack,
    onMenu,
    rightContent,
    className = ''
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const baseClasses = `px-4 py-3 ${gradient ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-white' : 'bg-white text-gray-900'} ${className}`;

    return (
        <header className={baseClasses}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full hover:bg-black/10 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="flex-1">
                        {title && (
                            <h1 className="text-lg font-semibold">{title}</h1>
                        )}
                        {subtitle && (
                            <p className="text-sm opacity-90">{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {showLanguage && (
                        <LanguageSelector variant="header" />
                    )}

                    {rightContent}

                    {showMenu && (
                        <button
                            onClick={onMenu}
                            className="p-2 rounded-full hover:bg-black/10 transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;