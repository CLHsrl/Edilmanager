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
        <div className="bg-white border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Package size={18} className="text-[#003F61]" />
                    <h3 className="text-base font-semibold text-[#003F61]">Logistica & Materiali</h3>
                </div>
                {articoli.length > 0 ? (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-medium flex items-center gap-1">
                        <AlertCircle size={13} /> {articoli.length} Sotto Scorta
                    </span>
                ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                        Regolare
                    </span>
                )}
            </div>

            <div className="flex-1 space-y-3">
                {articoli.length === 0 ? (
                    <div className="bg-slate-50 p-6 text-center border border-slate-200/80">
                        <p className="text-slate-700 font-medium text-sm">Tutte le scorte sono a livello ottimale.</p>
                        <p className="text-slate-400 text-xs mt-1">Nessun riordino urgente necessario.</p>
                    </div>
                ) : (
                    articoli.map((art) => {
                        const safetyPercent = Math.min((art.giacenza / (art.livelloScortaMin || 1)) * 100, 100);
                        
                        return (
                            <div key={art.id} className="bg-slate-50/60 p-3.5 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">{art.codice}</p>
                                        <p className="text-sm font-semibold text-slate-900">{art.nome}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">{art.giacenza} {art.unitaMisura}</p>
                                        <p className="text-xs text-amber-600 font-medium">Min: {art.livelloScortaMin}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
                                    <div 
                                        className={`h-full ${safetyPercent < 50 ? 'bg-amber-500' : 'bg-[#003F61]'}`}
                                        style={{ width: `${safetyPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/magazzino" className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#003F61] flex items-center justify-center gap-2 text-xs font-semibold transition-colors">
                    <ShoppingCart size={15} /> Gestione Ordini & Magazzino <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}
