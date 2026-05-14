'use client';

import { Users, Target, Rocket, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pt-16 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* HERO AZIENDA */}
                <div className="mb-32 text-center reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">Chi Siamo</div>
                    <h1 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]">
                        Costruiamo il futuro <br /> dell'<span className="text-blue-600">edilizia digitale.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-[1.8] font-medium">
                        EdilManager nasce dall'unione tra l'esperienza decennale sul campo e la passione per l'innovazione tecnologica. Non siamo solo sviluppatori; siamo partner della tua crescita.
                    </p>
                </div>

                {/* MISSION & VISION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-40">
                    <div className="bento-card bg-slate-50 border-slate-200 p-12 reveal">
                        <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm mb-8">
                            <Target size={28} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">La nostra Mission</h3>
                        <p className="text-lg text-slate-600 leading-[1.7] mb-8">
                            Semplificare la complessità del cantiere attraverso dati precisi e strumenti intuitivi. Vogliamo che ogni impresa, piccola o grande, possa competere ai massimi livelli grazie alla tecnologia.
                        </p>
                        <div className="space-y-4">
                            {["Efficienza Operativa", "Controllo dei Margini", "Sicurezza sul Lavoro"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-900 font-bold">
                                    <CheckCircle2 size={18} className="text-blue-600" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bento-card bg-slate-900 text-white border-slate-800 p-12 reveal" style={{ animationDelay: '0.1s' }}>
                        <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-8">
                            <Rocket size={28} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 tracking-tight">La nostra Vision</h3>
                        <p className="text-lg text-slate-400 leading-[1.7] mb-8">
                            Diventare lo standard globale per la gestione delle costruzioni. Immaginiamo un mondo dove il cantiere è connesso, sostenibile e privo di sprechi informativi.
                        </p>
                        <div className="space-y-4">
                            {["Automazione Integrale", "Intelligenza Predittiva", "Zero Burocrazia Cartacea"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-white font-bold">
                                    <CheckCircle2 size={18} className="text-blue-400" /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* THE VALUES SECTION */}
                <div className="mb-40 reveal">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6">I valori che ci guidano.</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Non sono solo parole, ma il codice genetico di ogni riga di software che scriviamo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { icon: <Award size={32}/>, title: "Qualità Senza Compromessi", desc: "Ogni funzione è testata per resistere ai ritmi frenetici del cantiere reale." },
                            { icon: <Users size={32}/>, title: "L'Utente al Centro", desc: "Ascoltiamo i geometri, i capocantiere e i CEO per creare strumenti utili davvero." },
                            { icon: <Heart size={32}/>, title: "Passione per l'Innovazione", desc: "Non ci accontentiamo mai. Cerchiamo sempre il modo più semplice per fare cose complesse." }
                        ].map((v, i) => (
                            <div key={i} className="group">
                                <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    {v.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{v.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IL TEAM */}
                <div className="mb-40 reveal">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-6">Le persone dietro il software.</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Non siamo anonimi. Siamo un team di professionisti con le scarpe sporche di cantiere che hanno deciso di rivoluzionare un settore.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Andrea Ferretti",
                                role: "CEO & Co-Founder",
                                bio: "Ex Project Manager con 12 anni di cantieri alle spalle. Ha creato EdilManager per risolvere i problemi che viveva ogni giorno.",
                                initials: "AF",
                                color: "bg-blue-600",
                            },
                            {
                                name: "Sara Colombo",
                                role: "CPO & Co-Founder",
                                bio: "Ingegnere gestionale e appassionata di UX. Ha progettato l'interfaccia pensando agli operai con i guanti in mano.",
                                initials: "SC",
                                color: "bg-slate-900",
                            },
                            {
                                name: "Marco De Luca",
                                role: "CTO",
                                bio: "Architetto software con background enterprise. Garantisce che la piattaforma regga il peso di centinaia di cantieri simultanei.",
                                initials: "MD",
                                color: "bg-emerald-600",
                            }
                        ].map((member, i) => (
                            <div key={i} className="bento-card bg-white border-slate-100 p-10 text-center group hover:border-blue-200 transition-all">
                                <div className={`w-20 h-20 ${member.color} rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 font-black text-white text-xl shadow-xl group-hover:scale-110 transition-transform`}>
                                    {member.initials}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{member.name}</h4>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">{member.role}</div>
                                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STATS / NUMBERS */}
                <div className="bg-slate-50 rounded-[3rem] p-12 lg:p-24 border border-slate-100 reveal text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-8">EdilManager in Numeri</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { val: "2018", label: "Anno di Fondazione" },
                            { val: "500+", label: "Cantieri Digitalizzati" },
                            { val: "15k+", label: "Rapportini Inviati" },
                            { val: "99%", label: "Soddisfazione Clienti" }
                        ].map((s, i) => (
                            <div key={i}>
                                <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{s.val}</div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className="mt-40 text-center reveal">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">Unisciti alla rivoluzione dell'edilizia.</h2>
                    <p className="text-slate-500 mb-12 max-w-xl mx-auto">Siamo sempre alla ricerca di aziende ambiziose che vogliono fare il salto di qualità.</p>
                    <Link href="/#contatti" className="inline-flex bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 items-center gap-3">
                        Lavora con Noi <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
