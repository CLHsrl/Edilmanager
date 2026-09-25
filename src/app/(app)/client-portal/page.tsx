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
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-[#003F61] text-[#FEDE59] border border-[#003F61] mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
            Area Riservata Committente
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">
            EDILMANAGER24 • Portale Trasparenza Cantieri
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Accedi al Tuo Progetto
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inserisci la Partita IVA o il Codice Fiscale dell'intestatario della commessa per visualizzare avanzamento, SAL e documentazione in tempo reale.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Codice Fiscale / Partita IVA *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="Es. 01234567890 o RSSMRA80A01H501U"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#003F61] placeholder:text-slate-400"
                />
                <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 text-xs font-bold border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !taxId}
              className="w-full h-12 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
              {isPending ? 'AUTENTICAZIONE...' : 'ACCEDI AL PORTALE'}
              {!isPending && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400 uppercase tracking-wider">
          Connessione Crittografata SSL • Edilmanager24
        </p>
      </div>
    </div>
  );
}
