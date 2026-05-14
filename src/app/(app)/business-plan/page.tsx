'use client';

import React from 'react';
import { 
    Target, BarChart3, Users, Globe, 
    Zap, ShieldCheck, PieChart, TrendingUp, 
    Printer, ArrowLeft, Layers, Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function BusinessPlanPage() {
    return (
        <div className="min-h-screen bg-slate-50 print:bg-white pb-20">
            {/* Header / Actions - Hidden in Print */}
            <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center print:hidden sticky top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Torna alla Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento Strategico Riservato</p>
                    <button 
                        onClick={() => window.print()}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        <Printer size={18} /> Stampa Business Plan
                    </button>
                </div>
            </div>

            {/* Business Plan Container */}
            <div className="max-w-[1000px] mx-auto bg-white my-10 print:my-0 shadow-2xl print:shadow-none min-h-[1414px]">
                
                {/* PAGE 1: COVER */}
                <div className="min-h-[297mm] p-24 flex flex-col justify-between border-b border-slate-50 break-after-page">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                            <Layers size={24} />
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em]">EdilManager Enterprise</span>
                    </div>
                    
                    <div className="max-w-2xl">
                        <p className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-8 italic">Strategic Vision 2026</p>
                        <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                            Business <br />
                            Plan <br />
                            <span className="text-slate-200">Evolution</span>
                        </h1>
                        <div className="h-2 w-32 bg-slate-900 mt-12 mb-12" />
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Digitalizzazione dei processi edilizi, monitoraggio neurale dei costi e scalabilità del modello di business construction-tech.
                        </p>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-100 pt-12">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preparato per</p>
                            <p className="text-lg font-black text-slate-900 italic">Financial Partners & Bank Institutions</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Versione</p>
                            <p className="text-lg font-black text-slate-900">v2.4.0 - Confidential</p>
                        </div>
                    </div>
                </div>

                {/* PAGE 2: EXECUTIVE SUMMARY & PROBLEM */}
                <div className="min-h-[297mm] p-24 flex flex-col break-after-page">
                    <header className="mb-20">
                        <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Section 01</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Executive Summary</h3>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                        <div className="space-y-6">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                EdilManager è la risposta tecnologica alla frammentazione informativa del settore edile. Attraverso l'unificazione dei dati di cantiere, finanza e logistica in un unico ecosistema digitale, riduciamo l'inefficienza operativa del 25% e aumentiamo la precisione del margine lordo.
                            </p>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Objective</p>
                                <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter">
                                    Convertire la complessità del cantiere in dati finanziari certi e scalabili.
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-2 overflow-hidden shadow-sm">
                             <img src="/presentation/dashboard.png" alt="Dashboard Preview" className="w-full rounded-2xl shadow-xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Market Gap</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Mancanza di sistemi integrati "all-in-one" per le PMI edili italiane.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Solution</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Piattaforma SaaS ad alta densità con monitoraggio dei margini in tempo reale.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-2 overflow-hidden shadow-sm">
                             <img src="/presentation/projects.png" alt="Projects Preview" className="w-full rounded-2xl shadow-xl" />
                        </div>
                    </div>

                    <header className="mb-12">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Market Analysis</h3>
                    </header>
                    <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="grid grid-cols-3 gap-12 relative z-10">
                            <div className="text-center">
                                <p className="text-4xl font-black tracking-tighter mb-2">€ 150B+</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mercato Edile ITA</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-black tracking-tighter mb-2">18.5%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Gap Index</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-black tracking-tighter mb-2">+24%</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CAGR Con-Tech</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAGE 3: REVENUE MODEL & FINANCIALS */}
                <div className="min-h-[297mm] p-24 flex flex-col break-after-page">
                    <header className="mb-20">
                        <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Section 02</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Revenue Model</h3>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        <div className="p-8 border border-slate-100 rounded-[2rem] hover:shadow-2xl transition-all">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Subscription</h5>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter mb-4">SaaS Tier</p>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8">Modello a canone mensile basato sul numero di cantieri attivi.</p>
                            <div className="text-2xl font-black text-emerald-600">€ 299/mo</div>
                        </div>
                        <div className="p-8 border border-slate-100 rounded-[2rem] hover:shadow-2xl transition-all">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Enterprise</h5>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Corporate</p>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8">Customizzazione e setup infrastruttura on-premise o cloud dedicata.</p>
                            <div className="text-2xl font-black text-emerald-600">Custom</div>
                        </div>
                        <div className="p-8 border border-slate-100 rounded-[2rem] hover:shadow-2xl transition-all">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Add-ons</h5>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter mb-4">AI Credits</p>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8">Token per generazione automatica documenti sicurezza e analisi AI.</p>
                            <div className="text-2xl font-black text-emerald-600">Pay-per-use</div>
                        </div>
                    </div>

                    <header className="mb-12">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Financial Projections</h3>
                    </header>
                    <div className="space-y-8">
                        <div className="flex items-center gap-10">
                            <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Year 01</div>
                            <div className="flex-1 h-12 bg-slate-100 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-[30%] bg-slate-900 rounded-xl flex items-center justify-end pr-4">
                                    <span className="text-[10px] font-black text-white">€ 450K</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Year 02</div>
                            <div className="flex-1 h-12 bg-slate-100 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-[65%] bg-emerald-600 rounded-xl flex items-center justify-end pr-4">
                                    <span className="text-[10px] font-black text-white">€ 1.2M</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Year 03</div>
                            <div className="flex-1 h-12 bg-slate-100 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-[95%] bg-blue-600 rounded-xl flex items-center justify-end pr-4">
                                    <span className="text-[10px] font-black text-white">€ 2.8M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAGE 4: SWOT & ROADMAP */}
                <div className="min-h-[297mm] p-24 flex flex-col">
                    <header className="mb-20">
                        <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Section 03</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">SWOT Analysis</h3>
                    </header>

                    <div className="grid grid-cols-2 gap-8 mb-32">
                        <div className="p-10 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                            <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Zap size={14} /> Strengths
                            </h6>
                            <ul className="text-xs text-slate-700 space-y-4 font-bold">
                                <li>• UI/UX proprietaria "Luxury Corporate"</li>
                                <li>• Motore AI per analisi documenti</li>
                                <li>• Integrazione nativa logistica-finanza</li>
                            </ul>
                        </div>
                        <div className="p-10 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                            <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Globe size={14} /> Opportunities
                            </h6>
                            <ul className="text-xs text-slate-700 space-y-4 font-bold">
                                <li>• Espansione Mercati UE</li>
                                <li>• Integrazione IoT cantieri smart</li>
                                <li>• Partnership con istituti bancari</li>
                            </ul>
                        </div>
                    </div>

                    <header className="mb-12">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Strategic Roadmap</h3>
                    </header>
                    <div className="relative pl-12 space-y-16">
                        <div className="absolute left-4 inset-y-0 w-1 bg-slate-100" />
                        
                        <div className="relative">
                            <div className="absolute -left-10 top-0 w-6 h-6 bg-slate-900 rounded-full border-4 border-white shadow-xl" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Q3 2025</p>
                            <h6 className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Audit Engine v1</h6>
                            <p className="text-xs text-slate-500 mt-2">Lancio del sistema di controllo neurale degli scostamenti budget.</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-10 top-0 w-6 h-6 bg-emerald-600 rounded-full border-4 border-white shadow-xl" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Q1 2026</p>
                            <h6 className="text-xl font-black text-slate-900 uppercase tracking-tight">IoT Fleet Management</h6>
                            <p className="text-xs text-slate-500 mt-2">Integrazione hardware per il tracciamento real-time dei mezzi pesanti.</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-xl" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Q4 2026</p>
                            <h6 className="text-xl font-black text-slate-900 uppercase tracking-tight">Financial Hub Expansion</h6>
                            <p className="text-xs text-slate-500 mt-2">Modulo per la cessione del credito e factoring integrato in-app.</p>
                        </div>
                    </div>

                    <footer className="mt-auto pt-16 border-t border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">Building the Future of Construction</p>
                        <p className="text-xs font-bold text-slate-900">EdilManager Enterprise © 2026</p>
                    </footer>
                </div>

            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
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
                    .break-after-page {
                        display: block;
                        page-break-after: always !important;
                        page-break-inside: avoid;
                        margin: 0 !important;
                        padding: 20mm !important;
                        min-height: 297mm !important;
                    }
                    img {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
