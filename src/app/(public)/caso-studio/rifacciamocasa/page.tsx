'use client';

import { ArrowRight, BarChart3, CheckCircle2, Clock, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CasoStudioPage() {
    return (
        <div className="bg-white font-manrope relative">
            
            {/* HERO SECTION */}
            <section className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 overflow-hidden bg-corporate border-b border-slate-100">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center reveal">
                    <div className="flex w-fit items-center gap-2 px-4 py-1.5 bg-edil-light text-edil-blue rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm mx-auto">
                        CASO STUDIO
                    </div>
                    <h1 className="text-[38px] sm:text-[56px] lg:text-[64px] font-black text-navy-deep tracking-[-0.04em] mb-8 leading-[1.05] max-w-4xl mx-auto">
                        Come RifacciamoCasa <br className="hidden sm:block"/>
                        ha recuperato il <span className="text-edil-blue">15% di <br className="hidden sm:block"/>
                        marginalità</span> netta in 6 mesi.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
                        Da un'organizzazione basata su fogli Excel e WhatsApp a un controllo di gestione integrato e in tempo reale.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-white relative z-20">
                <div className="max-w-4xl mx-auto px-6">
                    
                    {/* THE CLIENT */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 mb-20 reveal shadow-sm">
                        <h2 className="text-xl font-bold text-navy-deep mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-edil-blue" size={24} /> Identikit dell'Impresa
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Azienda</div>
                                <div className="text-navy-deep font-bold text-lg">RifacciamoCasa</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Settore</div>
                                <div className="text-navy-deep font-bold text-lg leading-tight">Ristrutturazioni Residenziali</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Team</div>
                                <div className="text-navy-deep font-bold text-lg leading-tight">24 Operai + 4 Ufficio</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Sede</div>
                                <div className="text-navy-deep font-bold text-lg">Milano e Hinterland</div>
                            </div>
                        </div>
                    </div>

                    {/* THE PROBLEM */}
                    <div className="mb-20 reveal text-center lg:text-left">
                        <div className="flex w-fit items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100 mx-auto lg:mx-0">
                            IL PROBLEMA
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6 mx-auto lg:mx-0">Crescere senza controllo</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium mx-auto lg:mx-0">
                            Nel 2022, sfruttando il boom dei bonus edilizi, RifacciamoCasa ha raddoppiato il fatturato. Tuttavia, l'aumento delle commesse ha messo in crisi il sistema organizzativo, basato interamente su metodi tradizionali.
                        </p>
                        <div className="space-y-4 mb-12">
                            <div className="flex items-start gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">1</div>
                                <div>
                                    <h4 className="font-bold text-navy-deep mb-1">Rapportini persi o illeggibili</h4>
                                    <p className="text-slate-600 text-sm font-medium">Gli operai inviavano le ore tramite WhatsApp a fine settimana. Spesso le foto erano sfocate o le ore non tornavano.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">2</div>
                                <div>
                                    <h4 className="font-bold text-navy-deep mb-1">Margini scoperti solo a consuntivo</h4>
                                    <p className="text-slate-600 text-sm font-medium">Il reale guadagno su un cantiere veniva calcolato dal commercialista mesi dopo la fine dei lavori. Troppo tardi per intervenire.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">3</div>
                                <div>
                                    <h4 className="font-bold text-navy-deep mb-1">Colli di bottiglia amministrativi</h4>
                                    <p className="text-slate-600 text-sm font-medium">Una sola impiegata doveva rincorrere fornitori, fatture passive e DDT, impiegando il 60% del tempo in data entry ripetitivo.</p>
                                </div>
                            </div>
                        </div>

                        <blockquote className="border-l-4 border-edil-blue pl-8 py-4 my-10 bg-slate-50 rounded-r-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-edil-blue">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                            </div>
                            <p className="text-slate-700 italic font-bold text-xl leading-relaxed relative z-10">
                                "Lavoravamo tantissimo, fatturavamo il doppio, ma a fine anno in cassa non c'era quello che ci aspettavamo. Stavamo perdendo soldi nei meandri della disorganizzazione."
                            </p>
                            <footer className="text-xs font-black text-navy-deep uppercase tracking-widest mt-6 relative z-10">Marco P. — Amministratore Delegato</footer>
                        </blockquote>
                    </div>

                    {/* THE SOLUTION */}
                    <div className="mb-20 reveal text-center lg:text-left">
                        <div className="flex w-fit items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 mx-auto lg:mx-0">
                            LA SOLUZIONE
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6 mx-auto lg:mx-0">EdilManager24 come unico centro di comando</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium mx-auto lg:mx-0">
                            L'obiettivo era chiaro: connettere il cantiere con l'ufficio in tempo reale, eliminando passaggi manuali e fornendo alla direzione dati finanziari immediati.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem]">
                                <div className="w-12 h-12 bg-white text-edil-blue rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <Users size={24} />
                                </div>
                                <h4 className="font-bold text-navy-deep text-lg mb-3">App Mobile per Operai</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">Inserimento presenze, foto e materiali usati direttamente da smartphone a fine giornata. Interfaccia semplificata per favorire l'adozione al 100%.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem]">
                                <div className="w-12 h-12 bg-white text-edil-blue rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <TrendingUp size={24} />
                                </div>
                                <h4 className="font-bold text-navy-deep text-lg mb-3">Controllo Margini in tempo reale</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">Raffronto automatico tra preventivo (budget) e consuntivo (costi reali di manodopera e fatture fornitori SDI) aggiornato quotidianamente.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* THE RESULTS */}
            <section className="py-24 bg-navy-deep relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-edil-blue/20 via-navy-deep to-navy-deep"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-edil-blue/20 blur-[100px] rounded-full translate-x-20 -translate-y-20"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center lg:text-left reveal">
                    <div className="flex w-fit items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10 mx-auto lg:mx-0">
                        RISULTATI
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-16 mx-auto lg:mx-0">
                        I Numeri dopo 6 mesi
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md">
                            <div className="text-6xl font-black text-edil-blue mb-4 tracking-tighter drop-shadow-sm">-12h</div>
                            <h4 className="font-bold text-white text-lg mb-2">Ore salvate</h4>
                            <p className="text-sm text-slate-400 font-medium">A settimana di back-office, eliminando il data entry.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md shadow-2xl shadow-black/50 transform md:-translate-y-4">
                            <div className="text-6xl font-black text-emerald-400 mb-4 tracking-tighter drop-shadow-sm">+15%</div>
                            <h4 className="font-bold text-white text-lg mb-2">Margine Netto</h4>
                            <p className="text-sm text-slate-400 font-medium">Grazie al blocco immediato delle inefficienze in cantiere.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md">
                            <div className="text-6xl font-black text-edil-blue mb-4 tracking-tighter drop-shadow-sm">100%</div>
                            <h4 className="font-bold text-white text-lg mb-2">Adozione</h4>
                            <p className="text-sm text-slate-400 font-medium">Tutti gli operai utilizzano l'app mobile quotidianamente.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 bg-corporate text-center border-t border-slate-100 relative overflow-hidden reveal">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-black text-navy-deep tracking-tighter mb-8 mx-auto lg:mx-0">
                        Vuoi ottenere gli stessi risultati?
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto lg:mx-0 font-medium">
                        Scopri come EdilManager24 può adattarsi ai flussi della tua impresa in una demo personalizzata.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <Link href="/contatti" className="inline-flex bg-edil-blue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 items-center justify-center gap-2">
                            Prenota una Demo <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

