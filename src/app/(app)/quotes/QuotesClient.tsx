'use client';

import { useState } from 'react';
import { 
  Plus, Search as SearchIcon, LayoutGrid, List, TrendingUp, 
  FileText, Calendar, Clock, CheckCircle2, ChevronRight, X
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter & Sort
  const filtered = quotes.filter(q => {
    const searchMatch = (q.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
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
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 bg-[#003F61]" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Sales & Commercial Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
            Offerte & Preventivi Commerciali
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pipeline commerciale, marginalità e monitoraggio contratti d'appalto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quotes/new"
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Nuova Offerta
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Commerciale</span>
            <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61]">
              € {stats.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Valore totale portafoglio emesso
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Trattativa</span>
            <div className="p-2 bg-amber-50 border border-amber-200 text-amber-700">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">
              € {stats.pendingValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Capitale in attesa di approvazione cliente
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Totale Offerte</span>
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61]">
              {stats.count}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Tasso di conversione medio stimato: 68%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per cliente o numero preventivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003F61]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 uppercase focus:outline-none focus:border-[#003F61]"
          >
            <option value="ALL">TUTTI GLI STATI</option>
            <option value="DRAFT">BOZZA</option>
            <option value="SENT">INVIATO</option>
            <option value="ACCEPTED">ACCETTATO</option>
            <option value="REJECTED">RIFIUTATO</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 uppercase focus:outline-none focus:border-[#003F61]"
          >
            <option value="date">DATA EMISSIONE</option>
            <option value="total">IMPORTO</option>
            <option value="number">NUMERO DOCUMENTO</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#003F61] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
              title="Vista Tabella"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#003F61] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
              title="Vista Griglia"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Content */}
      {viewMode === 'list' ? (
        <div className="bg-white border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Doc. #</th>
                <th className="py-3 px-4">Committente</th>
                <th className="py-3 px-4">Data Emissione</th>
                <th className="py-3 px-4">Stato</th>
                <th className="py-3 px-4 text-right">Importo Totale</th>
                <th className="py-3 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#003F61]">
                    #{String(quote.number).padStart(4, '0')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link href={`/quotes/${quote.id}`} className="hover:text-[#003F61] hover:underline">
                      {quote.client?.name || 'Cliente sconosciuto'}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {new Date(quote.date).toLocaleDateString('it-IT')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      quote.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : quote.status === 'SENT'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <QuoteShareButton 
                        quoteNumber={String(quote.number)} 
                        clientEmail={quote.client?.email || null} 
                      />
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="h-8 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        Dettaglio <ChevronRight size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((quote) => (
            <div key={quote.id} className="bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#003F61]">
                    #{String(quote.number).padStart(4, '0')}
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    quote.status === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : quote.status === 'SENT'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  <Link href={`/quotes/${quote.id}`} className="hover:text-[#003F61] hover:underline">
                    {quote.client?.name || 'Cliente sconosciuto'}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                  <Calendar size={13} />
                  {new Date(quote.date).toLocaleDateString('it-IT')}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Importo Totale</span>
                  <span className="text-lg font-bold text-[#003F61]">
                    € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <QuoteShareButton 
                    quoteNumber={String(quote.number)} 
                    clientEmail={quote.client?.email || null} 
                  />
                  <Link
                    href={`/quotes/${quote.id}`}
                    className="h-8 px-3 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    Apri
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <FileText size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-bold">Nessun preventivo trovato.</p>
          <p className="text-xs text-slate-400 mt-1">Verifica i parametri di ricerca o crea una nuova offerta.</p>
        </div>
      )}
    </div>
  );
}
