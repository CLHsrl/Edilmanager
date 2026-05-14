'use client';

import { useState } from 'react';
import { 
  Plus, Search as SearchIcon, LayoutGrid, List, TrendingUp, 
  FileText, Calendar, User, ArrowRight, ChevronRight,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import QuoteShareButton from './components/QuoteShareButton';

type Quote = {
  id: string;
  number: number;
  status: string;
  date: Date;
  total: number;
  client: {
    id: string;
    name: string;
    email: string | null;
  };
};

type Props = {
  quotes: Quote[];
  stats: {
    totalValue: number;
    pendingValue: number;
    count: number;
  };
};

export default function QuotesClient({ quotes, stats }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<'date' | 'total' | 'number'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Logic
  const filtered = quotes.filter(q => {
    const searchMatch = q.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       String(q.number).includes(searchTerm);
    const statusMatch = statusFilter === 'ALL' || q.status === statusFilter;
    
    return searchMatch && statusMatch;
  }).sort((a, b) => {
    let comp = 0;
    if (sortKey === 'date') comp = new Date(a.date).getTime() - new Date(b.date).getTime();
    else if (sortKey === 'total') comp = a.total - b.total;
    else if (sortKey === 'number') comp = a.number - b.number;
    
    return sortOrder === 'asc' ? comp : -comp;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex justify-between items-end no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="text-blue-600" size={14} />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sales & Contract Engineering</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Offerte Commerciali</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-3">Pipeline di preventivazione, analisi margini e conversione contratti</p>
        </div>
        <Link 
          href="/quotes/new"
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1"
        >
          <Plus size={16} /> Genera Nuova Offerta
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
         {/* KPI 1 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <TrendingUp size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume Offerte</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">€ {stats.totalValue.toLocaleString('it-IT')}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Valore totale portfolio commerciale</p>
         </div>

         {/* KPI 2 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Clock size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Negoziazione</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">€ {stats.pendingValue.toLocaleString('it-IT')}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Capitale in fase di approvazione</p>
         </div>

         {/* KPI 3 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totale Documenti</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.count}</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2">Tasso di conversione medio: 68%</p>
         </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 no-print bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 w-full relative">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cerca per cliente o codice documento..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:flex flex-wrap items-center gap-3 pt-3 border-t border-gray-50">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Stato</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-bold"
            >
              <option value="ALL">Tutti gli stati</option>
              <option value="DRAFT">Bozza</option>
              <option value="SENT">Inviato</option>
              <option value="ACCEPTED">Accettato</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ordina per</label>
            <div className="flex gap-1">
              <select 
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-bold"
              >
                <option value="date">Data Documento</option>
                <option value="total">Importo Totale</option>
                <option value="number">N° Preventivo</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all text-gray-500"
              >
                <TrendingUp size={16} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setSortKey('date');
              setSortOrder('desc');
            }}
            className="mt-auto h-[38px] px-4 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((quote) => (
            <div key={quote.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6 transition-all hover:shadow-xl hover:border-slate-300">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/quotes/${quote.id}`}>
                        {quote.client.name}
                      </Link>
                    </h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      Doc. #{quote.number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="text-xl font-black text-slate-900 tracking-tighter">
                  € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  quote.status === 'ACCEPTED' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {quote.status}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                  <Calendar size={14} className="text-gray-300" />
                  {new Date(quote.date).toLocaleDateString('it-IT')}
                </div>
                <div className="text-lg font-black text-gray-900">
                  € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-3">
                <Link 
                  href={`/quotes/${quote.id}`}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-600 transition-all shadow-sm"
                >
                  Gestione
                </Link>
                <QuoteShareButton 
                  quoteNumber={String(quote.number)} 
                  clientEmail={quote.client.email} 
                />
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Preventivo</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Stato</th>
                <th className="px-6 py-4 text-right">Importo</th>
                <th className="px-6 py-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((quote) => (
                <tr key={quote.id} className="hover:bg-blue-50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-black text-gray-400 font-mono">
                        #{String(quote.number).padStart(3, '0')}
                      </div>
                      <Link href={`/quotes/${quote.id}`} className="p-2 text-gray-400 hover:bg-white hover:text-blue-600 rounded-lg shadow-sm border border-transparent hover:border-blue-100 transition-all">
                        <FileText size={16} />
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/quotes/${quote.id}`}>{quote.client.name}</Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {new Date(quote.date).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase border ${
                      quote.status === 'DRAFT' ? 'bg-gray-50 text-gray-400 border-gray-100' : 
                      quote.status === 'SENT' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <QuoteShareButton 
                        quoteNumber={String(quote.number)} 
                        clientEmail={quote.client.email} 
                      />
                      <Link href={`/quotes/${quote.id}`} className="p-2 text-gray-400 hover:bg-white hover:text-blue-600 rounded-lg">
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">Nessun preventivo trovato.</p>
          <p className="text-sm text-gray-400">Prova a cambiare i filtri o il termine di ricerca.</p>
        </div>
      )}
    </div>
  );
}
