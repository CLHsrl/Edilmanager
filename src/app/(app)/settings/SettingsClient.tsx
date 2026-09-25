'use client';

import Link from 'next/link';
import { 
  Building2, CreditCard, ShieldCheck, UserCheck, 
  ArrowRight, Settings, CheckCircle2, AlertCircle, Shield, LogOut 
} from 'lucide-react';
import SettingsNav from './SettingsNav';
import { signOut } from 'next-auth/react';

export default function SettingsClient({ user, company, conti }: { user: any; company: any; conti: any[] }) {
  const settingsModules = [
    {
      title: 'Dati Aziendali & Sede',
      desc: 'Ragione sociale, P.IVA/CF, PEC, codice SDI e sede legale per documenti e fatture.',
      href: '/settings/company',
      icon: Building2,
      status: company?.companyName ? 'Configurato' : 'Da Completare',
      statusOk: !!company?.companyName,
      badge: company?.companyName || 'Non impostato',
    },
    {
      title: 'Conti Bancari & Casse',
      desc: 'Gestione conti correnti bancari, codici IBAN, carte e casse contanti di cantiere.',
      href: '/settings/conti',
      icon: CreditCard,
      status: conti?.length > 0 ? `${conti.length} Conti Attivi` : 'Nessun Conto',
      statusOk: conti?.length > 0,
      badge: conti?.length > 0 ? `${conti.length} registrati` : '0 registrati',
    },
    {
      title: 'Sicurezza & POS (D.Lgs 81/08)',
      desc: 'Datore di lavoro, RSPP, Medico Competente e parametri per la conformità di cantiere.',
      href: '/settings/safety',
      icon: ShieldCheck,
      status: company?.rspp ? 'Figure Assegnate' : 'Da Assegnare',
      statusOk: !!company?.rspp,
      badge: company?.rspp ? `RSPP: ${company.rspp}` : 'Incompleto',
    },
    {
      title: 'Profilo Utente & Credenziali',
      desc: 'Dati anagrafici operatore, email di autenticazione e controllo permessi di accesso.',
      href: '/settings/profile',
      icon: UserCheck,
      status: user?.role || 'ADMIN',
      statusOk: true,
      badge: user?.email || '',
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Settings size={14} className="text-[#003F61]" />
            <span>Amministrazione / Centro Configurazione</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Impostazioni di Sistema</h1>
          <p className="text-sm text-slate-500 mt-1">Configura l'anagrafica d'impresa, i conti bancari, i parametri di sicurezza e il tuo account.</p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <SettingsNav />

      {/* Overview Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-white border border-slate-200 p-6 hover:border-[#003F61] hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 text-[#003F61] group-hover:bg-[#003F61] group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-[#003F61] transition-colors">
                        {mod.title}
                      </h2>
                      <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                        {mod.badge}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      mod.statusOk
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {mod.statusOk ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                    <span>{mod.status}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {mod.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#003F61] group-hover:translate-x-0.5 transition-transform">
                <span>Gestisci impostazioni</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Session Box */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Sessione Amministratore Attiva</span>
          <span className="text-xs text-slate-500 mt-0.5 block">Accesso corrente: {user?.email || 'Admin'} con privilegi completi.</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="h-9 px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Disconnetti</span>
        </button>
      </div>
    </div>
  );
}
