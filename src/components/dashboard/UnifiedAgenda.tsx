'use client';

import { Calendar, AlertTriangle, FileText, CheckCircle2, MapPin, HardHat, TrendingDown, TrendingUp } from 'lucide-react';

interface AgendaItem {
    id: string;
    type?: 'SURVEY' | 'MAINTENANCE';
    category?: 'FINANCE' | 'COMPLIANCE';
    title: string;
    date: Date;
    sub?: string;
    amount?: number;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface UnifiedAgendaProps {
    items: AgendaItem[];
}

export default function UnifiedAgenda({ items }: UnifiedAgendaProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" /> Agenda & Scadenze Unificate
                </h3>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {items.length} Eventi
                </span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-30 grayscale">
                        <CheckCircle2 size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Nessuna scadenza imminente</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {items.map((item) => {
                            const isPast = new Date(item.date) < today;
                            const isFinancial = item.category === 'FINANCE';
                            const isComplance = item.category === 'COMPLIANCE';
                            const isSurvey = item.type === 'SURVEY';

                            return (
                                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors group relative">
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 ${
                                        item.priority === 'HIGH' ? 'bg-red-500' : isFinancial ? 'bg-blue-600' : 'bg-emerald-500'
                                    } opacity-0 group-hover:opacity-100 transition-all rounded-r-full shadow-lg`}></div>
                                    
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                                    isFinancial ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                    isComplance ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-purple-50 text-purple-600 border-purple-100'
                                                }`}>
                                                    {isFinancial ? 'Finanza' : isComplance ? 'Sicurezza' : 'Sopralluogo'}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isPast ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">
                                                {item.title}
                                            </h4>
                                            {item.sub && (
                                                <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                                    {isSurvey ? <MapPin size={12} className="text-slate-300" /> : <HardHat size={12} className="text-slate-300" />} {item.sub}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            {item.amount && (
                                                <p className="text-base font-black text-slate-900 tracking-tighter">
                                                    € {item.amount.toLocaleString('it-IT')}
                                                </p>
                                            )}
                                            {item.priority === 'HIGH' && (
                                                <div className="flex items-center justify-end text-red-600 gap-1 mt-1">
                                                    <AlertTriangle size={12} className="animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Urgente</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-gray-100">
                <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                    Visualizza Calendario Completo
                </button>
            </div>
        </div>
    );
}
