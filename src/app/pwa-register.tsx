'use client';

import { useEffect } from 'react';

const PwaRegister = () => {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
        const isProd = process.env.NODE_ENV === 'production';
        if (isProd) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // noop
            });
        } else {
            // Avoid stale caches during HMR in dev
            navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
        }
    }, []);
    return null;
};

export default PwaRegister;
