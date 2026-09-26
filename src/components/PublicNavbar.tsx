'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[#003F61] text-white border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                
                {/* Left: Brand Logo */}
                <div className="flex items-center gap-4 shrink-0">
                    <Logo variant="light" href="/" />
                </div>

                {/* Center: Desktop Navigation Links (only on xl+ to completely prevent overlaps) */}
                <nav className="hidden xl:flex items-center gap-7 font-bold text-xs uppercase tracking-wider text-white/80 shrink-0">
                    <a href="#moduli" className="hover:text-[#FEDE59] transition-colors py-2 whitespace-nowrap">
                        Funzionalità
                    </a>
                    <a href="#dashboard-anteprima" className="hover:text-[#FEDE59] transition-colors py-2 whitespace-nowrap">
                        Dashboard Live
                    </a>
                    <a href="#confronto" className="hover:text-[#FEDE59] transition-colors py-2 whitespace-nowrap">
                        Confronto
                    </a>
                    <a href="#prezzi" className="hover:text-[#FEDE59] transition-colors py-2 whitespace-nowrap">
                        Prezzi
                    </a>
                    <a href="#contatti" className="hover:text-[#FEDE59] transition-colors py-2 whitespace-nowrap">
                        Contatti
                    </a>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link 
                        href="/login" 
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white border border-white/20 hover:border-white/40 hover:bg-white/10 px-3 sm:px-4 py-2 transition-all whitespace-nowrap"
                    >
                        <ShieldCheck size={14} className="text-[#FEDE59]" />
                        <span>Accedi</span>
                    </Link>
                    
                    <a 
                        href="#contatti" 
                        className="hidden sm:flex items-center gap-1.5 bg-[#FEDE59] hover:bg-[#e5c74f] text-[#003F61] px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-md whitespace-nowrap"
                    >
                        <span>Richiedi Demo</span>
                        <ArrowRight size={13} />
                    </a>

                    {/* Hamburger Button for mobile and tablets (< xl) */}
                    <button 
                        className="xl:hidden p-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile / Tablet Dropdown Drawer (Positioned absolute below header to prevent any overlapping) */}
            {isMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 right-0 w-full bg-[#00273D] border-b border-white/15 px-6 py-6 space-y-5 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#FEDE59]">
                        Navigazione Piattaforma
                    </div>
                    <nav className="flex flex-col gap-1 text-sm font-semibold text-white/90">
                        <a 
                            href="#moduli" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 border-b border-white/10 hover:text-[#FEDE59] transition-colors"
                        >
                            <span>Funzionalità & Moduli</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#dashboard-anteprima" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 border-b border-white/10 hover:text-[#FEDE59] transition-colors"
                        >
                            <span>Anteprima Dashboard</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#confronto" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 border-b border-white/10 hover:text-[#FEDE59] transition-colors"
                        >
                            <span>Confronto: Excel vs E24</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#prezzi" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 border-b border-white/10 hover:text-[#FEDE59] transition-colors"
                        >
                            <span>Piani & Prezzi</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#contatti" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 border-b border-white/10 hover:text-[#FEDE59] transition-colors"
                        >
                            <span>Richiedi Demo Guidata</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                    </nav>

                    <div className="pt-2 flex flex-col gap-2.5">
                        <Link 
                            href="/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full bg-[#FEDE59] text-[#003F61] py-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                        >
                            <ShieldCheck size={16} />
                            <span>Accedi al Gestionale</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
