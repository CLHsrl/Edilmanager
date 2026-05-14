'use client';

import { useState, useTransition } from 'react';
import { createDdt, deleteDdt } from '@/app/(app)/cantiere-actions';
import { Plus, Trash2, Truck, Calendar, Euro, FileText, X, AlertCircle } from 'lucide-react';
import SlideOver from '@/components/SlideOver';

interface Ddt {
  id: string;
  numeroDdt: string;
  fornitoreId: string | null;
  fornitore: { name: string } | null;
  fornitoreName: string | null;
  data: Date;
  note: string | null;
  importo: number | null;
  articoli: { id: string; descrizione: string; quantita: number; unita: string | null; prezzoUn: number | null }[];
}

interface Fornitore {
  id: string;
  name: string;
}

export default function DdtTab({ projectId, ddts, allFornitori }: { projectId: string; ddts: Ddt[]; allFornitori: Fornitore[] }) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isScanning, setIsScanning] = useState(false);
  const [mockData, setMockData] = useState<any>(null);

  const handleAiImport = () => {
    setIsScanning(true);
    // Simula elaborazione AI
    setTimeout(() => {
      setIsScanning(false);
      setMockData({
        numeroDdt: "AI-" + Math.floor(Math.random() * 1000),
        fornitoreName: "Edilizia Moderna S.p.A.",
        importo: 1250.45,
        note: "Estratto da scansione AI: Materiale edile vario e attrezzatura."
      });
      setIsSlideOpen(true);
    }, 2500);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createDdt(projectId, fd);
      setIsSlideOpen(false);
      setMockData(null);
    });
  }

  async function handleDelete(id: string) {
    if (confirm('Eliminare questo DDT?')) {
      startTransition(async () => { await deleteDdt(id, projectId); });
    }
  }

  const totale = ddts.reduce((s, d) => s + (d.importo ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Logistics & Supply Control</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">
            {ddts.length} Documenti Registrati · Totale Materiali: € {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
           <button 
             onClick={handleAiImport}
             className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
           >
             <Plus size={18} className="text-blue-400" /> Scansione AI
           </button>
           <button 
             onClick={() => { setMockData(null); setIsSlideOpen(true); }} 
             className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all active:scale-95"
           >
             <Plus size={18} /> Nuovo DDT
           </button>
        </div>
      </div>

      {/* List */}
      {ddts.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
          <Truck size={64} className="mx-auto text-slate-100 mb-8" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nessun Carico Rilevato</h3>
          <p className="text-sm text-slate-400 font-medium mt-2">Registra i documenti di trasporto per tracciare l'arrivo dei materiali in cantiere.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dettaglio Documento</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fornitore Autorizzato</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Consegna</th>
                <th className="text-right px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valore Stimato</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ddts.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 group transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm leading-none mb-1.5">{d.numeroDdt}</p>
                        {d.note && <p className="text-[10px] font-medium text-slate-400 italic truncate max-w-[250px]">"{d.note}"</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                      {d.fornitore?.name || d.fornitoreName || 'Fornitore Esterno'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(d.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {d.importo != null ? (
                      <span className="text-lg font-black text-slate-900 tracking-tighter">€ {d.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    ) : <span className="text-slate-200">N.D.</span>}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleDelete(d.id)} disabled={isPending}
                      className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white">
                <td colSpan={3} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Valuation Summary</td>
                <td className="px-8 py-6 text-right">
                  <p className="text-2xl font-black tracking-tighter">€ {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver 
        isOpen={isSlideOpen} 
        onClose={() => { setIsSlideOpen(false); setMockData(null); }} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">📦 <span className="italic text-blue-600">Registro DDT</span></div>}
      >
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4">
            <AlertCircle size={24} className="text-blue-600 shrink-0 mt-1" />
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
               La registrazione del <strong className="text-slate-900 uppercase font-black">Documento di Trasporto</strong> è essenziale per la quadratura del magazzino e la verifica dei costi diretti di cantiere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Codice Documento *</label>
              <input 
                type="text" 
                name="numeroDdt" 
                required 
                placeholder="Es. DDT/2024/001" 
                defaultValue={mockData?.numeroDdt}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data di Entrata *</label>
              <input 
                type="date" 
                name="data" 
                required 
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fornitore Accreditato</label>
            <select name="fornitoreId" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm appearance-none">
              <option value="">-- Seleziona Fornitore --</option>
              {allFornitori.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <div className="pt-2">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 ml-1">Oppure Ragione Sociale Esterna:</p>
              <input 
                type="text" 
                name="fornitoreName" 
                placeholder="Nome fornitore non in anagrafica" 
                defaultValue={mockData?.fornitoreName}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valore Imponibile Stimato (€)</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:scale-125 transition-transform">
                <Euro size={20} />
              </div>
              <input 
                type="number" 
                name="importo" 
                step="0.01" 
                placeholder="0.00" 
                defaultValue={mockData?.importo}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annotazioni Materiale / Packing List</label>
            <textarea 
              name="note" 
              rows={4} 
              placeholder="Elenco materiali, pesi, note sulla qualità della consegna..." 
              defaultValue={mockData?.note}
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all resize-none shadow-sm" 
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 transform active:scale-95"
            >
              {isPending ? 'Sincronizzazione...' : 'Sincronizza Documento'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* AI Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white">
          <div className="relative w-64 h-64 mb-10">
             <div className="absolute inset-0 border-8 border-blue-600/10 rounded-[3rem]"></div>
             <div className="absolute inset-0 border-4 border-blue-600/30 rounded-[3rem] animate-pulse"></div>
             <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] rounded-full animate-[scan_2s_ease-in-out_infinite] z-10"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-40 h-56 bg-white/5 border-2 border-white/10 rounded-xl relative overflow-hidden flex flex-col p-4">
                  <div className="w-3/4 h-2 bg-white/20 rounded mb-2"></div>
                  <div className="w-1/2 h-2 bg-white/10 rounded mb-6"></div>
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-white/5 rounded"></div>
                    <div className="w-full h-1.5 bg-white/5 rounded"></div>
                    <div className="w-3/4 h-1.5 bg-white/5 rounded"></div>
                  </div>
                  <div className="mt-auto flex justify-between">
                    <div className="w-8 h-8 bg-blue-600/20 rounded"></div>
                    <div className="w-16 h-4 bg-white/10 rounded self-center"></div>
                  </div>
               </div>
             </div>
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">AI Document Analysis</h2>
          <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Extracting Supply Chain Intelligence</p>
          
          <style jsx>{`
            @keyframes scan {
              0%, 100% { top: 5% }
              50% { top: 95% }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
