'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MonthlyData {
  month: string;
  entrate: number;
  uscite: number;
  saldoEffettivo: number;
  entratePrev: number;
  uscitePrev: number;
  saldoPrevisto: number;
}

export default function CashflowClient({ data, saldoAttuale }: { data: MonthlyData[], saldoAttuale: number }) {
  
  // Modifichiamo le etichette per l'asse X per renderle più leggibili (es: 2026-04 -> Apr '26)
  const chartData = data.map(d => {
    const [year, month] = d.month.split('-');
    // Usiamo UTC o formattazione stabile per evitare Hydration Mismatch
    const date = new Date(parseInt(year), parseInt(month) - 1, 15); 
    const label = date.toLocaleString('it-IT', { month: 'short', year: '2-digit', timeZone: 'UTC' });
    return { ...d, label };
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border text-left border-slate-100 rounded-2xl p-6 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Attuale Reale</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-black text-slate-900 mt-2">
              € {new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(saldoAttuale)}
            </p>
          </div>
        </div>
        <div className="bg-white border text-left border-slate-100 rounded-2xl p-6 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-green-600">Totale Entrate (Mensile)</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-black text-slate-900 mt-2">€ {chartData[chartData.length-1]?.entrate.toLocaleString('it-IT')}</p>
          </div>
        </div>
        <div className="bg-white border text-left border-slate-100 rounded-2xl p-6 shadow-sm group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-red-500">Totale Uscite (Mensile)</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-black text-slate-900 mt-2">€ {chartData[chartData.length-1]?.uscite.toLocaleString('it-IT')}</p>
          </div>
        </div>
      </div>
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <TrendingUp size={20} className="text-blue-600" /> Cashflow Globale & Previsioni
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Confronto tra movimenti reali e proiezioni stimate dai cantieri.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Grafico a Barre: Entrate vs Uscite Effettive Mensili */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-2">
            Movimenti Reali Mensili
          </h3>
          <div className="h-72 w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `€${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`€ ${Number(value).toLocaleString('it-IT')}`, '']}
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                <Bar dataKey="entrate" name="Entrate" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="uscite" name="Uscite" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Andamento Cumulativo Saldo reale vs Previsione */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-2">
            Proiezione Saldo Netto
            <div className="group relative">
               <Info size={14} className="text-slate-400" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                 Mostra l'accumulo del saldo nel tempo. La linea stimata usa i dati del pannello "Previsionale" di ogni cantiere.
               </div>
            </div>
          </h3>
          <div className="h-72 w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `€${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`€ ${Number(value).toLocaleString('it-IT')}`, '']}
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                
                {/* Area per il saldo reale per dare corposità */}
                <Area type="monotone" dataKey="saldoEffettivo" name="Saldo Reale Registrato" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={3} />
                
                {/* Linea tratteggiata per la previsione */}
                <Line type="monotone" dataKey="saldoPrevisto" name="Saldo Previsto da Cantieri" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
