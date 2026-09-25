'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, Lock, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const [loginType, setLoginType] = useState<'STAFF' | 'CLIENT'>('STAFF');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
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
        } catch (error) {
            setErrorMsg('Errore di connessione al server.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left panel — brand strip */}
            <div className="hidden lg:flex w-[420px] flex-shrink-0 bg-[#003F61] flex-col justify-between p-12 relative overflow-hidden">
                {/* Geometric decor */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FEDE59]/10 translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-24 -left-8 w-40 h-40 border border-white/10" />
                <div className="absolute top-32 -left-4 w-40 h-40 border border-white/5" />

                {/* Logo */}
                <Logo variant="light" href="" />

                {/* Tagline */}
                <div>
                    <p className="text-[#FEDE59] text-xs font-bold uppercase tracking-widest mb-3">
                        Gestionale Edile Professionale
                    </p>
                    <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">
                        Cantieri, finanze e<br />squadre — tutto<br />sotto controllo.
                    </h2>
                </div>

                {/* Footer strip */}
                <div className="flex items-center gap-3">
                    <Building2 size={14} className="text-white/30" />
                    <span className="text-white/30 text-[11px] font-medium tracking-wider uppercase">
                        by RifacciamoCasa © 2024
                    </span>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="flex justify-start mb-10 lg:hidden">
                        <Logo variant="dark" href="" />
                    </div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Accesso al sistema
                    </p>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight mb-8">
                        Benvenuto in RifacciamoCasa
                    </h1>

                    {/* Tab toggle */}
                    <div className="flex border border-slate-200 bg-white mb-8">
                        <button
                            onClick={() => { setLoginType('STAFF'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                                loginType === 'STAFF'
                                    ? 'bg-[#003F61] text-white'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <ShieldCheck size={14} />
                            Staff
                        </button>
                        <button
                            onClick={() => { setLoginType('CLIENT'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-l border-slate-200 ${
                                loginType === 'CLIENT'
                                    ? 'bg-[#003F61] text-white'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Users size={14} />
                            Area Clienti
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {errorMsg && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200">
                                <AlertCircle size={14} />
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="page-label mb-2">
                                {loginType === 'STAFF' ? 'Email Aziendale' : 'P.IVA / Codice Fiscale'}
                            </label>
                            <input
                                type={loginType === 'STAFF' ? 'email' : 'text'}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={loginType === 'STAFF' ? 'admin@edilmanager.it' : 'IT123456789'}
                                className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003F61] focus:ring-1 focus:ring-[#003F61] transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="page-label mb-2 flex items-center justify-between">
                                <span>Password</span>
                                <a href="#" className="text-[10px] text-[#003F61] hover:underline normal-case tracking-normal font-medium">
                                    Dimenticata?
                                </a>
                            </label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003F61] focus:ring-1 focus:ring-[#003F61] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="action-btn-primary w-full justify-center mt-2 disabled:opacity-60"
                        >
                            {isLoading ? 'Accesso in corso...' : 'Entra nel sistema'}
                            {!isLoading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <p className="mt-8 text-[11px] text-slate-400 text-center">
                        Accesso riservato al personale autorizzato
                    </p>
                </div>
            </div>
        </div>
    );
}
