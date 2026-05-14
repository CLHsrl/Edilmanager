'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, Search, TrendingUp, User, MapPin, 
    Phone, Mail, Calendar, Target, DollarSign, 
    ChevronRight, MoreVertical, Trash2, CheckCircle2, 
    XCircle, Clock, Filter, Wand2, LayoutGrid, List, Sparkles, Trophy, Zap 
} from 'lucide-react';
import { createLead, updateLeadStatus, deleteLead } from '../lead-actions';
import SlideOver from '@/components/SlideOver';
import GlobalRankWidget from '@/components/GlobalRankWidget';
import RankUpModal from '@/components/RankUpModal';
import CRMMissionBoard from './CRMMissionBoard';
import ContractBossFight from './ContractBossFight';

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
    }
};

export default function LeadsClient({ leads, stats, isAdmin, user }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'BOARD' | 'TABLE'>('BOARD');
    const [isPending, startTransition] = useTransition();
    const [bossFightLead, setBossFightLead] = useState<Lead | null>(null);
    const [rankUpData, setRankUpData] = useState<{ old: string, new: string } | null>(null);
    const [prevRank, setPrevRank] = useState(user?.rank || 'GARZONE DI CANTIERE');

    // Detect Rank Up
    if (user?.rank && user.rank !== prevRank) {
      setRankUpData({ old: prevRank, new: user.rank });
      setPrevRank(user.rank);
    }

    const handleStatusUpdate = (id: string, status: string) => {
      if (status === 'WON') {
        const lead = leads.find(l => l.id === id);
        if (lead) {
          setBossFightLead(lead);
          return;
        }
      }
      startTransition(async () => { await updateLeadStatus(id, status); });
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (l.clientName && l.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors: Record<string, string> = {
        'NEW': 'bg-blue-50 text-blue-700 border-blue-100',
        'CONTACTED': 'bg-purple-50 text-purple-700 border-purple-100',
        'SURVEY_SCHEDULED': 'bg-orange-50 text-orange-700 border-orange-100',
        'QUOTED': 'bg-yellow-50 text-yellow-700 border-yellow-100',
        'WON': 'bg-green-50 text-green-700 border-green-100',
        'LOST': 'bg-red-50 text-red-700 border-red-100'
    };

    const statusLabels: Record<string, string> = {
        'NEW': 'Nuovo',
        'CONTACTED': 'Contattato',
        'SURVEY_SCHEDULED': 'Sopralluogo',
        'QUOTED': 'Preventivato',
        'WON': 'Vinto',
        'LOST': 'Perso'
    };

    return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header (Gamified) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <Sparkles className="text-blue-600" size={14} />
            Opportunity Pipeline & CRM Gamification
          </div>
          <h1 className="page-title">Campaign Conquest</h1>
          <p className="page-description">Chiudi contratti, guadagna XP e scala le vette mondiali del CRM</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                    onClick={() => setViewMode('BOARD')}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tight transition-all ${viewMode === 'BOARD' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <LayoutGrid size={14} /> Mission Board
                </button>
                <button 
                    onClick={() => setViewMode('TABLE')}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tight transition-all ${viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List size={14} /> Lista Lead
                </button>
            </div>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="action-btn-primary"
            >
                <Plus size={16} /> Lancia Nuova Missione
            </button>
        </div>
      </div>

            {/* Top Stats Area - Gamification Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlobalRankWidget user={user} />
                
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPI 1 */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Target size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tesoro Potenziale</p>
                        </div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">€{stats.potentialBudget.toLocaleString('it-IT')}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Valore missioni attive</p>
                    </div>

                    {/* KPI 2 */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <TrendingUp size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Win Rate</p>
                        </div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0}%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Tasso di conquista globale</p>
                    </div>

                    {/* KPI 3 */}
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:shadow-blue-900/20 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <Trophy size={20} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contratti Chiusi</p>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tighter">{stats.won}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Missioni completate con successo</p>
                    </div>
                </div>
            </div>

            {/* View Switching */}
            {viewMode === 'BOARD' ? (
                <CRMMissionBoard leads={leads} onStatusUpdate={handleStatusUpdate} />
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Cerca tradttative nel database..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter size={16} className="text-gray-400 ml-2" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none transition-all"
                            >
                                <option value="ALL">Tutti gli stati</option>
                                {Object.entries(statusLabels).map(([val, label]) => (
                                    <option key={val} value={val}>{label.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-gray-50/50 border-b border-gray-50">
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-8 py-5">Opportunità</th>
                                    <th className="px-8 py-5">Livello</th>
                                    <th className="px-8 py-5">Contatto</th>
                                    <th className="px-8 py-5">Dettagli</th>
                                    <th className="px-8 py-5">Budget</th>
                                    <th className="px-8 py-5 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${statusColors[lead.status].replace('text-', 'bg-').replace('border-', 'text-')}`}>
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase leading-tight">{lead.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{lead.source || 'Lead standard'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase border ${statusColors[lead.status]}`}>
                                                    Lvl {lead.level}: {statusLabels[lead.status]}
                                                </span>
                                                <span className="text-[9px] font-black text-blue-600">{lead.xp} XP</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                                                    <User size={12} className="text-gray-300" /> {lead.clientName || 'N/A'}
                                                </span>
                                                <span className="text-gray-400 flex items-center gap-1.5">
                                                    <Mail size={12} className="text-gray-300" /> {lead.clientEmail || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-tighter">
                                                    <MapPin size={12} className="text-gray-300" /> {lead.city || 'N/A'}
                                                </span>
                                                <span className="text-gray-400 font-bold uppercase text-[9px]">
                                                    {lead.workType || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-gray-900 leading-tight">€{lead.estimatedBudget?.toLocaleString('it-IT') || '0'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => isAdmin && confirm('Eliminare lead?') && startTransition(async () => { await deleteLead(lead.id); })}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Lead SlideOver */}
            <SlideOver 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                title="LANCIA NUOVA MISSIONE"
            >
                <form action={async (fd) => {
                    await createLead(fd);
                    setIsFormOpen(false);
                }} className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 mb-6">
                       <p className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2 animate-pulse">
                          <Zap size={14} /> Regole d'Ingaggio
                       </p>
                       <p className="text-xs font-bold text-blue-800 leading-relaxed">
                          Inserendo questa missione, inizierai il percorso al **Livello 1 (Reclutamento)**. Completa i compiti quotidiani per scalare e vincere il contratto!
                       </p>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nome Trattativa *</label>
                        <input name="name" required placeholder="Es: Ristrutturazione Attico Milano" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nome Cliente</label>
                            <input name="clientName" placeholder="Mario Rossi" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Telefono</label>
                            <input name="phone" placeholder="+39 333..." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">E-mail</label>
                            <input name="email" type="email" placeholder="cliente@example.com" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Fonte Lead</label>
                            <select name="source" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Città</label>
                            <input name="city" placeholder="Milano" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Budget Stimato (€)</label>
                            <input name="estimatedBudget" type="number" placeholder="50000" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                        </div>
                    </div>

                    <div className="pt-8">
                        <button 
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Target size={20} /> INIZIA MISSIONE
                        </button>
                    </div>
                </form>
            </SlideOver>

            {bossFightLead && (
              <ContractBossFight 
                lead={bossFightLead} 
                onWin={() => {
                  startTransition(async () => { await updateLeadStatus(bossFightLead.id, 'WON'); });
                  setBossFightLead(null);
                }}
                onCancel={() => setBossFightLead(null)}
              />
            )}

            {rankUpData && (
              <RankUpModal 
                isOpen={!!rankUpData}
                oldRank={rankUpData.old}
                newRank={rankUpData.new}
                onClose={() => setRankUpData(null)}
              />
            )}
        </div>
    );
}
