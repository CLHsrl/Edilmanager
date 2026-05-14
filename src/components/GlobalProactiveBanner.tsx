'use client';

import { usePathname } from 'next/navigation';
import { AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Anomaly {
    id: string;
    name: string;
    usagePercent: number;
}

export default function GlobalProactiveBanner({ anomalies }: { anomalies: Anomaly[] }) {
    const pathname = usePathname();

    // Don't show on the dashboard itself since it already has the pulse section
    if (pathname === '/' || anomalies.length === 0) return null;

    return (
        <div className="mb-8 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-[2rem] p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-700">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                    <AlertCircle size={32} className="animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Attenzione: Rischio Budget</h2>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">
                        Sforamento rilevato in: {anomalies.map(a => a.name).join(' • ')}
                    </p>
                </div>
            </div>
            <Link 
                href="/projects" 
                className="bg-white text-red-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
                Gestisci Cantieri <ArrowRight size={16} />
            </Link>
        </div>
    );
}
