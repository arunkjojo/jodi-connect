import React from 'react';
import { GRID_BREAKPOINTS } from '../../constants';

interface ResponsiveGridProps {
    children: React.ReactNode;
    className?: string;
    gap?: 'sm' | 'md' | 'lg';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
    children,
    className = '',
    gap = 'md'
}) => {
    const gapClasses = {
        sm: 'gap-3',
        md: 'gap-4 sm:gap-6',
        lg: 'gap-6 sm:gap-8'
    };

    const gridClasses = `
    grid 
    ${GRID_BREAKPOINTS.mobile} 
    ${GRID_BREAKPOINTS.tablet} 
    ${GRID_BREAKPOINTS.desktop}
    ${gapClasses[gap]}
    ${className}
  `.trim();

    return (
        <div className={gridClasses}>
            {children}
        </div>
    );
};

export default ResponsiveGrid;