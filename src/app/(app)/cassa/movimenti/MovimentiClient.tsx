'use client';

import { useState, useTransition } from 'react';
import { createMovimento, deleteMovimento } from '@/app/(app)/cassa-actions';
import { Plus, Trash2, ArrowRightLeft, Search, Calendar, Folder, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import { useAuth } from '@/lib/auth-mock';

interface Project { id: string; name: string; number: number | null }
interface Conto { id: string; nome: string; attivo: boolean }
interface Movimento {
  id: string;
  contoId: string;
  conto: Conto;
  tipo: string;
  categoria: string | null;
  data: Date;
  importo: number;
  descrizione: string | null;
  controparte: string | null;
  riferimento: string | null;
  projects: Project[];
}

import SlideOver from '@/components/SlideOver';

export default function MovimentiClient({ movimenti, conti, projects }: { movimenti: Movimento[]; conti: Conto[]; projects: Project[] }) {
  const { role } = useAuth();
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [tipo, setTipo] = useState('USCITA');
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [filterConto, setFilterConto] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterCantiere, setFilterCantiere] = useState('');

  const stats = {
    entrate: movimenti.filter(m => m.tipo === 'ENTRATA').reduce((acc, m) => acc + m.importo, 0),
    uscite: movimenti.filter(m => m.tipo === 'USCITA').reduce((acc, m) => acc + m.importo, 0),
  };

  // Selected projects state for the form
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const toggleProject = (id: string) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('projectIds', JSON.stringify(selectedProjects));
    
    startTransition(async () => {
      await createMovimento(fd);
      setIsSlideOverOpen(false);
      setSelectedProjects([]);
    });
  }

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo movimento?')) {
      startTransition(async () => {
        await deleteMovimento(id);
      });
    }
  };

  const filteredMovimenti = movimenti.filter(m => {
    const matchSearch = (m.descrizione?.toLowerCase() || '').includes(search.toLowerCase()) ||
                        (m.controparte?.toLowerCase() || '').includes(search.toLowerCase()) ||
                        (m.categoria?.toLowerCase() || '').includes(search.toLowerCase());
    const matchConto = filterConto ? m.contoId === filterConto : true;
    const matchTipo = filterTipo ? m.tipo === filterTipo : true;
    const matchCantiere = filterCantiere ? m.projects.some(p => p.id === filterCantiere) : true;
    return matchSearch && matchConto && matchTipo && matchCantiere;
  });

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <ArrowRightLeft className="text-blue-600" size={14} />
            Cashflow Integrity & Registry
          </div>
          <h1 className="page-title text-4xl">Financial Ledger</h1>
          <p className="page-description text-base font-medium text-slate-500">Real-time monitoring of construction liquidity and project associations</p>
        </div>
        <div className="flex gap-4">
          <PrintButton label="Export Analysis" className="bg-white text-slate-900 px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm" />
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Plus size={18} /> Register Entry
          </button>
        </div>
      </div>

      {/* Strategic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <TrendingUp size={12} className="text-emerald-500" /> Gross Inflow
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">€ {stats.entrate.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
            <p className="text-[9px] font-bold text-emerald-600 uppercase mt-4 italic tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-lg">Operational Surplus</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group hover:border-red-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <TrendingDown size={12} className="text-red-500" /> Gross Outflow
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">€ {stats.uscite.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
            <p className="text-[9px] font-bold text-red-600 uppercase mt-4 italic tracking-widest bg-red-50 inline-block px-3 py-1 rounded-lg">Expense Allocation</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl group hover:shadow-blue-900/20 transition-all relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mb-24 -mr-24 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               <ArrowRightLeft size={12} className="text-blue-400" /> Net Liquidity
            </p>
            <p className="text-4xl font-black text-white tracking-tighter leading-none italic">€ {(stats.entrate - stats.uscite).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
            <p className="text-[9px] font-bold text-blue-400 uppercase mt-4 italic tracking-[0.2em]">Consolidated Balance</p>
        </div>
      </div>

      {/* Advanced Filter Console */}
      <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col lg:flex-row gap-6 items-center shadow-sm no-print">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search entries, categories, or counterparties..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="w-full lg:w-48 bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer">
            <option value="">Flow Type</option>
            <option value="ENTRATA">Inflow Only</option>
            <option value="USCITA">Outflow Only</option>
          </select>
          <select value={filterConto} onChange={e => setFilterConto(e.target.value)} className="w-full lg:w-48 bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer">
            <option value="">All Accounts</option>
            {conti.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select value={filterCantiere} onChange={e => setFilterCantiere(e.target.value)} className="w-full lg:w-48 bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer">
            <option value="">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.number ? `#${p.number} - ` : ''}{p.name}</option>)}
          </select>
        </div>
      </div>

      <SlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">🏛️ <span className="italic text-blue-600">Register Asset Flow</span></div>}
      >
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
           <div className="bg-slate-50/50 p-8 rounded-[2rem] space-y-8 border border-slate-100">
              {/* Tipo Toggle */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flow Direction</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full">
                  <button type="button" onClick={() => setTipo('ENTRATA')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === 'ENTRATA' ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    + Inflow
                  </button>
                  <button type="button" onClick={() => setTipo('USCITA')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tipo === 'USCITA' ? 'bg-white shadow-xl text-red-500' : 'text-slate-400 hover:text-slate-600'}`}>
                    - Outflow
                  </button>
                  <input type="hidden" name="tipo" value={tipo} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Entity *</label>
                <select name="contoId" required className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm">
                  <option value="">Select account source...</option>
                  {conti.filter(c => c.attivo).map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Effective Date *</label>
                  <input type="date" name="data" required defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantum (€) *</label>
                  <input type="number" name="importo" required step="0.01" min="0.01" placeholder="0.00"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm text-right" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Category *</label>
                <input type="text" name="categoria" required placeholder="Materials, Payroll, Logistics..." list="categorie-list"
                  className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
                <datalist id="categorie-list">
                  <option value="Materiali" /><option value="Manodopera" /><option value="Noleggio" /><option value="Banca" /><option value="Fattura SAL" /><option value="Tasse" />
                </datalist>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Narrative *</label>
                <textarea name="descrizione" required placeholder="Detailed description of the financial movement..." rows={3}
                  className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm resize-none" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Counterparty (Entity)</label>
                <input type="text" name="controparte" placeholder="Optional: Client or Provider name"
                  className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Folder size={14} className="text-blue-500" /> Project Association Matrix
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {projects.map(p => {
                  const checked = selectedProjects.includes(p.id);
                  return (
                    <button type="button" key={p.id} onClick={() => toggleProject(p.id)}
                      className={`flex items-center justify-between px-6 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-tight border transition-all ${
                        checked ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                      }`}>
                      <span>{p.number ? `#${p.number} - ` : ''}{p.name}</span>
                      {checked && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>}
                    </button>
                  );
                })}
              </div>
           </div>

           <div className="flex flex-col gap-4 pt-6">
              <button type="submit" disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-600/20 active:scale-95"
              >
                {isPending ? 'Synchronizing with Ledger...' : 'Commit Transaction'}
              </button>
              <button type="button" onClick={() => setIsSlideOverOpen(false)}
                className="w-full py-4 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">
                Dismiss Registry
              </button>
           </div>
        </form>
      </SlideOver>

      {/* Transaction Ledger Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        {filteredMovimenti.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-inner">
               <ArrowRightLeft size={40} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Ledger data not retrieved</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Date</th>
                  <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Source</th>
                  <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                  <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Asset Category</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">In/Out Quantum</th>
                  <th className="px-10 py-8 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMovimenti.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8 whitespace-nowrap" suppressHydrationWarning>
                      <p className="text-xs font-bold text-slate-400">{new Date(m.data).toLocaleDateString('it-IT')}</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Ref ID: {m.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-8">
                      <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-sm">{m.conto.nome}</span>
                    </td>
                    <td className="px-6 py-8">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{m.descrizione}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {m.controparte && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.controparte}</span>}
                        {m.projects.length > 0 && (
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Folder size={8} className="text-blue-400" /> {m.projects.length} PRJ Associations
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-8 hidden md:table-cell">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">{m.categoria}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <p className={`text-xl font-black tracking-tighter ${m.tipo === 'ENTRATA' ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {m.tipo === 'ENTRATA' ? '+' : '-'} € {m.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-10 py-8 text-right opacity-0 group-hover:opacity-100 transition-all">
                      {role === 'ADMIN' && (
                        <button onClick={() => handleDelete(m.id)} disabled={isPending} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
