import { Menu, HardHat } from 'lucide-react';
import Link from 'next/link';
import SidebarLinks from '@/components/SidebarLinks';
import AnomalyContainer from '@/components/AnomalyContainer';

import { getServerSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

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
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-50 print:hidden w-full border-b border-slate-100">
        <span className="font-black text-xl tracking-tighter text-slate-900">EDIL MANAGER <span className="text-blue-600">.</span></span>
        <button className="p-2 rounded-xl hover:bg-gray-100">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[320px] bg-white border-r border-slate-100 h-screen sticky top-0 print:hidden shrink-0 z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black shadow-2xl shadow-slate-900/20 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
              <HardHat size={28} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
               <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase leading-none">Edil<span className="text-blue-600">Manager</span></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Enterprise 2.0</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto pb-10 no-scrollbar">
          <SidebarLinks user={user as any} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 md:p-12 print:p-0 print:overflow-visible print:w-full print:m-0 w-full relative">
          <div className="max-w-[1600px] mx-auto relative z-10">
            {/* Global Anomaly Check */}
            <AnomalyContainer />
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
