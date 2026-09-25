'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, Search, TrendingUp, User, MapPin, 
    Phone, Mail, Calendar, Target, 
    Trash2, CheckCircle2, 
    Clock, Filter, LayoutGrid, List
} from 'lucide-react';
import { createLead, updateLeadStatus, deleteLead } from '../lead-actions';
import SlideOver from '@/components/SlideOver';

type Lead = {
    id: string;
    name: string;
    clientName: string | null;
    clientEmail: string | null;
    clientPhone: string | null;
    address: string | null;
    city: string | null;
    status: string;
    level: number;
    xp: number;
    stagnationAlert: boolean;
    source: string | null;
    workType: string | null;
    estimatedBudget: number | null;
    surveyDate: Date | null;
    notes: string | null;
    createdAt: Date;
};

type Props = {
    leads: Lead[];
    stats: {
        total: number;
        open: number;
        potentialBudget: number;
        won: number;
    };
    isAdmin: boolean;
    user: {
      name: string | null;
      totalXp: number;
      rank: string;
    };
};

const STAGES = [
    { key: 'NEW', label: 'Nuovi Lead', color: 'border-slate-300' },
    { key: 'CONTACTED', label: 'Contattati', color: 'border-blue-400' },
    { key: 'SURVEY_SCHEDULED', label: 'Sopralluogo', color: 'border-amber-400' },
    { key: 'QUOTED', label: 'Preventivato', color: 'border-purple-400' },
    { key: 'WON', label: 'Contratto Chiuso', color: 'border-emerald-500' }
];

export default function LeadsClient({ leads, stats, isAdmin }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'BOARD' | 'TABLE'>('BOARD');
    const [isPending, startTransition] = useTransition();

    const handleStatusUpdate = (id: string, status: string) => {
        startTransition(async () => {
            await updateLeadStatus(id, status);
        });
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (l.clientName && l.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (l.city && l.city.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusLabels: Record<string, string> = {
        'NEW': 'Nuovo',
        'CONTACTED': 'Contattato',
        'SURVEY_SCHEDULED': 'Sopralluogo',
        'QUOTED': 'Preventivato',
        'WON': 'Vinto',
        'LOST': 'Perso'
    };

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* 1. Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="h-2 w-2 bg-[#003F61]" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            CRM & Pipeline Commerciale
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
                        Opportunità & Trattative Commerciali
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitoraggio lead, sopralluoghi tecnici e avanzamento delle offerte contrattuali.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16} /> Nuova Trattativa
                    </button>
                </div>
            </div>

            {/* 2. KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Budget Potenziale</span>
                        <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
                            <Target size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61]">
                            € {stats.potentialBudget.toLocaleString('it-IT')}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Valore pipeline attiva</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Trattative Aperte</span>
                        <div className="p-2 bg-blue-50 border border-blue-100 text-[#003F61]">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            {stats.open}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Lead in corso di negoziazione</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Contratti Chiusi</span>
                        <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-700">
                            {stats.won}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Trattative convertite in commesse</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Tasso di Chiusura</span>
                        <div className="p-2 bg-amber-50 border border-amber-100 text-amber-700">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61]">
                            {stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0}%
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Tasso medio di conversione</div>
                    </div>
                </div>
            </div>

            {/* 3. Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cerca per trattativa, cliente o città..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003F61]"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 px-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 uppercase focus:outline-none focus:border-[#003F61]"
                    >
                        <option value="ALL">TUTTI GLI STATI</option>
                        {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex border border-slate-200">
                        <button
                            onClick={() => setViewMode('BOARD')}
                            className={`p-2 transition-colors ${
                                viewMode === 'BOARD'
                                    ? 'bg-[#003F61] text-white'
                                    : 'bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                            title="Vista Pipeline"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('TABLE')}
                            className={`p-2 transition-colors ${
                                viewMode === 'TABLE'
                                    ? 'bg-[#003F61] text-white'
                                    : 'bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                            title="Vista Tabella"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Content */}
            {viewMode === 'BOARD' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
                    {STAGES.map((stage) => {
                        const stageLeads = filteredLeads.filter(l => l.status === stage.key);
                        return (
                            <div key={stage.key} className="bg-slate-100 border border-slate-200 flex flex-col min-h-[500px]">
                                <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        {stage.label}
                                    </span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                        {stageLeads.length}
                                    </span>
                                </div>

                                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                                    {stageLeads.map((lead) => (
                                        <div key={lead.id} className="bg-white border border-slate-200 p-3 hover:border-slate-400 transition-colors">
                                            <h4 className="font-bold text-xs text-slate-900 mb-1 leading-tight">{lead.name}</h4>
                                            {lead.clientName && (
                                                <p className="text-[11px] text-slate-600 flex items-center gap-1 mb-1">
                                                    <User size={11} className="text-slate-400" /> {lead.clientName}
                                                </p>
                                            )}
                                            {lead.city && (
                                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-2">
                                                    <MapPin size={11} className="text-slate-400" /> {lead.city}
                                                </p>
                                            )}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                <span className="text-xs font-bold text-[#003F61]">
                                                    € {lead.estimatedBudget?.toLocaleString('it-IT') || '—'}
                                                </span>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                    className="text-[10px] font-bold uppercase bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-slate-700"
                                                >
                                                    {Object.entries(statusLabels).map(([val, label]) => (
                                                        <option key={val} value={val}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {stageLeads.length === 0 && (
                                        <div className="p-4 text-center text-xs text-slate-400 italic">
                                            Nessuna trattativa
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="py-3 px-4">Trattativa</th>
                                <th className="py-3 px-4">Stato</th>
                                <th className="py-3 px-4">Contatto</th>
                                <th className="py-3 px-4">Ubicazione</th>
                                <th className="py-3 px-4 text-right">Budget Stimato</th>
                                <th className="py-3 px-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-900">{lead.name}</div>
                                        <div className="text-[11px] text-slate-500">{lead.source || 'Lead diretto'}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-100 text-slate-700 border-slate-200">
                                            {statusLabels[lead.status] || lead.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-slate-600">
                                        <div>{lead.clientName || '—'}</div>
                                        <div className="text-slate-400">{lead.clientPhone || lead.clientEmail || ''}</div>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-slate-600">
                                        {lead.city || '—'}
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                                        € {lead.estimatedBudget?.toLocaleString('it-IT') || '0'}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                                className="text-xs bg-slate-50 border border-slate-200 px-2 py-1 font-semibold"
                                            >
                                                {Object.entries(statusLabels).map(([val, label]) => (
                                                    <option key={val} value={val}>{label}</option>
                                                ))}
                                            </select>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => confirm('Eliminare questo lead?') && startTransition(async () => { await deleteLead(lead.id); })}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SlideOver for New Lead */}
            <SlideOver
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title="NUOVA TRATTATIVA COMMERCIALE"
            >
                <form
                    action={async (fd) => {
                        await createLead(fd);
                        setIsFormOpen(false);
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Nome Trattativa *
                        </label>
                        <input
                            name="name"
                            required
                            placeholder="Es: Ristrutturazione Villa Rossi"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Nome Committente
                            </label>
                            <input
                                name="clientName"
                                placeholder="Mario Rossi"
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Telefono
                            </label>
                            <input
                                name="phone"
                                placeholder="+39 333..."
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="cliente@example.com"
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Origine Lead
                            </label>
                            <select
                                name="source"
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            >
                                <option value="WEB">Sito Web</option>
                                <option value="SOCIAL">Social Media</option>
                                <option value="REFERRAL">Passaparola</option>
                                <option value="FIERA">Evento/Fiera</option>
                                <option value="ALTRO">Altro</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Città
                            </label>
                            <input
                                name="city"
                                placeholder="Milano"
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Budget Stimato (€)
                            </label>
                            <input
                                name="estimatedBudget"
                                type="number"
                                placeholder="50000"
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider"
                        >
                            Salva Trattativa
                        </button>
                    </div>
                </form>
            </SlideOver>
        </div>
    );
}
