'use client';

import { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Search, Filter, 
  ArrowRight, ShieldCheck, Zap, BarChart3, 
  ShoppingCart, Star, CheckCircle2, Activity,
  Target, Globe
} from 'lucide-react';

interface Comparison {
  name: string;
  minPrice: number;
  bestSupplier: string;
  avgPrice: number;
  historyCount: number;
}

export default function ProcurementClient({ initialData }: { initialData: Comparison[] }) {
  const [search, setSearch] = useState('');

  const filtered = initialData.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-12 pb-24 reveal">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 no-print">
        <div className="space-y-4">
          <div className="page-label m-0">
            <ShoppingCart className="text-blue-600" size={14} />
            Supply Chain & Procurement Intelligence
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Intelligenza <span className="text-blue-600">Acquisti</span>
          </h1>
          <p className="text-slate-500 font-medium text-base tracking-tight max-w-2xl">
            Analisi comparativa, benchmark prezzi regionali e ottimizzazione scorte basata su performance storica dei fornitori.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <Activity size={20} className="text-emerald-500" />
              <div className="leading-none">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Market</p>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Sync Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Risparmio Potenzial', val: '12.4%', sub: 'Margine recuperabile', icon: Zap, color: 'blue', bg: 'bg-slate-900', text: 'text-white' },
           { label: 'Articoli Monitorati', val: initialData.length.toString(), sub: 'SKU analizzati live', icon: BarChart3, color: 'blue', bg: 'bg-white', text: 'text-slate-900' },
           { label: 'Benchmark Rating', val: 'Premium', sub: 'Supply chain health', icon: Star, color: 'emerald', bg: 'bg-white', text: 'text-slate-900' }
         ].map((kpi, idx) => (
           <div key={idx} className={`${kpi.bg} p-10 rounded-[2.5rem] border border-slate-100 shadow-premium relative overflow-hidden group transition-all hover:-translate-y-1`}>
              <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${kpi.bg === 'bg-white' ? 'bg-slate-50' : 'bg-white/10'} flex items-center justify-center ${kpi.bg === 'bg-white' ? `text-${kpi.color}-600` : 'text-white'}`}>
                      <kpi.icon size={24} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${kpi.bg === 'bg-white' ? 'text-slate-400' : 'text-slate-500'}`}>{kpi.label}</p>
              </div>
              <div className="relative z-10">
                <p className={`text-4xl font-black tracking-tighter leading-none mb-3 ${kpi.text}`}>{kpi.val}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${kpi.bg === 'bg-white' ? 'text-slate-400' : 'text-slate-500'}`}>{kpi.sub}</p>
              </div>
              {kpi.bg === 'bg-slate-900' && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              )}
           </div>
         ))}
      </div>

      {/* Main Analysis Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden group">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                Market Price Leaderboard
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Benchmark dei prezzi unitari estratti dai DDT</p>
           </div>
           <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cerca materiale (es. Cemento)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border-slate-100 border rounded-2xl pl-16 pr-8 py-5 text-sm font-bold focus:ring-4 focus:ring-blue-600/10 focus:bg-white focus:border-blue-600 outline-none w-full transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Articolo / Categoria</th>
                <th>Prezzo Minimo</th>
                <th>Fornitore Leader</th>
                <th className="text-center">Price Gap</th>
                <th className="text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item, i) => {
                const gap = ((item.avgPrice - item.minPrice) / (item.minPrice || 1)) * 100;
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group/row">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover/row:bg-blue-600 group-hover/row:text-white transition-all">
                             <ShoppingCart size={20} />
                          </div>
                          <div>
                             <p className="font-black text-slate-900 text-base uppercase tracking-tight">{item.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.historyCount} campionamenti</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <p className="font-black text-slate-900 text-lg">€ {item.minPrice.toFixed(2)}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prezzo Unitario</p>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                             <ShieldCheck size={16} />
                          </div>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.bestSupplier}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col items-center gap-2">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${gap > 0 ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm' : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm'}`}>
                             {gap > 0 ? <TrendingUp size={12} /> : <Target size={12} />}
                             {gap > 0 ? '+' : ''}{gap.toFixed(1)}% Gap
                          </div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Efficiency Analysis</p>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="p-4 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md">
                          <ArrowRight size={20} />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-premium space-y-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
               <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
               AI Procurement Advisory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col gap-6 group hover:bg-white transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                     <TrendingDown size={24} />
                  </div>
                  <div>
                     <p className="font-black text-blue-900 text-base uppercase tracking-tight mb-3">Opportunità: {initialData[0]?.name || 'Cemento'}</p>
                     <p className="text-xs text-blue-700 font-medium leading-relaxed uppercase tracking-wide">Acquistando dal fornitore leader puoi ridurre i costi del {( (initialData[0]?.avgPrice - initialData[0]?.minPrice) / (initialData[0]?.minPrice || 1) * 100).toFixed(1)}% rispetto alla media attuale.</p>
                  </div>
               </div>
               
               <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-6 opacity-80 group hover:opacity-100 hover:bg-white transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl text-slate-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                     <Globe size={24} />
                  </div>
                  <div>
                     <p className="font-black text-slate-900 text-base uppercase tracking-tight mb-3">Trend Regionali: Ferro</p>
                     <p className="text-xs text-slate-600 font-medium leading-relaxed uppercase tracking-wide italic">I prezzi del tondino sono in calo del 4% nel nord-est. Suggeriamo di posticipare i grandi ordini di 15 giorni per ottimizzare il budget.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Compliance Engine</p>
                    <p className="text-lg font-black uppercase tracking-tighter">Supply Chain Risk</p>
                  </div>
               </div>
               <p className="text-2xl font-black tracking-tight leading-snug">Tutti i fornitori suggeriti sono stati verificati in base a ISO-9001 e puntualità storica certificata.</p>
            </div>
            
            <button className="mt-12 relative z-10 bg-white text-slate-900 hover:bg-blue-600 hover:text-white w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 transform active:scale-95">
               Genera Report Analitico <ArrowRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
}

