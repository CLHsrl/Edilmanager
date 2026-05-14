'use client';

import Link from 'next/link';
import { ArrowRight, Check, Zap, ShieldCheck, Headphones } from 'lucide-react';
import PricingTable from '@/components/PricingTable';
import StrategicFAQ from '@/components/StrategicFAQ';
import MaturityQuiz from '@/components/MaturityQuiz';

export default function PricingPage() {
    return (
        <div className="bg-white font-sans">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="chip chip--accent mb-8 bg-blue-500/10 border-blue-500/20 text-blue-400">Piani & Investimento</div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                        Trasparenza Radicale.<br/>
                        <span className="text-blue-500">Nessun costo nascosto.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
                        Scegli il piano adatto alla dimensione della tua impresa. Tutti i piani includono aggiornamenti illimitati e supporto tecnico prioritario.
                    </p>
                </div>
            </section>

            {/* PRICING TABLE */}
            <section className="py-24 bg-white relative z-20 -mt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <PricingTable />
                </div>
            </section>

            {/* TRUST BANNERS */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Sicurezza Enterprise</h3>
                            <p className="text-slate-500 text-sm">I tuoi dati sono criptati e salvati su server europei conformi al GDPR.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600">
                                <Zap size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Attivazione Immediata</h3>
                            <p className="text-slate-500 text-sm">Configura la tua azienda in meno di 10 minuti con il nostro setup assistito.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600">
                                <Headphones size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">Supporto Dedicato</h3>
                            <p className="text-slate-500 text-sm">Un team di esperti a tua disposizione via chat, email e telefono.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MATURITY QUIZ */}
            <section id="quiz" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Non sai quale piano scegliere?</h2>
                        <p className="text-slate-600">Fai il quiz di maturità digitale e ricevi un consiglio personalizzato.</p>
                    </div>
                    <MaturityQuiz />
                </div>
            </section>

            {/* FAQ */}
            <StrategicFAQ mode="pricing" />

            {/* FINAL CTA */}
            <section className="py-32 bg-blue-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl font-black tracking-tighter mb-8">Pronto a trasformare la tua impresa?</h2>
                    <p className="text-blue-100 text-xl mb-12">Unisciti alle oltre 40 aziende che hanno già digitalizzato i loro processi con EdilManager.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/#contatti" className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                            Richiedi Demo Gratuita
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto bg-blue-700 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-800 transition-all">
                            Accedi al Portal
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
