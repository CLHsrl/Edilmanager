'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import Logo from '@/components/Logo';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-white flex flex-col font-sans relative">
            <ScrollReveal />
            {/* CORPORATE NAVBAR */}
            <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Logo />

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-10 font-bold text-[11px] uppercase tracking-widest text-slate-500">
                        <Link href="/features" className="hover:text-slate-900 transition-colors">Funzionalità</Link>
                        <Link href="/platform" className="hover:text-slate-900 transition-colors">Piattaforma</Link>
                        <Link href="/pricing" className="hover:text-slate-900 transition-colors">Prezzi</Link>
                        <Link href="/blog" className="hover:text-slate-900 transition-colors">Blog</Link>
                        <Link href="/about" className="hover:text-slate-900 transition-colors">Azienda</Link>
                    </nav>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-xs font-bold text-slate-900 hover:text-blue-600 hidden sm:block">Accedi</Link>
                        <Link href="/#contatti" className="bg-slate-900 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm btn-solid">
                            Richiedi Demo
                        </Link>
                        {/* Mobile Toggle */}
                        <button 
                            className="md:hidden p-2 text-slate-600 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 py-8 px-6 shadow-xl animate-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-6 text-lg font-bold text-gray-900">
                            <Link href="/features" onClick={() => setIsMenuOpen(false)}>Funzionalità</Link>
                            <Link href="/platform" onClick={() => setIsMenuOpen(false)}>Piattaforma</Link>
                            <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Prezzi</Link>
                            <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                            <Link href="/#faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)}>Chi Siamo</Link>
                            <hr className="border-gray-100" />
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-blue-600">Accedi Clienti</Link>
                        </nav>
                    </div>
                )}


            {/* MAIN CONTENT */}
            <main className="flex-1">
                {children}
            </main>


            {/* PREMIUM FOOTER */}
            <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
                {/* NEWSLETTER BANNER */}
                <div className="border-b border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Industry Insights</p>
                            <h3 className="text-xl font-black text-white">Ricevi le guide settimanali per far crescere la tua impresa.</h3>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <input 
                                type="email" 
                                placeholder="tua@email.it" 
                                className="flex-1 md:w-64 bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 transition-colors placeholder-gray-600 font-medium"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap">
                                Iscriviti
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* MAIN FOOTER */}
                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12 mb-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-6">
                            <Logo variant="light" />
                        </div>
                        <p className="text-sm max-w-sm mb-8 leading-relaxed">
                            Il sistema operativo definitivo per le imprese edili moderne. Innovazione, tecnologia e controllo totale in un unico posto.
                        </p>
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl w-fit">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Server Online — 99.99% uptime</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Prodotto</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/features" className="hover:text-white transition-colors">Funzionalità</Link></li>
                            <li><Link href="/platform" className="hover:text-white transition-colors">Piattaforma</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Prezzi</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Accedi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Risorse</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Guide</Link></li>
                            <li><Link href="/#quiz" className="hover:text-white transition-colors">Maturity Quiz</Link></li>
                            <li><Link href="/#contatti" className="hover:text-white transition-colors">Richiedi Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Azienda</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">Chi Siamo</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Termini e Condizioni</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 border-t border-gray-900 py-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                    <p>© {new Date().getFullYear()} EdilManager Srl — P.IVA IT12345678900. Tutti i diritti riservati.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">🇮🇹</span>
                        <span className="font-bold text-gray-600 uppercase tracking-widest text-[9px]">Made in Italy · GDPR Compliant</span>
                    </div>
                </div>
            </footer>
            {/* WHATSAPP FLOATING BUTTON */}
            <a 
                href="https://wa.me/393331234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[60]"
            >
                <div className="relative w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </div>
            </a>
        </div>
    );
}
