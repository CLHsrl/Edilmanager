'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Building2, CreditCard, ShieldCheck, UserCheck } from 'lucide-react';

const TABS = [
  { href: '/settings', label: 'Panoramica', icon: LayoutGrid, exact: true },
  { href: '/settings/company', label: 'Dati Aziendali', icon: Building2 },
  { href: '/settings/conti', label: 'Conti Bancari', icon: CreditCard },
  { href: '/settings/safety', label: 'Sicurezza & Cantiere', icon: ShieldCheck },
  { href: '/settings/profile', label: 'Profilo & Account', icon: UserCheck },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border border-slate-200 p-1 flex flex-wrap gap-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? 'bg-[#003F61] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#003F61]'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-[#FEDE59]' : 'text-slate-400'} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
