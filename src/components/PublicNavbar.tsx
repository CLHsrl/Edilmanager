'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Logo />

                <nav className="hidden md:flex items-center gap-10 font-bold text-[11px] uppercase tracking-widest text-slate-500">
                    <Link href="/features" className="hover:text-slate-900 transition-colors">Funzionalità</Link>
                    <Link href="/platform" className="hover:text-slate-900 transition-colors">Piattaforma</Link>
                    <Link href="/pricing" className="hover:text-slate-900 transition-colors">Prezzi</Link>
                    <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
                    <Link href="/about" className="hover:text-slate-900 transition-colors">Azienda</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-xs font-bold text-slate-900 hover:text-blue-600 hidden sm:block">Accedi</Link>
                    <Link href="/#contatti" className="bg-slate-900 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm">
                        Richiedi Demo
                    </Link>
                    <button 
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 py-8 px-6 shadow-xl">
                    <nav className="flex flex-col gap-6 text-lg font-bold text-gray-900">
                        <Link href="/features" onClick={() => setIsMenuOpen(false)}>Funzionalità</Link>
                        <Link href="/platform" onClick={() => setIsMenuOpen(false)}>Piattaforma</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Prezzi</Link>
                        <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)}>Chi Siamo</Link>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-blue-600">Accedi</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
