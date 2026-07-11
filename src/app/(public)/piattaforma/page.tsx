import { Metadata } from 'next';
import Link from 'next/link';
import { 
    ArrowRight, Monitor, Tablet, Smartphone, 
    ShieldCheck, Database, Zap, FileText, 
    HardHat, Calculator, Briefcase, FileSignature, 
    CheckCircle2, Users, LayoutDashboard, Cog, 
    RefreshCw, Server, Lock
} from 'lucide-react';

export const metadata: Metadata = {
    title: "Piattaforma EdilManager24 | Ufficio e cantiere in un unico sistema",
    description: "Scopri come EdilManager24 collega direzione, amministrazione, commerciale, personale e cantieri in una piattaforma sicura e accessibile da ogni dispositivo.",
};

export default function PiattaformaPage() {
    return (
        <div className="bg-white font-manrope">
            {/* 1. HERO */}
            <section className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 overflow-hidden bg-corporate">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10 reveal">
                    <div className="flex w-fit items-center gap-2 px-4 py-1.5 bg-edil-light text-edil-blue rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm mx-auto">
                        LA PIATTAFORMA EdilManager24
                    </div>
                    <h1 className="text-[38px] sm:text-[56px] lg:text-[64px] font-black text-navy-deep tracking-[-0.04em] mb-8 leading-[1.05] max-w-5xl mx-auto">
                        Una piattaforma. <br className="hidden sm:block"/>
                        <span className="text-edil-blue">Un unico flusso operativo.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 font-medium">
                        EdilManager24 collega direzione, amministrazione, commerciale e cantiere. Le informazioni entrano una sola volta, vengono aggiornate durante il lavoro e rimangono disponibili a chi ne ha bisogno.
                    </p>
                    <p className="text-sm font-black text-edil-blue uppercase tracking-widest mx-auto mb-10">
                        Dal primo contatto alla chiusura della commessa, ogni fase rimane collegata.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contatti" className="w-full sm:w-auto bg-navy-deep text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-edil-blue transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                            Prenota una demo <ArrowRight size={18} />
                        </Link>
                        <Link href="/funzionalita" className="w-full sm:w-auto bg-white text-slate-700 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center">
                            Esplora le funzionalità
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. FLUSSO OPERATIVO */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                            UN PROCESSO COLLEGATO
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6">
                            Dalla richiesta iniziale <br/>al controllo della commessa.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                            EdilManager24 accompagna le informazioni durante tutto il ciclo operativo. Ogni passaggio aggiorna il successivo, senza ricostruire dati tra fogli, chat e cartelle separate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal relative">
                        {[
                            { step: "01", title: "Richiesta e opportunità", desc: "Registrazione dei contatti e delle esigenze preliminari.", icon: <Briefcase className="text-edil-blue"/> },
                            { step: "02", title: "Sopralluogo e analisi", desc: "Raccolta di dati, misure e fotografie direttamente sul campo.", icon: <FileSignature className="text-edil-blue"/> },
                            { step: "03", title: "Preventivo e approvazione", desc: "Creazione dell'offerta economica basata sui listini.", icon: <Calculator className="text-edil-blue"/> },
                            { step: "04", title: "Apertura della commessa", desc: "Organizzazione formale del progetto accettato dal cliente.", icon: <HardHat className="text-edil-blue"/> },
                            { step: "05", title: "Pianificazione del cantiere", desc: "Assegnazione di squadre, mezzi e materiali necessari.", icon: <Cog className="text-edil-blue"/> },
                            { step: "06", title: "Rapportini e avanzamento", desc: "Registrazione ore e attività giornaliere da smartphone.", icon: <FileText className="text-edil-blue"/> },
                            { step: "07", title: "Costi, documenti e fatturazione", desc: "Emissione documenti fiscali e tracciamento spese.", icon: <Database className="text-edil-blue"/> },
                            { step: "08", title: "Controllo di margini e risultati", desc: "Analisi in tempo reale della redditività del cantiere.", icon: <LayoutDashboard className="text-edil-blue"/> },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-edil-blue transition-colors">
                                <div className="text-[10px] font-black text-slate-300 mb-4">{item.step}</div>
                                <div className="w-12 h-12 bg-edil-light rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-navy-deep mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                                
                                {i !== 7 && (
                                    <div className="hidden lg:block absolute top-1/2 right-[-24px] text-slate-300">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. UFFICIO E CANTIERE */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-edil-light text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                            UN'UNICA FONTE DI INFORMAZIONE
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6">
                            Ufficio e cantiere <br/>lavorano sugli stessi dati.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                            Le informazioni raccolte sul campo diventano immediatamente disponibili per chi pianifica, amministra e controlla la commessa. L'ufficio non deve più ricostruire il lavoro attraverso telefonate e messaggi separati.
                        </p>
                        <p className="mt-6 text-sm font-black text-edil-blue uppercase tracking-widest">
                            Una sola informazione. Disponibile nel posto corretto. Aggiornata durante il lavoro.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-stretch reveal">
                        <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-10 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-edil-light rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-edil-blue text-white rounded-2xl flex items-center justify-center">
                                    <Monitor size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-navy-deep tracking-tight">Area Ufficio</h3>
                            </div>
                            <ul className="grid grid-cols-2 gap-4">
                                {["Commerciale", "Preventivi", "Amministrazione", "Fatturazione", "Documenti", "Controllo economico", "Pianificazione"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                                        <CheckCircle2 size={16} className="text-edil-blue" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="hidden lg:flex items-center justify-center px-4">
                            <RefreshCw size={40} className="text-edil-blue animate-spin-slow opacity-50" />
                        </div>

                        <div className="flex-1 bg-navy-deep border border-slate-800 rounded-[2rem] p-10 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-edil-blue/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-edil-blue text-white rounded-2xl flex items-center justify-center">
                                    <HardHat size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Area Cantiere</h3>
                            </div>
                            <ul className="grid grid-cols-2 gap-4">
                                {["Attività", "Presenze", "Rapportini", "Fotografie", "Materiali", "Criticità", "Avanzamento"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300 font-medium">
                                        <CheckCircle2 size={16} className="text-edil-blue" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ESPERIENZA MULTI-DISPOSITIVO */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                            OVUNQUE SERVA
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6">
                            La stessa piattaforma, <br/>su ogni dispositivo.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                            Direzione e amministrazione lavorano da desktop. Tecnici e responsabili consultano dati e attività da tablet. Il personale operativo utilizza dallo smartphone soltanto le funzioni necessarie.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 reveal">
                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <div className="bg-slate-200 aspect-[4/3] relative w-full h-full overflow-hidden">
                                <img src="/dashboard-render.png" alt="EdilManager24 Desktop Dashboard" className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="p-8 flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Monitor className="text-edil-blue" size={24} />
                                    <h3 className="text-xl font-bold text-navy-deep">Desktop</h3>
                                </div>
                                <p className="text-sm font-black text-edil-blue uppercase tracking-widest mb-4">Controllo completo</p>
                                <ul className="space-y-3">
                                    {["Dashboard", "Amministrazione", "Analisi", "Pianificazione", "Documentazione"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                            <div className="w-1.5 h-1.5 bg-edil-blue rounded-full"></div> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <div className="bg-slate-200 aspect-[4/3] relative w-full h-full overflow-hidden">
                                <img src="/ipad-preview.png" alt="EdilManager24 Tablet" className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="p-8 flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Tablet className="text-edil-blue" size={24} />
                                    <h3 className="text-xl font-bold text-navy-deep">Tablet</h3>
                                </div>
                                <p className="text-sm font-black text-edil-blue uppercase tracking-widest mb-4">Gestione operativa</p>
                                <ul className="space-y-3">
                                    {["Commesse", "Attività", "Avanzamento", "Documenti", "Sopralluoghi"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                            <div className="w-1.5 h-1.5 bg-edil-blue rounded-full"></div> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <div className="bg-slate-200 aspect-[4/3] relative w-full h-full overflow-hidden">
                                <img src="/iphone-preview.png" alt="EdilManager24 Smartphone" className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="p-8 flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Smartphone className="text-edil-blue" size={24} />
                                    <h3 className="text-xl font-bold text-navy-deep">Smartphone</h3>
                                </div>
                                <p className="text-sm font-black text-edil-blue uppercase tracking-widest mb-4">Operatività sul campo</p>
                                <ul className="space-y-3">
                                    {["Presenze", "Rapportini", "Foto", "Segnalazioni", "Attività assegnate"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                            <div className="w-1.5 h-1.5 bg-edil-blue rounded-full"></div> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. RUOLI E ACCESSI */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 reveal">
                    <div className="bg-navy-deep rounded-[3rem] p-10 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                            <div className="text-center lg:text-left">
                                <div className="flex w-fit items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10 mx-auto lg:mx-0">
                                    OGNI PERSONA VEDE CIÒ CHE SERVE
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6 mx-auto lg:mx-0">
                                    Informazioni complete.<br/>Accessi controllati.
                                </h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8 mx-auto lg:mx-0">
                                    Ogni utente accede alle funzioni e ai dati pertinenti al proprio ruolo. La direzione mantiene una visione completa, mentre ufficio, tecnici e personale operativo utilizzano soltanto gli strumenti necessari.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    "Titolare", "Amministrazione", "Commerciale", 
                                    "Responsabile di commessa", "Tecnico", 
                                    "Capocantiere", "Operaio", "Collaboratore esterno", "Cliente o committente"
                                ].map((role, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 text-slate-300 font-medium">
                                        <Users size={18} className="text-edil-blue" />
                                        <span className="text-sm">{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. INFRASTRUTTURA, SICUREZZA E CONTINUITÀ */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                            SICUREZZA E CONTINUITÀ OPERATIVA
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6">
                            I dati dell'impresa <br/>protetti e sempre disponibili.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                            EdilManager24 utilizza un'infrastruttura progettata per garantire disponibilità, protezione e continuità operativa. Ogni dichiarazione tecnica deve corrispondere alle caratteristiche reali del servizio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
                        {[
                            { 
                                title: "Backup ridondati", 
                                desc: "Backup automatici ogni 6 ore su infrastrutture ridondate. Copie separate per ridurre il rischio di perdita.",
                                icon: <Database className="text-edil-blue" />
                            },
                            { 
                                title: "Disponibilità del servizio", 
                                desc: "Infrastruttura progettata per mantenere il servizio disponibile durante il lavoro quotidiano. SLA 99,99% garantito contrattualmente.",
                                icon: <Zap className="text-edil-blue" />
                            },
                            { 
                                title: "Crittografia dei dati", 
                                desc: "I dati e le comunicazioni vengono protetti attraverso standard crittografici adeguati come AES-256 in transito e a riposo.",
                                icon: <Lock className="text-edil-blue" />
                            },
                            { 
                                title: "Protezione dei dati e GDPR", 
                                desc: "La gestione dei dati, i processi e l'infrastruttura sono progettati nel rispetto dei requisiti applicabili in materia di privacy (GDPR).",
                                icon: <ShieldCheck className="text-edil-blue" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-edil-light rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-edil-blue group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h4 className="text-lg font-bold text-navy-deep mb-3 tracking-tight">{item.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. DATI TECNICI & 8. PRESTAZIONI */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal text-center lg:text-left">
                            <div className="flex w-fit items-center gap-2 px-3 py-1 bg-edil-light text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm mx-auto lg:mx-0">
                                PROGETTATO PER IL LAVORO REALE
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-8 mx-auto lg:mx-0">
                                Tecnologia affidabile, <br />senza complicare l'operatività.
                            </h2>
                            
                            <div className="space-y-10">
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-slate-100 text-edil-blue rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                                        <Server size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-navy-deep mb-2">Accesso senza infrastruttura locale</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm">EdilManager24 è accessibile dai dispositivi autorizzati senza installare server aziendali o mantenere infrastrutture complesse in sede.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-slate-100 text-edil-blue rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                                        <RefreshCw size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-navy-deep mb-2">Interfaccia reattiva e sincronizzata</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm">Le informazioni vengono aggiornate tra i dispositivi per mantenere ufficio e cantiere allineati durante l'operatività.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-slate-100 text-edil-blue rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-navy-deep mb-2">Protezione integrata dei dati</h4>
                                        <p className="text-slate-600 leading-relaxed text-sm">Crittografia, backup e controllo degli accessi contribuiscono a proteggere le informazioni aziendali in modo silenzioso ed efficace.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-slate-100 text-center lg:text-left">
                                <div className="flex w-fit items-center gap-2 px-3 py-1 bg-edil-light text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm mx-auto lg:mx-0">
                                    INFORMAZIONI AGGIORNATE
                                </div>
                                <h2 className="text-2xl font-black text-navy-deep tracking-tight mb-4 mx-auto lg:mx-0">Ogni area lavora sulla stessa versione dei dati.</h2>
                                <p className="text-slate-600 text-sm mx-auto lg:mx-0">Quando un'attività, un documento o un dato di commessa viene aggiornato, le persone autorizzate possono consultare l'informazione senza ricostruirla in strumenti separati.</p>
                            </div>
                        </div>

                        <div className="bg-warm-gray rounded-[3rem] p-8 md:p-12 border border-slate-100 reveal shadow-inner">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                                <div className="flex items-center gap-2 text-edil-blue font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                                    <Server size={14} /> DATI DELL'INFRASTRUTTURA
                                </div>
                                <h3 className="text-2xl font-black text-navy-deep tracking-tight mb-8">Una base tecnica verificabile.</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Disponibilità", val: "99,99%" },
                                        { label: "Localizzazione dati", val: "Unione Europea" },
                                        { label: "Data center", val: "Tier IV" },
                                        { label: "Crittografia", val: "AES-256" },
                                        { label: "Protezione dati", val: "GDPR" },
                                        { label: "Sistema di gestione", val: "ISO/IEC 27001*" }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                            <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                                            <span className="text-sm font-black text-navy-deep">{stat.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-xs text-slate-400 font-medium">
                                    *Infrastruttura ospitata presso provider con data center certificati ISO/IEC 27001.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CONFIGURAZIONE E ONBOARDING */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                            CONFIGURATO SUI PROCESSI REALI
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6">
                            La piattaforma si adatta <br/>alla struttura della tua impresa.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                            Prima dell'attivazione analizziamo processi, ruoli, moduli e informazioni utilizzate. La configurazione viene costruita per ridurre i passaggi inutili e rendere l'adozione più semplice.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 reveal">
                        {[
                            { step: "01", title: "Analisi dei processi", desc: "Studio del flusso di lavoro attuale dell'impresa." },
                            { step: "02", title: "Configurazione dei moduli", desc: "Attivazione delle sole funzioni realmente necessarie." },
                            { step: "03", title: "Importazione dati", desc: "Organizzazione ordinata delle anagrafiche base." },
                            { step: "04", title: "Formazione e avvio", desc: "Accompagnamento all'uso per uffici e cantieri." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
                                <div className="text-2xl font-black text-edil-blue mb-4 opacity-50">{item.step}</div>
                                <h3 className="font-bold text-navy-deep mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. APPROFONDIMENTO TECNICO */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-edil-light text-edil-blue rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                        DOCUMENTAZIONE TECNICA
                    </div>
                    <h2 className="text-3xl font-black text-navy-deep tracking-tight mb-6">Vuoi approfondire l'architettura e la sicurezza?</h2>
                    <p className="text-slate-600 mb-10 text-lg">
                        Richiedi un confronto diretto sull'infrastruttura, la protezione dei dati e il funzionamento dettagliato della piattaforma.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/contatti" className="bg-white text-edil-blue border-2 border-edil-blue px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-edil-blue hover:text-white transition-all shadow-md flex items-center gap-2">
                            Parla con un tecnico <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 10. CTA FINALE */}
            <section className="py-24 bg-navy-deep reveal text-center border-t border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
                        VEDILA SUI TUOI PROCESSI
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8">
                        Scopri come EdilManager24 <br/>può collegare la tua impresa.
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                        Durante la demo analizziamo il tuo flusso operativo e mostriamo come direzione, ufficio e cantiere possono lavorare nello stesso sistema.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contatti" className="w-full sm:w-auto bg-edil-blue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2">
                            Prenota una demo
                        </Link>
                        <Link href="/funzionalita" className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center">
                            Esplora le funzionalità
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

