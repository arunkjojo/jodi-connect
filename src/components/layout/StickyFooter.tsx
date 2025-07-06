import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const StickyFooter: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();

    // Don't show on authenticated pages
    if (user) return null;

    // Don't show on login/signup pages
    const hideOnPages = ['/login', '/profile-creation'];
    if (hideOnPages.includes(location.pathname)) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto px-4 py-3">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Link
                        to="/login"
                        className="block w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-center py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all shadow-lg"
                    >
                        {t('auth.joinNow')}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default StickyFooter;