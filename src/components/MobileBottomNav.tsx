'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HardHat, Receipt, Package, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-mock';

const BOTTOM_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PM', 'OPERAIO', 'WORKER', 'ACCOUNTANT', 'VIEWER'] },
    { href: '/projects',  label: 'Cantieri',  icon: HardHat,         roles: ['ADMIN', 'PM', 'OPERAIO', 'WORKER'] },
    { href: '/fatture',   label: 'Fatture',   icon: Receipt,         roles: ['ADMIN', 'ACCOUNTANT'] },
    { href: '/magazzino', label: 'Logistica', icon: Package,         roles: ['ADMIN', 'PM'] },
    { href: '/settings',  label: 'Settings',  icon: Settings,        roles: ['ADMIN', 'PM'] },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { role } = useAuth();

    const visibleLinks = BOTTOM_LINKS.filter(l => l.roles.includes(role));

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex md:hidden safe-bottom">
            {visibleLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[10px] font-bold uppercase tracking-wide transition-colors ${
                            isActive
                                ? 'text-[#003F61]'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Icon
                            size={20}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            className={isActive ? 'text-[#003F61]' : ''}
                        />
                        <span>{link.label}</span>
                        {isActive && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#003F61]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
