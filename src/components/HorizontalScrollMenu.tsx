import React, { useRef, useState, MouseEvent } from 'react';

interface HorizontalScrollMenuProps {
    children: React.ReactNode;
}

const HorizontalScrollMenu: React.FC<HorizontalScrollMenuProps> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
        scrollRef.current.classList.add('cursor-grabbing');
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        scrollRef.current?.classList.remove('cursor-grabbing');
    };

    const onMouseUp = () => {
        setIsDragging(false);
        scrollRef.current?.classList.remove('cursor-grabbing');
    };

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;

        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // scroll speed
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <div className="bg-white px-3 py-2 sm:px-4 shadow-sm">
            <div
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide cursor-grab select-none"
            >
                {children}
            </div>
        </div>
    );
};

export default HorizontalScrollMenu;
