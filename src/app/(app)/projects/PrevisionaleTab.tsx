'use client';

import { useState, useTransition } from 'react';
import { createPrevisionale, deletePrevisionale } from '@/app/(app)/cantiere-actions';
import { Plus, Trash2, TrendingUp, TrendingDown, Calendar, PieChart, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import SlideOver from '@/components/SlideOver';

const CATEGORIE_ENTRATA = ['Acconto', 'SAL', 'Saldo', 'Altro'];
const CATEGORIE_USCITA = ['Materiali', 'Manodopera', 'Noleggio mezzi', 'Subappalto', 'Altro'];

interface Previsionale {
  id: string;
  tipo: string;
  categoria: string | null;
  data: Date;
  importo: number;
  descrizione: string | null;
}

export default function PrevisionaleTab({ projectId, previsionali }: { projectId: string; previsionali: Previsionale[] }) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [tipo, setTipo] = useState('ENTRATA');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createPrevisionale(projectId, fd);
      setIsSlideOpen(false);
    });
  }

  const entrate = previsionali.filter(p => p.tipo === 'ENTRATA').reduce((s, p) => s + p.importo, 0);
  const uscite = previsionali.filter(p => p.tipo === 'USCITA').reduce((s, p) => s + p.importo, 0);
  const margine = entrate - uscite;

  // Sort by date inversed for better UX in lists
  const sorted = [...previsionali].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Financial Projections</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Cash Flow Planning & Margin Control</p>
        </div>
        <button 
          onClick={() => setIsSlideOpen(true)} 
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all transform active:scale-95"
        >
          <Plus size={18} /> New Ledger Entry
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Projected Inflow</p>
            <p className="text-3xl font-black text-emerald-600 tracking-tighter">€ {entrate.toLocaleString('it-IT')}</p>
            <div className="flex items-center gap-3 text-[10px] text-emerald-700 font-black uppercase tracking-widest mt-4">
               <ArrowUpRight size={14} className="text-emerald-500" /> Revenue Forecast
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Projected Outflow</p>
            <p className="text-3xl font-black text-red-500 tracking-tighter">€ {uscite.toLocaleString('it-IT')}</p>
            <div className="flex items-center gap-3 text-[10px] text-red-700 font-black uppercase tracking-widest mt-4">
               <ArrowDownRight size={14} className="text-red-500" /> Expense Estimate
            </div>
          </div>
        </div>

        <div className={`rounded-[2.5rem] border p-8 relative overflow-hidden group shadow-2xl ${margine >= 0 ? 'bg-slate-900 border-slate-800 text-white' : 'bg-red-600 border-red-700 text-white'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4">Net Operational Margin</p>
            <p className="text-3xl font-black tracking-tighter">{margine >= 0 ? '+' : ''}€ {margine.toLocaleString('it-IT')}</p>
            <div className="flex items-center gap-3 text-[10px] opacity-60 font-black uppercase tracking-widest mt-4">
               <PieChart size={14} /> Estimated Gross Profit
            </div>
          </div>
        </div>
      </div>

      {/* List Table */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
          <TrendingUp size={64} className="mx-auto text-slate-100 mb-8" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Projections Found</h3>
          <p className="text-sm text-slate-400 font-medium mt-2">Initialize your cash flow planning by adding anticipated revenue and costs.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 group transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 font-black text-slate-900 uppercase tracking-tight text-sm">
                       <Calendar size={14} className="text-blue-500" />
                       {new Date(p.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                       <span className={`w-fit px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                         p.tipo === 'ENTRATA' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                       }`}>
                         {p.tipo} · {p.categoria || 'Generico'}
                       </span>
                       <p className="text-xs font-bold text-slate-700 uppercase tracking-tight truncate max-w-xs">{p.descrizione || '—'}</p>
                    </div>
                  </td>
                  <td className={`px-8 py-6 text-right font-black text-lg tracking-tighter ${p.tipo === 'ENTRATA' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {p.tipo === 'ENTRATA' ? '+' : '-'} € {p.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => { if(confirm('Eliminare questa voce?')) startTransition(async () => { await deletePrevisionale(p.id, projectId); }) }} disabled={isPending}
                      className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver 
        isOpen={isSlideOpen} 
        onClose={() => setIsSlideOpen(false)} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">📈 <span className="italic text-blue-600">Financial Entry</span></div>}
      >
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 relative z-10 leading-none">Ledger Classification</p>
             <h4 className="text-lg font-black uppercase tracking-tighter relative z-10">Cash Flow Direction</h4>
             
             <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 mt-6 relative z-10">
              {['ENTRATA', 'USCITA'].map(t => (
                <button key={t} type="button" onClick={() => setTipo(t)}
                  className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    tipo === t
                      ? t === 'ENTRATA' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                      : 'text-slate-500 hover:text-white'
                  }`}>
                  {t === 'ENTRATA' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {t === 'ENTRATA' ? 'Revenue' : 'Expense'}
                </button>
              ))}
            </div>
          </div>
          
          <input type="hidden" name="tipo" value={tipo} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Date *</label>
              <input 
                type="date" 
                name="data" 
                required 
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation (€) *</label>
              <div className="relative group">
                 <input 
                  type="number" 
                  name="importo" 
                  step="0.01" 
                  required 
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm text-right pr-12" 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">€</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Category</label>
            <div className="relative">
              <select name="categoria" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm appearance-none">
                <option value="">Other / General</option>
                {(tipo === 'ENTRATA' ? CATEGORIE_ENTRATA : CATEGORIE_USCITA).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <PieChart size={18} className="text-slate-300" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Description / Memo</label>
            <input 
              type="text" 
              name="descrizione" 
              placeholder="Es. Project Advance SAL 2, Structural Material Purchase..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
            />
          </div>

          <div className="pt-10 space-y-4">
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 ${
                tipo === 'ENTRATA' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
              }`}
            >
              {isPending ? 'Salvataggio...' : `Commit ${tipo.toLowerCase()}`}
            </button>
            <button 
              type="button" 
              onClick={() => setIsSlideOpen(false)}
              className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel Transaction
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
