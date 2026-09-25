'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart, ShieldAlert, BarChart3, AlertCircle } from 'lucide-react';

export default function BIAnalytics({ data }: { data: any }) {
  const { forecast, projectMargins } = data;

  const totalIn = forecast?.reduce((acc: number, cur: any) => acc + (cur.incassi || 0), 0) || 0;
  const totalOut = forecast?.reduce((acc: number, cur: any) => acc + (cur.pagamenti || 0), 0) || 0;

  // Analysis for Top Overruns
  const overruns = projectMargins
    ?.filter((m: any) => m.cost > m.revenue)
    .sort((a: any, b: any) => (b.cost - b.revenue) - (a.cost - a.revenue))
    .slice(0, 3);

  // Top Margins
  const topMargins = [...projectMargins]
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 8);

  const avgMargin = (projectMargins?.reduce((acc: number, cur: any) => acc + (cur.margin || 0), 0) / (projectMargins?.length || 1)) || 0;

  if (!projectMargins || projectMargins.length === 0) {
    return (
      <div className="bg-white border border-slate-200 p-12 text-center">
         <PieChart size={36} className="mx-auto text-slate-300 mb-3" />
         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessun dato analitico disponibile</h3>
         <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Inserisci commesse e voci di spesa per generare il forecast finanziario e i report di marginalità.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
           <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Incassi Stimati (6 Mesi)</span>
              <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
                <TrendingUp size={16} />
              </div>
           </div>
           <div>
             <div className="text-2xl font-bold text-emerald-600 tracking-tight">€ {totalIn.toLocaleString('it-IT')}</div>
             <div className="text-xs text-slate-500 mt-1">Previsione entrate contrattuali</div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
           <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Uscite Stimate (6 Mesi)</span>
              <div className="p-2 bg-slate-50 text-rose-600 border border-slate-100">
                <TrendingDown size={16} />
              </div>
           </div>
           <div>
             <div className="text-2xl font-bold text-rose-600 tracking-tight">€ {totalOut.toLocaleString('it-IT')}</div>
             <div className="text-xs text-slate-500 mt-1">Impegni fornitori e subappalti</div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
           <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Saldo Netto Previsionale</span>
              <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                <DollarSign size={16} />
              </div>
           </div>
           <div>
             <div className="text-2xl font-bold text-[#003F61] tracking-tight">€ {(totalIn - totalOut).toLocaleString('it-IT')}</div>
             <div className="text-xs text-slate-500 mt-1">Flusso netto generato nel periodo</div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
           <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">Margine Medio Globale</span>
              <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                <Target size={16} />
              </div>
           </div>
           <div>
             <div className="text-2xl font-bold text-[#003F61] tracking-tight">{avgMargin.toFixed(1)}%</div>
             <div className="text-xs text-slate-500 mt-1">Margine medio su commesse</div>
           </div>
        </div>
      </div>

      {/* Overrun Alert */}
      {overruns && overruns.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <AlertCircle size={20} className="text-red-600 shrink-0" />
             <div>
               <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">Commesse Fuori Budget</h4>
               <p className="text-xs text-red-700 mt-0.5">Rilevati {overruns.length} cantieri con costi consuntivati superiori ai ricavi concordati.</p>
             </div>
           </div>
           <div className="flex gap-2">
             {overruns.map((m: any, i: number) => (
               <span key={i} className="px-2 py-0.5 bg-white border border-red-200 text-xs font-bold text-red-800">
                 {m.name}
               </span>
             ))}
           </div>
        </div>
      )}

      {/* Cashflow Area Chart */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
            <TrendingUp size={16} className="text-[#003F61]" />
            <span>Previsione Flussi di Cassa a 6 Mesi</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">Forecast Entrate vs Uscite</span>
        </div>

        <div className="p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '0px', fontSize: '11px', fontWeight: 600 }} 
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '10px' }} />
                <Area type="monotone" dataKey="incassi" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" name="Incassi Previsti" />
                <Area type="monotone" dataKey="pagamenti" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPag)" name="Pagamenti Previsti" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Margini Progetto & Stato Avanzamento Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Chart */}
        <div className="bg-white border border-slate-200">
           <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
             <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
               <PieChart size={16} className="text-[#003F61]" />
               <span>Top Margini per Commessa (%)</span>
             </div>
           </div>

           <div className="p-4">
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMargins} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 600}} width={120} />
                    <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '0px', fontSize: '11px', fontWeight: 600 }} />
                    <Bar dataKey="margin" fill="#003F61" radius={0} barSize={18} name="Margine %" />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Budget vs Cost List */}
        <div className="bg-white border border-slate-200">
           <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
             <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
               <BarChart3 size={16} className="text-[#003F61]" />
               <span>Avanzamento Costi su Budget Commessa</span>
             </div>
           </div>

           <div className="p-4 space-y-4">
              {projectMargins.slice(0, 6).map((m: any, i: number) => {
                const ratio = Math.min((m.cost / (m.revenue || 1)) * 100, 100);
                const isOver = m.cost > m.revenue;

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{m.name}</span>
                      <span className="text-slate-500 font-medium">
                        € {m.cost.toLocaleString('it-IT')} / € {m.revenue.toLocaleString('it-IT')}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all ${isOver ? 'bg-red-600' : ratio > 80 ? 'bg-amber-500' : 'bg-[#003F61]'}`} 
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
