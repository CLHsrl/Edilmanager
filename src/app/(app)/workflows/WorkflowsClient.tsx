'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    Plus, CheckCircle, Clock, AlertCircle, LayoutGrid, 
    Table as TableIcon, Calendar, User as UserIcon, HardHat,
    ArrowRight, Filter, Search
} from 'lucide-react';
import WorkerCalendar from './components/WorkerCalendar';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    roleScope: string | null;
    dueDate: Date | null;
    assignedTo?: { id: string; name: string | null } | null;
    lavoratore?: { id: string; nome: string; cognome: string | null } | null;
}

interface Props {
    initialTasks: Task[];
    users: any[];
    lavoratori: any[];
}

export default function WorkflowsClient({ initialTasks, users, lavoratori }: Props) {
    const [view, setView] = useState<'board' | 'table' | 'calendar'>('calendar');

    return (
        <div className="flex flex-col gap-8 pb-20 reveal">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                <div>
                    <div className="page-label">
                        <Calendar className="text-blue-600" size={14} />
                        Workflow Operativi & Task
                    </div>
                    <h1 className="page-title text-4xl">Operational Stream</h1>
                    <p className="page-description text-base font-medium text-slate-500">Gestione attività e stato avanzamento commesse in tempo reale</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-1.5 flex shadow-sm">
                        {[
                            { id: 'board', icon: LayoutGrid },
                            { id: 'table', icon: TableIcon },
                            { id: 'calendar', icon: Calendar }
                        ].map((v) => (
                            <button 
                                key={v.id}
                                onClick={() => setView(v.id as any)}
                                className={`p-3 rounded-xl transition-all ${view === v.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <v.icon size={20} />
                            </button>
                        ))}
                    </div>

                    <Link href="/workflows/new" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all flex items-center gap-2 transform active:scale-95">
                        <Plus size={18} /> Nuova Attività
                    </Link>
                </div>
            </div>

            {/* Quick Stats / Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex items-center justify-between group hover:border-blue-600 transition-colors">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Totali</p>
                        <p className="text-3xl font-black text-slate-900">{initialTasks.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Search size={20} />
                    </div>
                </div>
                {['TODO', 'IN_PROGRESS', 'DONE'].map(s => {
                    const count = initialTasks.filter(t => t.status === s).length;
                    return (
                        <div key={s} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm group hover:border-slate-900 transition-colors">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s === 'DONE' ? 'Completati' : s === 'IN_PROGRESS' ? 'In Corso' : 'Pendenti'}</p>
                            <p className="text-3xl font-black text-slate-900">{count}</p>
                        </div>
                    );
                })}
            </div>

            {view === 'calendar' && (
                <WorkerCalendar tasks={initialTasks} lavoratori={lavoratori} />
            )}

            {view === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                        <div key={status} className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 min-h-[600px] flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${status === 'TODO' ? 'bg-orange-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                    {status === 'TODO' && 'Sprint Backlog'}
                                    {status === 'IN_PROGRESS' && 'In Esecuzione'}
                                    {status === 'DONE' && 'Verificato'}
                                </h3>
                                <span className="bg-white border border-slate-200 text-slate-400 text-[10px] px-3 py-1 rounded-full font-black">
                                    {initialTasks.filter(t => t.status === status).length}
                                </span>
                            </div>

                            <div className="space-y-5 flex-1">
                                {initialTasks.filter(t => t.status === status).map(task => (
                                    <Link href={`/workflows/${task.id}`} key={task.id} className="block group">
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group-hover:border-blue-600 transition-all transform group-hover:-translate-y-1 relative overflow-hidden">
                                            {task.priority === 'HIGH' && (
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                                            )}
                                            
                                            <div className="flex justify-between items-start mb-3 relative z-10">
                                                <h4 className="font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">{task.title}</h4>
                                                {task.priority === 'HIGH' && (
                                                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-red-100">Flash</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed relative z-10">{task.description || "Nessun dettaglio aggiuntivo disponibile."}</p>

                                            <div className="pt-6 border-t border-slate-50 flex flex-col gap-4 relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${task.lavoratore ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                            {task.lavoratore ? <HardHat size={16} /> : <UserIcon size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                                                                {task.assignedTo?.name || (task.lavoratore ? `${task.lavoratore.nome} ${task.lavoratore.cognome}` : 'System')}
                                                            </p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Assegnato</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-300" />
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('it-IT') : 'Pending'}
                                                    </div>
                                                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px]">{task.roleScope || 'GLOBAL'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {initialTasks.filter(t => t.status === status).length === 0 && (
                                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-10">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Colonna Vuota</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'table' && (
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-10 py-6">Missione / Dettagli</th>
                                <th className="px-6 py-6">Priorità</th>
                                <th className="px-6 py-6">Responsabile</th>
                                <th className="px-6 py-6 text-center">Deadline</th>
                                <th className="px-10 py-6 text-right">Stato Attuale</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {initialTasks.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Flusso di lavoro vuoto.</td></tr>
                            ) : initialTasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <Link href={`/workflows/${task.id}`} className="block">
                                            <p className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors leading-none">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium mt-1.5 line-clamp-1">{task.description || "—"}</p>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                                                task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                                                task.priority === 'LOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border shadow-sm ${task.lavoratore ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                {task.lavoratore ? <HardHat size={18} /> : <UserIcon size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">
                                                    {task.assignedTo?.name || (task.lavoratore ? `${task.lavoratore.nome} ${task.lavoratore.cognome}` : 'System')}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {task.lavoratore ? 'Field Force' : 'HQ Staff'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center text-sm font-black text-slate-900 tracking-tighter">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('it-IT') : <span className="text-slate-200">—</span>}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end">
                                            {task.status === 'DONE' && <span className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100"><CheckCircle size={14} /> Completato</span>}
                                            {task.status === 'IN_PROGRESS' && <span className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100"><Clock size={14} className="animate-pulse" /> In Corso</span>}
                                            {task.status === 'TODO' && <span className="inline-flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100"><AlertCircle size={14} /> Da Fare</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

