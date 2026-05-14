'use client';

import { useState, useTransition } from 'react';
import { createFattura, markFatturaStato, deleteFattura, getFatturaDetails } from '@/app/(app)/fatture-actions';
import { 
  Receipt, Plus, Search, Folder, Calendar, Trash2, 
  CheckCircle2, Clock, AlertCircle, Sparkles, TrendingUp, 
  TrendingDown, ArrowUpRight, BrainCircuit, LayoutGrid, List,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
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
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <Receipt className="text-blue-600" size={14} />
            Financial Ledger & Procurement Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gestione Fatturazione</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Sincronizzazione flussi attivi/passivi e scadenziario fiscale con AI integration</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
                onClick={() => setShowAiUploader(true)}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
                <BrainCircuit size={18} /> AI Smart Import
            </button>
            <button 
                onClick={() => { setAiData(null); setIsCreateOpen(true); }}
                className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
                <Plus size={18} /> Registra Fattura
            </button>
        </div>
      </div>

      {/* Strategic KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Crediti (Da Incassare)</p>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">€ {stats.daIncassare.toLocaleString('it-IT')}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Cash-in previsto entro 30gg</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-rose-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                    <TrendingDown size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Debiti (Da Pagare)</p>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">€ {stats.daPagare.toLocaleString('it-IT')}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Esposizione verso fornitori</p>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-orange-500">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <AlertCircle size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posizione Scaduti</p>
            </div>
            <p className="text-4xl font-black text-orange-600 tracking-tighter leading-none">€ {stats.scadute.toLocaleString('it-IT')}</p>
            <p className="text-[10px] font-bold text-orange-600 uppercase mt-4 italic tracking-wider">Richiede attenzione immediata</p>
         </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full md:w-auto">
              <button 
                onClick={() => setTab('ATTIVE')} 
                className={`flex-1 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'ATTIVE' ? 'bg-white shadow-md text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Fatture Attive
              </button>
              <button 
                onClick={() => setTab('PASSIVE')} 
                className={`flex-1 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'PASSIVE' ? 'bg-white shadow-md text-blue-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Fatture Passive
              </button>
            </div>

            <div className="flex-1 w-full relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Cerca numero o soggetto..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
            </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-24 text-center">
            <Receipt size={48} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest">Nessun documento finanziario rilevato</p>
            <p className="text-xs text-slate-400 mt-2">Modifica la ricerca o registra una nuova fattura.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-6">Documento / Ref</th>
                <th className="px-6 py-6">Soggetto Stakeholder</th>
                <th className="px-6 py-6 text-center">Compliance Scadenza</th>
                <th className="px-6 py-6">Status Ledger</th>
                <th className="px-6 py-6 text-right">Totale Lordo</th>
                <th className="px-10 py-6 text-right">Dettagli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(f => {
                const isScaduta = f.stato !== 'PAGATA' && f.dataScadenza && new Date(f.dataScadenza) < new Date();

                return (
                  <tr key={f.id} onClick={() => handleOpenDetails(f.id)} className="hover:bg-slate-50/50 cursor-pointer transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tab === 'ATTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          <Receipt size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors">
                            {f.numero}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                             <Calendar size={10} /> {new Date(f.dataEmissione).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-bold text-slate-700 text-sm uppercase tracking-tight truncate max-w-[200px]">{f.soggetto}</p>
                      {f.projects.length > 0 && (
                        <div className="flex gap-1 mt-2">
                           {f.projects.map(p => (
                             <span key={p.id} className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                               <Folder size={8} /> {p.number ? `#${p.number}` : p.name}
                             </span>
                           ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6 text-center">
                      {f.dataScadenza ? (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            isScaduta ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                           {isScaduta && <AlertCircle size={12} />}
                           {new Date(f.dataScadenza).toLocaleDateString('it-IT')}
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={f.stato} 
                        onChange={e => handleUpdateStato(f.id, e.target.value)}
                        disabled={isPending}
                        className={`text-[10px] font-black px-4 py-2 rounded-xl border-none cursor-pointer focus:ring-0 uppercase tracking-widest appearance-none text-center min-w-[120px] transition-all ${
                          f.stato === 'PAGATA' ? 'bg-emerald-50 text-emerald-700' :
                          f.stato === 'PARZIALE' ? 'bg-yellow-50 text-yellow-700' :
                          isScaduta ? 'bg-rose-50 text-rose-700' :
                          'bg-slate-50 text-slate-500'
                        }`}
                      >
                        <option value="DA_PAGARE">Da Pagare</option>
                        <option value="PARZIALE">Parziale</option>
                        <option value="PAGATA">Pagata</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className={`font-black text-lg tracking-tighter ${tab === 'ATTIVE' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        € {f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tax: € {(f.totale - f.importo).toLocaleString('it-IT')}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
                          <ArrowRight size={18} />
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
        title="Importazione Documenti con IA"
      >
        <AIFatturaUploader 
          onSuccess={handleAiSuccess} 
          onCancel={() => setShowAiUploader(false)} 
        />
      </SlideOver>

      <SlideOver 
        isOpen={isCreateOpen} 
        onClose={() => { setIsCreateOpen(false); setAiData(null); }} 
        title={aiData ? 'Importazione AI Completata' : 'Registra Nuovo Documento'}
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
        title={invoiceDetails ? `Dettaglio ${invoiceDetails.fattura.numero}` : 'Caricamento...'}
      >
        {isLoadingDetails ? (
           <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div></div>
        ) : invoiceDetails ? (
           <DettaglioFatturaClient 
             fattura={invoiceDetails.fattura} 
             movimentiRecenti={invoiceDetails.potentialMovimenti}
             onClose={handleCloseDetails}
           />
        ) : (
           <p className="text-slate-500 text-center py-12 font-black uppercase tracking-widest">Errore nel caricamento dei dati.</p>
        )}
      </SlideOver>
    </div>
  );
}
