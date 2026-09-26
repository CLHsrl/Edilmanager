'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ShieldCheck, 
    Users, 
    Lock, 
    ArrowRight, 
    AlertCircle, 
    Building2, 
    Eye, 
    EyeOff, 
    Shield, 
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
        <div className="min-h-screen bg-[#003F61] lg:bg-slate-50 flex flex-col lg:flex-row relative overflow-hidden">
            {/* ─── DESKTOP LEFT BRAND PANEL (Original Layout) ─── */}
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

            {/* ─── MOBILE BACKGROUND DECOR (Full Blue Theme) ─── */}
            <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FEDE59]/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/20 rounded-full blur-2xl" />
                <div className="absolute top-12 left-6 w-32 h-32 border border-white/10" />
                <div className="absolute bottom-20 right-6 w-48 h-48 border border-white/5" />
            </div>

            {/* ─── FORM CONTAINER (Mobile: Centered on Blue / Desktop: Right Side on Slate) ─── */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-16 relative z-10 my-auto min-h-screen lg:min-h-0">
                
                {/* Mobile Top Brand Header (Clean, No menu, matching Desktop Hero) */}
                <div className="lg:hidden flex flex-col items-center text-center mb-6 pt-4">
                    <div className="mb-4">
                        <Logo variant="light" href="" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#FEDE59]/15 border border-[#FEDE59]/30 px-3 py-1 mb-2">
                        <span className="w-1.5 h-1.5 bg-[#FEDE59]" />
                        <span className="text-[#FEDE59] text-[10px] font-black uppercase tracking-widest">
                            Gestionale Edile Professionale
                        </span>
                    </div>
                    <p className="text-white/80 text-xs font-medium">
                        Cantieri, finanze e squadre sotto controllo
                    </p>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 shadow-2xl p-6 sm:p-10">

                    {/* Section Header */}
                    <div className="mb-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Accesso al sistema
                        </p>
                        <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
                            Benvenuto in RifacciamoCasa
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Inserisci le tue credenziali per accedere allo spazio di lavoro.
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
                    </div>
                </div>

                {/* Mobile Bottom Footer */}
                <div className="lg:hidden mt-6 pb-4 flex flex-col items-center gap-1.5 text-center text-white/50 text-[11px]">
                    <div className="flex items-center gap-1.5">
                        <Building2 size={13} className="text-[#FEDE59]" />
                        <span className="font-semibold uppercase tracking-wider">
                            by RifacciamoCasa © 2024
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40 text-[10px]">
                        <Shield size={11} className="text-emerald-400" />
                        <span>Crittografia SSL 256-bit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
