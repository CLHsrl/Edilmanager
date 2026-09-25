import { getCompanyProfile } from '../settings-actions';
import CompanySettingsClient from './CompanySettingsClient';
import SettingsNav from '../SettingsNav';
import { Building2 } from 'lucide-react';

export default async function CompanySettingsPage() {
  const company = await getCompanyProfile();

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Building2 size={14} className="text-[#003F61]" />
            <span>Impostazioni / Impresa & Sede Legale</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Dati Aziendali & Fiscali</h1>
          <p className="text-sm text-slate-500 mt-1">Configura intestazione fatture, P.IVA, PEC e riferimenti legali per la documentazione.</p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <SettingsNav />

      {/* Main Settings Form */}
      <CompanySettingsClient company={company} />
    </div>
  );
}
