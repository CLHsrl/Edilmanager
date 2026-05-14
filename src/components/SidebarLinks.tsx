'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-mock';
import { 
  LayoutDashboard, Users, FileText, ClipboardList, 
  HardHat, Euro, Receipt, Package, TrendingUp, Globe, Truck, BarChart3, BrainCircuit,
  Zap, Star
} from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';

const SECTIONS = [
  {
    label: 'Operatività & Efficienza',
    roles: ['ADMIN', 'PM', 'OPERAIO'],
    links: [
      { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['ADMIN', 'PM', 'OPERAIO'] },
      { href: '/projects', label: 'Cantieri', icon: HardHat, roles: ['ADMIN', 'PM', 'OPERAIO'] },
      { href: '/workflows', label: 'Workflow', icon: ClipboardList, roles: ['ADMIN', 'PM'] },
      { href: '/magazzino', label: 'Logistica & Mezzi', icon: Package, roles: ['ADMIN', 'PM'] },
    ]
  },
  {
    label: 'Controllo Margini & Finanza',
    roles: ['ADMIN', 'PM'],
    links: [
      { href: '/procurement', label: 'Intelligenza Acquisti', icon: BarChart3, roles: ['ADMIN'] },
      { href: '/fornitori', label: 'Fornitori', icon: Truck, roles: ['ADMIN', 'PM'] },
      { href: '/fatture', label: 'Fatture & Acquisti', icon: Receipt, roles: ['ADMIN'] },
      { href: '/cassa', label: 'Cassa & Cashflow', icon: Euro, roles: ['ADMIN'] },
    ]
  },
  {
    label: 'Crescita & Strategia',
    roles: ['ADMIN'],
    links: [
      { href: '/strategy', label: 'Growth Advisor', icon: BrainCircuit, roles: ['ADMIN'], badge: 'AI' },
      { href: '/bi', label: 'BI Analytics', icon: TrendingUp, roles: ['ADMIN'] },
      { href: '/client-portal', label: 'Customer Portal', icon: Globe, roles: ['ADMIN', 'PM'] },
    ]
  },
  {
    label: 'Amministrazione',
    roles: ['ADMIN'],
    links: [
      { href: '/clients', label: 'Anagrafica Clienti', icon: Users, roles: ['ADMIN', 'PM'] },
      { href: '/lavoratori', label: 'Gestione Personale', icon: Users, roles: ['ADMIN'] },
      { href: '/audit', label: 'Audit Log (ISO)', icon: FileText, roles: ['ADMIN'] },
    ]
  }
];

export default function SidebarLinks({ user }: { user?: { name: string, totalXp: number, rank: string } }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const safeUser = user || { name: 'Guest', totalXp: 0, rank: 'GARZONE DI CANTIERE' };
  const ranks = [
    { title: "GARZONE DI CANTIERE", minXp: 0, maxXp: 1000, color: "bg-orange-500" },
    { title: "MURATORE ESPERTO", minXp: 1000, maxXp: 5000, color: "bg-amber-500" },
    { title: "CAPOCANTIERE D'ELITE", minXp: 5000, maxXp: 10000, color: "bg-yellow-500" },
    { title: "ARCHISTAR DEL CANTIERE", minXp: 10000, maxXp: 1000000, color: "bg-blue-600" },
  ];

  const currentRank = ranks.find((r, i) => {
    const next = ranks[i+1];
    return safeUser.totalXp >= r.minXp && (!next || safeUser.totalXp < next.minXp);
  }) || ranks[0];

  const nextRank = ranks[ranks.indexOf(currentRank) + 1];
  const progress = nextRank 
    ? ((safeUser.totalXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100
    : 100;

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-6 space-y-10 py-4">
        {SECTIONS.map((section, idx) => {
          const visibleLinks = section.links.filter(l => l.roles.includes(role));
          if (visibleLinks.length === 0) return null;

          return (
            <div key={idx} className="space-y-4">
              <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 opacity-50">{section.label}</h3>
              <div className="space-y-1.5">
                {visibleLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest group relative overflow-hidden ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 group-hover:text-slate-900'}`}>
                        <Icon size={16} />
                      </div>
                      <span className="flex-1 relative z-10">{link.label}</span>
                      {link.badge && (
                        <span className="relative z-10 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                          {link.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-600 h-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-6 py-8 border-t border-slate-50 space-y-6">
        {/* User Maturity Widget */}
        <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Maturity Ledger</span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{safeUser.totalXp} XP</span>
          </div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-yellow-500">
              <Star size={16} fill="currentColor" />
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
              {currentRank.title}
            </p>
          </div>

          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative z-10 mb-4">
            <div 
              className={`h-full ${currentRank.color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
              style={{ width: `${progress}%` }}
            />
          </div>

          {nextRank ? (
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest relative z-10 leading-relaxed">
              Unlock <span className="text-white italic">{nextRank.title}</span> in <span className="text-blue-400 font-black">{Math.floor(nextRank.minXp - safeUser.totalXp)}</span> XP
            </p>
          ) : (
             <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest relative z-10">Maximum Rank Achieved</p>
          )}
        </div>

        <RoleSwitcher />
      </div>
    </div>
  );
}

