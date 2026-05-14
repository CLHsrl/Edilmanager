'use client';

import { useState, useTransition } from 'react';
import { createFattura } from '@/app/(app)/fatture-actions';
import { Folder, Send, Receipt } from 'lucide-react';

interface Project { id: string; name: string; number: number | null }

export default function NuovaFatturaForm({ 
  defaultTipo, 
  projects, 
  onSuccess,
  mockData 
}: { 
  defaultTipo: string; 
  projects: Project[];
  onSuccess: () => void;
  mockData?: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [tipo, setTipo] = useState(mockData?.tipo || defaultTipo);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  const [importo, setImporto] = useState<number | string>(mockData?.importo || '');
  const [iva, setIva] = useState<number | string>(mockData?.iva || 22);

  const parsedImporto = typeof importo === 'string' ? parseFloat(importo) || 0 : importo;
  const parsedIva = typeof iva === 'string' ? parseFloat(iva) || 0 : iva;
  const totale = parsedImporto + (parsedImporto * parsedIva / 100);

  const toggleProject = (id: string) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('tipo', tipo);
    fd.set('projectIds', JSON.stringify(selectedProjects));
    
    startTransition(async () => {
      await createFattura(fd);
      onSuccess();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      {/* Tipo Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full">
        <button type="button" onClick={() => setTipo('ATTIVA')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tipo === 'ATTIVA' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          Fattura Attiva
        </button>
        <button type="button" onClick={() => setTipo('PASSIVA')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tipo === 'PASSIVA' ? 'bg-white shadow text-red-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Fattura Passiva
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">
             {tipo === 'ATTIVA' ? 'Cliente / Committente' : 'Fornitore / Prestatore'} *
          </label>
          <input type="text" name="soggetto" required defaultValue={mockData?.soggetto}
            placeholder={tipo === 'ATTIVA' ? "Nome cliente..." : "Nome fornitore..."}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Numero Documento *</label>
            <input type="text" name="numero" required defaultValue={mockData?.numero}
              placeholder="Es. FPA-12/26"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black font-mono text-slate-900 placeholder:text-slate-300" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Data Scadenza</label>
            <input type="date" name="dataScadenza" defaultValue={mockData?.dataScadenza}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Data Emissione *</label>
          <input type="date" name="dataEmissione" required defaultValue={mockData?.dataEmissione || new Date().toISOString().slice(0, 10)}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900" />
        </div>
      </div>

      {/* Importi */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Imponibile (€) *</label>
            <input type="number" name="importo" required step="0.01" value={importo} onChange={e => setImporto(e.target.value)}
              className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-lg focus:outline-none transition-all font-black text-slate-900" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">IVA (%) *</label>
            <select name="iva" value={iva} onChange={e => setIva(e.target.value)} className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
              <option value="22">22% — Ordinaria</option>
              <option value="10">10% — Agevolata</option>
              <option value="4">4% — Agevolata</option>
              <option value="0">0% — Esente/N.I.</option>
            </select>
          </div>
        </div>
        <div className="pt-2 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totale a pagare</span>
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">€ {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Cantieri */}
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Associa ai Cantieri</label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {projects.map(p => {
            const checked = selectedProjects.includes(p.id);
            return (
              <button type="button" key={p.id} onClick={() => toggleProject(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-2 ${
                  checked ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                <Folder size={14} className={checked ? "text-blue-200" : "text-slate-400"} /> 
                {p.number ? `#${p.number}` : p.name.substring(0, 20)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8">
        <button type="submit" disabled={isPending}
          className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2">
          {isPending ? 'ELABORAZIONE...' : <><Receipt size={18} /> REGISTRA DOCUMENTO</>}
        </button>
      </div>
    </form>
  );
}
