'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    Plus, CheckCircle, Clock, AlertCircle, LayoutGrid, 
    Table as TableIcon, Calendar, User as UserIcon, HardHat,
    ArrowRight, ClipboardList, CheckCircle2, ChevronRight
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
    const [view, setView] = useState<'calendar' | 'board' | 'table'>('calendar');

    const todoCount = initialTasks.filter(t => t.status === 'TODO').length;
    const inProgressCount = initialTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneCount = initialTasks.filter(t => t.status === 'DONE').length;

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <ClipboardList size={14} className="text-[#003F61]" />
                        <span>Operazioni / Gestione Flussi di Lavoro</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Workflow & Attività</h1>
                    <p className="text-sm text-slate-500 mt-1">Pianificazione task di cantiere, scadenze operative e assegnazione maestranze.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex border border-slate-200">
                        <button 
                            onClick={() => setView('calendar')}
                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                                view === 'calendar' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Calendar size={14} /> Calendario
                        </button>
                        <button 
                            onClick={() => setView('board')}
                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border-l border-slate-200 ${
                                view === 'board' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <LayoutGrid size={14} /> Kanban
                        </button>
                        <button 
                            onClick={() => setView('table')}
                            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border-l border-slate-200 ${
                                view === 'table' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <TableIcon size={14} /> Tabella
                        </button>
                    </div>

                    <Link 
                        href="/workflows/new" 
                        className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Plus size={16} /> Nuova Attività
                    </Link>
                </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Attività Totali</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <ClipboardList size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{initialTasks.length}</div>
                        <div className="text-xs text-slate-500 mt-1">Task registrati a sistema</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Da Iniziare</span>
                        <div className="p-2 bg-slate-50 text-amber-600 border border-slate-100">
                            <AlertCircle size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{todoCount}</div>
                        <div className="text-xs text-slate-500 mt-1">Attività in coda di avvio</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">In Esecuzione</span>
                        <div className="p-2 bg-slate-50 text-blue-600 border border-slate-100">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600 tracking-tight">{inProgressCount}</div>
                        <div className="text-xs text-slate-500 mt-1">Lavori attualmente in corso</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Completate</span>
                        <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-600 tracking-tight">{doneCount}</div>
                        <div className="text-xs text-slate-500 mt-1">Task collaudati e chiusi</div>
                    </div>
                </div>
            </div>

            {/* View Switching Content */}
                        {view === 'calendar' && (
                <WorkerCalendar tasks={initialTasks} lavoratori={lavoratori} />
            )}

            {view === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map(status => {
                        const statusTasks = initialTasks.filter(t => t.status === status);
                        const label = status === 'TODO' ? 'Da Fare / In Coda' : status === 'IN_PROGRESS' ? 'In Esecuzione' : 'Completate';
                        const badgeColor = status === 'TODO' ? 'bg-amber-100 text-amber-800' : status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800';

                        return (
                            <div key={status} className="bg-white border border-slate-200 flex flex-col">
                                <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                                        {label}
                                    </h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${badgeColor}`}>
                                        {statusTasks.length}
                                    </span>
                                </div>

                                <div className="p-3 space-y-3 flex-1 bg-slate-50/30">
                                    {statusTasks.map(task => (
                                        <Link href={`/workflows/${task.id}`} key={task.id} className="block group">
                                            <div className="bg-white border border-slate-200 p-4 hover:border-slate-400 transition-colors space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#003F61] transition-colors">
                                                        {task.title}
                                                    </h4>
                                                    {task.priority === 'HIGH' && (
                                                        <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 uppercase shrink-0">
                                                            Alta
                                                        </span>
                                                    )}
                                                </div>
                                                {task.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                                                )}

                                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                                    <span className="font-medium text-[11px] truncate">
                                                        {task.assignedTo?.name || (task.lavoratore ? `${task.lavoratore.nome} ${task.lavoratore.cognome}` : 'Non assegnato')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('it-IT') : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {statusTasks.length === 0 && (
                                        <div className="py-8 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200">
                                            Nessun task in questa colonna
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {view === 'table' && (
                <div className="bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Attività / Titolo</th>
                                <th className="px-4 py-3">Priorità</th>
                                <th className="px-4 py-3">Assegnato A</th>
                                <th className="px-4 py-3">Scadenza</th>
                                <th className="px-4 py-3 text-center">Stato</th>
                                <th className="px-4 py-3 text-center">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {initialTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                                        Nessuna attività registrata
                                    </td>
                                </tr>
                            ) : (
                                initialTasks.map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <Link href={`/workflows/${task.id}`} className="font-bold text-slate-900 block hover:text-[#003F61]">
                                                {task.title}
                                            </Link>
                                            {task.description && (
                                                <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                                task.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                                                task.priority === 'LOW' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {task.priority === 'HIGH' ? 'Alta' : task.priority === 'LOW' ? 'Bassa' : 'Normale'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">
                                            {task.assignedTo?.name || (task.lavoratore ? `${task.lavoratore.nome} ${task.lavoratore.cognome}` : '—')}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-slate-600">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('it-IT') : '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                                task.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {task.status === 'DONE' ? 'Completato' : task.status === 'IN_PROGRESS' ? 'In Corso' : 'Da Fare'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <Link 
                                                href={`/workflows/${task.id}`} 
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                                            >
                                                Apri <ChevronRight size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
