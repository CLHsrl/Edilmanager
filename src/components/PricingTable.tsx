'use client';

import { Check, CheckCircle2, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingTable() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Starter",
            monthlyPrice: 149,
            desc: "Ideale per piccole ditte e artigiani.",
            features: ["Fino a 5 operai", "Gestione Cantieri illimitata", "Rapportini Mobile", "Magazzino base", "Supporto email"],
            notIncluded: ["Integrazione Bancaria", "Fatturazione SDI", "Assistente WhatsApp"],
            cta: "Inizia Gratis",
            popular: false
        },
        {
            name: "Business",
            monthlyPrice: 299,
            desc: "La soluzione completa per le PMI.",
            features: ["Operai illimitati", "Fatturazione SDI inclusa", "Integrazione Bancaria", "Gestione Mezzi & Sicurezza", "Supporto Prioritario"],
            notIncluded: ["Multi-azienda"],
            cta: "Prova Business Gratis",
            popular: true
        },
        {
            name: "Enterprise",
            monthlyPrice: null,
            desc: "Per grandi realtà multi-società.",
            features: ["Tutto il piano Business", "Multi-azienda", "Integrazioni API custom", "Onboarding Concierge", "Account Manager dedicato"],
            notIncluded: [],
            cta: "Contattaci per un'offerta",
            popular: false
        }
    ];

    const getPrice = (monthlyPrice: number | null) => {
        if (!monthlyPrice) return null;
        return isAnnual ? Math.round(monthlyPrice * 0.83) : monthlyPrice;
    };

    return (
        <div className="relative">
            {/* BILLING TOGGLE */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 relative z-10">
                <button
                    onClick={() => setIsAnnual(false)}
                    className={`text-sm font-black uppercase tracking-widest transition-colors ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}
                >
                    Mensile
                </button>
                
                <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isAnnual ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isAnnual ? 'translate-x-9' : 'translate-x-1'}`}></div>
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`text-sm font-black uppercase tracking-widest transition-colors ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                        Annuale
                    </button>
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-100">
                        <Zap size={10} /> Risparmia 2 mesi
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
                {plans.map((plan, idx) => {
                    const price = getPrice(plan.monthlyPrice);
                    const isPopular = plan.popular;
                    return (
                        <div 
                            key={idx}
                            className={`relative p-10 rounded-[2.5rem] backdrop-blur-xl border transition-all duration-500 group overflow-hidden ${isPopular ? 'bg-blue-50/30 border-blue-200/50 shadow-2xl' : 'bg-white/70 border-white shadow-lg'}`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 flex items-center gap-1.5 z-20">
                                    <Zap size={10} /> Più Scelto
                                </div>
                            )}
                            
                            <div className="mb-10">
                                <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isPopular ? 'text-blue-600' : 'text-slate-400'}`}>{plan.name}</div>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{plan.desc}</p>
                                {price !== null ? (
                                    <div>
                                        <div className="flex items-baseline gap-1.5 mb-2">
                                            <span className="text-lg font-bold text-slate-500">€</span>
                                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{price}</span>
                                            <span className="text-slate-400 font-bold text-sm">/mese</span>
                                        </div>
                                        {isAnnual && (
                                            <div className="text-[11px] text-slate-400 font-bold">
                                                Fatturato annualmente · <span className="line-through text-slate-300">€{plan.monthlyPrice}/mese</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">Custom</span>
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-5 mb-12">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-700">
                                        <CheckCircle2 size={18} className="text-blue-600 shrink-0" /> {feat}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-300">
                                        <X size={18} className="text-slate-200 shrink-0" /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href="/#contatti"
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center transition-all ${isPopular ? 'bg-blue-600 text-white hover:bg-slate-900 shadow-xl shadow-blue-200' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg'}`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    );
                })}
            </div>

            <p className="text-center mt-12 text-sm text-slate-400 font-medium">
                Tutti i piani includono <strong className="text-slate-700">14 giorni di prova gratuita</strong>. Nessuna carta di credito richiesta.
            </p>
        </div>
    );
}
