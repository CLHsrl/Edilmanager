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
        <div className="mb-4 bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-md border border-white/20">
                    <AlertCircle size={32} className="animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter">Attenzione: Rischio Budget</h2>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wide mt-1">
                        Sforamento rilevato in: {anomalies.map(a => a.name).join(' • ')}
                    </p>
                </div>
            </div>
            <Link 
                href="/projects" 
                className="bg-white text-red-600 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
            >
                Gestisci Cantieri <ArrowRight size={16} />
            </Link>
        </div>
    );
}
