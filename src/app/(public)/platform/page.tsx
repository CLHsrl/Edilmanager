'use client';

import { 
    Cpu, Database, ShieldCheck, Zap, 
    Smartphone, Monitor, Tablet, Globe, 
    Cloud, Server, Lock, RefreshCw,
    ArrowRight, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function PlatformPage() {
    return (
        <div className="bg-white min-h-screen pt-16 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* PERSUASIVE HERO */}
                <div className="mb-40 text-center reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-10 shadow-lg shadow-blue-200">Enterprise Infrastructure</div>
                    <h1 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-12 leading-[0.85]">
                        La spina dorsale della tua <span className="text-blue-600">impresa digitale.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-[1.8] font-medium">
                        Mentre gli altri offrono semplici app, noi forniamo un'infrastruttura blindata. Progettata per resistere alle condizioni più estreme, dal polveroso cantiere di montagna all'ufficio di presidenza.
                    </p>
                </div>

                {/* GLOBAL INFRASTRUCTURE & SECURITY PROTOCOLS */}
                <div className="py-40 border-t border-slate-100">
                    <div className="text-center mb-24 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl">Military Grade Security</div>
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                            Infrastruttura <span className="text-blue-600">senza compromessi.</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Proteggiamo i tuoi asset digitali con lo stesso rigore con cui tu proteggi i tuoi dipendenti in cantiere.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal" style={{ animationDelay: '0.2s' }}>
                        {[
                            { 
                                title: "Backup Ridondati", 
                                desc: "Dati salvati ogni 6 ore in 3 datacenter europei distinti. Perdita dati impossibile.",
                                icon: <Database className="text-blue-600" />
                            },
                            { 
                                title: "SLA 99.99%", 
                                desc: "Garanzia contrattuale di uptime. Il software è sempre online, quando serve davvero.",
                                icon: <Zap className="text-blue-600" />
                            },
                            { 
                                title: "Crittografia AES-256", 
                                desc: "Standard bancario per ogni comunicazione. I tuoi preventivi sono al sicuro.",
                                icon: <Lock className="text-blue-600" />
                            },
                            { 
                                title: "Conformità GDPR", 
                                desc: "Piena aderenza alle normative europee sulla privacy e sulla gestione documentale.",
                                icon: <ShieldCheck className="text-blue-600" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all group">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* THE CONNECTED ECOSYSTEM (Visual Showcase) */}
                <div className="relative h-[600px] lg:h-[800px] mb-40 reveal">
                    {/* MacBook Pro - Centralized Power */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl z-10 group">
                        <div className="rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] bg-white aspect-[16/10]">
                            <img src="/dashboard-render.png" alt="Desktop Command Center" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        </div>
                        {/* Floating KPI card */}
                        <div className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 hidden lg:block animate-float">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <RefreshCw size={24} className="animate-spin-slow" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Sync Status</p>
                                    <p className="text-sm font-black text-slate-900">100% Sincronizzato</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* iPad - Mobility */}
                    <div className="absolute top-[45%] right-[-5%] w-[40%] max-w-sm z-20 hidden lg:block group">
                        <div className="rounded-[2rem] overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-6 aspect-[3/4] bg-white">
                            <img src="/ipad-preview.png" alt="Field Tablet" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* iPhone - Action */}
                    <div className="absolute bottom-[5%] left-[-5%] w-[22%] max-w-[200px] z-30 hidden lg:block group">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform group-hover:-rotate-3 aspect-[9/19.5] bg-white">
                            <img src="/iphone-preview.png" alt="Mobile Worker App" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* WHY IT WORKS: THE CORE VALUES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40 items-center">
                    <div className="reveal">
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-12 leading-[0.9]">
                            Perché EdilManager è <br /><span className="text-blue-600">tecnicamente superiore.</span>
                        </h2>
                        
                        <div className="space-y-12">
                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <Cloud size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Zero Hardware, Zero Pensieri</h4>
                                    <p className="text-slate-500 leading-relaxed text-sm">Nessun server da gestire in ufficio. Accedi da qualsiasi dispositivo, in qualsiasi parte del mondo. La tua azienda è sempre con te.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <Zap size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Velocità di Esecuzione Killer</h4>
                                    <p className="text-slate-500 leading-relaxed text-sm">Abbiamo ottimizzato ogni riga di codice per garantire che l'app sia reattiva anche sotto reti 3G instabili in cantiere.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group">
                                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Blindata da Standard Militari</h4>
                                    <p className="text-slate-500 leading-relaxed text-sm">Crittografia end-to-end e backup geografici ridondati. I tuoi dati sono protetti come in una cassaforte svizzera.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 reveal" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                                <Globe size={14} /> Global Compliance
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: "Uptime Garantito", val: "99.99%" },
                                    { label: "Data Center", val: "Tier 4 (EU)" },
                                    { label: "Crittografia", val: "AES-256 Bit" },
                                    { label: "Conformità", val: "GDPR / ISO 27001" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50">
                                        <span className="text-sm font-bold text-slate-500">{stat.label}</span>
                                        <span className="text-sm font-black text-slate-900">{stat.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 bg-blue-600 p-8 rounded-2xl text-white">
                                <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Pronto per il salto?</p>
                                <h4 className="text-2xl font-black mb-6 leading-tight">Trasforma la tecnologia nel tuo vantaggio competitivo.</h4>
                                <Link href="/#contatti" className="w-full bg-white text-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                    Richiedi Audit Tecnico <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className="mt-40 text-center reveal">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">Vuoi approfondire l'aspetto tecnico?</h2>
                    <p className="text-slate-500 mb-12">Scarica il nostro White Paper sulla sicurezza e l'architettura dei dati.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/#contatti" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                            Parla con un Tecnico
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
