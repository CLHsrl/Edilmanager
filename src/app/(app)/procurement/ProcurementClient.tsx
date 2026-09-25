'use client';

import { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Search, 
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <ShoppingCart size={14} className="text-[#003F61]" />
            <span>Finanza / Acquisti & Listini Fornitori</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Intelligenza Acquisti & Benchmark</h1>
          <p className="text-sm text-slate-500 mt-1">Analisi comparativa dei prezzi d'acquisto, miglior fornitore per materiale e marginalità.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 px-3 bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Activity size={14} className="text-emerald-600" />
            <span>Mercato & Prezzi Sincronizzati</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Articoli Monitorati</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <BarChart3 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{initialData.length}</div>
            <div className="text-xs text-slate-500 mt-1">Materiali e voci analizzate</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Risparmio Stimato</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <Zap size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">12.4%</div>
            <div className="text-xs text-slate-500 mt-1">Margine ottimizzabile sui fornitori</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fornitori a Confronto</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Star size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">Rating Alto</div>
            <div className="text-xs text-slate-500 mt-1">Affidabilità media registrata</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Campionamenti Totali</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">
              {initialData.reduce((acc, c) => acc + c.historyCount, 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Rilevazioni da DDT e fatture</div>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
            <BarChart3 size={16} className="text-[#003F61]" />
            <span>Benchmark Prezzi Unitari per Articolo</span>
          </div>

          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cerca materiale (es. Cemento, Sabbia, Tubi)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingCart size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-bold uppercase tracking-wider">Nessun articolo per la comparazione</p>
              <p className="text-xs text-slate-500 mt-1">Carica DDT o fatture per generare il benchmark prezzi automatico.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Articolo / Materiale</th>
                  <th className="px-4 py-3 text-right">Miglior Prezzo</th>
                  <th className="px-4 py-3 text-right">Prezzo Medio</th>
                  <th className="px-4 py-3">Miglior Fornitore</th>
                  <th className="px-4 py-3 text-center">Scostamento (Gap)</th>
                  <th className="px-4 py-3 text-center">Campionamenti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item, i) => {
                  const gap = ((item.avgPrice - item.minPrice) / (item.minPrice || 1)) * 100;
                  return (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-700">
                        € {item.minPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-700">
                        € {item.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{item.bestSupplier}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          gap > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {gap > 0 ? '+' : ''}{gap.toFixed(1)}% Gap
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-xs text-slate-500">
                        {item.historyCount} ordini
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Advisory & Compliance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
            <Zap size={16} className="text-[#003F61]" />
            <span>Suggerimenti di Acquisto Ottimale</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Opportunità di Riduzione Costi</span>
              <h4 className="font-bold text-slate-900 text-sm">Centralizzazione Forniture</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Concentrando gli ordini di inerti e cemento sul fornitore leader emerso dai DDT storici è possibile risparmiare fino al 12% su base annua.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Verifica Fatture vs DDT</span>
              <h4 className="font-bold text-slate-900 text-sm">Controllo Congruità</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                I prezzi esposti nelle fatture passive ricevute coincidono con le quantità e i listini concordati nei documenti di trasporto.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 border-b border-slate-100 pb-3 mb-4">
              <ShieldCheck size={16} className="text-[#003F61]" />
              <span>Garanzia di Qualità & Scoring</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tutti i fornitori suggeriti nelle comparazioni mantengono un tasso di puntualità superiore al 90% e conformità documentale completa (DURC regolare).
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Verifica Fornitori Attiva
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
