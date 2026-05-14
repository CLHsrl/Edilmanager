'use client';

import { useState } from 'react';
import { recognizeText, parseInvoiceText, ParsedInvoiceData } from '@/lib/ocrUtils';
import { Upload, Scan, FileText, Check, AlertCircle, Loader2, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';

interface Props {
  onSuccess: (data: ParsedInvoiceData) => void;
  onCancel: () => void;
}

export default function AIFatturaUploader({ onSuccess, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ParsedInvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResults(null);
      setError(null);
    }
  };

  const runOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const text = await recognizeText(file, (p) => setProgress(p * 100));
      const parsed = parseInvoiceText(text);
      setResults(parsed);
    } catch (err) {
      console.error(err);
      setError('Errore durante l\'analisi del documento. Riprova con un\'immagine più chiara.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
        <Sparkles className="text-blue-600 shrink-0 mt-1" size={20} />
        <div>
          <p className="text-sm font-bold text-blue-900">Intelligenza Artificiale OCR</p>
          <p className="text-xs text-blue-700 leading-relaxed">Carica la foto di una fattura o di un DDT. L'AI estrarrà automaticamente data, importi e fornitori per te.</p>
        </div>
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-700">Trascina qui la foto oppure clicca</p>
            <p className="text-xs text-gray-400">Supporta JPG, PNG fino a 10MB</p>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
            <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => { setFile(null); setPreview(null); setResults(null); }}
              className="absolute top-2 right-2 bg-white/80 backdrop-blur shadow-md px-3 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-white"
            >
              Cambia foto
            </button>
          </div>

          {!results && !isProcessing && (
            <button 
              onClick={runOCR}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              <Scan size={20} /> Inizia Analisi Documento
            </button>
          )}

          {isProcessing && (
            <div className="bg-slate-900 p-8 rounded-[2rem] text-center space-y-6 shadow-2xl reveal">
              <div className="flex justify-center">
                  <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="text-blue-400 animate-pulse" size={24} />
                      </div>
                  </div>
              </div>
              <div>
                  <p className="text-white font-black text-[11px] uppercase tracking-widest mb-2">Analisi AI in corso...</p>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] italic">Estrapolazione importi, scadenze e dati fornitore</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 reveal">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          {results && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                  <Check size={16} />
                </div>
                <h3 className="font-bold text-gray-900">Risultati Estratti</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Data Trovata</p>
                  <p className="font-bold text-gray-900">{results.date || '---'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Totale Stimato</p>
                  <p className="font-bold text-blue-600 text-lg">{results.total ? results.total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }) : '---'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Partita IVA / Fornitore</p>
                  <p className="font-bold text-gray-900">{results.vatNumber || '---'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <button 
                  onClick={() => onSuccess(results)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                 >
                   Verifica e Conferma <ArrowRight size={18} />
                 </button>
                 <button 
                  onClick={() => setResults(null)}
                  className="px-4 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50"
                 >
                   Riprova
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="pt-8 flex justify-center">
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xs font-bold underline">
          Annulla e inserisci manualmente
        </button>
      </div>
    </div>
  );
}
