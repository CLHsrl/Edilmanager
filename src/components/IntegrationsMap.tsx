import { useState, useEffect } from 'react';
import { Building2, Landmark, Mail, MapPin, ShieldAlert, Truck, Zap } from 'lucide-react';

export default function IntegrationsMap() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const integrations = [
        { icon: <Landmark size={24}/>, name: 'Banche', desc: 'Riconciliazione automatica' },
        { icon: <Zap size={24}/>, name: 'SDI / Fatture', desc: 'Fatturazione Elettronica' },
        { icon: <Truck size={24}/>, name: 'Mezzi / GPS', desc: 'Monitoraggio flotta' },
        { icon: <MapPin size={24}/>, name: 'Cantieri', desc: 'Geolocalizzazione' },
        { icon: <ShieldAlert size={24}/>, name: 'Sicurezza', desc: 'Scadenze DPI / Corsi' },
        { icon: <Mail size={24}/>, name: 'PEC', desc: 'Archiviazione automatica' }
    ];

    return (
        <div className="relative py-20 overflow-hidden border-y border-slate-200/60">
            {/* TECHNICAL BLUE GRID OVERLAY */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200">Ecosistema Connesso</div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                            Il cuore pulsante della tua impresa,<br/>completamente integrato.
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            EdilManager non è un sistema isolato. Dialoga costantemente con il tuo ecosistema operativo per eliminare ogni ridondanza di dati.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">1</div>
                                Riconciliazione bancaria automatizzata
                            </li>
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">2</div>
                                Integrazione diretta con lo SDI (Fisco)
                            </li>
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">3</div>
                                Gestione logistica e mezzi via GPS
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/2 relative h-[400px] flex items-center justify-center">
                        {/* Center Logo */}
                        <div className="relative z-10 w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center text-white font-black text-3xl">
                            E
                        </div>

                        {/* Orbits */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[300px] border border-slate-200 rounded-full absolute border-dashed animate-slow-spin"></div>
                            <div className="w-[180px] h-[180px] border border-slate-100 rounded-full absolute"></div>
                        </div>

                        {/* Floating Icons */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {mounted && integrations.map((item, idx) => {
                                const angle = (idx * 60) * (Math.PI / 180);
                                const radius = 150;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                
                                return (
                                    <div 
                                        key={idx}
                                        className="absolute bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center gap-1 group hover:scale-110 transition-transform cursor-pointer"
                                        style={{ transform: `translate(${x}px, ${y}px)` }}
                                    >
                                        <div className="text-blue-600 group-hover:text-purple-600 transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-900">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
