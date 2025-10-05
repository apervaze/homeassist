'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Calculator, Home, SlidersHorizontal } from 'lucide-react';

const items = [
    { href: '/', label: 'Scenarios', icon: Home },
    { href: '/amortization', label: 'Amortization', icon: Calculator },
    { href: '/settings', label: 'Settings', icon: SlidersHorizontal }
];

const BottomNav = () => {
    const pathname = usePathname();
    return (
        <nav className='bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur sm:hidden'>
            <ul className='mx-auto grid max-w-screen-sm grid-cols-3 gap-1 px-2 py-2'>
                {items.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <li key={href} className='text-center'>
                            <Link
                                href={href}
                                className={`mx-auto inline-flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs transition-colors ${
                                    active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}>
                                <Icon className='h-5 w-5' />
                                <span>{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BottomNav;
