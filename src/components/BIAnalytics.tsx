'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart, ShieldAlert } from 'lucide-react';

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
    .slice(0, 10);

  if (!projectMargins || projectMargins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
         <PieChart size={64} className="text-gray-200 mb-6" />
         <h3 className="text-xl font-bold text-gray-900">Nessun dato analitico disponibile</h3>
         <p className="text-gray-400 max-w-xs text-center mt-2">Popola i progetti e i costi per visualizzare le dashboard previsionali Enterprise.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* 1. Finacial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><TrendingUp size={20} /></div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incassi Previsti (6m)</p>
           <p className="text-2xl font-black text-slate-900 mt-1">€ {totalIn.toLocaleString('it-IT')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="bg-red-50 text-red-600 p-2 rounded-xl"><TrendingDown size={20} /></div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamenti Previsti (6m)</p>
           <p className="text-2xl font-black text-slate-900 mt-1">€ {totalOut.toLocaleString('it-IT')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><DollarSign size={20} /></div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Finale Stimato</p>
           <p className="text-2xl font-black text-blue-600 mt-1">€ {(totalIn - totalOut).toLocaleString('it-IT')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-xl"><Target size={20} /></div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margine Medio</p>
           <p className="text-2xl font-black text-slate-900 mt-1">
             {(projectMargins.reduce((acc: number, cur: any) => acc + (cur.margin || 0), 0) / (projectMargins.length || 1)).toFixed(1)}%
           </p>
        </div>
      </div>

      {/* 2. Overrun Alerts */}
      {overruns.length > 0 && (
        <div className="bg-white border border-red-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-red-900/5 transition-all hover:scale-[1.01]">
           <div className="bg-red-600 text-white p-6 rounded-[2rem] shadow-xl shadow-red-200">
             <ShieldAlert size={40} />
           </div>
           <div className="flex-1">
             <h3 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-1">Alert Operativo: Progetti Fuori Budget</h3>
             <p className="text-slate-500 text-base font-medium">Sono stati rilevati {overruns.length} progetti con costi superiori al ricavo stimato.</p>
           </div>
           <div className="flex -space-x-4 overflow-hidden">
              {overruns.map((m: any, i: number) => (
                <div key={i} title={m.name} className="w-12 h-12 rounded-full bg-slate-900 border-4 border-white text-xs font-black text-white flex items-center justify-center shadow-xl">
                   {m.name.charAt(0)}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* 3. Cashflow Area Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
           <TrendingUp size={18} className="text-blue-600" /> Previsione Flussi di Cassa (Cashflow)
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'black' }} 
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingBottom: '20px' }} />
              <Area type="monotone" dataKey="incassi" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" />
              <Area type="monotone" dataKey="pagamenti" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorPag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Margin Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
             <PieChart size={18} className="text-purple-600" /> Top 10 Margini Progetto (%)
           </h3>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMargins} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 'bold'}} width={120} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', fontSize: '10px', fontWeight: 'black' }} />
                  <Bar dataKey="margin" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 5. Budget vs Cost */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
             <DollarSign size={18} className="text-amber-500" /> Stato Avanzamento Budget (Top 8)
           </h3>
           <div className="space-y-6">
              {projectMargins.slice(0, 8).map((m: any, i: number) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.name}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">€ {m.cost.toLocaleString()} / € {m.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-1000 ${m.cost > m.revenue ? 'bg-red-500 w-full' : 'bg-blue-600'}`} 
                      style={{ width: `${Math.min((m.cost / (m.revenue || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
