'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardHat, Users, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decors */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:bg-blue-700 transition-colors">
                            <HardHat size={24} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                            EDIL <span className="text-blue-600">MANAGER</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Accedi al tuo account</h1>
                    <p className="text-slate-500 text-sm mt-2">Dati e cantieri sempre al sicuro, in cloud.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    
                    {/* Toggle Login Type */}
                    <div className="flex border-b border-slate-100 bg-slate-50">
                        <button 
                            onClick={() => { setLoginType('STAFF'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 pt-6 transition-colors ${loginType === 'STAFF' ? 'bg-white border-b-2 border-b-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ShieldCheck size={20} className={loginType === 'STAFF' ? "text-blue-600" : ""} />
                            <span className="text-xs font-black uppercase tracking-widest">Accesso Staff</span>
                        </button>
                        <button 
                            onClick={() => { setLoginType('CLIENT'); setErrorMsg(''); setIdentifier(''); setPassword(''); }}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 pt-6 transition-colors ${loginType === 'CLIENT' ? 'bg-white border-b-2 border-b-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Users size={20} className={loginType === 'CLIENT' ? "text-emerald-600" : ""} />
                            <span className="text-xs font-black uppercase tracking-widest">Area Clienti</span>
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="p-8">
                        
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                                <AlertCircle size={18} />
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                                    {loginType === 'STAFF' ? 'Email Aziendale' : 'P.IVA / Codice Fiscale'}
                                </label>
                                <input 
                                    type={loginType === 'STAFF' ? 'email' : 'text'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={loginType === 'STAFF' ? 'admin@edilmanager.it' : 'IT123456789'}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 flex justify-between">
                                    <span>Password</span>
                                    <Link href="#" className="text-[10px] text-blue-600 hover:underline">Dimenticata?</Link>
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full mt-8 text-white px-6 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 ${
                                loginType === 'STAFF' ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700' : 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700'
                            }`}
                        >
                            {isLoading ? 'Accesso in corso...' : 'Entra nel sistema'} {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                {/* Info Credenziali Test */}
                <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 text-center text-sm text-slate-600">
                    <p className="font-bold text-blue-800 mb-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                        <Lock size={14} /> Credenziali di Test
                    </p>
                    {loginType === 'STAFF' ? (
                        <div className="font-mono text-xs space-y-2 text-left bg-white p-4 rounded-xl border border-blue-50">
                            <div><span className="font-bold text-slate-800 w-24 inline-block">Role Admin:</span> <span>admin@edilmanager.it</span> / <span className="text-blue-600">admin</span></div>
                            <div><span className="font-bold text-slate-800 w-24 inline-block">Role PM:</span> <span>pm@edilmanager.it</span> / <span className="text-blue-600">pm</span></div>
                            <div><span className="font-bold text-slate-800 w-24 inline-block">Role Operaio:</span> <span>operaio@edilmanager.it</span> / <span className="text-blue-600">operaio</span></div>
                        </div>
                    ) : (
                        <div className="font-mono text-xs space-y-2 text-left bg-white p-4 rounded-xl border border-emerald-50">
                            <div><span className="font-bold text-slate-800 w-24 inline-block">Role Cliente:</span> <span>IT123456789</span> / <span className="text-emerald-600">cliente</span></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
