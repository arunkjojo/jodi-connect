import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    type,
    message,
    onClose,
    autoClose = true,
    duration = 3000
}) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    };

    const colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200'
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
    };

    const Icon = icons[type];

    React.useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`flex items-center p-4 border rounded-lg shadow-lg ${colors[type]} max-w-sm mx-auto`}
        >
            <Icon className={`mr-3 flex-shrink-0 ${iconColors[type]}`} size={20} />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={onClose}
                className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;