'use client';

import { 
    BarChart3, LayoutDashboard, HardHat, FileText, 
    ClipboardCheck, Receipt, Package, TrendingUp, 
    Smartphone, Users, ShieldCheck, Globe, 
    Clock, Zap, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    {
        title: "Command Center Analitico",
        desc: "Una visione a 360° sulla tua impresa. Monitora ogni parametro vitale da un unico cruscotto enterprise.",
        icon: <LayoutDashboard size={32} />,
        category: "Management",
        color: "bg-blue-600",
        slug: "management",
        subfeatures: ["Dashboard Cashflow Proiettato", "Monitoraggio Margini Real-time", "Alert Anomalie di Budget", "Analisi Carico di Lavoro"]
    },
    {
        title: "Gestione Cantieri (SAL)",
        desc: "Controlla l'avanzamento dei lavori e la redditività di ogni singola commessa in tempo reale.",
        icon: <HardHat size={32} />,
        category: "Operazioni",
        color: "bg-orange-600",
        slug: "cantieri",
        subfeatures: ["Cronoprogramma Lavori", "Gestione Varianti in Corso d'Opera", "Produzione Documenti SAL", "Archiviazione Foto Cantiere"]
    },
    {
        title: "Rapportini Digitali",
        desc: "Elimina la carta e il data-entry manuale. Trasforma il cantiere in una fonte di dati puliti.",
        icon: <ClipboardCheck size={32} />,
        category: "In Cantiere",
        color: "bg-emerald-600",
        slug: "rapportini",
        subfeatures: ["Rilevazione Presenze GPS", "Diario di Bordo Giornaliero", "Consumo Materiali Istantaneo", "Firma Digitale Capocantiere"]
    },
    {
        title: "Fatturazione & SDI",
        desc: "Integrazione profonda con il fisco e la banca per una contabilità che si gestisce da sola.",
        icon: <Receipt size={32} />,
        category: "Amministrazione",
        color: "bg-slate-900",
        slug: "amministrazione",
        subfeatures: ["Ricezione Automatica Fatture Passive", "Creazione XML Fatture Attive", "Riconciliazione Movimenti Bancari", "Scadenziario Fiscale Integrato"]
    },
    {
        title: "Logistica & Mezzi",
        desc: "Ottimizza l'uso della flotta e riduci i fermi macchina con una manutenzione proattiva.",
        icon: <Package size={32} />,
        category: "Risorse",
        color: "bg-purple-600",
        slug: "logistica",
        subfeatures: ["Geolocalizzazione Flotta", "Pianificazione Manutenzioni", "Gestione Schede Carburante", "Checklist Sicurezza Mezzi"]
    },
    {
        title: "Sicurezza & DPI",
        desc: "Proteggi i tuoi lavoratori e la tua azienda garantendo la piena conformità normativa.",
        icon: <ShieldCheck size={32} />,
        category: "Compliance",
        color: "bg-red-600",
        slug: "compliance",
        subfeatures: ["Registro Formazione Dipendenti", "Alert Visite Mediche", "Tracciamento Consegna DPI", "Generazione POS Automatico"]
    },
    {
        title: "Portale Clienti & Committenti",
        desc: "Trasparenza totale per i tuoi clienti. Riduci le chiamate e aumenta la fiducia.",
        icon: <Globe size={32} />,
        category: "Collaborazione",
        color: "bg-indigo-600",
        slug: "collaborazione",
        subfeatures: ["Condivisione Stato Avanzamento", "Area Download Fatture/Documenti", "Approvazione Varianti Online", "Galleria Fotografica Cantiere"]
    },
    {
        title: "Commerciale & Preventivi",
        desc: "Vinci più appalti con preventivi precisi, veloci e dall'aspetto professionale.",
        icon: <FileText size={32} />,
        category: "Commerciale",
        color: "bg-amber-600",
        slug: "commerciale",
        subfeatures: ["Analisi Costi Parametrici", "Gestione Listini Fornitori", "Tracciamento Trattative (CRM)", "Invio Preventivi con Firma Online"]
    },
    {
        title: "Business Intelligence",
        desc: "Trasforma i dati in decisioni strategiche per far scalare la tua impresa.",
        icon: <TrendingUp size={32} />,
        category: "Strategia",
        color: "bg-blue-600",
        slug: "strategia",
        subfeatures: ["Report Redditività per Tipologia", "Analisi Efficienza Squadre", "Forecast Fatturato Annuale", "Export Dati per Commercialista"]
    }
];

export default function FeaturesPage() {
    return (
        <div className="bg-corporate min-h-screen pt-16 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 text-center reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200">Capabilities</div>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                        Tutto ciò che serve per <span className="text-blue-600">vincere in cantiere.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        EdilManager non è un semplice software, è il sistema nervoso della tua impresa edile. Progettato per eliminare le inefficienze e massimizzare i profitti.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, i) => (
                        <Link 
                            key={i} 
                            href={`/features/${feature.slug}`}
                            className="bento-card bg-white hover:border-blue-600 transition-all group reveal block text-left"
                        >
                            <div className={`w-16 h-16 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">{feature.category}</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{feature.desc}</p>
                            
                            <ul className="space-y-3 mb-8">
                                {feature.subfeatures.map((sub, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                                        {sub}
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Modulo EM-{(i+1).toString().padStart(3, '0')}</span>
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase hidden group-hover:block animate-in fade-in slide-in-from-right-1">Dettagli</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* FINAL CTA */}
                <div className="mt-32 p-12 lg:p-20 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden reveal">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-8">Pronto a trasformare la tua impresa?</h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12">
                            Unisciti a oltre 40 aziende che hanno scelto l'efficienza digitale. Inizia la tua prova gratuita oggi stesso.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/#contatti" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2">
                                Richiedi Demo Gratuita <ArrowRight size={20} />
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all flex items-center justify-center">
                                Accedi al Portale
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
