import HorizontalScrollMenu from './HorizontalScrollMenu';
import { NavLink } from 'react-router-dom';

const getNavClass = (isActive: boolean) =>
    isActive
        ? 'bg-cyan-500 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap'
        : 'text-gray-600 px-3 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap';

interface NavigationBarProps {
    t: (key: string) => string;
}

export default function NavigationBar({ t }: NavigationBarProps) {
    return (
        <HorizontalScrollMenu>
            <NavLink to="/login" className={({ isActive }) => getNavClass(isActive)}>
                {t('common.login')}
            </NavLink>
            <NavLink to="/testimonials" className={({ isActive }) => getNavClass(isActive)}>
                {t('common.testimonials')}
            </NavLink>
            <NavLink to="/how-it-works" className={({ isActive }) => getNavClass(isActive)}>
                {t('common.howItWork')}
            </NavLink>
        </HorizontalScrollMenu>
    );
}
