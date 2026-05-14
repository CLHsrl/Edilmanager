'use client';

import { Cloud, HardHat, Projector as Project, Users, Clock } from 'lucide-react';

interface DashboardHeroProps {
    userName?: string;
    activeWorkers: number;
    activeProjects: number;
}

export default function DashboardHero({ userName, activeWorkers, activeProjects }: DashboardHeroProps) {
    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Buongiorno' : hours < 18 ? 'Buon pomeriggio' : 'Buonasera';

    return (
        <div className="relative overflow-hidden bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent"></div>
                <div className="grid grid-cols-8 h-full">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className="border-l border-white/10 h-12 w-full"></div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                            <Cloud size={14} /> 22°C • Soleggiato
                        </div>
                        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={14} /> {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none mb-3">
                        {greeting}, <span className="text-blue-400">{userName || 'Direttore'}</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium max-w-md">
                        Ecco lo stato attuale dell'impresa. Tutti i sistemi sono operativi e i cantieri procedono secondo programma.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 md:gap-8">
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl min-w-[160px]">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{activeWorkers}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">In Cantiere</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl min-w-[160px]">
                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                            <HardHat size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">{activeProjects}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Cantieri Attivi</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
