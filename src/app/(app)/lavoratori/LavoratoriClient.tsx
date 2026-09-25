'use client';

import { useState, useTransition } from 'react';
import { createLavoratore, updateLavoratore, deleteLavoratore } from '@/app/(app)/lavoratori-actions';
import { 
  Users, Plus, Search, Phone, Mail, HardHat, 
  Trash2, Edit, Clock, FileCheck, 
  ChevronRight, AlertCircle, LayoutGrid, List, UserCheck
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Users size={14} className="text-[#003F61]" />
            <span>Amministrazione / Risorse Umane & Personale</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Gestione Personale & Maestranze</h1>
          <p className="text-sm text-slate-500 mt-1">Supervisione organico, presenze in tempo reale, cartelle HR e scadenze formative.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenCreate}
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Nuova Risorsa
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Organico Totale</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">Collaboratori registrati</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Cantiere Oggi</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <UserCheck size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">{stats.inServizio}</div>
            <div className="text-xs text-slate-500 mt-1">Attualmente timbrati</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dipendenti Diretti</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <HardHat size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{stats.dipendenti}</div>
            <div className="text-xs text-slate-500 mt-1">Contratto dipendente interno</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Alert Scadenze HR</span>
            <div className="p-2 bg-slate-50 text-amber-600 border border-slate-100">
              <AlertCircle size={16} />
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold tracking-tight ${stats.documentiInScadenza > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {stats.documentiInScadenza}
            </div>
            <div className="text-xs text-slate-500 mt-1">Attestati o visite mediche</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cerca lavoratore per nome, cognome o ruolo..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
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

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Inquadramento</label>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
            >
              <option value="ALL">Tutti i tipi</option>
              <option value="DIPENDENTE">Dipendente</option>
              <option value="SUBAPPALTATORE">Subappaltatore</option>
              <option value="ESTERNO">Esterno</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Stato Servizio</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
            >
              <option value="ALL">Qualsiasi stato</option>
              <option value="IN_SERVICE">In cantiere (Timbrato)</option>
              <option value="OFF_SERVICE">Non attivo</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Ordina per</label>
            <select 
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
            >
              <option value="name">Nome / Cognome</option>
              <option value="type">Inquadramento</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearch(''); setTypeFilter('ALL'); setStatusFilter('ALL');
                setSortKey('name'); setSortOrder('asc');
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
          {filtered.map(l => {
            const isInServizio = l.presenze?.some(p => p.uscita === null);
            const alertDocs = l.documenti?.filter(d => new Date(d.dataScadenza) < new Date()).length || 0;

            return (
              <div key={l.id} className="bg-white border border-slate-200 hover:border-slate-400 transition-all flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border border-slate-200 flex items-center justify-center font-bold text-sm ${
                      isInServizio ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-700'
                    }`}>
                      {l.nome[0]}{l.cognome ? l.cognome[0] : ''}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm hover:text-[#003F61] transition-colors">
                        {l.nome} {l.cognome}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {l.livello || 'Mansione standard'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-white text-slate-700 border-slate-200">
                      {l.tipo}
                    </span>
                    {isInServizio && (
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                        ● IN SERVIZIO
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-[#003F61] shrink-0" />
                      <span>{l.telefono || 'Nessun recapito'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-[#003F61] shrink-0" />
                      <span className="truncate">{l.email || '—'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-100">
                    <div className="p-2 bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ferie Fruite</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {l.assenze?.filter(a => a.tipo === 'FERIE' && a.stato === 'APPROVATA').reduce((acc, cur) => acc + (cur.giorniTotali || 0), 0) || 0} gg
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ore Registrate</span>
                      <span className="font-bold text-slate-900 text-sm">{l._count.rapportini * 8}h</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => handleOpenHr(l)}
                      className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-[#003F61] text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Clock size={12} /> Cartella HR
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(l)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Modifica"
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Collaboratore</th>
                <th className="px-4 py-3">Stato Servizio</th>
                <th className="px-4 py-3">Inquadramento</th>
                <th className="px-4 py-3">Contatti</th>
                <th className="px-4 py-3">Compliance</th>
                <th className="px-4 py-3 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(l => {
                const isInServizio = l.presenze?.some(p => p.uscita === null);
                const alertDocs = l.documenti?.filter(d => new Date(d.dataScadenza) < new Date()).length || 0;
                
                return (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <span onClick={() => handleOpenHr(l)} className="font-bold text-slate-900 block hover:text-[#003F61] cursor-pointer">
                        {l.nome} {l.cognome}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {l.livello || 'Mansione standard'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {isInServizio ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                          In Servizio
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Offline</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-700 border-slate-200">
                        {l.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <div>{l.telefono || '—'}</div>
                      <div className="text-slate-400">{l.email || ''}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {alertDocs > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-red-50 text-red-700 border-red-200">
                          {alertDocs} Doc. Scaduti
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <FileCheck size={13} /> In regola
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleOpenHr(l)} 
                          className="px-2 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                        >
                          Cartella HR
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(l)} 
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Modifica"
                        >
                          <Edit size={16} />
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
        <div className="bg-white border border-slate-200 p-12 text-center">
          <Users size={36} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessuna risorsa trovata</p>
          <p className="text-xs text-slate-500 mt-1">Nessun collaboratore corrisponde ai criteri impostati.</p>
        </div>
      )}

      {/* SlideOver: Form */}
      <SlideOver 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={<div className="text-lg font-bold text-slate-900">{editingLavoratore ? `Aggiorna: ${editingLavoratore.nome} ${editingLavoratore.cognome || ''}` : 'Nuovo Collaboratore'}</div>}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 pb-10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Nome *</label>
              <input type="text" name="nome" required defaultValue={editingLavoratore?.nome}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Cognome</label>
              <input type="text" name="cognome" defaultValue={editingLavoratore?.cognome || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Inquadramento Contrattuale</label>
            <select name="tipo" defaultValue={editingLavoratore?.tipo || 'DIPENDENTE'} 
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]">
              <option value="DIPENDENTE">Dipendente Interno</option>
              <option value="SUBAPPALTATORE">Artigiano / Subappaltatore</option>
              <option value="ESTERNO">Consulente Tecnico / Libero Prof.</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Costo Orario Standard (€)</label>
              <input type="number" step="0.01" name="costoOrario" defaultValue={editingLavoratore?.costoOrario || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Livello / Mansione</label>
              <input type="text" name="livello" defaultValue={editingLavoratore?.livello || ''} placeholder="Es. 3° Livello Cantiere"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Telefono</label>
              <input type="text" name="telefono" defaultValue={editingLavoratore?.telefono || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Email</label>
              <input type="email" name="email" defaultValue={editingLavoratore?.email || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Assegnazione Cantieri</label>
            <div className="border border-slate-200 p-2 max-h-48 overflow-y-auto space-y-1">
              {projects.map(p => (
                <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                  <input 
                    type="checkbox" 
                    checked={selectedProjectIds.includes(p.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedProjectIds([...selectedProjectIds, p.id]);
                      else setSelectedProjectIds(selectedProjectIds.filter(id => id !== p.id));
                    }}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full h-10 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isPending ? 'Salvataggio...' : editingLavoratore ? 'Aggiorna Risorsa' : 'Salva Collaboratore'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver: HR Cartella */}
      <SlideOver 
        isOpen={hrViewLavoratore !== null} 
        onClose={() => setHrViewLavoratore(null)} 
        title={<div className="text-lg font-bold text-slate-900">{hrViewLavoratore ? `Cartella HR: ${hrViewLavoratore.nome} ${hrViewLavoratore.cognome || ''}` : 'Dettaglio'}</div>}
      >
        {hrViewLavoratore && (
          <div className="space-y-6 pb-10">
            <ClockInCard 
              lavoratoreId={hrViewLavoratore.id} 
              currentPresenza={hrViewLavoratore.presenze?.find(p => p.uscita === null)} 
            />
            
            <div className="bg-white border border-slate-200 p-4">
              <HRDashboard lavoratore={hrViewLavoratore} />
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
