'use client';

import { useState } from 'react';
import { Building2, Save, MapPin, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { updateCompanyProfile } from '../settings-actions';
import { toast } from 'sonner';

export default function CompanySettingsClient({ company }: { company: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateCompanyProfile(formData);
      toast.success('Dati aziendali aggiornati con successo');
    } catch (err: any) {
      toast.error(err.message || 'Errore durante il salvataggio dei dati aziendali');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Dati Anagrafici & Fiscali */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <Building2 size={16} />
            <span>Anagrafica Fiscale & Ragione Sociale</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-[#003F61] border border-blue-200">
            Dati Ufficiali
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Ragione Sociale Impresa *
            </label>
            <input
              type="text"
              name="companyName"
              defaultValue={company?.companyName || ''}
              required
              placeholder="Es. RifacciamoCasa S.r.l."
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Partita IVA / Codice Fiscale *
            </label>
            <input
              type="text"
              name="vatId"
              defaultValue={company?.vatId || ''}
              placeholder="Es. IT12345678901"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Codice Destinatario SDI / PEC Fatturazione
            </label>
            <input
              type="text"
              name="sdiPec"
              defaultValue={company?.sdiPec || ''}
              placeholder="Es. M5UXCR1 oppure amministrazione@pec.it"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>
        </div>
      </div>

      {/* 2. Sede Legale & Operativa */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <MapPin size={16} />
            <span>Sede Legale & Recapiti</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Indirizzo (Via, Piazza, N. Civico)
            </label>
            <input
              type="text"
              name="legalAddress"
              defaultValue={company?.legalAddress || ''}
              placeholder="Es. Via Roma, 45"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Città
            </label>
            <input
              type="text"
              name="legalCity"
              defaultValue={company?.legalCity || ''}
              placeholder="Es. Milano"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>
        </div>
      </div>

      {/* 3. Incarichi e Responsabili Sicurezza */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <ShieldAlert size={16} />
            <span>Responsabili Sicurezza & Cantiere</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Responsabile Sicurezza Lavoro
            </label>
            <input
              type="text"
              name="responsabileSicurezza"
              defaultValue={company?.responsabileSicurezza || ''}
              placeholder="Nome e cognome"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              RSPP Aziendale
            </label>
            <input
              type="text"
              name="rspp"
              defaultValue={company?.rspp || ''}
              placeholder="Nome e cognome"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Medico Competente
            </label>
            <input
              type="text"
              name="medicoCompetente"
              defaultValue={company?.medicoCompetente || ''}
              placeholder="Dott. / Studio"
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
            />
          </div>
        </div>
      </div>

      {/* Salva */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 px-6 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Save size={15} />
          <span>{isSaving ? 'Salvataggio in corso...' : 'Salva Dati Aziendali'}</span>
        </button>
      </div>
    </form>
  );
}
