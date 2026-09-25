import { getSafetySettings, updateSafetySettings } from '@/app/(app)/safety-actions';
import { ShieldCheck, Building2, UserCheck, Save } from 'lucide-react';
import SettingsNav from '../SettingsNav';

export default async function SafetySettingsPage() {
  const settings = await getSafetySettings();

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <ShieldCheck size={14} className="text-[#003F61]" />
            <span>Impostazioni / Normativa & Conformità</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Sicurezza & Cantiere (D.Lgs. 81/08)</h1>
          <p className="text-sm text-slate-500 mt-1">Configurazione dati impresa esecutrice e figure di riferimento per la redazione automatica del POS.</p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <SettingsNav />

      {/* Safety Form */}
      <form action={updateSafetySettings} className="space-y-6">
        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
              <Building2 size={16} />
              <span>Dati Impresa Esecutrice (Intestazione POS)</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
              Conforme POS
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Ragione Sociale
              </label>
              <input
                name="companyName"
                defaultValue={settings.companyName}
                required
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Partita IVA / Codice Fiscale
              </label>
              <input
                name="vatId"
                defaultValue={settings.vatId || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Sede Legale (Città)
              </label>
              <input
                name="legalCity"
                defaultValue={settings.legalCity || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Indirizzo Completo Sede Legale
              </label>
              <input
                name="legalAddress"
                defaultValue={settings.legalAddress || ''}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
              <UserCheck size={16} />
              <span>Figure e Incarichi di Sicurezza Obbligatori</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Datore di Lavoro / Resp. Sicurezza
              </label>
              <input
                name="responsabileSicurezza"
                defaultValue={settings.responsabileSicurezza || ''}
                placeholder="Nome e cognome"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                RSPP (Resp. Servizio Prevenzione & Protezione)
              </label>
              <input
                name="rspp"
                defaultValue={settings.rspp || ''}
                placeholder="Nome e cognome"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Medico Competente Sorveglianza Sanitaria
              </label>
              <input
                name="medicoCompetente"
                defaultValue={settings.medicoCompetente || ''}
                placeholder="Dott. / Studio associato"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="h-10 px-6 bg-[#003F61] hover:bg-[#002f49] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save size={15} />
            <span>Salva Parametri Sicurezza</span>
          </button>
        </div>
      </form>
    </div>
  );
}
