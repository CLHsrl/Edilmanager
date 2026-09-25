'use client';

import { useState } from 'react';
import { User, Shield, LogOut, Save, Mail, KeyRound } from 'lucide-react';
import { updateUserName } from '../settings-actions';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export default function ProfileSettingsClient({ user }: { user: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserName(formData);
      toast.success('Profilo aggiornato con successo');
    } catch (err: any) {
      toast.error(err.message || 'Errore durante l\'aggiornamento del profilo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Dati Personali */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <User size={16} />
            <span>Informazioni Personali Operatore</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-[#003F61] border border-blue-200">
            Account Attivo
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Nome e Cognome *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user?.name || ''}
                required
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Indirizzo Email (Credenziale di Accesso)
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed select-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">L'indirizzo email è gestito come identificativo univoco primario.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? 'Salvataggio in corso...' : 'Salva Modifiche Profilo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Ruolo & Autorizzazioni */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <Shield size={16} />
            <span>Livello di Accesso & Sicurezza</span>
          </div>
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Ruolo:</span>
              <span className="px-2.5 py-0.5 bg-[#FEDE59] text-[#003F61] text-xs font-bold uppercase tracking-wider border border-amber-300">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Disponi dei massimi privilegi di gestione aziendale, approvazione fatture e audit log.
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="h-10 px-5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={15} />
            <span>Disconnetti Sessione</span>
          </button>
        </div>
      </div>
    </div>
  );
}
