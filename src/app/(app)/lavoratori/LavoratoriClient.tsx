'use client';

import { useState, useTransition } from 'react';
import { createLavoratore, updateLavoratore, deleteLavoratore } from '@/app/(app)/lavoratori-actions';
import { 
  Users, Plus, Search, Phone, Mail, HardHat, 
  Trash2, Edit, X, Clock, Umbrella, FileCheck, 
  ChevronRight, ArrowUpRight, AlertCircle,
  LayoutGrid, List, TrendingUp, UserCheck, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-mock';
import SlideOver from '@/components/SlideOver';
import HRDashboard from './components/HRDashboard';
import ClockInCard from './components/ClockInCard';

interface Project { id: string; name: string }

interface Lavoratore {
  id: string;
  nome: string;
  cognome: string | null;
  tipo: string;
  costoOrario: number | null;
  telefono: string | null;
  email: string | null;
  dataAssunzione?: string | Date | null;
  livello?: string | null;
  ferieAnnuetot?: number;
  projects: Project[];
  presenze?: any[];
  assenze?: any[];
  documenti?: any[];
  _count: { rapportini: number }
}

type Props = {
  lavoratori: Lavoratore[];
  projects: Project[];
  stats: {
    total: number;
    dipendenti: number;
    inServizio: number;
    documentiInScadenza: number;
  };
};

export default function LavoratoriClient({ lavoratori, projects, stats }: Props) {
  const { role } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_SERVICE' | 'OFF_SERVICE'>('ALL');
  const [sortKey, setSortKey] = useState<'name' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals Visibility
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hrViewLavoratore, setHrViewLavoratore] = useState<Lavoratore | null>(null);
  
  // Form State
  const [editingLavoratore, setEditingLavoratore] = useState<Lavoratore | null>(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  
  // Advanced Filtering Logic
  const filtered = lavoratori.filter(l => {
    const fullName = `${l.nome} ${l.cognome || ''}`.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase());
    const typeMatch = typeFilter === 'ALL' || l.tipo === typeFilter;
    
    const isInServizio = l.presenze?.some(p => p.uscita === null);
    const statusMatch = statusFilter === 'ALL' || 
                       (statusFilter === 'IN_SERVICE' && isInServizio) ||
                       (statusFilter === 'OFF_SERVICE' && !isInServizio);
    
    return searchMatch && typeMatch && statusMatch;
  }).sort((a, b) => {
    let comp = 0;
    if (sortKey === 'name') {
      comp = `${a.nome} ${a.cognome}`.localeCompare(`${b.nome} ${b.cognome}`);
    } else if (sortKey === 'type') {
      comp = a.tipo.localeCompare(b.tipo);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const handleOpenCreate = () => {
    setEditingLavoratore(null);
    setSelectedProjectIds([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (l: Lavoratore) => {
    setEditingLavoratore(l);
    setSelectedProjectIds(l.projects.map(p => p.id));
    setIsFormOpen(true);
  };

  const handleOpenHr = (l: Lavoratore) => {
    setHrViewLavoratore(l);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('projectIds', JSON.stringify(selectedProjectIds));

    startTransition(async () => {
      try {
        if (editingLavoratore) {
          await updateLavoratore(editingLavoratore.id, formData);
          toast.success('Profilo aggiornato con successo');
        } else {
          await createLavoratore(formData);
          toast.success('Collaboratore registrato con successo');
        }
        setIsFormOpen(false);
      } catch (error) {
        toast.error('Si è verificato un errore');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Eliminare definitivamente questo lavoratore? Tutte le presenze e le ferie collegate verranno rimosse.')) {
      startTransition(async () => {
        try {
          await deleteLavoratore(id);
          toast.success('Lavoratore eliminato');
        } catch (error) {
          toast.error('Errore durante l\'eliminazione');
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <ShieldCheck className="text-blue-600" size={14} />
            Human Capital & Compliance Ledger
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestione Capitale Umano</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Monitoraggio in tempo reale di presenze, skills e compliance sicurezza</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2 transform active:scale-95"
        >
          <Plus size={18} /> Registra Risorsa
        </button>
      </div>

      {/* Strategic KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organico Totale</p>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.total}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Risorse umane attive a sistema</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <HardHat size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forza Lavoro Attiva</p>
            </div>
            <p className="text-4xl font-black text-emerald-600 tracking-tighter leading-none">{stats.inServizio}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Collaboratori in cantiere oggi</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-orange-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <AlertCircle size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert Compliance</p>
            </div>
            <p className={`text-4xl font-black tracking-tighter leading-none ${stats.documentiInScadenza > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{stats.documentiInScadenza}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Documenti o visite in scadenza</p>
         </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cerca per nome, cognome o ruolo..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
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

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Inquadramento</label>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
            >
              <option value="ALL">Tutti i tipi</option>
              <option value="DIPENDENTE">Dipendente</option>
              <option value="SUBAPPALTATORE">Subappaltatore</option>
              <option value="ESTERNO">Esterno</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stato Servizio</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
            >
              <option value="ALL">Qualsiasi stato</option>
              <option value="IN_SERVICE">In cantiere</option>
              <option value="OFF_SERVICE">Non attivo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ordina per</label>
            <select 
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
            >
                <option value="name">Nome / Cognome</option>
                <option value="type">Inquadramento</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Direzione</label>
            <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full h-[46px] bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 hover:bg-slate-100 transition-all flex items-center justify-between"
            >
                {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                <TrendingUp size={16} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          </div>

          <div className="flex items-end">
            <button 
                onClick={() => {
                  setSearch(''); setTypeFilter('ALL'); setStatusFilter('ALL');
                  setSortKey('name'); setSortOrder('asc');
                }}
                className="w-full h-[46px] border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
                Reset Filtri
            </button>
          </div>
        </div>
      </div>

      {/* 4. Worker Views */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(l => {
            const isInServizio = l.presenze?.some(p => p.uscita === null);
            const alertDocs = l.documenti?.filter(d => new Date(d.dataScadenza) < new Date()).length || 0;

            return (
              <div key={l.id} className="group relative bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-blue-600/20 transform hover:-translate-y-1">
                <div className="h-24 bg-slate-900 relative p-6 flex justify-between items-start">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                   <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black border-4 border-white shadow-2xl transition-all group-hover:rotate-3 translate-y-4 ${
                    isInServizio ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {l.nome[0]}{l.cognome ? l.cognome[0] : ''}
                  </div>
                  <div className="relative z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenHr(l)} className="p-2.5 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 rounded-xl transition-all border border-white/20">
                      <Clock size={16} />
                    </button>
                    <button onClick={() => handleOpenEdit(l)} className="p-2.5 bg-white/10 backdrop-blur-md text-white hover:bg-blue-600 rounded-xl transition-all border border-white/20">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-8 pt-12 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase flex items-center gap-2">
                      {l.nome} {l.cognome} 
                      {alertDocs > 0 && <AlertCircle size={18} className="text-red-500 animate-pulse" />}
                    </h3>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        l.tipo === 'DIPENDENTE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {l.tipo}
                      </span>
                      {isInServizio && (
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> IN SERVIZIO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50 mb-8 flex-1">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Phone size={14} />
                      </div>
                      {l.telefono || 'Non inserito'}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Mail size={14} />
                      </div>
                      <span className="truncate">{l.email || '—'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ferie Fruite</p>
                      <p className="text-xl font-black text-slate-900">
                        {l.assenze?.filter(a => a.tipo === 'FERIE' && a.stato === 'APPROVATA').reduce((acc, cur) => acc + (cur.giorniTotali || 0), 0) || 0}g
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ore Progetto</p>
                      <p className="text-xl font-black text-blue-600">{l._count.rapportini * 8}h</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenHr(l)}
                    className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-xl"
                  >
                    Vedi Cartella HR <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-6">Collaboratore</th>
                <th className="px-6 py-6">Stato Servizio</th>
                <th className="px-6 py-6">Inquadramento</th>
                <th className="px-6 py-6">Contatti Strategici</th>
                <th className="px-6 py-6">Compliance</th>
                <th className="px-10 py-6 text-right">Cartella HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(l => {
                const isInServizio = l.presenze?.some(p => p.uscita === null);
                const alertDocs = l.documenti?.filter(d => new Date(d.dataScadenza) < new Date()).length || 0;
                
                return (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                          isInServizio ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {l.nome[0]}{l.cognome ? l.cognome[0] : ''}
                        </div>
                        <div>
                          <p onClick={() => handleOpenHr(l)} className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors">
                            {l.nome} {l.cognome}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{l.livello || 'Mansione generica'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {isInServizio ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> IN SERVIZIO
                        </div>
                      ) : (
                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest ml-3">Offline</span>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                        l.tipo === 'DIPENDENTE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {l.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                          <Phone size={12} className="text-slate-300" /> {l.telefono || '-'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                          <Mail size={12} className="text-slate-300" /> {l.email || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {alertDocs > 0 ? (
                        <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                          <AlertCircle size={14} /> {alertDocs} Documenti Scaduti
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          <FileCheck size={14} /> Compliance OK
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenHr(l)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
                          <Clock size={18} />
                        </button>
                        <button onClick={() => handleOpenEdit(l)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
          <Users size={48} className="mx-auto text-slate-200 mb-6" />
          <p className="text-slate-400 font-black uppercase tracking-widest">Nessuna risorsa individuata</p>
          <p className="text-xs text-slate-400 mt-2">Affina la ricerca per visualizzare le anagrafiche.</p>
        </div>
      )}

      {/* 5. SlideOver: Registry Form */}
      <SlideOver 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={editingLavoratore ? `Aggiorna Profilo: ${editingLavoratore.nome}` : 'Iscrizione Nuovo Collaboratore'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-8 pb-20">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Identification</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome *</label>
                <input type="text" name="nome" required defaultValue={editingLavoratore?.nome}
                  className="w-full bg-white border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cognome</label>
                <input type="text" name="cognome" defaultValue={editingLavoratore?.cognome || ''}
                  className="w-full bg-white border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
            </div>
          </div>

          <div className="space-y-8 px-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquadramento Contrattuale</label>
              <select name="tipo" defaultValue={editingLavoratore?.tipo || 'DIPENDENTE'} 
                className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 uppercase tracking-widest cursor-pointer appearance-none">
                <option value="DIPENDENTE">Dipendente Interno</option>
                <option value="SUBAPPALTATORE">Artigiano / Subappaltatore</option>
                <option value="ESTERNO">Consulente / Libero Prof.</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Costo Orario Standard (€)</label>
                <input type="number" step="0.01" name="costoOrario" defaultValue={editingLavoratore?.costoOrario || ''}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Livello / Mansione</label>
                <input type="text" name="livello" defaultValue={editingLavoratore?.livello || ''} placeholder="Es. 3° Livello"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contatti (Tel)</label>
                <input type="text" name="telefono" defaultValue={editingLavoratore?.telefono || ''}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Strategica</label>
                <input type="email" name="email" defaultValue={editingLavoratore?.email || ''}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
            </div>
          </div>

          <div className="px-4 space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assegnazione Progetti Attivi</label>
             <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                {projects.map(p => (
                   <label key={p.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all cursor-pointer ${
                    selectedProjectIds.includes(p.id) ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-100' : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedProjectIds.includes(p.id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-300 border border-slate-100 shadow-sm'}`}>
                         <HardHat size={16} />
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{p.name}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedProjectIds.includes(p.id)}
                      onChange={e => {
                        if (e.target.checked) setSelectedProjectIds([...selectedProjectIds, p.id]);
                        else setSelectedProjectIds(selectedProjectIds.filter(id => id !== p.id));
                      }}
                    />
                    {selectedProjectIds.includes(p.id) && <FileCheck size={20} className="text-blue-600" />}
                  </label>
                ))}
             </div>
          </div>

          <div className="pt-10 px-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all transform active:scale-95"
            >
              {isPending ? 'Sincronizzazione in corso...' : editingLavoratore ? 'Aggiorna Profilo Asset' : 'Esegui Registrazione Collaboratore'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* 6. SlideOver: HR Advanced Dashboard */}
      <SlideOver 
        isOpen={hrViewLavoratore !== null} 
        onClose={() => setHrViewLavoratore(null)} 
        title={hrViewLavoratore ? `HR LEDGER: ${hrViewLavoratore.nome} ${hrViewLavoratore.cognome}` : 'Dettaglio Risorsa'}
      >
        {hrViewLavoratore && (
          <div className="space-y-10 pb-20">
            {/* Real-time Clock card */}
            <ClockInCard 
              lavoratoreId={hrViewLavoratore.id} 
              currentPresenza={hrViewLavoratore.presenze?.find(p => p.uscita === null)} 
            />
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8">
               <HRDashboard lavoratore={hrViewLavoratore} />
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
