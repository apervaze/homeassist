import { useEffect } from 'react';

export const useLocalSync = (key: string, value: unknown) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, JSON.stringify(value)]);
};
