import { useEffect, useState } from 'react';

export const useResponsiveCharts = () => {
    const [width, setWidth] = useState<number>(0);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onResize = () => setWidth(window.innerWidth);
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    const compact = width < 640; // tailwind sm breakpoint
    return { compact };
};
