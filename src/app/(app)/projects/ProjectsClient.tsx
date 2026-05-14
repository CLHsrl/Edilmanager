'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, HardHat, CheckCircle, Clock, Search as SearchIcon, 
    TrendingUp, Wallet, CheckCircle2, ChevronRight, LayoutGrid, 
    List, ArrowRight, MapPin, Calendar, Activity
} from 'lucide-react';
import Link from 'next/link';
import { updateProjectStatus } from '../actions';
import SlideOver from '@/components/SlideOver';
import ProjectWizard from '@/components/ProjectWizard';

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
};

type SortKey = 'name' | 'startDate' | 'budget';
type SortOrder = 'asc' | 'desc';

type Props = {
    projects: Project[];
    isAdmin: boolean;
    stats: {
        activeProjects: number;
        completedProjects: number;
        totalBudget: number;
    };
};

export default function ProjectsClient({ projects, isAdmin, stats }: Props) {
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
        <div className="flex flex-col gap-8 pb-20 reveal">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                <div>
                    <div className="page-label">
                        <HardHat className="text-blue-600" size={14} />
                        Asset Operativi & Commesse
                    </div>
                    <h1 className="page-title text-4xl">Strategic Asset Ledger</h1>
                    <p className="page-description text-base font-medium text-slate-500">Monitoraggio flussi di cassa e avanzamento tecnico commesse</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsWizardOpen(true)}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 transform active:scale-95"
                    >
                        <Plus size={18} /> Nuova Commessa
                    </button>
                )}
            </div>

            {/* Strategic KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-emerald-500 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" /> Cantieri Attivi
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.activeProjects}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 italic">Capacità operativa ottimale</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-500 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <Wallet size={12} className="text-blue-500" /> Capitalizzazione
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">€ {(stats.totalBudget / 1000).toFixed(1)}k</p>
                    <p className="text-[9px] font-bold text-blue-600 uppercase mt-4 italic tracking-widest">Asset sotto gestione</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-purple-500 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <TrendingUp size={12} className="text-purple-500" /> Health Score
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">8.4<span className="text-lg text-slate-300">/10</span></p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 italic">Basato su delta budget</p>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Crescita Netta</p>
                        <p className="text-3xl font-black text-emerald-400 tracking-tighter">+12.4%</p>
                    </div>
                    <Link href="/bi" className="text-[9px] font-black text-white uppercase tracking-[0.2em] hover:text-blue-400 transition-colors flex items-center gap-2 mt-4">
                       Deep Analytics <ArrowRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full relative">
                        <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cerca missione, cliente o localizzazione..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stato Operativo</label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                        >
                            <option value="ALL">Tutti</option>
                            <option value="ONGOING">In Corso</option>
                            <option value="COMPLETED">Archiviati</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Area / Città</label>
                        <select 
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                        >
                            <option value="ALL">Qualsiasi</option>
                            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Responsabile</label>
                        <select 
                            value={employeeFilter}
                            onChange={(e) => setEmployeeFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                        >
                            <option value="ALL">Tutti</option>
                            {uniqueEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.nome} {emp.cognome}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sort Data</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer"
                        >
                            <option value="startDate">Inizio</option>
                            <option value="name">Alfabetico</option>
                            <option value="budget">Valore</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setStatusFilter('ALL'); setLocationFilter('ALL');
                                setEmployeeFilter('ALL'); setSortKey('startDate'); setSortOrder('desc');
                            }}
                            className="w-full h-[46px] border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-blue-600/20 transform hover:-translate-y-1">
                            {/* Card Header Image Placeholder / Gradient */}
                            <div className="h-32 bg-slate-900 relative p-8 flex justify-between items-start">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                                <span className={`relative z-10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md ${
                                    project.status === 'ONGOING' ? 'bg-emerald-500/80 text-white' : 'bg-slate-700/80 text-slate-300'
                                }`}>
                                    {project.status === 'ONGOING' ? 'In Corso' : 'Archiviato'}
                                </span>
                                <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center text-white">
                                    <HardHat size={20} />
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase mb-2">
                                        <Link href={`/projects/${project.id}`}>{project.name}</Link>
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={10} className="text-blue-500" /> {project.citta || 'Location non specificata'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50 mb-8">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Committente</p>
                                        <p className="text-xs font-bold text-slate-900 truncate">{project.client.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Value</p>
                                        <p className="text-xs font-black text-slate-900">€ {project.budget?.toLocaleString('it-IT') || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Launch Date</p>
                                        <p className="text-xs font-bold text-slate-900">{new Date(project.startDate).toLocaleDateString('it-IT')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Code</p>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">PRJ-{String(project.number).padStart(3, '0')}</p>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {project.lavoratori.slice(0, 4).map((l) => (
                                            <div key={l.id} className="w-8 h-8 rounded-xl bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-900 uppercase shadow-sm" title={`${l.nome} ${l.cognome}`}>
                                                {l.nome[0]}
                                            </div>
                                        ))}
                                        {project.lavoratori.length > 4 && (
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                                                +{project.lavoratori.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <Link 
                                        href={`/projects/${project.id}`} 
                                        className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all border border-slate-100"
                                    >
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-10 py-6">Missione / Asset</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Location</th>
                                <th className="px-6 py-6">Staff</th>
                                <th className="px-6 py-6">Timeline</th>
                                <th className="px-6 py-6">Budget</th>
                                <th className="px-10 py-6 text-right">Dettagli</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <p className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors">
                                            <Link href={`/projects/${project.id}`}>{project.name}</Link>
                                        </p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">CODE: PRJ-{String(project.number).padStart(3, '0')}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                                            project.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                            <MapPin size={14} className="text-blue-500" /> {project.citta || 'HQ'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex -space-x-1.5">
                                            {project.lavoratori.slice(0, 3).map((l) => (
                                                <div key={l.id} className="w-8 h-8 rounded-xl bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white uppercase shadow-sm">
                                                    {l.nome[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-black text-slate-900 tracking-tighter">
                                        {new Date(project.startDate).toLocaleDateString('it-IT')}
                                    </td>
                                    <td className="px-6 py-6 font-black text-slate-900 text-sm">
                                        {project.budget ? `€ ${project.budget.toLocaleString('it-IT')}` : <span className="text-slate-200">—</span>}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <Link href={`/projects/${project.id}`} className="inline-flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100">
                                            <ChevronRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">Nessuna commessa rilevata</p>
                    <p className="text-xs text-slate-400 mt-2">Modifica i criteri di ricerca per sbloccare i dati.</p>
                </div>
            )}

            {/* Creation Wizard SlideOver */}
            <SlideOver 
                isOpen={isWizardOpen} 
                onClose={() => setIsWizardOpen(false)} 
                title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">🚀 <span className="italic">Nuovo Cantiere</span></div>}
            >
                <div className="pb-10">
                    <ProjectWizard onSuccess={() => setIsWizardOpen(false)} />
                </div>
            </SlideOver>
        </div>
    );
}

