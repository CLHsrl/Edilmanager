'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-mock';
import { 
    HardHat, Users, TrendingUp, AlertTriangle, 
    Receipt, ChevronRight, Plus, Calendar,
    Building2, ArrowUpRight, Package, ClipboardCheck
} from 'lucide-react';

import FinancialPulse from '@/components/dashboard/FinancialPulse';
import InventoryScanner from '@/components/dashboard/InventoryScanner';
import UnifiedAgenda from '@/components/dashboard/UnifiedAgenda';

export default function DashboardClient({ data }: { data: any }) {
    const { role } = useAuth();
    const { 
        fattureScadute = [], 
        cantieriAttivi = [], 
        health = {}, 
        articoliSottoScorta = [] 
    } = data || {};
 
    const isAdmin = role === 'ADMIN';
    const isPM = role === 'PM';

    const weeklyTrend = health.weeklyTrend || [
        { name: 'Lun', balance: 0 },
        { name: 'Mar', balance: 0 },
        { name: 'Mer', balance: 0 },
        { name: 'Gio', balance: 0 },
        { name: 'Ven', balance: 0 },
        { name: 'Sab', balance: 0 },
        { name: 'Dom', balance: 0 },
    ];

    const todayFormatted = new Intl.DateTimeFormat('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <Calendar size={14} className="text-[#003F61]" />
                        <span className="capitalize">{todayFormatted}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] mt-1 tracking-tight">Panoramica Aziendale</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Controllo operativo di cantieri, flussi di cassa e logistica.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link 
                        href="/projects" 
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#003F61] hover:bg-[#002f49] text-white text-xs font-semibold transition-colors"
                    >
                        <Plus size={15} /> Nuovo Cantiere
                    </Link>
                    <Link 
                        href="/fatture" 
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                        <Receipt size={15} /> Fatture
                    </Link>
                </div>
            </div>

            {/* 2. Top KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cantieri Attivi */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cantieri Aperti</span>
                        <div className="w-9 h-9 bg-[#003F61]/10 text-[#003F61] flex items-center justify-center">
                            <HardHat size={18} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-slate-900">{health.totalActiveProjects || 0}</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">In corso d'opera</span>
                            <Link href="/projects" className="text-xs font-medium text-[#003F61] hover:underline inline-flex items-center">
                                Gestisci <ChevronRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Personale Attivo */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Personale Registrato</span>
                        <div className="w-9 h-9 bg-blue-50 text-blue-700 flex items-center justify-center">
                            <Users size={18} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-slate-900">{health.totalActiveWorkers || 0}</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">Operai & Tecnici</span>
                            <Link href="/lavoratori" className="text-xs font-medium text-[#003F61] hover:underline inline-flex items-center">
                                Personale <ChevronRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Margine Operativo */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Margine Globale</span>
                        <div className="w-9 h-9 bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-3xl font-bold text-slate-900">{health.globalMargin || 0}%</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-emerald-600 font-medium">Margine medio commesse</span>
                            <Link href="/cassa" className="text-xs font-medium text-[#003F61] hover:underline inline-flex items-center">
                                Finanza <ChevronRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scadenze & Pendenze */}
                <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pendenze Fiscali</span>
                        <div className={`w-9 h-9 flex items-center justify-center ${fattureScadute.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <AlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className={`text-3xl font-bold ${fattureScadute.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                            {fattureScadute.length}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">
                                {fattureScadute.length > 0 ? 'Fatture scadute' : 'Tutto saldato'}
                            </span>
                            <Link href="/fatture" className="text-xs font-medium text-[#003F61] hover:underline inline-flex items-center">
                                Scadenzario <ChevronRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Operational Layout (2 Cols: 2/3 and 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Financial Chart (Admin & PM) */}
                    {(isAdmin || isPM) && (
                        <FinancialPulse 
                            weeklyTrend={weeklyTrend} 
                            monthlyTrend={health.monthlyCashflowTrend || []} 
                            globalMargin={health.globalMargin || 0}
                        />
                    )}

                    {/* Cantieri Attivi Table */}
                    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <HardHat size={18} className="text-[#003F61]" />
                                <h3 className="text-base font-semibold text-[#003F61]">Cantieri in Lavorazione</h3>
                            </div>
                            <Link 
                                href="/projects" 
                                className="text-xs font-semibold text-[#003F61] hover:underline inline-flex items-center gap-1"
                            >
                                Vedi tutti i cantieri <ArrowUpRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        <th className="px-4 py-3">Cantiere</th>
                                        <th className="px-4 py-3">Committente</th>
                                        <th className="px-4 py-3">Budget</th>
                                        <th className="px-4 py-3">Stato</th>
                                        <th className="px-4 py-3 text-right">Dettaglio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cantieriAttivi.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-slate-400">{c.number ? `#${c.number}` : ''}</span>
                                                    <span>{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {c.client?.name || 'Cliente Diretto'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-900 font-medium">
                                                {c.budget ? `€ ${c.budget.toLocaleString('it-IT')}` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Attivo
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link 
                                                    href={`/projects/${c.id}`} 
                                                    className="inline-flex items-center text-xs font-medium text-[#003F61] hover:underline"
                                                >
                                                    Apri Scheda <ChevronRight size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {cantieriAttivi.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                                                Nessun cantiere attivo al momento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Scadenzario Fiscale (Admin) */}
                    {isAdmin && (
                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Receipt size={18} className="text-[#003F61]" />
                                    <h3 className="text-base font-semibold text-[#003F61]">Scadenzario Fiscale & Pagamenti</h3>
                                </div>
                                {fattureScadute.length > 0 && (
                                    <span className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-2.5 py-0.5">
                                        {fattureScadute.length} Scadute
                                    </span>
                                )}
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            <th className="px-4 py-3">Flusso</th>
                                            <th className="px-4 py-3">Fornitore / Cliente</th>
                                            <th className="px-4 py-3">Documento & Scadenza</th>
                                            <th className="px-4 py-3 text-right">Importo</th>
                                            <th className="px-4 py-3 text-right">Azione</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {fattureScadute.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                                                    Nessun pagamento o incasso scaduto in sospeso.
                                                </td>
                                            </tr>
                                        ) : (
                                            fattureScadute.map((f: any) => (
                                                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 border ${
                                                            f.tipo === 'ATTIVA' 
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                                        }`}>
                                                            {f.tipo === 'ATTIVA' ? 'Entrata' : 'Uscita'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                                        {f.soggetto}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">
                                                        Doc. #{f.numero} • Scad. {new Date(f.dataScadenza).toLocaleDateString('it-IT')}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                        € {f.totale.toLocaleString('it-IT')}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link 
                                                            href={`/fatture/${f.id}`} 
                                                            className="text-xs font-semibold text-[#003F61] hover:underline"
                                                        >
                                                            Gestisci
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Right Column (1/3) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Quick Management Actions */}
                    <div className="bg-white border border-slate-200 p-5 shadow-sm">
                        <h3 className="text-base font-semibold text-[#003F61] mb-3 pb-3 border-b border-slate-100 flex items-center gap-2">
                            <ClipboardCheck size={18} className="text-[#003F61]" />
                            Azioni Rapide
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Link 
                                href="/projects" 
                                className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-center transition-colors"
                            >
                                <HardHat size={20} className="text-[#003F61] mb-1.5" />
                                <span className="text-xs font-semibold">Cantieri</span>
                            </Link>
                            <Link 
                                href="/fatture" 
                                className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-center transition-colors"
                            >
                                <Receipt size={20} className="text-[#003F61] mb-1.5" />
                                <span className="text-xs font-semibold">Fatture</span>
                            </Link>
                            <Link 
                                href="/magazzino" 
                                className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-center transition-colors"
                            >
                                <Package size={20} className="text-[#003F61] mb-1.5" />
                                <span className="text-xs font-semibold">Magazzino</span>
                            </Link>
                            <Link 
                                href="/lavoratori" 
                                className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-center transition-colors"
                            >
                                <Users size={20} className="text-[#003F61] mb-1.5" />
                                <span className="text-xs font-semibold">Personale</span>
                            </Link>
                        </div>
                    </div>

                    {/* Inventory Scanner (Sotto Scorta) */}
                    <InventoryScanner articoli={articoliSottoScorta || []} />

                    {/* Unified Agenda */}
                    <UnifiedAgenda items={[]} />
                </div>

            </div>
        </div>
    );
}
