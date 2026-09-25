'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import SidebarLinks from './SidebarLinks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav({ user }: { user?: { name: string; totalXp: number; rank: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close drawer on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Hamburger button — visible only on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                aria-label="Apri menu"
                type="button"
            >
                <Menu size={22} />
            </button>

            {/* Backdrop — rendered via portal so no layout interference */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[998]"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer — always in DOM, controlled by transform */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-[#003F61] z-[999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Drawer header */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
                    <Link href="/dashboard" className="flex flex-col" onClick={() => setIsOpen(false)}>
                        <span className="font-extrabold text-xl leading-tight uppercase tracking-tight">
                            <span className="text-white">EDIL</span>
                            <span className="text-[#FEDE59]">MANAGER</span>
                            <span className="text-white">24</span>
                        </span>
                        <span className="text-[10px] text-white/60 tracking-wider font-medium">
                            by RifacciamoCasa
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Chiudi menu"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar links */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <SidebarLinks user={user} />
                </div>
            </aside>
        </>
    );
}
