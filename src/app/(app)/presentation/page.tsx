'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, Briefcase, Receipt, HardHat, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PresentationPage() {
    return (
        <div className="min-h-screen bg-slate-50 print:bg-white pb-20">
            {/* Header / Actions - Hidden in Print */}
            <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center print:hidden sticky top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Torna alla Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ottimizzato per stampa A4</p>
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                        <Printer size={18} /> Stampa Presentazione
                    </button>
                </div>
            </div>

            {/* Main Presentation Container */}
            <div className="max-w-[1000px] mx-auto bg-white my-10 print:my-0 shadow-2xl print:shadow-none p-16 md:p-24 min-h-[1414px]">
                
                {/* Title Section */}
                <header className="mb-24 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Briefcase size={32} />
                            </div>
                            <div className="h-10 w-[2px] bg-slate-100" />
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">EdilManager</h1>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1 italic">Enterprise 2.0</p>
                            </div>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight max-w-xl">
                            Analisi Tecnologica e Controllo dei Margini Aziendali
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data Documento</p>
                        <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </header>

                {/* Section 1: Command Center */}
                <section className="mb-32 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">01. Supervisione Direzionale</h3>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-2 mb-8 overflow-hidden shadow-inner">
                        <img src="/presentation/dashboard.png" alt="Dashboard" className="w-full rounded-[2rem] shadow-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Trasparenza Totale</p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                La piattaforma offre una visione olistica in tempo reale di tutti i KPI critici. Il monitoraggio del saldo netto e dei margini lordi permette una gestione finanziaria proattiva, riducendo drasticamente il rischio operativo.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Financial Pulse 7D
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Monitoraggio Liquidità
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Audit Operativo H24
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 2: Cantieri */}
                <section className="mb-32 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">02. Controllo Commesse</h3>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-2 mb-8 overflow-hidden shadow-inner">
                        <img src="/presentation/projects.png" alt="Cantieri" className="w-full rounded-[2rem] shadow-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Ottimizzazione Risorse</p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Ogni progetto è monitorato analiticamente, confrontando i costi effettivi con i budget stanziati. Questo garantisce che ogni commessa contribuisca positivamente al cash flow aziendale.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Tracciamento SAL Analitici
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Analisi Scostamento Budget
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Gestione Forza Lavoro
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 3: Finance */}
                <section className="mb-32 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-8">
                        <Receipt className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">03. Liquidità e Bilancio</h3>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-2 mb-8 overflow-hidden shadow-inner">
                        <img src="/presentation/fatture.png" alt="Finanza" className="w-full rounded-[2rem] shadow-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Automazione Contabile</p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                L'integrazione di motori AI per l'importazione automatica dei documenti contabili riduce gli errori di data-entry e fornisce dati certi per la valutazione del merito creditizio.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Workflow Fatturazione Attiva
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Controllo Costi Acquisto
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Ledger Digitale Certificato
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 4: Magazzino */}
                <section className="mb-32 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-8">
                        <Briefcase className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">04. Gestione Asset</h3>
                    </div>
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-2 mb-8 overflow-hidden shadow-inner">
                        <img src="/presentation/magazzino.png" alt="Magazzino" className="w-full rounded-[2rem] shadow-2xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Valore del Patrimonio</p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Il parco mezzi e le attrezzature sono asset fondamentali che necessitano di protezione. Il sistema gestisce manutenzioni e disponibilità per massimizzare il ROI sugli investimenti strumentali.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Manutenzione Predittiva
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Logistica Real-time
                                </li>
                                <li className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" /> Valorizzazione Scorte
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-48 pt-16 border-t border-slate-100 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Documentazione Riservata</p>
                        <p className="text-xs font-bold text-slate-900">EdilManager Enterprise Solution - P.IVA 0123456789</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagina di Analisi</p>
                        <p className="text-2xl font-black text-slate-900">Enterprise Ready</p>
                    </div>
                </footer>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    html, body {
                        overflow: visible !important;
                        height: auto !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                    img {
                        max-width: 100% !important;
                        page-break-inside: avoid;
                    }
                    section {
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
