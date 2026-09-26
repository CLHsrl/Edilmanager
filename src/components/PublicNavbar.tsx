'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ShieldCheck, PhoneCall, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[#003F61] text-white border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Logo variant="light" href="/" />
                    <div className="hidden xl:inline-flex items-center gap-2 bg-[#FEDE59]/15 border border-[#FEDE59]/30 px-2.5 py-0.5">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        <span className="text-[#FEDE59] text-[9px] font-black uppercase tracking-widest">
                            Gestionale Edile Professionale
                        </span>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-wider text-white/80">
                    <a href="#moduli" className="hover:text-[#FEDE59] transition-colors py-2">
                        Moduli & Cantieri
                    </a>
                    <a href="#dashboard-anteprima" className="hover:text-[#FEDE59] transition-colors py-2">
                        Dashboard Live
                    </a>
                    <a href="#confronto" className="hover:text-[#FEDE59] transition-colors py-2">
                        Metodo Tradizionale vs E24
                    </a>
                    <a href="#prezzi" className="hover:text-[#FEDE59] transition-colors py-2">
                        Piani & Licenze
                    </a>
                    <a href="#contatti" className="hover:text-[#FEDE59] transition-colors py-2">
                        Contatti
                    </a>
                </nav>

                {/* Desktop Action Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <Link 
                        href="/login" 
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white border border-white/20 hover:border-white/40 hover:bg-white/10 px-4 py-2.5 transition-all"
                    >
                        <ShieldCheck size={15} className="text-[#FEDE59]" />
                        <span>Accedi</span>
                    </Link>
                    <a 
                        href="#contatti" 
                        className="flex items-center gap-2 bg-[#FEDE59] hover:bg-[#e5c74f] text-[#003F61] px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-md"
                    >
                        <span>Richiedi Demo</span>
                        <ArrowRight size={14} />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 sm:hidden">
                    <Link
                        href="/login"
                        className="text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white px-3 py-1.5 border border-white/20"
                    >
                        Accedi
                    </Link>
                    <button 
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden bg-[#002b42] border-t border-white/10 px-6 py-6 space-y-5 shadow-2xl animate-in slide-in-from-top duration-200">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#FEDE59]">
                        Navigazione Piattaforma
                    </div>
                    <nav className="flex flex-col gap-3 text-sm font-semibold text-white/90">
                        <a 
                            href="#moduli" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                        >
                            <span>Moduli & Cantieri</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#dashboard-anteprima" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                        >
                            <span>Anteprima Dashboard</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#confronto" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                        >
                            <span>Confronto vs Metodo Tradizionale</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#prezzi" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                        >
                            <span>Piani & Licenze</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                        <a 
                            href="#contatti" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                        >
                            <span>Richiedi Consulenza</span>
                            <ArrowRight size={14} className="text-white/40" />
                        </a>
                    </nav>

                    <div className="pt-2 flex flex-col gap-2.5">
                        <Link 
                            href="/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full bg-white text-[#003F61] py-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={16} />
                            <span>Entra nel Gestionale</span>
                        </Link>
                        <a 
                            href="https://wa.me/393331234567" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white py-3 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <PhoneCall size={15} />
                            <span>Parla con un Consulente Edile</span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
