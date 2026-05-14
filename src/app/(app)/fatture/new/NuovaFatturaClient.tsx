'use client';

import { useState, useTransition } from 'react';
import { createFattura } from '@/app/(app)/fatture-actions';
import { useRouter } from 'next/navigation';
import { Folder, ArrowLeft, Send, Sparkles, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { recognizeText, parseInvoiceText } from '@/lib/ocrUtils';
import { useRef } from 'react';

interface Project { id: string; name: string; number: number | null }
interface Fornitore { id: string; ragioneSociale: string | null; vatId: string | null; dataScadenzaDurc: Date | null }

export default function NuovaFatturaClient({ defaultTipo, projects, fornitori }: { defaultTipo: string; projects: Project[]; fornitori: Fornitore[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [tipo, setTipo] = useState(defaultTipo);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  // Real-time calculation logic
  const [soggetto, setSoggetto] = useState('');
  const [numero, setNumero] = useState('');
  const [importo, setImporto] = useState<number | string>('');
  const [iva, setIva] = useState<number | string>(22);
  const [dataEmissione, setDataEmissione] = useState(new Date().toISOString().slice(0, 10));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setIsAiScanning(true);
    setOcrProgress(0);
    try {
      const text = await recognizeText(f, (p) => setOcrProgress(p * 100));
      const results = parseInvoiceText(text);

      if (results.vatNumber) setSoggetto(results.vatNumber);
      if (results.date) setDataEmissione(results.date);
      if (results.total) setImporto(results.total.toString());
      
      // We don't have a reliable regex for invoice number yet, generating a placeholder if missing
      setNumero(`FPA-OCR/${new Date().getFullYear()}`);

    } catch (err) {
      console.error("OCR Error:", err);
      alert("Errore durante la scansione del documento. Assicurati che l'immagine sia leggibile.");
    } finally {
      setIsAiScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/fatture" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16} /> Torna a Fatture
      </Link>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-8">
        
        {/* Intestazione */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registrazione Pagina Documento</h2>
            <p className="text-sm text-gray-500">Inserisci i dettagli del documento fiscale.</p>
          </div>
          
          {/* Tipo Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-max">
            <button type="button" onClick={() => setTipo('ATTIVA')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tipo === 'ATTIVA' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Fattura Attiva
            </button>
            <button type="button" onClick={() => setTipo('PASSIVA')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tipo === 'PASSIVA' ? 'bg-white shadow text-red-500' : 'text-gray-500 hover:text-gray-700'}`}>
              Fattura Passiva
            </button>
          </div>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isAiScanning}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-purple-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isAiScanning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
            {isAiScanning ? `Analisi AI in corso (${ocrProgress.toFixed(0)}%)...` : 'Importa con AI (OCR)'}
          </button>
        </div>

        {/* AI Scanning Animation Overlay */}
        {isAiScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" style={{ top: '150px' }}>
            <div className="w-full h-full bg-purple-400 blur-sm shadow-[0_0_15px_purple]"></div>
          </div>
        )}

        {/* Dati Base */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest border-b border-gray-100 pb-2">Dati Documento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                 {tipo === 'ATTIVA' ? 'Cliente' : 'Fornitore'} *
              </label>
              <input type="text" name="soggetto" required list="fornitori-list" placeholder={tipo === 'ATTIVA' ? "Nome cliente o P.IVA..." : "Seleziona o scrivi fornitore..."}
                value={soggetto} onChange={e => setSoggetto(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              
              {tipo === 'PASSIVA' && (
                <datalist id="fornitori-list">
                  {fornitori.map(f => <option key={f.id} value={f.ragioneSociale || ''} />)}
                </datalist>
              )}

              {/* LIVE DURC CHECK VISUAL WARNING */}
              {tipo === 'PASSIVA' && soggetto && fornitori.find(f => f.ragioneSociale === soggetto)?.dataScadenzaDurc && new Date(fornitori.find(f => f.ragioneSociale === soggetto)!.dataScadenzaDurc!) < new Date() && (
                <div className="mt-2 text-[10px] uppercase font-black tracking-wider text-red-600 bg-red-50 p-2 rounded border border-red-200 flex items-center gap-1.5 animate-pulse">
                  <span>🚨 ATTENZIONE: FORNITORE CON DURC SCADUTO. IL SALVATAGGIO VERRÀ BLOCCATO.</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Numero Fattura *</label>
              <input type="text" name="numero" required placeholder="Es. FPA-12/26"
                value={numero} onChange={e => setNumero(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Data Emissione *</label>
              <input type="date" name="dataEmissione" required value={dataEmissione} onChange={e => setDataEmissione(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Data Scadenza prevista</label>
              <input type="date" name="dataScadenza"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>

        {/* Associazione Progetti */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest border-b border-gray-100 pb-2">Destinazione (Cantieri)</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-3 font-semibold">Seleziona i cantieri a cui la fattura o lo split fa riferimento:</p>
            <div className="flex flex-wrap gap-2">
              {projects.map(p => {
                const checked = selectedProjects.includes(p.id);
                return (
                  <button type="button" key={p.id} onClick={() => toggleProject(p.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
                      checked ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    <Folder size={14} className={checked ? "text-blue-200" : "text-gray-400"} /> 
                    {p.number ? `Prog. #${p.number}` : p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Riepilogo Costi */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest border-b border-gray-100 pb-2">Importi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Imponibile (€) *</label>
              <input type="number" name="importo" required step="0.01" value={importo} onChange={e => setImporto(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">IVA (%) *</label>
              <select name="iva" value={iva} onChange={e => setIva(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                <option value="22">22% Ordinaria</option>
                <option value="10">10% Agevolata</option>
                <option value="4">4% Agevolata</option>
                <option value="0">0% Esente / Inversione</option>
              </select>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3 flex flex-col justify-center">
              <span className="text-xs font-semibold text-gray-400 uppercase">Totale Documento</span>
              <span className="text-2xl font-bold text-gray-900">€ {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Note (Es. Riferimento SAL)</label>
            <textarea name="note" rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2">
            {isPending ? 'Creazione in corso...' : <>Registra Fattura <Send size={16} /></>}
          </button>
        </div>

      </form>
    </div>
  );
}
