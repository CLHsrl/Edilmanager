'use client';

import { useState } from 'react';

const CATEGORIES = [
    { id: "ALL", label: "Tutte le funzionalità" },
    { id: "CTRL", label: "Direzione e controllo" },
    { id: "COMM", label: "Commerciale e amministrazione" },
    { id: "CANT", label: "Cantieri e operatività" },
    { id: "RIS", label: "Risorse e sicurezza" },
    { id: "CLI", label: "Clienti e collaborazione" }
];

export default function FunzionalitaClient({ features }: { features: any[] }) {
    const [activeCategory, setActiveCategory] = useState("ALL");

    const filteredFeatures = activeCategory === "ALL" 
        ? features 
        : features.filter(f => f.categoryId === activeCategory);

    return (
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* IN-PAGE NAVIGATION (FILTERS) */}
            <div className="mb-16 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex items-center gap-2 sm:gap-4 justify-start lg:justify-center min-w-max">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                                activeCategory === cat.id 
                                ? 'bg-edil-blue text-white shadow-md' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-edil-blue hover:text-edil-blue'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFeatures.map((feature, i) => (
                    <div 
                        key={feature.id} 
                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border border-slate-200 rounded-[16px] hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_50px_rgba(21,93,252,0.12)] transition-all duration-300 group block text-left overflow-hidden flex flex-col`}
                    >
                        <div className="p-8 flex-grow">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-edil-light text-edil-blue border border-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-edil-blue group-hover:text-white transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    {feature.id}
                                </div>
                            </div>
                            
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-edil-blue mb-3">
                                {feature.category}
                            </div>
                            
                            <h3 className="text-2xl font-black text-navy-deep mb-2 tracking-tight">
                                {feature.title}
                            </h3>
                            
                            {feature.subtitle && (
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    {feature.subtitle}
                                </p>
                            )}
                            
                            <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
                                {feature.desc}
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {feature.subfeatures.map((sub: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm font-bold text-navy-deep">
                                        <div className="w-1.5 h-1.5 rounded-full bg-edil-blue shrink-0 mt-2"></div>
                                        <span className="leading-snug">{sub}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}
