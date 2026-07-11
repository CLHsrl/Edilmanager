'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, CheckCircle2, ShieldCheck, Smartphone, TrendingUp, Users, 
    HardHat, Building2, Zap, MessageSquare, ChevronDown, Check, 
    LayoutDashboard, FileText, Package, CheckCircle, X 
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';
import ROICalculator from '@/components/ROICalculator';
import IntegrationsMap from '@/components/IntegrationsMap';
import MaturityQuiz from '@/components/MaturityQuiz';
import PricingTable from '@/components/PricingTable';
import IndustryVerticals from '@/components/IndustryVerticals';
import StrategicFAQ from '@/components/StrategicFAQ';

export default function LandingPage() {
    const [showTrigger, setShowTrigger] = useState(false);
    const [isTriggerClosed, setIsTriggerClosed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 1500 && !isTriggerClosed) {
                setShowTrigger(true);
            } else if (window.scrollY <= 1500) {
                setShowTrigger(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isTriggerClosed]);

    return (
        <div className="bg-white font-sans">

            {/* 1. HERO SECTION */}
            <section className="relative pt-10 pb-20 overflow-hidden bg-corporate">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 text-left reveal">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.04em] leading-[1.1] mb-6">
                                L'Eccellenza Digitale <br/><span className="text-blue-600">per la tua Impresa.</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-medium">
                                Centralizza la gestione dei cantieri, monitora i margini in tempo reale e ottimizza le risorse con una piattaforma progettata per i leader dell'edilizia.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link href="#contatti" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-2 btn-solid">
                                    Inizia Ora <ArrowRight size={18} />
                                </Link>
                                <Link href="#soluzioni" className="w-full sm:w-auto bg-white text-slate-600 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center">
                                    Guarda Demo
                                </Link>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative reveal">
                            <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full"></div>
                            <div className="relative z-10 p-4 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white shadow-2xl overflow-hidden group">
                                <img 
                                    src="/hero-render.png" 
                                    alt="EdilManager Platform" 
                                    className="w-full rounded-[2.5rem] shadow-lg group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. STATS BAR (Modern Blueprint Section - High Contrast) */}
            <section className="relative py-8 bg-slate-50/50 overflow-hidden">
                {/* TECHNICAL BLUE GRID OVERLAY */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Aziende Partner", value: "40+", icon: <Building2 size={24}/>, detail: "Network Certificato" },
                            { label: "Cantieri Attivi", value: "1.2k+", icon: <HardHat size={24}/>, detail: "Monitoraggio Real-time" },
                            { label: "Profitto Medio", value: "+22%", icon: <TrendingUp size={24}/>, detail: "Margine Operativo" },
                            { label: "Uptime Server", value: "99.99%", icon: <ShieldCheck size={24}/>, detail: "Protocollo Security" }
                        ].map((stat, i) => (
                            <div key={i} className="px-8 py-6 sm:py-2 group transition-all duration-500 first:pl-0 last:pr-0">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.2)] group-hover:scale-110 transition-all duration-500">
                                            {stat.icon}
                                        </div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono">
                                            SEC_0{i + 1} // ACTIVE
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black text-blue-600 tracking-tighter mb-2 leading-none">
                                            {stat.value}
                                        </div>
                                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">{stat.label}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{stat.detail}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. THE MANIFESTO (Pain vs Dream) */}
            <section className="py-32 bg-slate-950 overflow-hidden reveal border-y border-white/5 relative">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-6 leading-tight">Perché le vecchie abitudini<br/><span className="text-blue-500">stanno limitando la tua crescita.</span></h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">La gestione cartacea non è solo lenta, è un freno invisibile alla tua redditività. EdilManager trasforma il caos in efficienza automatizzata.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                        {/* PAIN */}
                        <div className="relative p-10 lg:p-12 rounded-[3rem] bg-white border border-white shadow-2xl overflow-hidden group">
                            <div className="hidden lg:block absolute top-4 right-8 text-[64px] font-black text-red-500/5 -z-0 select-none">PRIMA</div>
                            <div className="relative z-10">
                                <div className="flex w-fit items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-red-100 mx-auto lg:mx-0">
                                    Vecchio Metodo
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Inefficienza e<br/>Dati Frammentati</h3>
                                <ul className="space-y-6 mb-12">
                                    {[
                                        "Rapportini cartacei che si perdono o arrivano illeggibili in ufficio.",
                                        "Nessuna visione reale dei margini fino alla chiusura del cantiere."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start text-slate-600">
                                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0 border border-red-100"><X size={18} className="text-red-600" /></div>
                                            <p className="font-medium leading-relaxed">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center gap-3 py-4 border-t border-slate-100">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Obsolescenza Operativa</span>
                                </div>
                            </div>
                        </div>

                        {/* DREAM */}
                        <div className="relative p-10 lg:p-12 rounded-[3rem] bg-blue-600 border border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden group">
                            <div className="hidden lg:block absolute top-4 right-8 text-[64px] font-black text-white/10 -z-0 select-none">DOPO</div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex w-fit items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-white/20 backdrop-blur-md mx-auto lg:mx-0">
                                    La Nuova Era
                                </div>
                                <h3 className="text-4xl font-black text-white mb-8 tracking-tight leading-tight">Precisione e<br/>Controllo Totale</h3>
                                <ul className="space-y-6 mb-12">
                                    {[
                                        { title: "Dati Certificati", desc: "Tracciamento istantaneo di ogni euro e ogni ora lavorata." },
                                        { title: "Margine Protetto", desc: "Anticipa i problemi prima che diventino costi vivi." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-md shadow-inner"><CheckCircle size={22} className="text-white" /></div>
                                            <div>
                                                <p className="text-white font-black mb-1">{item.title}</p>
                                                <p className="text-blue-100/70 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white border border-white/20">System Ready</div>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-400/50 overflow-hidden shadow-sm"></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CORE SOLUTIONS (Consolidated) */}
            <section id="soluzioni" className="py-32 bg-slate-50/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#bfdbfe_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 reveal">
                        <div className="chip mb-4" style={{background:'#fff',color:'#2563eb',borderColor:'#dbeafe'}}>Core Ecosystem</div>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-tight"><span className="text-slate-900">Un solo strumento,</span><br/><span className="text-blue-600">zero salti mortali.</span></h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">Abbiamo centralizzato tutte le operazioni della tua impresa in un'unica interfaccia fluida e potentissima.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                        {
                            icon: <TrendingUp size={32}/>,
                            title: 'Cassa e Margini Real-time',
                            desc: "Monitora cashflow, marginalità e scadenze da un unico cruscotto aggiornato al secondo.",
                            checks: ['Riconciliazione automatica', 'Proiezione incassi/uscite'],
                            style: 'bg-blue-50/40 border-blue-100 shadow-blue-200/20 text-slate-900',
                            iconStyle: 'bg-white text-blue-600 shadow-sm',
                            checkStyle: 'bg-blue-100 text-blue-600'
                        },
                        {
                            icon: <HardHat size={32}/>,
                            title: 'Cantieri sotto Controllo',
                            desc: 'Traccia costi diretti e indiretti, SAL e ricevi alert se superi il budget preventivato.',
                            checks: ['Alert budget superato', 'Gestione SAL digitale'],
                            style: 'bg-white border-white shadow-slate-200/40 text-slate-900',
                            iconStyle: 'bg-blue-600 text-white shadow-lg',
                            checkStyle: 'bg-slate-100 text-slate-400'
                        },
                        {
                            icon: <Users size={32}/>,
                            title: 'Risorse e Personale',
                            desc: 'Assegna i task, traccia le ore e compila rapportini in pochi tap dallo smartphone.',
                            checks: ['Rapportini immediati', 'Tracciamento ore manodopera'],
                            style: 'bg-blue-900 border-blue-800 text-white shadow-blue-950/40',
                            iconStyle: 'bg-blue-600 text-white shadow-lg',
                            checkStyle: 'bg-white/10 text-blue-300'
                        },
                        {
                            icon: <Package size={32}/>,
                            title: 'Archivio e Logistica',
                            desc: 'Tutti i documenti dei fornitori, DDT e giacenze in un unico posto accessibile ovunque.',
                            checks: ['Magazzino real-time', 'Gestione integrata DDT'],
                            style: 'bg-slate-950 border-white/10 text-white shadow-black/40',
                            iconStyle: 'bg-white/10 text-white border border-white/20 backdrop-blur-md',
                            checkStyle: 'bg-white/5 text-slate-400'
                        }
                    ].map((card, i) => (
                        <div key={i} className={`relative p-12 rounded-[3.5rem] backdrop-blur-2xl border transition-all duration-500 group reveal overflow-hidden ${card.style} hover:shadow-2xl hover:-translate-y-1`} style={{ animationDelay: `${i * 0.1}s` }}>
                            {/* Decorative Glow */}
                            <div className={`absolute -top-24 -right-24 w-64 h-64 opacity-20 blur-[100px] transition-colors ${i === 2 ? 'bg-blue-400' : i === 3 ? 'bg-white' : 'bg-blue-500'}`}></div>
                            
                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ${card.iconStyle}`}>{card.icon}</div>
                                
                                <h3 className={`text-3xl font-black mb-6 tracking-tight leading-tight ${i > 1 ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                                <p className={`text-[16px] leading-[1.6] font-medium mb-10 opacity-80 ${i > 1 ? 'text-blue-100' : 'text-slate-600'}`}>{card.desc}</p>
                                
                                <ul className="space-y-6 mb-12">
                                    {card.checks.map((c, j) => (
                                        <li key={j} className="flex gap-5 items-center">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-transparent ${card.checkStyle}`}><Check size={18} strokeWidth={3}/></div>
                                            <p className={`text-[15px] font-bold ${i > 1 ? 'text-white' : 'text-slate-700'}`}>{c}</p>
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className={`pt-8 border-t flex items-center justify-between ${i > 1 ? 'border-white/10' : 'border-slate-100'}`}>
                                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${i > 1 ? 'text-blue-300' : 'text-slate-400'}`}>
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-blue-600' : 'bg-white'}`}></div>
                                        {i === 0 ? 'Active Module' : i === 1 ? 'Ready for Setup' : i === 2 ? 'High Priority' : 'Enterprise Secure'}
                                    </div>
                                    <ArrowRight size={20} className={`transition-transform duration-500 group-hover:translate-x-2 ${i > 1 ? 'text-blue-400' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            {/* 5. ROI CALCULATOR (Financial proof) */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative reveal">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <div className="chip chip--accent mb-6">Business Intelligence</div>
                        <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.95]">
                            Quanto ti costa <br/><span className="text-blue-500">non decidere?</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Calcola istantaneamente il recupero di marginalità che la tua impresa può ottenere digitalizzando i processi.</p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <ROICalculator />
                    </div>
                </div>
            </section>

            {/* 6. OPERAIO AL CENTRO (Mobile & WhatsApp) */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2 relative reveal">
                            <div className="absolute -inset-10 bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
                            <img 
                                src="/iphone-preview.png" 
                                alt="EdilManager Mobile" 
                                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl hover:rotate-3 transition-transform duration-700 rounded-[3rem]" 
                            />
                        </div>
                        <div className="lg:w-1/2 reveal">
                            <div className="chip chip--accent mb-8">User Centric Design</div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
                                L'operaio non deve fare nulla, <span className="text-blue-600">se non quello che già fa.</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                                Abbiamo eliminato ogni complessità. I tuoi operai useranno l'app solo per 2 minuti al giorno. È talmente semplice che non servirà nemmeno spiegarglielo.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 text-slate-900"><Smartphone size={24}/></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Interfaccia XXL</h4>
                                        <p className="text-sm text-slate-500">Bottoni enormi, pensati per chi lavora con i guanti o in condizioni difficili.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                       </svg>
                                   </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">WhatsApp Ready</h4>
                                        <p className="text-sm text-slate-500">Presto sarà possibile inviare rapportini e foto via chat, senza nemmeno aprire l'app.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl flex items-center gap-6">
                                <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0"><CheckCircle size={28}/></div>
                                <div>
                                    <p className="text-emerald-900 font-bold mb-1">Dati Puliti al 100%</p>
                                    <p className="text-emerald-700 text-sm">Elimina il data-entry manuale in ufficio. I dati arrivano già pronti per la contabilità.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. INDUSTRY VERTICALS */}
            <IndustryVerticals />

            {/* 8. TESTIMONIALS */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden reveal">
                <div className="absolute top-0 left-0 w-full h-full bg-corporate opacity-5"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black tracking-tighter mb-6">Dicono di noi.</h2>
                        <p className="text-slate-400 text-lg">Le voci dei leader che stanno cambiando il settore.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { 
                                quote: "Prima perdevamo il 10% dei margini in acquisti fuori controllo. Ora so quanto costa ogni singolo mattone.", 
                                author: "Ing. Giovanni Riva", 
                                company: "Riva Costruzioni Srl",
                                initial: "G", color: "bg-blue-600"
                            },
                            { 
                                quote: "Gli operai non si lamentano. L'app è così facile che la usano volentieri e ho i rapportini ogni sera.", 
                                author: "Paolo Brambilla", 
                                company: "Brambilla Edilizia",
                                initial: "P", color: "bg-emerald-600"
                            },
                            { 
                                quote: "Finalmente ho il controllo totale sulla cassa. So esattamente quando incasserò e quando pagare.", 
                                author: "Arch. Alessandra Poli", 
                                company: "Poli & Co Costruzioni",
                                initial: "A", color: "bg-purple-600"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
                                <div className="flex gap-1 text-yellow-500 mb-8">
                                    {[...Array(5)].map((_, j) => <CheckCircle key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-xl font-medium italic mb-10 text-slate-200">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 ${t.color} rounded-full flex items-center justify-center font-black text-xl shadow-lg`}>{t.initial}</div>
                                    <div>
                                        <div className="font-bold text-lg">{t.author}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest">{t.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. INTEGRATIONS */}
            <IntegrationsMap />



            <section id="quiz" className="py-32 bg-slate-950 relative overflow-hidden">
                {/* Tech background elements */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 reveal">
                            <div className="chip chip--accent bg-blue-500/10 border-blue-500/20 text-blue-400 mb-8">Performance Audit</div>
                            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-white mb-8 leading-[0.95]">
                                La tua impresa <br/><span className="text-blue-500">è pronta al salto?</span>
                            </h2>
                            <p className="text-slate-400 text-xl mb-12 leading-relaxed max-w-xl">
                                Scopri il tuo livello di maturità digitale in 60 secondi. Ricevi un'analisi tecnica dei processi per identificare colli di bottiglia e opportunità di crescita.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-2xl font-bold text-white mb-2 tracking-tight">60 Secondi</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest font-black">Tempo di Audit</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white mb-2 tracking-tight">Real-time</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest font-black">Elaborazione Dati</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full reveal">
                            <MaturityQuiz />
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. FAQ */}
            <StrategicFAQ />

            {/* 12. CONTACT & MISSION */}
            <section id="contatti" className="py-32 bg-slate-900 text-white relative reveal overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 blur-3xl rounded-full"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <div className="chip chip--accent mb-8">Contatti</div>
                            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter mb-8 leading-[0.95]">Inizia il tuo percorso verso l'eccellenza.</h2>
                            <p className="text-slate-400 text-xl mb-12 leading-relaxed">Compila il modulo e un nostro consulente senior ti mostrerà come EdilManager può scalare la tua impresa.</p>
                            
                            <div className="space-y-8 mb-16">
                                <div className="flex items-center gap-4 text-slate-200 font-bold">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><CheckCircle2 className="text-white" size={24}/></div>
                                    Demo personalizzata di 30 minuti
                                </div>
                                <div className="flex items-center gap-4 text-slate-200 font-bold">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><CheckCircle2 className="text-white" size={24}/></div>
                                    Analisi gratuita dei processi operativi
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-12">
                                <p className="text-sm text-slate-500 italic leading-relaxed">
                                    "Siamo nati nel fango dei cantieri. Abbiamo costruito EdilManager perché cercavamo uno strumento che ci restituisse il nostro tempo. Ora lo condividiamo con te."
                                </p>
                                <p className="text-sm font-black text-white mt-4">— I Fondatori di EdilManager</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 text-slate-900 shadow-2xl">
                            <h3 className="text-2xl font-black tracking-tight mb-8">Richiedi una consulenza</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nome</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" placeholder="Mario" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Cognome</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" placeholder="Rossi" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Azienda</label>
                                    <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" placeholder="Edilizia Srl" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                                    <input type="email" className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold" placeholder="mario@email.it" />
                                </div>
                                <button type="button" className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs py-6 rounded-2xl shadow-xl shadow-blue-200 transition-all mt-4 flex items-center justify-center gap-2 group">
                                    Invia Richiesta <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ti risponderemo entro 2 ore lavorative</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* STICKY CONVERSION TRIGGER */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] md:w-auto md:left-10 md:translate-x-0 z-[100] transition-all duration-700 transform ${showTrigger ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-white text-slate-900 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center gap-4 md:gap-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                    <div className="relative z-10 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                        <Zap size={24} className="text-white" />
                    </div>
                    <div className="relative z-10 hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">Analisi Rapida</p>
                        <h4 className="font-bold text-sm">Pronto per il salto?</h4>
                    </div>
                    <Link 
                        href="#quiz" 
                        onClick={() => {
                            setShowTrigger(false);
                            setIsTriggerClosed(true);
                        }}
                        className="relative z-10 bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-lg"
                    >
                        Inizia Quiz
                    </Link>
                    <button 
                        onClick={() => {
                            setShowTrigger(false);
                            setIsTriggerClosed(true);
                        }}
                        className="relative z-20 p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Chiudi"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}
