'use client';

import { useState } from 'react';
import { loginClient } from './actions';
import { ShieldCheck, ArrowRight, Building2, Loader2 } from 'lucide-react';

export default function ClientPortalLogin() {
  const [taxId, setTaxId] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      await loginClient(taxId);
    } catch (err: any) {
      setError(err.message || "Accesso non riuscito.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 mb-6 animate-in zoom-in-50 duration-500">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Area Committente</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Enterprise Construction Suite</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-800 mb-2 text-center">Benvenuto nel tuo Progetto</h2>
            <p className="text-sm text-gray-400 text-center leading-relaxed font-medium">Inserisci la tua Partita IVA o Codice Fiscale per accedere allo stato avanzamento lavori in tempo reale.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block ml-1">Codice di Accesso *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="P.IVA / CF..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm font-black text-gray-900 focus:outline-none transition-all placeholder:text-gray-300"
                />
                <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-blue-600 transition-colors" size={20} />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !taxId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
              {isPending ? 'AUTENTICAZIONE...' : 'ACCEDI AL PORTALE'}
              {!isPending && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> }
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          Sistemi di Sicurezza Crittografati v2.1
        </p>
      </div>
    </div>
  );
}
