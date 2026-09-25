import { getCurrentUser, getStaffUsers } from '../settings-actions';
import ProfileSettingsClient from './ProfileSettingsClient';
import SettingsNav from '../SettingsNav';
import { UserCheck } from 'lucide-react';

export default async function ProfileSettingsPage() {
  const [user, staffUsers] = await Promise.all([
    getCurrentUser(),
    getStaffUsers(),
  ]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <UserCheck size={14} className="text-[#003F61]" />
            <span>Impostazioni / Credenziali &amp; Accesso</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Profilo Operativo &amp; Account</h1>
          <p className="text-sm text-slate-500 mt-1">Aggiorna le informazioni del tuo account, gestisci ruoli e permessi dello staff.</p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <SettingsNav />

      {/* Main Form */}
      <ProfileSettingsClient user={user} staffUsers={staffUsers} />
    </div>
  );
}
