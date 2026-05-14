'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Wallet, ArrowRight } from 'lucide-react';

export default function ROICalculator() {
    const [workers, setWorkers] = useState(10);
    const [admins, setAdmins] = useState(2);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const HOURLY_COST = 35; // Costo medio orario aziendale
    const WORKER_SAVING_H = 20; // Ore risparmiate al mese per operaio (1h/giorno)
    const ADMIN_SAVING_H = 16; // Ore risparmiate al mese per admin (4h/settimana)

    const totalHours = (workers * WORKER_SAVING_H) + (admins * ADMIN_SAVING_H);
    const totalMoney = totalHours * HOURLY_COST;

    if (!mounted) return <div className="h-[400px] bg-slate-50 animate-pulse rounded-3xl"></div>;

    return (
        <div className="bg-slate-950/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col lg:flex-row reveal">
            {/* Input Side */}
            <div className="p-10 md:p-16 lg:w-1/2 bg-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-10 border border-slate-200 shadow-sm">Configuratore Risparmio</div>
                <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tighter leading-tight">Dimensiona la tua <br /><span className="text-blue-600">efficienza.</span></h3>
                
                <div className="space-y-12">
                    <div className="group">
                        <div className="flex justify-between mb-6">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Forza Lavoro (Operai)</label>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{workers}</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                value={workers} 
                                onChange={(e) => setWorkers(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="flex justify-between mb-6">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">Management (Ufficio)</label>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{admins}</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="range" 
                                min="1" 
                                max="20" 
                                value={admins} 
                                onChange={(e) => setAdmins(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                            <TrendingUp size={18} />
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                            *Algoritmo di calcolo basato su medie di settore: 1 ora/giorno recuperata per operaio e 4 ore/settimana per amministratore grazie all'automazione dei flussi documentali.
                        </p>
                    </div>
                </div>
            </div>

            {/* Results Side */}
            <div className="p-10 md:p-16 lg:w-1/2 flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
                
                <div className="relative z-10 space-y-12">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 opacity-80">Risparmio Mensile Stimato</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black tracking-tighter text-white">€{totalMoney.toLocaleString('it-IT')}</span>
                            <span className="text-blue-400 font-black text-sm uppercase">/ mese</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Tempo Recuperato</div>
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-blue-400" />
                                <span className="text-2xl font-black">{totalHours} <span className="text-xs text-slate-500 uppercase">Ore</span></span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">ROI Annuale</div>
                            <div className="flex items-center gap-3">
                                <Wallet size={20} className="text-emerald-400" />
                                <span className="text-2xl font-black">€{(totalMoney * 12).toLocaleString('it-IT')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 group">
                            Ottieni il Report Completo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Nessun impegno richiesto</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
