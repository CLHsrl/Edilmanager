'use client';

import { useState } from 'react';
import { User, Shield, LogOut, Save, Crown, Users, ChevronDown } from 'lucide-react';
import { updateUserName, updateUserRole, transferAdmin } from '../settings-actions';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

const ALL_ROLES = [
  { value: 'ADMIN',      label: 'Admin',      desc: 'Accesso completo, può cambiare ruoli e impostazioni di sistema' },
  { value: 'PM',         label: 'Project Manager', desc: 'Gestione cantieri, preventivi, workflow e documenti' },
  { value: 'ACCOUNTANT', label: 'Contabile',   desc: 'Accesso a fatture, cassa, movimenti e report finanziari' },
  { value: 'WORKER',     label: 'Operaio',     desc: 'Visualizza cantieri assegnati, rapportini e timbrature' },
  { value: 'VIEWER',     label: 'Visualizzatore', desc: 'Solo lettura senza possibilità di modifiche' },
];

interface StaffUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function ProfileSettingsClient({
  user,
  staffUsers,
}: {
  user: any;
  staffUsers: StaffUser[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isRoleSaving, setIsRoleSaving] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

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

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsRoleSaving(userId);
    const fd = new FormData();
    fd.set('userId', userId);
    fd.set('role', newRole);
    try {
      await updateUserRole(fd);
      toast.success('Ruolo aggiornato');
    } catch (err: any) {
      toast.error(err.message || 'Errore');
    } finally {
      setIsRoleSaving(null);
    }
  };

  const handleTransferAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('Sei sicuro? Perderai i privilegi di ADMIN e diventerai PM.')) return;
    setIsTransferring(true);
    const formData = new FormData(e.currentTarget);
    try {
      await transferAdmin(formData);
      toast.success('Ruolo ADMIN trasferito. Verrai disconnesso.');
      setTimeout(() => signOut({ callbackUrl: '/login' }), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Errore durante il trasferimento');
    } finally {
      setIsTransferring(false);
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
              <input
                type="email"
                defaultValue={user?.email || ''}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">L'indirizzo email è l'identificativo univoco primario.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? 'Salvataggio...' : 'Salva Modifiche Profilo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Gestione Ruoli Staff (solo ADMIN) */}
      {isAdmin && (
        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
              <Users size={16} />
              <span>Gestione Ruoli Staff</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Assegna o modifica il ruolo di ogni membro dello staff. Tutti i ruoli disponibili sono selezionabili.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {staffUsers.map((u) => (
              <div key={u.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{u.name || '—'}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      defaultValue={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={isRoleSaving === u.id}
                      className="appearance-none h-9 pl-3 pr-8 border border-slate-200 text-xs font-bold uppercase bg-slate-50 text-slate-800 focus:outline-none focus:border-[#003F61] disabled:opacity-50 cursor-pointer"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {isRoleSaving === u.id && (
                    <span className="text-[11px] text-slate-400">Salvataggio...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Trasferisci ruolo ADMIN (solo ADMIN) */}
      {isAdmin && (
        <div className="bg-white border border-amber-200">
          <div className="p-4 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
            <Crown size={16} className="text-amber-600" />
            <div>
              <p className="text-sm font-bold text-amber-800">Trasferisci ruolo Amministratore</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Potrai cedere il ruolo ADMIN a un altro membro dello staff. Diventerai PM e verrai disconnesso.
              </p>
            </div>
          </div>

          <form onSubmit={handleTransferAdmin} className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <select
                  name="newAdminId"
                  required
                  className="w-full appearance-none h-10 pl-3 pr-8 border border-slate-200 text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-amber-400"
                >
                  <option value="">— Seleziona nuovo Amministratore —</option>
                  {staffUsers
                    .filter((u) => u.id !== user?.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.email} ({u.role})
                      </option>
                    ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={isTransferring}
                className="h-10 px-5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                <Crown size={14} />
                {isTransferring ? 'Trasferimento...' : 'Trasferisci Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Ruolo corrente & Disconnetti */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2 font-bold text-sm text-[#003F61]">
          <Shield size={16} />
          <span>Sessione Corrente</span>
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
              {ALL_ROLES.find((r) => r.value === user?.role)?.desc || ''}
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
