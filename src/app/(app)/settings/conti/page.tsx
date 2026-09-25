import { getConti } from '../settings-actions';
import ContiSettingsClient from './ContiSettingsClient';
import SettingsNav from '../SettingsNav';
import { CreditCard } from 'lucide-react';

export default async function ContiSettingsPage() {
  const conti = await getConti();

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <CreditCard size={14} className="text-[#003F61]" />
            <span>Impostazioni / Tesoreria & Banche</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Conti Bancari & Casse</h1>
          <p className="text-sm text-slate-500 mt-1">Configura gli IBAN aziendali, conti correnti operativi e casse per i movimenti di cantiere.</p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <SettingsNav />

      {/* Main Form */}
      <ContiSettingsClient initialConti={conti} />
    </div>
  );
}
