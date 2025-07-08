import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    helperText?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    helperText,
    fullWidth = true,
    className = '',
    ...props
}, ref) => {
    const inputClasses = `
    px-3 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors
    ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
    ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <Icon
                        size={20}
                        className={`absolute top-3 text-gray-400 ${iconPosition === 'left' ? 'left-3' : 'right-3'
                            }`}
                    />
                )}

                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-gray-500 text-sm mt-1">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;