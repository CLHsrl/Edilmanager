'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ShieldCheck, 
    Users, 
    Lock, 
    ArrowRight, 
    AlertCircle, 
    Building2, 
    Menu, 
    X, 
    Eye, 
    EyeOff, 
    Shield, 
    HelpCircle,
    ExternalLink,
    Mail
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const [loginType, setLoginType] = useState<'STAFF' | 'CLIENT'>('STAFF');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const result = await signIn('credentials', {
                email: identifier,
                password: password,
                redirect: false,
            });

            if (result?.error) {
                setErrorMsg('Credenziali non valide. Riprova.');
                setIsLoading(false);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setErrorMsg('Errore di connessione al server.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
            {/* ─── MOBILE TOP HEADER & MENU BAR ─── */}
            <header className="lg:hidden bg-[#003F61] text-white border-b border-white/10 sticky top-0 z-50">
                <div className="px-5 py-3.5 flex items-center justify-between">
                    <Logo variant="light" href="" />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 -mr-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                        aria-label="Apri menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="bg-[#002b42] border-t border-white/10 px-5 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#FEDE59]">
                            Navigazione & Risorse
                        </div>
                        <nav className="flex flex-col gap-3 text-sm font-semibold text-white/90">
                            <Link 
                                href="/features" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                            >
                                <span>Funzionalità Gestionale</span>
                                <ArrowRight size={14} className="text-white/40" />
                            </Link>
                            <Link 
                                href="/pricing" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                            >
                                <span>Piani & Prezzi</span>
                                <ArrowRight size={14} className="text-white/40" />
                            </Link>
                            <Link 
                                href="/platform" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between py-2 border-b border-white/10 hover:text-[#FEDE59]"
                            >
                                <span>Piattaforma Cantieri</span>
                                <ArrowRight size={14} className="text-white/40" />
                            </Link>
                            <a 
                                href="https://wa.me/393331234567" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between py-2 border-b border-white/10 text-[#FEDE59] hover:underline"
                            >
                                <span className="flex items-center gap-2">
                                    <HelpCircle size={15} />
                                    Assistenza Rapida WhatsApp
                                </span>
                                <ExternalLink size={14} />
                            </a>
                        </nav>
                        <div className="pt-2 text-[11px] text-white/40 flex items-center gap-2">
                            <Shield size={12} className="text-[#FEDE59]" />
                            <span>Server & Database protetti SSL 256-bit</span>
                        </div>
                    </div>
                )}
            </header>

            {/* ─── MOBILE BRAND BANNER (HERO) ─── */}
            <div className="lg:hidden bg-[#003F61] text-white px-6 pt-6 pb-8 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#FEDE59]/10 pointer-events-none" />
                <div className="absolute top-4 -right-4 w-28 h-28 border border-white/10 pointer-events-none" />
                
                <div className="relative z-10">
                    <span className="inline-block bg-[#FEDE59]/20 text-[#FEDE59] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 mb-2 border border-[#FEDE59]/30">
                        Gestionale Edile Professionale
                    </span>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight text-white mb-1">
                        Cantieri, finanze e squadre
                    </h2>
                    <p className="text-xs text-white/70 font-medium">
                        Tutto sotto controllo in un'unica piattaforma unificata.
                    </p>
                </div>
            </div>

            {/* ─── DESKTOP LEFT BRAND PANEL ─── */}
            <div className="hidden lg:flex w-[440px] xl:w-[480px] flex-shrink-0 bg-[#003F61] flex-col justify-between p-12 relative overflow-hidden shadow-2xl">
                {/* Geometric decor */}
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FEDE59]/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />
                <div className="absolute top-24 -left-8 w-48 h-48 border border-white/10 pointer-events-none" />
                <div className="absolute top-36 -left-4 w-48 h-48 border border-white/5 pointer-events-none" />

                {/* Logo */}
                <div>
                    <Logo variant="light" href="" />
                </div>

                {/* Tagline & Presentation */}
                <div className="relative z-10 my-auto py-12">
                    <div className="inline-flex items-center gap-2 bg-[#FEDE59]/15 border border-[#FEDE59]/30 px-3 py-1 mb-4">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        <span className="text-[#FEDE59] text-[11px] font-black uppercase tracking-widest">
                            Gestionale Edile Professionale
                        </span>
                    </div>
                    <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight tracking-tight mb-4">
                        Cantieri, finanze e squadre — tutto sotto controllo.
                    </h2>
                    <p className="text-white/70 text-sm font-normal leading-relaxed max-w-sm">
                        La piattaforma cloud all-in-one per il coordinamento dei lavori, contabilità cantieri, personale e gestione clienti.
                    </p>
                </div>

                {/* Footer strip */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-white/40 text-[11px]">
                    <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-[#FEDE59]/80" />
                        <span className="font-semibold tracking-wider uppercase">
                            by RifacciamoCasa © 2024
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50">
                        <Shield size={12} className="text-emerald-400" />
                        <span>SSL 256-bit</span>
                    </div>
                </div>
            </div>

            {/* ─── RIGHT PANEL: LOGIN FORM ─── */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-16 -mt-4 lg:mt-0 relative z-20">
                <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl p-6 sm:p-10">

                    {/* Section Header */}
                    <div className="mb-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Accesso al sistema
                        </p>
                        <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
                            Benvenuto in Edilmanager24
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Inserisci le tue credenziali per accedere al tuo spazio di lavoro.
                        </p>
                    </div>

                    {/* Tab toggle (Staff vs Client) */}
                    <div className="flex border border-slate-200 bg-slate-50 mb-6">
                        <button
                            type="button"
                            onClick={() => { setLoginType('STAFF'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                                loginType === 'STAFF'
                                    ? 'bg-[#003F61] text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <ShieldCheck size={16} className={loginType === 'STAFF' ? 'text-[#FEDE59]' : 'text-slate-400'} />
                            Staff & Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginType('CLIENT'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all border-l border-slate-200 ${
                                loginType === 'CLIENT'
                                    ? 'bg-[#003F61] text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Users size={16} className={loginType === 'CLIENT' ? 'text-[#FEDE59]' : 'text-slate-400'} />
                            Area Clienti
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2.5 border-l-4 border-red-500">
                                <AlertCircle size={16} className="text-red-500 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Identifier Field */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                                {loginType === 'STAFF' ? 'Email Aziendale' : 'P.IVA o Codice Fiscale'}
                            </label>
                            <div className="relative">
                                {loginType === 'STAFF' ? (
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                ) : (
                                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                )}
                                <input
                                    type={loginType === 'STAFF' ? 'email' : 'text'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={loginType === 'STAFF' ? 'admin@edilmanager.it' : 'IT01234567890'}
                                    className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#003F61] focus:ring-1 focus:ring-[#003F61] transition-all"
                                    required
                                    autoComplete={loginType === 'STAFF' ? 'email' : 'username'}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                                    Password
                                </label>
                                <a 
                                    href="https://wa.me/393331234567?text=Richiesta%20reset%20password%20Edilmanager24" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-[#003F61] hover:underline font-semibold"
                                >
                                    Password smarrita?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-300 pl-10 pr-11 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#003F61] focus:ring-1 focus:ring-[#003F61] transition-all"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                                    aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#003F61] hover:bg-[#002b42] active:bg-[#001f30] text-white py-3 px-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60 mt-3"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                                    Accesso in corso...
                                </span>
                            ) : (
                                <>
                                    <span>Entra nel sistema</span>
                                    <ArrowRight size={16} className="text-[#FEDE59]" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security & Access Info */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <Shield size={13} className="text-emerald-600 shrink-0" />
                            <span>Accesso riservato e monitorato</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                            EDILMANAGER24 • RifacciamoCasa • Tutti i diritti riservati
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
