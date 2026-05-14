'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { 
    LayoutDashboard, HardHat, ClipboardCheck, 
    Receipt, Package, ShieldCheck, Globe, 
    FileText, TrendingUp, ArrowLeft, CheckCircle2, 
    Zap, ArrowRight 
} from 'lucide-react';
import { FEATURES_DATA } from '@/lib/features-data';

const ICON_MAP: Record<string, any> = {
    LayoutDashboard, HardHat, ClipboardCheck, 
    Receipt, Package, ShieldCheck, Globe, 
    FileText, TrendingUp
};

export default function FeatureDetailPage() {
    const { slug } = useParams();
    const feature = FEATURES_DATA.find(f => f.slug === slug);

    if (!feature) return notFound();

    const Icon = ICON_MAP[feature.icon];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="pt-12 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link href="/features" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
                        <ArrowLeft size={16} /> Torna a tutte le funzioni
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="reveal">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-200">
                                <Icon size={32} />
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                                {feature.title}
                            </h1>
                            <p className="text-xl text-slate-500 font-bold mb-8 leading-relaxed">
                                {feature.macroTitle}
                            </p>
                            <p className="text-slate-500 leading-relaxed mb-10">
                                {feature.desc}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/#contatti" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-lg btn-solid">
                                    Richiedi Demo Live
                                </Link>
                                <button className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] border border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
                                    Scarica Scheda Tecnica
                                </button>
                            </div>
                        </div>

                        <div className="relative reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white">
                                <img 
                                    src={feature.image} 
                                    alt={feature.title} 
                                    className="w-full h-auto"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 bg-blue-600 text-white p-8 rounded-3xl shadow-2xl hidden lg:block animate-float">
                                <Zap size={40} />
                                <div className="mt-4">
                                    <p className="text-4xl font-black tracking-tighter">100%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Cloud Native</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal">
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6">Perché scegliere questo modulo?</h2>
                        <p className="text-slate-500">I vantaggi concreti per la tua operatività quotidiana.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {feature.benefits.map((benefit, i) => (
                            <div key={i} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{benefit.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TECHNICAL DETAILS SECTION */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-8">Deep Dive</div>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-12 leading-[0.9]">
                                Funzionamento nel <br /> <span className="text-blue-500">minimo dettaglio.</span>
                            </h2>
                            
                            <div className="space-y-12">
                                {feature.details.map((detail, i) => (
                                    <div key={i} className="flex gap-6 group reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="text-blue-500 font-black text-2xl group-hover:scale-125 transition-transform">{(i+1).toString().padStart(2, '0')}</div>
                                        <div>
                                            <h4 className="text-lg font-black mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{detail.label}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{detail.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-1 rounded-3xl border border-white/10 reveal" style={{ animationDelay: '0.3s' }}>
                            <div className="bg-slate-900 p-8 rounded-[1.5rem]">
                                <h4 className="text-xl font-black mb-8 flex items-center gap-3">
                                    <Zap className="text-blue-500" /> Integrazioni Native
                                </h4>
                                <div className="space-y-4">
                                    {["Sincronizzazione in tempo reale", "API Aperte per ERP terzi", "Backup ridondato ogni 6 ore", "Crittografia AES-256"].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm font-bold text-slate-300">{item}</span>
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 p-6 bg-blue-600 rounded-2xl">
                                    <p className="text-sm font-black mb-4 uppercase tracking-widest text-blue-100">Pronto a partire?</p>
                                    <p className="text-white text-xs leading-relaxed mb-6">
                                        Questo modulo è incluso in tutti i piani Enterprise. Configurazione in meno di 24 ore.
                                    </p>
                                    <button className="w-full bg-white text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                        Attiva Ora <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
