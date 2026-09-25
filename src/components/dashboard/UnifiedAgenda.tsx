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
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#003F61]" />
                    <h3 className="text-base font-semibold text-[#003F61]">Agenda & Scadenze</h3>
                </div>
                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 border border-slate-200">
                    {items.length} Eventi
                </span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                        <CheckCircle2 size={36} className="mb-2 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600">Nessuna scadenza imminente</p>
                        <p className="text-xs text-slate-400 mt-0.5">Tutti gli adempimenti tecnici sono completati</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map((item) => {
                            const isPast = new Date(item.date) < today;
                            const isFinancial = item.category === 'FINANCE';
                            const isComplance = item.category === 'COMPLIANCE';
                            const isSurvey = item.type === 'SURVEY';

                            return (
                                <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`text-[11px] font-medium px-2 py-0.5 border ${
                                                    isFinancial ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                    isComplance ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-purple-50 text-purple-700 border-purple-200'
                                                }`}>
                                                    {isFinancial ? 'Finanza' : isComplance ? 'Sicurezza' : 'Sopralluogo'}
                                                </span>
                                                <span className={`text-xs font-medium ${isPast ? 'text-rose-600' : 'text-slate-500'}`}>
                                                    {new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                                                {item.title}
                                            </h4>
                                            {item.sub && (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                                                    {isSurvey ? <MapPin size={13} className="text-slate-400 shrink-0" /> : <HardHat size={13} className="text-slate-400 shrink-0" />} {item.sub}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            {item.amount && (
                                                <p className="text-sm font-bold text-slate-900">
                                                    € {item.amount.toLocaleString('it-IT')}
                                                </p>
                                            )}
                                            {item.priority === 'HIGH' && (
                                                <div className="flex items-center justify-end text-rose-600 gap-1 mt-1">
                                                    <AlertTriangle size={13} />
                                                    <span className="text-[11px] font-semibold">Urgente</span>
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

            <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button className="w-full text-center text-xs font-semibold text-[#003F61] hover:underline transition-colors py-1">
                    Visualizza Calendario Completo →
                </button>
            </div>
        </div>
    );
}
