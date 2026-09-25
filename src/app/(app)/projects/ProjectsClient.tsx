'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, HardHat, CheckCircle, Clock, Search as SearchIcon, 
    TrendingUp, Wallet, CheckCircle2, ChevronRight, LayoutGrid, 
    List, ArrowRight, MapPin, Calendar, Activity, Target
} from 'lucide-react';
import Link from 'next/link';
import SlideOver from '@/components/SlideOver';
import ProjectWizard from '@/components/ProjectWizard';

type Previsionale = { tipo: string; importo: number };

type Project = {
    id: string;
    name: string;
    number: number | null;
    description: string | null;
    status: string;
    budget: number | null;
    startDate: Date;
    indirizzo: string | null;
    citta: string | null;
    client: {
        id: string;
        name: string;
        number: number | null;
    };
    lavoratori: {
        id: string;
        nome: string;
        cognome: string;
    }[];
    previsionali: Previsionale[];
    ddts: { importo: number | null }[];
};

// Helper: calcola margine netto di un singolo progetto
function calcMargine(project: Project): { margine: number; perc: number; ricavi: number; costi: number } {
    const entrate = project.previsionali.filter(p => p.tipo === 'ENTRATA').reduce((s, p) => s + p.importo, 0);
    const uscite  = project.previsionali.filter(p => p.tipo === 'USCITA').reduce((s, p) => s + p.importo, 0);
    const ricavi  = entrate > 0 ? entrate : (project.budget || 0);
    const margine = ricavi - uscite;
    const perc    = ricavi > 0 ? (margine / ricavi) * 100 : 0;
    return { margine, perc, ricavi, costi: uscite };
}

type SortKey = 'name' | 'startDate' | 'budget';
type SortOrder = 'asc' | 'desc';

type Props = {
    projects: Project[];
    isAdmin: boolean;
    stats: {
        activeProjects: number;
        completedProjects: number;
        totalBudget: number;
        totalMargine: number;
        marginePerc: number;
        hasMargineData: boolean;
    };
};

export default function ProjectsClient({ projects, isAdmin, stats }: Props) {
    const { activeProjects, completedProjects, totalBudget, totalMargine = 0, marginePerc = 0, hasMargineData = false } = stats;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONGOING' | 'COMPLETED'>('ALL');
    const [locationFilter, setLocationFilter] = useState<string>('ALL');
    const [employeeFilter, setEmployeeFilter] = useState<string>('ALL');
    const [sortKey, setSortKey] = useState<SortKey>('startDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isPending, startTransition] = useTransition();

    // Derived Data for Filters
    const uniqueCities = Array.from(new Set(projects.map(p => p.citta).filter(Boolean))).sort() as string[];
    const uniqueEmployees = Array.from(new Map(
        projects.flatMap(p => p.lavoratori).map(l => [l.id, l])
    ).values()).sort((a, b) => a.nome.localeCompare(b.nome));

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        const matchesLocation = locationFilter === 'ALL' || p.citta === locationFilter;
        const matchesEmployee = employeeFilter === 'ALL' || p.lavoratori.some(l => l.id === employeeFilter);
        
        return matchesSearch && matchesStatus && matchesLocation && matchesEmployee;
    }).sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortKey === 'startDate') {
            comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        } else if (sortKey === 'budget') {
            comparison = (a.budget || 0) - (b.budget || 0);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <HardHat size={14} className="text-[#003F61]" />
                        <span>Operazioni / Gestione Cantieri</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Commesse & Cantieri</h1>
                    <p className="text-sm text-slate-500 mt-1">Supervisione avanzamento operativo, budget e marginalità per commessa.</p>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsWizardOpen(true)}
                            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Plus size={16} /> Nuovo Cantiere
                        </button>
                    </div>
                )}
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Cantieri Attivi</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{activeProjects}</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Su {projects.length} commesse totali
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Volume Portafoglio</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">
                            € {totalBudget.toLocaleString('it-IT')}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Budget totale commesse
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Margine Globale</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <Target size={16} />
                        </div>
                    </div>
                    <div>
                        <div className={`text-2xl font-bold tracking-tight ${hasMargineData && totalMargine >= 0 ? 'text-emerald-600' : hasMargineData ? 'text-red-600' : 'text-slate-900'}`}>
                            {hasMargineData ? `${totalMargine >= 0 ? '+' : ''}€ ${Math.abs(totalMargine).toLocaleString('it-IT')}` : '0%'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {hasMargineData ? `Margine: ${marginePerc.toFixed(1)}%` : 'In attesa di consuntivazione'}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Commesse Concluse</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <CheckCircle size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{completedProjects}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>Collaudati & chiusi</span>
                            <Link href="/bi" className="text-[#003F61] font-semibold hover:underline">BI Analytics &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cerca cantiere, cliente o indirizzo..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex border border-slate-200 shrink-0">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            title="Vista a Griglia"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            title="Vista a Tabella"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Stato</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="ALL">Tutti gli stati</option>
                            <option value="ONGOING">In Corso</option>
                            <option value="COMPLETED">Archiviati / Chiusi</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Città</label>
                        <select 
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="ALL">Tutte le città</option>
                            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Responsabile</label>
                        <select 
                            value={employeeFilter}
                            onChange={(e) => setEmployeeFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="ALL">Tutto il personale</option>
                            {uniqueEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.nome} {emp.cognome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Ordina per</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="startDate">Data di Avvio</option>
                            <option value="name">Nome Cantiere</option>
                            <option value="budget">Importo Budget</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setStatusFilter('ALL'); setLocationFilter('ALL');
                                setEmployeeFilter('ALL'); setSortKey('startDate'); setSortOrder('desc');
                            }}
                            className="w-full h-[34px] border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProjects.map((project) => {
                        const { margine, perc, costi } = calcMargine(project);
                        const isPos = margine >= 0;

                        return (
                            <div key={project.id} className="bg-white border border-slate-200 hover:border-slate-400 transition-all flex flex-col">
                                <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                            COD: PRJ-{String(project.number || 0).padStart(3, '0')}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5 hover:text-[#003F61] transition-colors">
                                            <Link href={`/projects/${project.id}`}>{project.name}</Link>
                                        </h3>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                        project.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {project.status === 'ONGOING' ? 'In Corso' : 'Archiviato'}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span>Committente:</span>
                                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">{project.client.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span>Località:</span>
                                            <span className="font-medium text-slate-700 flex items-center gap-1">
                                                <MapPin size={12} className="text-[#003F61]" />
                                                {project.citta || 'Non specificata'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span>Budget di Commessa:</span>
                                            <span className="font-bold text-slate-900">€ {project.budget?.toLocaleString('it-IT') || '—'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span>Data di Avvio:</span>
                                            <span className="text-slate-700">{new Date(project.startDate).toLocaleDateString('it-IT')}</span>
                                        </div>
                                    </div>

                                    {costi > 0 && (
                                        <div className={`p-2.5 border text-xs ${isPos ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Margine Stimato</span>
                                                <span className={`font-bold ${isPos ? 'text-emerald-700' : 'text-red-600'}`}>
                                                    {isPos ? '+' : ''}{perc.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">
                                                {isPos ? '+' : ''}€ {margine.toLocaleString('it-IT')}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                            {project.lavoratori.slice(0, 3).map((l) => (
                                                <div key={l.id} className="w-6 h-6 bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700" title={`${l.nome} ${l.cognome}`}>
                                                    {l.nome[0]}
                                                </div>
                                            ))}
                                            {project.lavoratori.length > 3 && (
                                                <span className="text-[10px] text-slate-500 font-semibold pl-1">+{project.lavoratori.length - 3}</span>
                                            )}
                                        </div>
                                        <Link 
                                            href={`/projects/${project.id}`} 
                                            className="px-3 py-1.5 bg-slate-50 hover:bg-[#003F61] text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                                        >
                                            Scheda Cantiere <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View (Table) */
                <div className="bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Cantiere / Codice</th>
                                <th className="px-4 py-3">Committente</th>
                                <th className="px-4 py-3">Stato</th>
                                <th className="px-4 py-3">Località</th>
                                <th className="px-4 py-3">Avvio</th>
                                <th className="px-4 py-3 text-right">Budget</th>
                                <th className="px-4 py-3 text-right">Margine</th>
                                <th className="px-4 py-3 text-center">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredProjects.map((project) => {
                                const { margine, perc, costi } = calcMargine(project);
                                const isPos = margine >= 0;

                                return (
                                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <Link href={`/projects/${project.id}`} className="font-bold text-slate-900 hover:text-[#003F61]">
                                                {project.name}
                                            </Link>
                                            <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                                                PRJ-{String(project.number || 0).padStart(3, '0')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 font-medium">
                                            {project.client.name}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                                project.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {project.status === 'ONGOING' ? 'In Corso' : 'Archiviato'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 text-xs">
                                            {project.citta || '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 text-xs">
                                            {new Date(project.startDate).toLocaleDateString('it-IT')}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                                            {project.budget ? `€ ${project.budget.toLocaleString('it-IT')}` : '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {costi > 0 ? (
                                                <span className={`font-bold text-xs ${isPos ? 'text-emerald-700' : 'text-red-600'}`}>
                                                    {isPos ? '+' : ''}{perc.toFixed(1)}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <Link 
                                                href={`/projects/${project.id}`} 
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                                            >
                                                Apri <ChevronRight size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="bg-white border border-slate-200 p-12 text-center">
                    <Activity size={36} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessuna commessa trovata</p>
                    <p className="text-xs text-slate-500 mt-1">Nessun cantiere corrisponde ai filtri selezionati o al termine di ricerca.</p>
                </div>
            )}

            {/* Creation Wizard SlideOver */}
            <SlideOver 
                isOpen={isWizardOpen} 
                onClose={() => setIsWizardOpen(false)} 
                title={<div className="text-lg font-bold text-slate-900 tracking-tight">Nuovo Cantiere</div>}
            >
                <div className="pb-10">
                    <ProjectWizard onSuccess={() => setIsWizardOpen(false)} />
                </div>
            </SlideOver>
        </div>
    );
}
