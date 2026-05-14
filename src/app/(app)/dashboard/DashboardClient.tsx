'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-mock';
import { 
    AlertCircle, ArrowRight, BrainCircuit, 
    CircleDashed, FileText, HardHat, 
    Link as LinkIcon, Plus, Receipt, 
    Sparkles, Target, TrendingUp, Activity, ShieldAlert
} from 'lucide-react';

// Premium Components
import DashboardHero from '@/components/dashboard/DashboardHero';
import FinancialPulse from '@/components/dashboard/FinancialPulse';
import InventoryScanner from '@/components/dashboard/InventoryScanner';
import UnifiedAgenda from '@/components/dashboard/UnifiedAgenda';

export default function DashboardClient({ data }: { data: any }) {
    const { role } = useAuth();
    const { 
        fattureScadute, movimentiNonAssociati, cantieriAttivi, 
        preventiviAperti, health, projectedCashflow 
    } = data;
 
    const isAdmin = role === 'ADMIN';
    const isPM = role === 'PM';
    const isOperaio = role === 'OPERAIO';

    // Mock data for graphs if not fully provided by actions
    const weeklyTrend = [
        { name: 'Lun', balance: 4500 },
        { name: 'Mar', balance: 5200 },
        { name: 'Mer', balance: -1200 },
        { name: 'Gio', balance: 8900 },
        { name: 'Ven', balance: 3400 },
        { name: 'Sab', balance: 0 },
        { name: 'Dom', balance: 0 },
    ];

    return (
        <div className="flex flex-col gap-10 pb-20 reveal relative">
            {/* 1. HERO SECTION */}
            <DashboardHero 
                userName="Direttore" 
                activeWorkers={12} 
                activeProjects={health.totalActiveProjects}
            />

            {/* 2. ANALYTICAL ROW (Admin & PM) */}
            {(isAdmin || isPM) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        <FinancialPulse 
                            weeklyTrend={weeklyTrend} 
                            monthlyTrend={health.monthlyCashflowTrend} 
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <InventoryScanner articoli={data.articoliSottoScorta || []} />
                    </div>
                </div>
            )}

            {/* 3. STRATEGIC ROW */}
            {isAdmin && (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/20">
                                    AI CEO ADVISOR
                                </span>
                                <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles size={14} className="text-blue-400" /> Focus Strategico Settimanale
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                                Ottimizzazione <span className="text-blue-500">Margin-Call</span> Cantieri
                            </h2>
                            <p className="text-slate-400 text-base font-medium leading-relaxed mb-8">
                                L'analisi dei costi attuali indica un'opportunità di recupero del <span className="text-white font-black">4.2%</span> sulla logistica dell'ultimo miglio. Sblocca il piano d'azione per convertire questa inefficienza in utile netto.
                            </p>
                            <Link href="/strategy" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-xl">
                                Esplora Strategia <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
                                <BrainCircuit size={64} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. OPERATIONAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Agenda Unificata */}
                <div className="lg:col-span-1">
                    <UnifiedAgenda items={[]} /> {/* Pass real agenda items here */}
                </div>

                {/* Status List (Fatture / Cantieri) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Cantieri */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-premium">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <HardHat size={18} className="text-blue-600" /> Controllo Operativo
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Stato avanzamento cantieri attivi</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                {data.geofencingAlertsCount > 0 && (
                                    <div className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse shadow-sm">
                                        <ShieldAlert size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{data.geofencingAlertsCount} GPS ALERTS</span>
                                    </div>
                                )}
                                <Link href="/projects" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Vedi Tutti</Link>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cantieriAttivi.map((c: any) => (
                            <Link key={c.id} href={`/projects/${c.id}`} className="block bg-slate-50 border border-slate-100 p-5 rounded-3xl hover:border-blue-600 hover:bg-white transition-all group">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{c.number ? `#${c.number} ` : ''}{c.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{c.client?.name || 'Committente Privato'}</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>

                    {/* Fiscal Pulse (Solo Admin) */}
                    {isAdmin && (
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={18} className="text-emerald-600" /> Scadenzario Fiscale
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Gestione flussi di cassa in entrata/uscita</p>
                                </div>
                                <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{fattureScadute.length} Alert</span>
                            </div>
                            
                            <div className="space-y-3">
                                {fattureScadute.length === 0 ? (
                                    <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nessuna pendenza rilevata</p>
                                    </div>
                                ) : (
                                    fattureScadute.map((f: any) => (
                                        <div key={f.id} className="p-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-600 rounded-3xl flex justify-between items-center transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${f.tipo === 'ATTIVA' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {f.tipo === 'ATTIVA' ? 'IN' : 'OUT'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{f.soggetto}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Doc. {f.numero} • Scad. {new Date(f.dataScadenza).toLocaleDateString('it-IT')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900 tracking-tighter">€ {f.totale.toLocaleString('it-IT')}</p>
                                                <Link href={`/fatture/${f.id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Dettagli</Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

