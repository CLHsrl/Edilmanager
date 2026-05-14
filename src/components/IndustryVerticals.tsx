'use client';

import { Home, HardHat, Hammer, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const VERTICALS = [
    {
        icon: <Home size={32} />,
        title: "Edilizia Residenziale",
        desc: "Gestione impeccabile di varianti in corso d'opera, interazione con i clienti finali e controllo analitico dei margini su singola unità abitativa.",
        features: ["Gestione Varianti", "CRM Clienti Privati", "SAL Automatici"]
    },
    {
        icon: <HardHat size={32} />,
        title: "Grandi Infrastrutture",
        desc: "Coordinamento complesso di subappalti, logistica pesante e flussi documentali massivi. Sicurezza e conformità normativa sotto controllo totale.",
        features: ["Gestione Subappalti", "Logistica Mezzi", "Audit Sicurezza"]
    },
    {
        icon: <Hammer size={32} />,
        title: "Ristrutturazioni e Bonus",
        desc: "Ottimizzato per la gestione dei bonus fiscali. Archiviazione documentale a prova di controllo e monitoraggio scadenze finanziarie critiche.",
        features: ["Archivio Documentale", "Scadenziario Fiscale", "Pianificazione Acquisti"]
    }
];

export default function IndustryVerticals() {
    return (
        <section className="relative py-24 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
            {/* TECHNICAL BLUE GRID OVERLAY */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 reveal">
                    <div className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-8 shadow-lg shadow-blue-200">Verticali di Settore</div>
                    <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.95]">
                        <span className="text-slate-900">Progettato per</span> <br className="sm:hidden"/><span className="text-blue-600">ogni sfida.</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">Non importa la dimensione o la tipologia del tuo cantiere. EdilManager ha un modulo specifico per le tue esigenze operative.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {VERTICALS.map((v, i) => (
                        <div key={i} className="px-10 py-20 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 reveal">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    {v.icon}
                                </div>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">
                                    VRT_0{i + 1} // READY
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{v.title}</h3>
                            <p className="text-slate-500 text-[15px] leading-relaxed mb-10 font-medium">{v.desc}</p>
                            <ul className="space-y-4 mb-12">
                                {v.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="#contatti" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-all">
                                Analisi Modulo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
