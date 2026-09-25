'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-mock';
import { 
  LayoutDashboard, Users, FileText, ClipboardList, 
  HardHat, Euro, Receipt, Package, TrendingUp, Globe, Truck, BarChart3, BrainCircuit, 
  Settings, ChevronDown, Building2, CreditCard, ShieldCheck, UserCheck, LayoutGrid
} from 'lucide-react';

interface SubLink {
  href: string;
  label: string;
  icon?: any;
  exact?: boolean;
}

interface SidebarLinkItem {
  href: string;
  label: string;
  icon: any;
  roles: string[];
  sublinks?: SubLink[];
}

const SECTIONS: { label: string; roles: string[]; links: SidebarLinkItem[] }[] = [
  {
    label: 'Operazioni',
    roles: ['ADMIN', 'PM', 'OPERAIO'],
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PM', 'OPERAIO'] },
      { href: '/projects', label: 'Cantieri', icon: HardHat, roles: ['ADMIN', 'PM', 'OPERAIO'] },
      { href: '/workflows', label: 'Workflow', icon: ClipboardList, roles: ['ADMIN', 'PM'] },
      { href: '/magazzino', label: 'Logistica', icon: Package, roles: ['ADMIN', 'PM'] },
    ]
  },
  {
    label: 'Finanza',
    roles: ['ADMIN', 'PM'],
    links: [
      { href: '/procurement', label: 'Acquisti', icon: BarChart3, roles: ['ADMIN'] },
      { href: '/fornitori', label: 'Fornitori', icon: Truck, roles: ['ADMIN', 'PM'] },
      { href: '/fatture', label: 'Fatture', icon: Receipt, roles: ['ADMIN'] },
      { href: '/cassa', label: 'Cassa & Cashflow', icon: Euro, roles: ['ADMIN'] },
    ]
  },
  {
    label: 'Strategia',
    roles: ['ADMIN'],
    links: [
      { href: '/strategy', label: 'Growth Advisor', icon: BrainCircuit, roles: ['ADMIN'] },
      { href: '/bi', label: 'BI Analytics', icon: TrendingUp, roles: ['ADMIN'] },
      { href: '/client-portal', label: 'Portale Clienti', icon: Globe, roles: ['ADMIN', 'PM'] },
    ]
  },
  {
    label: 'Amministrazione',
    roles: ['ADMIN'],
    links: [
      { href: '/clients', label: 'Anagrafica Clienti', icon: Users, roles: ['ADMIN', 'PM'] },
      { href: '/lavoratori', label: 'Personale', icon: Users, roles: ['ADMIN'] },
      { href: '/audit', label: 'Audit Log', icon: FileText, roles: ['ADMIN'] },
      { 
        href: '/settings', 
        label: 'Impostazioni', 
        icon: Settings, 
        roles: ['ADMIN', 'PM'],
        sublinks: [
          { href: '/settings', label: 'Panoramica', icon: LayoutGrid, exact: true },
          { href: '/settings/company', label: 'Dati Aziendali', icon: Building2 },
          { href: '/settings/conti', label: 'Conti Bancari', icon: CreditCard },
          { href: '/settings/safety', label: 'Sicurezza Cantiere', icon: ShieldCheck },
          { href: '/settings/profile', label: 'Profilo & Account', icon: UserCheck },
        ]
      },
    ]
  }
];

export default function SidebarLinks({ user }: { user?: { name: string, totalXp: number, rank: string } }) {
  const pathname = usePathname();
  const { role } = useAuth();

  // Controllo dropdown aperto
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    '/settings': pathname.startsWith('/settings'),
  });

  // Mantieni aperto il dropdown se l'utente naviga su una sottopagina
  useEffect(() => {
    if (pathname.startsWith('/settings')) {
      setOpenDropdowns(prev => ({ ...prev, '/settings': true }));
    }
  }, [pathname]);

  const toggleDropdown = (href: string) => {
    setOpenDropdowns(prev => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white/80">
      <nav className="flex-1 px-4 py-6 space-y-8">
        {SECTIONS.map((section, idx) => {
          const visibleLinks = section.links.filter(l => l.roles.includes(role));
          if (visibleLinks.length === 0) return null;

          return (
            <div key={idx} className="space-y-2">
              <h3 className="px-3 text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">
                {section.label}
              </h3>
              <div className="space-y-1">
                {visibleLinks.map((link) => {
                  const Icon = link.icon;
                  const hasSublinks = link.sublinks && link.sublinks.length > 0;
                  const isDropdownOpen = !!openDropdowns[link.href];
                  const isMainActive = link.href === '/dashboard' 
                    ? pathname === '/dashboard' 
                    : (hasSublinks ? pathname === link.href : pathname.startsWith(link.href));
                  const isChildActive = hasSublinks && pathname.startsWith(link.href) && pathname !== link.href;

                  if (hasSublinks) {
                    return (
                      <div key={link.href} className="space-y-1">
                        {/* Parent item with toggle button */}
                        <div
                          className={`flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors ${
                            isMainActive
                              ? 'bg-[#FEDE59] text-[#003F61] shadow-sm'
                              : isChildActive
                              ? 'bg-white/10 text-white'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Link 
                            href={link.href} 
                            className="flex items-center gap-3 flex-1 min-w-0"
                          >
                            <Icon size={18} className={isMainActive ? 'text-[#003F61]' : isChildActive ? 'text-[#FEDE59]' : 'text-white/60'} />
                            <span className="truncate">{link.label}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleDropdown(link.href);
                            }}
                            className={`p-1 hover:bg-black/10 transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`}
                            title="Mostra pagine impostazioni"
                          >
                            <ChevronDown size={15} className={isMainActive ? 'text-[#003F61]' : 'text-white/70'} />
                          </button>
                        </div>

                        {/* Collapsible Submenu */}
                        {isDropdownOpen && (
                          <div className="ml-4 pl-3 border-l border-white/20 space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            {link.sublinks!.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = sub.exact ? pathname === sub.href : pathname.startsWith(sub.href);
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`flex items-center gap-2.5 px-2.5 py-1.5 text-xs transition-colors ${
                                    isSubActive
                                      ? 'bg-[#FEDE59] text-[#003F61] font-bold shadow-xs'
                                      : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
                                  }`}
                                >
                                  {SubIcon && <SubIcon size={13} className={isSubActive ? 'text-[#003F61]' : 'text-white/40'} />}
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular Single Link
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`flex items-center gap-3 px-3 py-2 transition-colors text-sm font-medium ${
                        isMainActive 
                          ? 'bg-[#FEDE59] text-[#003F61] shadow-sm' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={isMainActive ? 'text-[#003F61]' : 'text-white/60'} />
                      <span className="flex-1">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
