'use client';

import { useState, useMemo } from 'react';
import { 
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
    Clock, CheckCircle, AlertCircle, HardHat, User as UserIcon
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    assignedTo?: { id: string; name: string | null } | null;
    lavoratore?: { id: string; nome: string; cognome: string | null } | null;
    lavoratoreId?: string | null;
    assignedToId?: string | null;
}

interface Props {
    tasks: Task[];
    lavoratori: any[];
}

export default function WorkerCalendar({ tasks, lavoratori }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate Week Days
    const weekDays = useMemo(() => {
        const start = new Date(currentDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, [currentDate]);

    const navigateWeek = (direction: number) => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(next);
    };

    const resetToToday = () => setCurrentDate(new Date());

    // Filter tasks for the current week and group them by worker/user
    const calendarData = useMemo(() => {
        const data: Record<string, Record<number, Task[]>> = {};

        tasks.forEach(task => {
            if (!task.dueDate) return;
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0,0,0,0);

            const dayIndex = weekDays.findIndex(d => d.getTime() === taskDate.getTime());
            if (dayIndex === -1) return;

            // Priority: Lavoratore, then User
            const assigneeId = (task as any).lavoratoreId || (task as any).assignedToId || 'unassigned';
            
            if (!data[assigneeId]) data[assigneeId] = {};
            if (!data[assigneeId][dayIndex]) data[assigneeId][dayIndex] = [];
            data[assigneeId][dayIndex].push(task);
        });

        return data;
    }, [tasks, weekDays]);

    // Unique list of assignees present in the current view or all lavoratori
    const activeAssignees = useMemo(() => {
        const list: any[] = [...lavoratori.map(l => ({ ...l, type: 'WORKER' }))];
        
        // Add users if they have tasks this week and aren't already represented
        tasks.forEach(t => {
            if (t.assignedTo && !list.find(item => item.id === t.assignedTo?.id)) {
                list.push({ ...t.assignedTo, nome: t.assignedTo.name, type: 'USER' });
            }
        });

        return list;
    }, [lavoratori, tasks]);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
            {/* Calendar Header */}
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center">
                        <CalendarIcon size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                            {weekDays[0].toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Pianificazione Risorse & Squadre
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button onClick={() => navigateWeek(-1)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-600">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={resetToToday} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-slate-50">
                        Oggi
                    </button>
                    <button onClick={() => navigateWeek(1)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                    {/* Grid Days Header */}
                    <div className="grid grid-cols-[300px_repeat(7,1fr)] border-b border-slate-100 bg-white sticky top-0 z-10">
                        <div className="p-6 bg-slate-50/50 border-r border-slate-100 font-black text-[10px] uppercase text-slate-400 tracking-widest flex items-center">
                            Risorsa Operativa
                        </div>
                        {weekDays.map((day, i) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            return (
                                <div key={i} className={`p-6 text-center border-r border-slate-50 last:border-r-0 transition-colors ${
                                    isToday ? 'bg-blue-50/30' : ''
                                }`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                        {day.toLocaleDateString('it-IT', { weekday: 'short' })}
                                    </p>
                                    <p className={`text-2xl font-black tracking-tighter ${
                                        isToday ? 'text-blue-600' : 'text-slate-900'
                                    }`}>
                                        {day.getDate()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Rows (Resources) */}
                    <div className="divide-y divide-slate-50">
                        {activeAssignees.map(resource => (
                            <div key={resource.id} className="grid grid-cols-[300px_repeat(7,1fr)] group hover:bg-slate-50/20 transition-colors">
                                <div className="p-6 border-r border-slate-100 flex items-center gap-4 bg-white group-hover:bg-slate-50/50 transition-colors">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs border shadow-sm transition-transform group-hover:scale-110 ${
                                        resource.type === 'WORKER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-900 text-white border-slate-900'
                                    }`}>
                                        {resource.nome?.[0] || resource.name?.[0]}{resource.cognome?.[0] || resource.name?.[1] || ''}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-slate-900 uppercase tracking-tighter text-sm truncate">
                                            {resource.nome} {resource.cognome || ''}
                                        </p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                            {resource.type === 'WORKER' ? <HardHat size={12} className="text-blue-500" /> : <UserIcon size={12} className="text-slate-500" />}
                                            {resource.type === 'WORKER' ? 'Cantiere' : 'HQ Staff'}
                                        </p>
                                    </div>
                                </div>

                                {weekDays.map((_, dayIndex) => {
                                    const dayTasks = calendarData[resource.id]?.[dayIndex] || [];
                                    const isToday = weekDays[dayIndex].toDateString() === new Date().toDateString();
                                    return (
                                        <div key={dayIndex} className={`p-3 border-r border-slate-50 last:border-r-0 min-h-[120px] flex flex-col gap-3 ${
                                            isToday ? 'bg-blue-50/5' : ''
                                        }`}>
                                            {dayTasks.map(task => (
                                                <div 
                                                    key={task.id}
                                                    className={`p-3 rounded-2xl border shadow-sm text-left hover:shadow-md transition-all cursor-pointer group/task relative overflow-hidden ${
                                                        task.priority === 'HIGH' ? 'bg-red-50 border-red-100 text-red-900' :
                                                        task.status === 'DONE' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                                        'bg-white border-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    <p className="text-[10px] font-black uppercase leading-tight line-clamp-2 tracking-tight">
                                                        {task.title}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-black/5">
                                                        <div className="flex items-center gap-1.5">
                                                            {task.status === 'DONE' ? <CheckCircle size={12} className="text-emerald-600" /> : 
                                                             task.status === 'IN_PROGRESS' ? <Clock size={12} className="text-blue-600 animate-pulse" /> :
                                                             <AlertCircle size={12} className="text-orange-500" />}
                                                        </div>
                                                        <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">{task.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

