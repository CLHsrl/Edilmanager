'use client';

import { useState, useTransition } from 'react';
import { markFatturaStato, deleteFattura, getFatturaDetails } from '@/app/(app)/fatture-actions';
import { 
  Receipt, Plus, Search, Folder, Calendar, Trash2, 
  CheckCircle2, Clock, AlertCircle, TrendingUp, 
  TrendingDown, BrainCircuit, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-mock';
import SlideOver from '@/components/SlideOver';
import DettaglioFatturaClient from './[id]/DettaglioFatturaClient';
import NuovaFatturaForm from './components/NuovaFatturaForm';
import AIFatturaUploader from './components/AIFatturaUploader';
import { ParsedInvoiceData } from '@/lib/ocrUtils';

interface Project { id: string; name: string; number: number | null }
interface Fattura {
  id: string;
  numero: string;
  tipo: string;
  soggetto: string;
  dataEmissione: Date;
  dataScadenza: Date | null;
  importo: number;
  iva: number;
  totale: number;
  stato: string;
  projects: Project[];
}

export default function FattureClient({ fatture, stats, projects }: { fatture: Fattura[]; stats: any; projects: Project[] }) {
  const { role } = useAuth();
  const [tab, setTab] = useState<'ATTIVE' | 'PASSIVE'>('ATTIVE');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<{fattura: any, potentialMovimenti: any[]} | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showAiUploader, setShowAiUploader] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const handleAiSuccess = (data: ParsedInvoiceData) => {
    setAiData({
      importo: data.total,
      dataEmissione: data.date,
      soggetto: data.vatNumber,
      tipo: tab === 'ATTIVE' ? 'ATTIVA' : 'PASSIVA'
    });
    setShowAiUploader(false);
    setIsCreateOpen(true);
  };

  const handleOpenDetails = async (id: string) => {
    setSelectedInvoiceId(id);
    setIsLoadingDetails(true);
    const details = await getFatturaDetails(id);
    setInvoiceDetails(details);
    setIsLoadingDetails(false);
  };

  const handleCloseDetails = () => {
    setSelectedInvoiceId(null);
    setInvoiceDetails(null);
  };

  const handleUpdateStato = (id: string, stato: string) => {
    startTransition(async () => {
      await markFatturaStato(id, stato);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Eliminare definitivamente questa fattura?')) {
      startTransition(async () => {
        await deleteFattura(id);
      });
    }
  };

  const filtered = fatture.filter(f => 
    (tab === 'ATTIVE' ? f.tipo === 'ATTIVA' : f.tipo === 'PASSIVA') && 
    (f.soggetto.toLowerCase().includes(search.toLowerCase()) || f.numero.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Receipt size={14} className="text-[#003F61]" />
            <span>Finanza / Contabilità & Fiscale</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Gestione Fatturazione</h1>
          <p className="text-sm text-slate-500 mt-1">Sincronizzazione flussi attivi e passivi, liquidità e scadenziario pagamenti.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAiUploader(true)}
            className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BrainCircuit size={16} className="text-[#003F61]" /> AI Smart Import
          </button>
          <button 
            onClick={() => { setAiData(null); setIsCreateOpen(true); }}
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Nuova Fattura
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Crediti da Incassare</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              € {stats.daIncassare?.toLocaleString('it-IT') || '0'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Fatture attive in sospeso
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Debiti da Pagare</span>
            <div className="p-2 bg-slate-50 text-rose-600 border border-slate-100">
              <TrendingDown size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600 tracking-tight">
              € {stats.daPagare?.toLocaleString('it-IT') || '0'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Esposizione verso fornitori
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Posizione Scaduti</span>
            <div className="p-2 bg-slate-50 text-amber-600 border border-slate-100">
              <AlertCircle size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 tracking-tight">
              € {stats.scadute?.toLocaleString('it-IT') || '0'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pagamenti oltre termine
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Documenti Registrati</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Receipt size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{fatture.length}</div>
            <div className="text-xs text-slate-500 mt-1">
              Fatture a libro contabile
            </div>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex border border-slate-200 w-full sm:w-auto">
          <button 
            onClick={() => setTab('ATTIVE')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              tab === 'ATTIVE' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Fatture Attive (Vendite)
          </button>
          <button 
            onClick={() => setTab('PASSIVE')} 
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              tab === 'PASSIVE' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Fatture Passive (Acquisti)
          </button>
        </div>

        <div className="flex-1 w-full sm:max-w-md relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cerca per numero documento o soggetto..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessuna fattura trovata</p>
            <p className="text-xs text-slate-500 mt-1">Nessun documento corrisponde alla ricerca o al filtro attivo.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Numero / Data</th>
                <th className="px-4 py-3">Soggetto / Fornitore</th>
                <th className="px-4 py-3">Commesse Collegate</th>
                <th className="px-4 py-3">Scadenza</th>
                <th className="px-4 py-3 text-center">Stato</th>
                <th className="px-4 py-3 text-right">Totale Lordo</th>
                <th className="px-4 py-3 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(f => {
                const isScaduta = f.stato !== 'PAGATA' && f.dataScadenza && new Date(f.dataScadenza) < new Date();

                return (
                  <tr key={f.id} onClick={() => handleOpenDetails(f.id)} className="hover:bg-slate-50/80 cursor-pointer transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block hover:text-[#003F61]">
                        {f.numero}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} /> {new Date(f.dataEmissione).toLocaleDateString('it-IT')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {f.soggetto}
                    </td>
                    <td className="px-4 py-3.5">
                      {f.projects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {f.projects.map(p => (
                            <span key={p.id} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold">
                              {p.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {f.dataScadenza ? (
                        <span className={isScaduta ? 'text-red-600 font-bold' : ''}>
                          {new Date(f.dataScadenza).toLocaleDateString('it-IT')}
                          {isScaduta && ' (Scaduta)'}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={f.stato} 
                        onChange={e => handleUpdateStato(f.id, e.target.value)}
                        disabled={isPending}
                        className={`text-xs font-semibold px-2 py-1 border cursor-pointer uppercase tracking-wider ${
                          f.stato === 'PAGATA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          f.stato === 'PARZIALE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          isScaduta ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="DA_PAGARE">Da Pagare</option>
                        <option value="PARZIALE">Parziale</option>
                        <option value="PAGATA">Pagata</option>
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                      € {f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenDetails(f.id); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                      >
                        Dettagli <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <SlideOver 
        isOpen={showAiUploader} 
        onClose={() => setShowAiUploader(false)} 
        title={<div className="text-lg font-bold text-slate-900">Importazione Documenti con IA</div>}
      >
        <AIFatturaUploader 
          onSuccess={handleAiSuccess} 
          onCancel={() => setShowAiUploader(false)} 
        />
      </SlideOver>

      <SlideOver 
        isOpen={isCreateOpen} 
        onClose={() => { setIsCreateOpen(false); setAiData(null); }} 
        title={<div className="text-lg font-bold text-slate-900">{aiData ? 'Importazione AI Completata' : 'Registra Nuovo Documento'}</div>}
      >
        <NuovaFatturaForm 
          defaultTipo={tab === 'ATTIVE' ? 'ATTIVA' : 'PASSIVA'} 
          projects={projects} 
          onSuccess={() => setIsCreateOpen(false)}
          mockData={aiData}
        />
      </SlideOver>

      <SlideOver 
        isOpen={selectedInvoiceId !== null} 
        onClose={handleCloseDetails} 
        title={<div className="text-lg font-bold text-slate-900">{invoiceDetails ? `Dettaglio Fattura ${invoiceDetails.fattura.numero}` : 'Dettaglio Fattura'}</div>}
      >
        {isLoadingDetails ? (
           <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-[#003F61] border-t-transparent animate-spin"></div></div>
        ) : invoiceDetails ? (
           <DettaglioFatturaClient 
             fattura={invoiceDetails.fattura} 
             movimentiRecenti={invoiceDetails.potentialMovimenti}
             onClose={handleCloseDetails}
           />
        ) : (
           <p className="text-slate-500 text-center py-12 text-sm font-semibold">Errore nel caricamento dei dati.</p>
        )}
      </SlideOver>
    </div>
  );
}
