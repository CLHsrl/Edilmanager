'use client';

import { useState, useTransition } from 'react';
import { createSal, deleteSal, generateFatturaFromSal } from '@/app/(app)/cantiere-actions';
import { Plus, Trash2, BarChart2, Calendar, FileText, CheckCircle2, ArrowRight, X, Receipt, TrendingUp, Loader2 } from 'lucide-react';
import SlideOver from '@/components/SlideOver';
import { toast } from 'sonner';

interface SalVoce { id: string; descrizione: string; percentuale: number; importoVoce: number }
interface Sal { id: string; numero: number; data: Date; note: string | null; importo: number; voci: SalVoce[]; stato?: string }

export default function SalTab({ projectId, sals, budgetTotale }: { projectId: string; sals: Sal[]; budgetTotale: number }) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [voci, setVoci] = useState<{ descrizione: string; percentuale: number; importoVoce: number }[]>([{ descrizione: '', percentuale: 0, importoVoce: 0 }]);

  const addVoce = () => setVoci(v => [...v, { descrizione: '', percentuale: 0, importoVoce: 0 }]);
  const removeVoce = (i: number) => setVoci(v => v.filter((_, idx) => idx !== i));
  const updateVoce = (i: number, field: string, value: string | number) =>
    setVoci(v => v.map((voce, idx) => idx === i ? { ...voce, [field]: value } : voce));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('voci', JSON.stringify(voci.filter(v => v.descrizione)));
    startTransition(async () => {
      await createSal(projectId, fd);
      setIsSlideOpen(false);
      setVoci([{ descrizione: '', percentuale: 0, importoVoce: 0 }]);
    });
  }

  const totaleAccertato = sals.reduce((s, sal) => s + sal.importo, 0);
  const avanzamento = budgetTotale > 0 ? (totaleAccertato / budgetTotale) * 100 : 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Header + Avanzamento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
           <div className="flex justify-between items-start mb-8 relative z-10">
             <div>
               <div className="page-label m-0 mb-2">
                 <Receipt className="text-blue-600" size={14} />
                 Financial Milestone Tracking
               </div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Emission Control</h2>
             </div>
             <button 
                onClick={() => setIsSlideOpen(true)} 
                className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all transform active:scale-95"
             >
               <Plus size={18} /> Nuovo SAL
             </button>
           </div>
           
           <div className="flex items-center gap-6 pt-4 relative z-10">
             <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner">
               <TrendingUp size={32} />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capitale Accertato</p>
               <p className="text-4xl font-black text-slate-900 tracking-tighter">€ {totaleAccertato.toLocaleString('it-IT')}</p>
             </div>
           </div>
        </div>

        {budgetTotale > 0 && (
          <div className="lg:col-span-5 bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avanzamento Certificato</span>
                <span className="text-4xl font-black text-blue-400 tracking-tighter leading-none">{avanzamento.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  style={{ width: `${Math.min(avanzamento, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rimanenza</p>
                <p className="text-sm font-bold">€ {(budgetTotale - totaleAccertato).toLocaleString('it-IT')}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Budget Totale</p>
                <p className="text-sm font-bold">€ {budgetTotale.toLocaleString('it-IT')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-6">
        {sals.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
            <CheckCircle2 size={64} className="mx-auto text-slate-100 mb-8" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nessun Dato Rilevato</h3>
            <p className="text-sm text-slate-400 font-medium mt-2 max-w-xs mx-auto">Certifica il primo stato di avanzamento lavori per sbloccare la fatturazione attiva.</p>
          </div>
        ) : (
          <div className="space-y-6">
          {sals.map(sal => (
            <div key={sal.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 hover:shadow-xl hover:border-blue-600/20 transition-all group relative overflow-hidden">
              {sal.stato === 'FATTURATO' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12"></div>
              )}
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-8">
                  <div className="bg-slate-900 text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">
                    #{sal.numero}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                       <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Milestone Certificata</h4>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                         sal.stato === 'FATTURATO' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {sal.stato === 'FATTURATO' ? 'Fatturato' : 'Emesso'}
                       </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar size={12} className="text-blue-500" /> Registro del {new Date(sal.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 w-full xl:w-auto">
                  <div className="text-right w-full sm:w-auto">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">€ {sal.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 italic">Valore Accertato</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {sal.stato !== 'FATTURATO' ? (
                      <button 
                        onClick={() => {
                          startTransition(async () => {
                            try {
                              await generateFatturaFromSal(sal.id, projectId);
                              toast.success('Fattura generata con successo!');
                            } catch (error: any) {
                              toast.error(error.message || 'Errore durante la generazione della fattura');
                            }
                          });
                        }}
                        disabled={isPending}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10 active:scale-95"
                      >
                        <Receipt size={14} /> Fattura 1-Click
                      </button>
                    ) : (
                       <div className="flex-1 sm:flex-none bg-slate-50 text-slate-400 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                         <FileText size={14} /> Documento Emesso
                       </div>
                    )}

                    <button onClick={() => { if(confirm('Eliminare questo SAL?')) startTransition(async () => { await deleteSal(sal.id, projectId); }) }} disabled={isPending}
                      className="p-3.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {sal.voci.length > 0 && (
                <div className="mt-10 pt-10 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sal.voci.map(v => (
                    <div key={v.id} className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-50 hover:border-blue-600/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.descrizione}</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{v.percentuale}%</span>
                      </div>
                      <div className="h-1 bg-slate-200/50 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(v.percentuale, 100)}%` }} />
                      </div>
                      <p className="text-lg font-black text-slate-900 tracking-tighter">€ {v.importoVoce.toLocaleString('it-IT')}</p>
                    </div>
                  ))}
                </div>
              )}

              {sal.note && (
                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
                  <div className="absolute top-4 left-6">
                    <FileText size={14} className="text-blue-500 opacity-30" />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-7">Rilievi & Verbali</p>
                  <p className="text-sm text-slate-600 font-medium italic leading-relaxed ml-7">"{sal.note}"</p>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>

      {/* SlideOver Form */}
      <SlideOver 
        isOpen={isSlideOpen} 
        onClose={() => setIsSlideOpen(false)} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">💰 <span className="italic text-blue-600">Nuovo SAL</span></div>}
      >
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-slate-400 text-[11px] font-medium leading-relaxed shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16"></div>
            <p className="relative z-10">
              La certificazione di un <strong className="text-white uppercase font-black">SAL</strong> costituisce il titolo per la riscossione dei compensi maturati. Assicurarsi che i dati siano conformi al giornale dei lavori.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data di Rilevazione *</label>
              <input 
                type="date" 
                name="data" 
                required 
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Importo Complessivo (€) *</label>
              <input 
                type="number" 
                name="importo" 
                step="0.01" 
                required 
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note & Verbali</label>
            <textarea 
              name="note" 
              rows={3} 
              placeholder="Dettagli sulle lavorazioni certificate..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-5 text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all resize-none shadow-sm" 
            />
          </div>

          {/* Voci di Dettaglio */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-10 py-6 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scomposizione Analitica</span>
              <button 
                type="button" 
                onClick={addVoce} 
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              {voci.map((v, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-50 relative group transition-all hover:border-blue-100">
                  <div className="flex-1 w-full">
                     <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 block ml-1">Voce / Categoria</label>
                     <input 
                        type="text" 
                        placeholder="Es: Opere strutturali" 
                        value={v.descrizione} 
                        onChange={e => updateVoce(i, 'descrizione', e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all shadow-sm" 
                     />
                  </div>
                  <div className="flex gap-6 w-full md:w-auto">
                    <div className="w-24 relative">
                       <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 block ml-1">%</label>
                       <input 
                          type="number" 
                          placeholder="0" 
                          value={v.percentuale} 
                          min={0} max={100} step={0.1} 
                          onChange={e => updateVoce(i, 'percentuale', parseFloat(e.target.value))}
                          className="w-full bg-white border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-xs font-black text-blue-600 outline-none focus:border-blue-600 transition-all text-right shadow-sm" 
                       />
                       <span className="absolute right-3 top-10 text-[10px] font-black text-slate-300">%</span>
                    </div>
                    <div className="w-32">
                       <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 block ml-1">Importo</label>
                       <input 
                          type="number" 
                          placeholder="0.00" 
                          value={v.importoVoce} 
                          min={0} step={0.01} 
                          onChange={e => updateVoce(i, 'importoVoce', parseFloat(e.target.value))}
                          className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-black text-slate-900 outline-none focus:border-blue-600 transition-all text-right shadow-sm" 
                       />
                    </div>
                  </div>
                  {voci.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeVoce(i)} 
                      className="absolute -top-3 -right-3 md:static p-2.5 text-slate-200 hover:text-red-500 bg-white md:bg-transparent rounded-full shadow-lg md:shadow-none border border-slate-100 md:border-0 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              {voci.length === 0 && (
                <p className="text-center py-10 text-[10px] font-black text-slate-200 uppercase tracking-[0.3em] italic">Compilazione analitica opzionale</p>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-60 text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 transform active:scale-95"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Emetti Certificato SAL</>}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
