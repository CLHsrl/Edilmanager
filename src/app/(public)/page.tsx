'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    Building2, 
    ShieldCheck, 
    ArrowRight, 
    TrendingUp, 
    Users, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Smartphone, 
    BarChart3, 
    Calculator, 
    AlertTriangle, 
    Check, 
    X as XIcon, 
    Lock, 
    Sparkles, 
    Calendar, 
    DollarSign,
    HardHat,
    ExternalLink,
    ChevronRight,
    Camera
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function PublicHomePage() {
    const [activeTab, setActiveTab] = useState<'kpi' | 'cantieri' | 'finanze' | 'clienti'>('kpi');
    const [formSent, setFormSent] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        azienda: '',
        email: '',
        telefono: '',
        cantieri: '1-5 cantieri'
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSent(true);
    };

    return (
        <div className="w-full bg-slate-50 text-slate-900 font-sans selection:bg-[#FEDE59] selection:text-[#003F61]">
            
            {/* ─── 1. HERO SECTION (Total Brand Blue #003F61 matching Login) ─── */}
            <section className="relative bg-[#003F61] text-white pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden">
                {/* Geometric Watermarks */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEDE59]/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
                <div className="absolute top-20 left-12 w-64 h-64 border border-white/10 pointer-events-none hidden lg:block" />
                <div className="absolute bottom-12 right-20 w-48 h-48 border border-white/5 pointer-events-none hidden lg:block" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
                        
                        {/* Golden Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#FEDE59]/15 border border-[#FEDE59]/30 px-3.5 py-1 mb-6">
                            <span className="w-2 h-2 bg-[#FEDE59]" />
                            <span className="text-[#FEDE59] text-xs font-black uppercase tracking-widest">
                                GESTIONALE EDILE PROFESSIONALE
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
                            Cantieri, finanze e squadre — <span className="text-[#FEDE59]">tutto sotto controllo.</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                            La piattaforma cloud all-in-one creata su misura per le imprese di costruzioni e ristrutturazione. Elimina gli sprechi in cantiere, certifica i margini reali commessa per commessa e azzera il caos amministrativo.
                        </p>

                        {/* CTA Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a 
                                href="#contatti" 
                                className="w-full sm:w-auto bg-[#FEDE59] hover:bg-[#e5c74f] text-[#003F61] px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all"
                            >
                                <span>Richiedi Demo Gratuita</span>
                                <ArrowRight size={16} />
                            </a>
                            <Link 
                                href="/login" 
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/25 px-8 py-4 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                            >
                                <ShieldCheck size={16} className="text-[#FEDE59]" />
                                <span>Accedi al Gestionale</span>
                            </Link>
                        </div>

                        {/* Micro Trust Indicators */}
                        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
                            <div>
                                <div className="text-2xl sm:text-3xl font-black text-[#FEDE59]">€42.8M</div>
                                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Lavori Monitorati</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-black text-white">180+</div>
                                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Cantieri Gestiti</div>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
                                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Cloud & Mobile Ready</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── 2. INTERACTIVE DASHBOARD PREVIEW ─── */}
            <section id="dashboard-anteprima" className="py-20 bg-slate-100 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 bg-[#003F61]/10 text-[#003F61] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3">
                            <span className="w-1.5 h-1.5 bg-[#003F61]" />
                            Interfaccia Operativa Live
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#003F61] tracking-tight">
                            Il cruscotto aziendale sempre a portata di mano
                        </h2>
                        <p className="text-slate-600 text-sm mt-3">
                            Sperimenta come Edilmanager24 organizza ogni cantiere, spesa, operaio e commessa in tempo reale.
                        </p>
                    </div>

                    {/* Interactive Mockup Container */}
                    <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden">
                        
                        {/* Mockup Top Bar (like browser or ERP header) */}
                        <div className="bg-[#003F61] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-red-400" />
                                <span className="w-3 h-3 bg-yellow-400" />
                                <span className="w-3 h-3 bg-emerald-400" />
                                <span className="text-xs font-mono text-white/70 ml-2">app.edilmanager24.it/dashboard</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-[#FEDE59] font-bold">Impresa Edile Demo</span>
                                <span className="text-xs text-white/40">•</span>
                                <span className="text-[11px] text-white/80">Ruolo: Amministratore</span>
                            </div>
                        </div>

                        {/* Interactive Navigation Tabs */}
                        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('kpi')}
                                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === 'kpi'
                                        ? 'bg-white text-[#003F61] border-b-2 border-[#003F61] shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <BarChart3 size={15} />
                                <span>1. Panoramica & KPI Finanziari</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('cantieri')}
                                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === 'cantieri'
                                        ? 'bg-white text-[#003F61] border-b-2 border-[#003F61] shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Building2 size={15} />
                                <span>2. Avanzamento Cantieri & SAL</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('finanze')}
                                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === 'finanze'
                                        ? 'bg-white text-[#003F61] border-b-2 border-[#003F61] shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <DollarSign size={15} />
                                <span>3. Controllo Cassa & Fornitori</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('clienti')}
                                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === 'clienti'
                                        ? 'bg-white text-[#003F61] border-b-2 border-[#003F61] shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Users size={15} />
                                <span>4. Portale Clienti & Committenti</span>
                            </button>
                        </div>

                        {/* Mockup Content Body */}
                        <div className="p-6 sm:p-10 bg-slate-50/60 min-h-[420px]">
                            
                            {/* TAB 1: KPI OVERVIEW */}
                            {activeTab === 'kpi' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white p-5 border border-slate-200 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Totale Produzione Mese</p>
                                            <p className="text-2xl font-black text-[#003F61] mt-1">€ 142.450</p>
                                            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                                                <TrendingUp size={13} /> +18.4% rispetto al mese prec.
                                            </span>
                                        </div>
                                        <div className="bg-white p-5 border border-slate-200 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Margine Operativo Medio</p>
                                            <p className="text-2xl font-black text-emerald-600 mt-1">31.2%</p>
                                            <span className="text-[11px] text-slate-500 font-medium mt-2 block">Obiettivo aziendale: &gt; 25%</span>
                                        </div>
                                        <div className="bg-white p-5 border border-slate-200 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cantieri in Esecuzione</p>
                                            <p className="text-2xl font-black text-[#003F61] mt-1">7 Attivi</p>
                                            <span className="text-[11px] text-blue-600 font-bold mt-2 block">3 in fase di collaudo SAL</span>
                                        </div>
                                        <div className="bg-white p-5 border border-slate-200 shadow-sm">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Presenze Operai Oggi</p>
                                            <p className="text-2xl font-black text-[#003F61] mt-1">24 Presenti</p>
                                            <span className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                                <CheckCircle2 size={13} /> 100% Timbrature validate
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-[#003F61] uppercase tracking-wide">
                                                Stato Avanzamento Lavori (SAL) per Commessa
                                            </h4>
                                            <span className="text-xs text-slate-400">Aggiornato in tempo reale</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span>Villa Bellavista - Ristrutturazione Completa</span>
                                                    <span className="text-[#003F61]">SAL 3: 82% (€ 185.000)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2.5">
                                                    <div className="bg-[#003F61] h-2.5" style={{ width: '82%' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span>Complesso Residenziale Le Terrazze</span>
                                                    <span className="text-[#003F61]">SAL 1: 45% (€ 320.000)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2.5">
                                                    <div className="bg-[#FEDE59] h-2.5" style={{ width: '45%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: CANTIERI */}
                            {activeTab === 'cantieri' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-6 border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="bg-[#003F61] text-white text-[10px] font-black uppercase px-2.5 py-1">In Corso</span>
                                                <span className="text-xs text-slate-500 font-semibold">Committente: Fam. Rossi</span>
                                            </div>
                                            <h4 className="text-base font-bold text-[#003F61]">Riqualificazione Energetica Via Manzoni</h4>
                                            <p className="text-xs text-slate-500 mt-1">Cappotto termico 14cm, infissi triplo vetro e impianto ibrido.</p>
                                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Computo</span>
                                                    <span className="font-bold">€ 95.000</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Costi Reali</span>
                                                    <span className="font-bold text-slate-700">€ 61.200</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Margine</span>
                                                    <span className="font-bold text-emerald-600">+35.5%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1">SAL Pronto</span>
                                                <span className="text-xs text-slate-500 font-semibold">Committente: Società Gamma Srl</span>
                                            </div>
                                            <h4 className="text-base font-bold text-[#003F61]">Uffici Direzionali Innovation Hub</h4>
                                            <p className="text-xs text-slate-500 mt-1">Demolizione, tramezzature a secco e pavimenti galleggianti.</p>
                                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Computo</span>
                                                    <span className="font-bold">€ 210.000</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Fatturato</span>
                                                    <span className="font-bold text-slate-700">€ 140.000</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Margine</span>
                                                    <span className="font-bold text-emerald-600">+29.8%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: FINANZE */}
                            {activeTab === 'finanze' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="bg-white p-6 border border-slate-200 shadow-sm">
                                        <h4 className="text-sm font-bold text-[#003F61] uppercase tracking-wide mb-4">
                                            Proiezione di Cassa & Rischio Liquidità (30-60-90 Giorni)
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="p-4 bg-emerald-50 border border-emerald-200">
                                                <span className="text-[10px] font-bold text-emerald-800 uppercase">30 Giorni</span>
                                                <p className="text-xl font-bold text-emerald-700 mt-1">+ € 48.200</p>
                                                <p className="text-xs text-emerald-600 mt-1">Liquidità ottimale</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 border border-blue-200">
                                                <span className="text-[10px] font-bold text-blue-800 uppercase">60 Giorni</span>
                                                <p className="text-xl font-bold text-[#003F61] mt-1">+ € 32.500</p>
                                                <p className="text-xs text-blue-600 mt-1">Copertura fornitori garantita</p>
                                            </div>
                                            <div className="p-4 bg-amber-50 border border-amber-200">
                                                <span className="text-[10px] font-bold text-amber-800 uppercase">90 Giorni</span>
                                                <p className="text-xl font-bold text-amber-700 mt-1">+ € 19.800</p>
                                                <p className="text-xs text-amber-600 mt-1">Richiede emissione SAL 4</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: CLIENTI */}
                            {activeTab === 'clienti' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="bg-white p-6 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Camera size={20} className="text-[#003F61]" />
                                            <h4 className="text-sm font-bold text-[#003F61] uppercase tracking-wide">
                                                Esperienza Portale Committente Trasparente
                                            </h4>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-6">
                                            Ogni cliente riceve un link privato da cui seguire lo stato del proprio cantiere, guardare le foto scattate dai caposquadra e firmare digitalmente le varianti.
                                        </p>
                                        <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#003F61] text-white flex items-center justify-center font-bold text-xs">
                                                    SAL 2
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-900">Approvazione Gettata Fondazioni</h5>
                                                    <p className="text-[11px] text-slate-500">Firmato digitalmente dal cliente il 24/09</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 border border-emerald-200">
                                                Fattura Emessa
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 3. I MODULI DELLA SUITE EDILMANAGER24 ─── */}
            <section id="moduli" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#FEDE59]/20 text-[#003F61] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3 border border-[#FEDE59]/40">
                            <span className="w-1.5 h-1.5 bg-[#003F61]" />
                            Architettura Completa
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#003F61] tracking-tight">
                            I 6 Pilastri per Guidare l'Impresa Edile
                        </h2>
                        <p className="text-slate-600 text-sm mt-3">
                            Moduli integrati progettati per sostituire decine di file Excel sparsi e chat WhatsApp disordinate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Cantieri & SAL */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Gestione Cantieri & SAL
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Giornale dei lavori digitale, computi metrici estimativi, scadenziario contrattuale e monitoraggio istantaneo dello stato di avanzamento.
                            </p>
                        </div>

                        {/* 2. Controllo Finanziario */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <DollarSign size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Contabilità Analitica & Margini
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Conosci in tempo reale il margine lordo di ogni singolo lavoro. Riconcilia fatture di acquisto, costi manodopera e noleggi con gli incassi dei SAL.
                            </p>
                        </div>

                        {/* 3. Squadre & Presenze */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <HardHat size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Squadre, Presenze & Sicurezza
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Timbratura geolocalizzata GPS dal cellulare degli operai. Controllo scadenze visite mediche, DPI, patentini e documenti di subappalto.
                            </p>
                        </div>

                        {/* 4. Portale Clienti */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Portale Trasparente Committente
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Riduci le telefonate e aumenta la fiducia: il cliente accede a un'area web sicura con foto del cantiere, verbali approvati e pagamenti tracciati.
                            </p>
                        </div>

                        {/* 5. Preventivazione & Prezzari */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <Calculator size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Preventivazione Rapida DEI
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Crea offerte competitive in pochi minuti importando voci da prezzari regionali con ricarichi personalizzati e stima del fabbisogno materiali.
                            </p>
                        </div>

                        {/* 6. Strategic Advisor */}
                        <div className="p-8 bg-white border border-slate-200 hover:border-[#003F61] transition-all hover:shadow-xl group">
                            <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center mb-6">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-[#003F61] tracking-tight mb-2">
                                Strategic Cash Flow Advisor
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Intelligenza predittiva che analizza i flussi di tesoreria a 30, 60 e 90 giorni per prevenire crisi di cassa tra l'acquisto dei materiali e l'incasso dei SAL.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── 4. CONFRONTO: EXCEL VS EDILMANAGER24 ─── */}
            <section id="confronto" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEDE59]/5 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#FEDE59]/20 text-[#FEDE59] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3">
                            Il Salto di Qualità
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Metodo Tradizionale vs EDILMANAGER24
                        </h2>
                        <p className="text-white/70 text-sm mt-3">
                            Scopri perché decine di impresari hanno abbandonato i fogli di calcolo per una piattaforma centralizzata.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        
                        {/* Vecchio Metodo */}
                        <div className="bg-white/5 border border-red-500/30 p-8 space-y-6">
                            <div className="flex items-center gap-3 text-red-400 font-bold uppercase tracking-wider text-xs border-b border-red-500/20 pb-4">
                                <XIcon size={18} />
                                <span>Metodo Tradizionale (Excel + WhatsApp)</span>
                            </div>
                            <ul className="space-y-4 text-xs text-white/70">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold shrink-0">✕</span>
                                    <span>Fogli Excel duplicati e non allineati tra ufficio e cantiere.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold shrink-0">✕</span>
                                    <span>SAL calcolati dopo settimane: non sai mai se stai guadagnando o perdendo.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold shrink-0">✕</span>
                                    <span>Foto dei cantieri disperse nelle chat personali degli operai.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold shrink-0">✕</span>
                                    <span>Fatture fornitori scoperte all'ultimo minuto con crisi di cassa impreviste.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Nuovo Metodo */}
                        <div className="bg-[#003F61] border-2 border-[#FEDE59] p-8 space-y-6 shadow-2xl relative">
                            <div className="absolute top-0 right-0 bg-[#FEDE59] text-[#003F61] text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                                Consigliato
                            </div>
                            <div className="flex items-center gap-3 text-[#FEDE59] font-black uppercase tracking-wider text-xs border-b border-white/10 pb-4">
                                <Check size={18} />
                                <span>Con EDILMANAGER24</span>
                            </div>
                            <ul className="space-y-4 text-xs text-white/90">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                    <span>Unica base dati cloud aggiornata in tempo reale da smartphone e PC.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                    <span>Calcolo automatico del margine lordo e avanzamento SAL istantaneo.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                    <span>Archivio fotografico geolocalizzato diviso per cantiere e giorno.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                                    <span>Pianificazione tesoreria a 90 giorni per anticipare i fabbisogni di cassa.</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── 5. PIANI & LICENZE ─── */}
            <section id="prezzi" className="py-24 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#003F61]/10 text-[#003F61] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3">
                            Prezzi Chiari & Flessibili
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#003F61] tracking-tight">
                            Investi nel Controllo della Tua Impresa
                        </h2>
                        <p className="text-slate-600 text-sm mt-3">
                            Nessun costo nascosto. Attivazione immediata, supporto italiano dedicato e onboarding personalizzato.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Piano 1: Starter */}
                        <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-bold text-[#003F61] uppercase tracking-wide">Starter</h3>
                                <p className="text-xs text-slate-500 mt-1">Ideale per artigiani e piccole imprese di ristrutturazione.</p>
                                <div className="my-6">
                                    <span className="text-3xl font-black text-[#003F61]">€ 79</span>
                                    <span className="text-xs text-slate-400 font-medium"> / mese</span>
                                </div>
                                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Fino a 3 Cantieri Attivi</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Gestione SAL & Computi</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Timbratura Presenze Operai</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Supporto via Email</li>
                                </ul>
                            </div>
                            <a href="#contatti" className="w-full text-center bg-slate-100 hover:bg-slate-200 text-[#003F61] py-3 text-xs font-bold uppercase tracking-wider block transition-colors">
                                Inizia con Starter
                            </a>
                        </div>

                        {/* Piano 2: Professional (Featured) */}
                        <div className="bg-[#003F61] text-white border-2 border-[#FEDE59] p-8 shadow-2xl flex flex-col justify-between relative">
                            <div className="absolute top-0 right-0 bg-[#FEDE59] text-[#003F61] text-[9px] font-black uppercase px-3 py-1 tracking-widest">
                                Più Scelto
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white uppercase tracking-wide">Professional</h3>
                                <p className="text-xs text-white/70 mt-1">Per imprese strutturate che gestiscono più commesse parallele.</p>
                                <div className="my-6">
                                    <span className="text-3xl font-black text-[#FEDE59]">€ 169</span>
                                    <span className="text-xs text-white/60 font-medium"> / mese</span>
                                </div>
                                <ul className="space-y-3 text-xs text-white/90 mb-8">
                                    <li className="flex items-center gap-2"><Check size={14} className="text-[#FEDE59]" /> Fino a 12 Cantieri Attivi</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-[#FEDE59]" /> Controllo Cassa & Margini Reali</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-[#FEDE59]" /> Portale Clienti con Link Dedicato</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-[#FEDE59]" /> Riconciliazione Fatture & Fornitori</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-[#FEDE59]" /> Assistenza Prioritaria WhatsApp</li>
                                </ul>
                            </div>
                            <a href="#contatti" className="w-full text-center bg-[#FEDE59] hover:bg-[#e5c74f] text-[#003F61] py-3 text-xs font-black uppercase tracking-widest block transition-colors shadow-lg">
                                Attiva Professional
                            </a>
                        </div>

                        {/* Piano 3: Enterprise */}
                        <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-bold text-[#003F61] uppercase tracking-wide">Impresa Scalabile</h3>
                                <p className="text-xs text-slate-500 mt-1">Grandi aziende edili, general contractor e consorzi.</p>
                                <div className="my-6">
                                    <span className="text-3xl font-black text-[#003F61]">Su Misura</span>
                                </div>
                                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Cantieri & Utenti Illimitati</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Multi-Società e Consorzi</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Integrazione API & ERP Contabile</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Account Manager Dedicato</li>
                                </ul>
                            </div>
                            <a href="#contatti" className="w-full text-center bg-slate-100 hover:bg-slate-200 text-[#003F61] py-3 text-xs font-bold uppercase tracking-wider block transition-colors">
                                Parla con un Consulente
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── 6. CONTATTI & RICHIESTA DEMO ─── */}
            <section id="contatti" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#003F61]/10 text-[#003F61] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-4">
                                Richiedi Demo Guidata
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#003F61] tracking-tight mb-4">
                                Guarda Edilmanager24 all'opera sui tuoi cantieri
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8">
                                In 25 minuti ti mostriamo come configurare i tuoi cantieri attivi, impostare i computi metrici e azzerare le perdite sui margini.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                                    <div className="w-8 h-8 bg-[#003F61] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                        1
                                    </div>
                                    <span>Demo online 1-to-1 con un nostro esperto del settore edile</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                                    <div className="w-8 h-8 bg-[#003F61] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                        2
                                    </div>
                                    <span>Analisi gratuita dei processi e calcolo dei margini recuperabili</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                                    <div className="w-8 h-8 bg-[#003F61] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                        3
                                    </div>
                                    <span>14 giorni di prova completa senza vincoli contrattuali</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Card */}
                        <div className="bg-slate-50 border border-slate-200 p-8 shadow-xl">
                            {formSent ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#003F61]">Richiesta Ricevuta!</h3>
                                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                                        Grazie {formData.nome}. Un nostro consulente ti contatterà entro 2 ore lavorative al numero o all'email indicata.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <h3 className="text-lg font-bold text-[#003F61] uppercase tracking-wide mb-2">
                                        Prenota la tua sessione
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Nome e Cognome
                                            </label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.nome}
                                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                                placeholder="Geom. Marco Rossi"
                                                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003F61]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Nome Impresa
                                            </label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.azienda}
                                                onChange={(e) => setFormData({...formData, azienda: e.target.value})}
                                                placeholder="Costruzioni Rossi Srl"
                                                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003F61]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Email Aziendale
                                            </label>
                                            <input 
                                                type="email" 
                                                required 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                placeholder="rossi@costruzioni.it"
                                                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003F61]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Telefono / Cellulare
                                            </label>
                                            <input 
                                                type="tel" 
                                                required 
                                                value={formData.telefono}
                                                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                                placeholder="+39 333 000 0000"
                                                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003F61]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Cantieri Gestiti all'Anno
                                        </label>
                                        <select 
                                            value={formData.cantieri}
                                            onChange={(e) => setFormData({...formData, cantieri: e.target.value})}
                                            className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#003F61]"
                                        >
                                            <option>1-3 cantieri all'anno</option>
                                            <option>4-10 cantieri all'anno</option>
                                            <option>Oltre 10 cantieri all'anno</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-[#003F61] hover:bg-[#002b42] text-white py-3.5 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all mt-4"
                                    >
                                        <span>Prenota Demo Gratuita</span>
                                        <ArrowRight size={16} className="text-[#FEDE59]" />
                                    </button>

                                    <p className="text-[10px] text-slate-400 text-center pt-2">
                                        Nessun impegno • I tuoi dati non verranno ceduti a terzi
                                    </p>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
