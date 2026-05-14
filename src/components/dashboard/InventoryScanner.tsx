'use client';

import { Package, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Articolo {
    id: string;
    codice: string;
    nome: string;
    giacenza: number;
    livelloScortaMin: number;
    unitaMisura: string;
}

interface InventoryScannerProps {
    articoli: Articolo[];
}

export default function InventoryScanner({ articoli }: InventoryScannerProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Package size={18} className="text-orange-500" /> Logistica & Materiali
                </h3>
                {articoli.length > 0 && (
                    <div className="bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                        <AlertCircle size={14} /> {articoli.length} Alert
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-4">
                {articoli.length === 0 ? (
                    <div className="bg-emerald-50 rounded-3xl p-8 text-center border border-emerald-100 shadow-inner">
                        <p className="text-emerald-800 font-black text-sm uppercase tracking-tight">Tutte le scorte sono in linea.</p>
                        <p className="text-emerald-600 text-[10px] font-black uppercase mt-1 opacity-60">Magazzino Ottimizzato</p>
                    </div>
                ) : (
                    articoli.map((art) => {
                        const safetyPercent = Math.min((art.giacenza / (art.livelloScortaMin || 1)) * 100, 100);
                        
                        return (
                            <div key={art.id} className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{art.codice}</p>
                                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{art.nome}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900 tracking-tighter">{art.giacenza} {art.unitaMisura}</p>
                                        <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Min: {art.livelloScortaMin}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-slate-100">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${safetyPercent < 50 ? 'bg-orange-600' : 'bg-blue-600'}`}
                                        style={{ width: `${safetyPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <Link href="/magazzino" className="group bg-slate-900 text-white w-full py-4 rounded-3xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all">
                    <ShoppingCart size={16} /> Gestione Ordini <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
