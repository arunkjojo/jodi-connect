import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    shadow = 'sm',
    hover = false,
    gradient = false
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8'
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };

    const baseClasses = `
    bg-white rounded-xl border border-gray-100
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
    ${className}
  `.trim();

    if (hover) {
        return (
            <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className={`${baseClasses} hover:shadow-lg transition-shadow cursor-pointer`}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={baseClasses}>
            {children}
        </div>
    );
};

export default Card;