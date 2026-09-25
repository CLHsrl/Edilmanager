import { Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';
import SidebarLinks from '@/components/SidebarLinks';
import AnomalyContainer from '@/components/AnomalyContainer';
import MobileNav from '@/components/MobileNav';
import MobileBottomNav from '@/components/MobileBottomNav';

import { getServerSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

import GlobalSearchBar from '@/components/GlobalSearchBar';

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, totalXp: true, rank: true }
  });

  return (
    <div className="flex w-full h-screen overflow-hidden bg-slate-50">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#003F61] h-screen sticky top-0 shrink-0 z-50">
        <div className="h-16 px-4 flex flex-col justify-center border-b border-white/10 shrink-0">
          <Link href="/dashboard" className="flex flex-col">
             <span className="font-extrabold text-xl leading-tight uppercase tracking-tight">
               <span className="text-white">EDIL</span><span className="text-[#FEDE59]">MANAGER</span><span className="text-white">24</span>
             </span>
             <span className="text-[10px] text-white/70 tracking-wider font-medium">
               by RifacciamoCasa
             </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <SidebarLinks user={user as any} />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 shrink-0 z-40">
          <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <MobileNav user={user as any} />
              
              {/* Functional Advanced Search Bar */}
              <GlobalSearchBar />
            </div>

            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <button className="relative p-2 text-slate-400 hover:text-[#003F61] transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FEDE59] border border-white"></span>
              </button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <Link href="/settings" className="flex items-center gap-2 hover:bg-slate-50 p-1.5 transition-colors">
                <UserCircle size={24} className="text-[#003F61]" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-[#003F61] leading-none">{user?.name || 'Utente'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{session.role}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Scrolling Area */}
        <main className="flex-1 overflow-y-auto pt-3 md:pt-4 px-4 md:px-6 lg:px-8 pb-24 md:pb-8 relative">
          <div className="max-w-[1400px] mx-auto">
            {/* Global Anomaly Check (renders margin only when alert exists) */}
            <AnomalyContainer />
            
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
    </div>
  );
}
