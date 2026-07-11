import { Metadata } from 'next';
import Link from 'next/link';
import { 
    LayoutDashboard, HardHat, FileSignature, Receipt, 
    Truck, ShieldAlert, Globe, FileText, 
    TrendingUp, Users, ArrowRight, ArrowDown
} from 'lucide-react';
import FunzionalitaClient from './FunzionalitaClient';

export const metadata: Metadata = {
    title: "Funzionalità EdilManager24 | Gestionale completo per imprese edili",
    description: "Scopri le funzionalità di EdilManager24 per controllare cantieri, cassa, margini, preventivi, fatturazione, personale, sicurezza, mezzi e documenti.",
};

const FEATURES = [
    {
        id: "EM-001",
        title: "Centro di controllo aziendale",
        subtitle: "Command Center EdilManager24",
        desc: "Una visione completa dell’impresa. Controlla cassa, margini, anomalie e indicatori economici da un unico cruscotto aggiornato.",
        icon: <LayoutDashboard size={32} strokeWidth={1.5} />,
        category: "Direzione e controllo",
        categoryId: "CTRL",
        color: "bg-edil-blue text-white",
        slug: "centro-di-controllo",
        subfeatures: [
            "Dashboard del cash flow previsionale",
            "Monitoraggio dei margini in tempo reale",
            "Alert sulle anomalie di budget",
            "Analisi del carico di lavoro"
        ]
    },
    {
        id: "EM-002",
        title: "Cantieri e avanzamento lavori",
        subtitle: "Gestione SAL",
        desc: "Pianifica le attività, controlla l’avanzamento delle commesse e gestisci varianti, documenti e fotografie di cantiere.",
        icon: <HardHat size={32} strokeWidth={1.5} />,
        category: "Cantieri e operatività",
        categoryId: "CANT",
        color: "bg-navy-deep text-white",
        slug: "cantieri-avanzamento",
        subfeatures: [
            "Cronoprogramma dei lavori",
            "Gestione delle varianti in corso d’opera",
            "Produzione dei documenti SAL",
            "Archivio fotografico del cantiere"
        ]
    },
    {
        id: "EM-003",
        title: "Rapportini digitali",
        subtitle: "",
        desc: "Raccogli presenze, attività, materiali, fotografie e firme direttamente dal cantiere, senza rapportini cartacei.",
        icon: <FileSignature size={32} strokeWidth={1.5} />,
        category: "Cantieri e operatività",
        categoryId: "CANT",
        color: "bg-blue-50 text-edil-blue border border-blue-200",
        slug: "rapportini",
        subfeatures: [
            "Rilevazione delle presenze tramite GPS",
            "Diario giornaliero di cantiere",
            "Registrazione dei materiali utilizzati",
            "Firma digitale del capocantiere"
        ]
    },
    {
        id: "EM-004",
        title: "Fatturazione e SDI",
        subtitle: "",
        desc: "Gestisci fatture attive e passive, scadenze, riconciliazioni e comunicazioni con il Sistema di Interscambio da un unico ambiente.",
        icon: <Receipt size={32} strokeWidth={1.5} />,
        category: "Commerciale e amministrazione",
        categoryId: "COMM",
        color: "bg-edil-blue text-white",
        slug: "fatturazione-sdi",
        subfeatures: [
            "Ricezione automatica delle fatture passive",
            "Creazione XML delle fatture attive",
            "Riconciliazione dei movimenti bancari",
            "Scadenziario fiscale integrato"
        ]
    },
    {
        id: "EM-005",
        title: "Logistica e mezzi",
        subtitle: "",
        desc: "Organizza flotta, attrezzature, manutenzioni, carburante e controlli operativi, riducendo fermi e informazioni disperse.",
        icon: <Truck size={32} strokeWidth={1.5} />,
        category: "Risorse e sicurezza",
        categoryId: "RIS",
        color: "bg-navy-deep text-white",
        slug: "logistica-mezzi",
        subfeatures: [
            "Geolocalizzazione della flotta",
            "Pianificazione delle manutenzioni",
            "Gestione delle schede carburante",
            "Checklist di sicurezza dei mezzi"
        ]
    },
    {
        id: "EM-006",
        title: "Sicurezza e DPI",
        subtitle: "",
        desc: "Supporta l’impresa nel controllo degli adempimenti e della documentazione obbligatoria del personale.",
        icon: <ShieldAlert size={32} strokeWidth={1.5} />,
        category: "Risorse e sicurezza",
        categoryId: "RIS",
        color: "bg-blue-50 text-edil-blue border border-blue-200",
        slug: "sicurezza-dpi",
        subfeatures: [
            "Registro della formazione dei dipendenti",
            "Alert sulle visite mediche",
            "Tracciamento della consegna dei DPI",
            "Generazione automatica del POS"
        ]
    },
    {
        id: "EM-007",
        title: "Portale clienti e committenti",
        subtitle: "",
        desc: "Condividi avanzamento, documenti, fatture, fotografie e approvazioni attraverso un’area riservata e sempre aggiornata.",
        icon: <Globe size={32} strokeWidth={1.5} />,
        category: "Clienti e collaborazione",
        categoryId: "CLI",
        color: "bg-edil-blue text-white",
        slug: "portale-clienti",
        subfeatures: [
            "Condivisione dello stato di avanzamento",
            "Area download per fatture e documenti",
            "Approvazione online delle varianti",
            "Galleria fotografica del cantiere"
        ]
    },
    {
        id: "EM-008",
        title: "Commerciale e preventivi",
        subtitle: "",
        desc: "Gestisci opportunità, costi, preventivi, revisioni e trattative commerciali attraverso un processo unico e tracciabile.",
        icon: <FileText size={32} strokeWidth={1.5} />,
        category: "Commerciale e amministrazione",
        categoryId: "COMM",
        color: "bg-navy-deep text-white",
        slug: "commerciale-preventivi",
        subfeatures: [
            "Analisi parametrica dei costi",
            "Gestione dei listini fornitori",
            "Tracciamento delle trattative nel CRM",
            "Invio dei preventivi con firma online"
        ]
    },
    {
        id: "EM-009",
        title: "Analisi e Business Intelligence",
        subtitle: "",
        desc: "Trasforma i dati operativi in indicatori utili per controllare redditività, performance, fatturato e andamento aziendale.",
        icon: <TrendingUp size={32} strokeWidth={1.5} />,
        category: "Direzione e controllo",
        categoryId: "CTRL",
        color: "bg-blue-50 text-edil-blue border border-blue-200",
        slug: "analisi-bi",
        subfeatures: [
            "Report di redditività per tipologia di lavoro",
            "Analisi dell’efficienza delle squadre",
            "Previsione del fatturato annuale",
            "Esportazione dati per il commercialista"
        ]
    },
    {
        id: "EM-010",
        title: "Personale e squadre",
        subtitle: "",
        desc: "Organizza persone, squadre, presenze, assegnazioni e disponibilità, mantenendo collegate attività operative e documentazione.",
        icon: <Users size={32} strokeWidth={1.5} />,
        category: "Risorse e sicurezza",
        categoryId: "RIS",
        color: "bg-edil-blue text-white",
        slug: "personale-squadre",
        subfeatures: [
            "Assegnazione delle risorse ai cantieri",
            "Pianificazione dei turni e disponibilità",
            "Controllo delle ore lavorate mensili",
            "Gestione anagrafica e documenti HR"
        ]
    }
];

export default function FunzionalitaPage() {
    return (
        <div className="bg-white min-h-screen pb-32 font-manrope relative">
            
            {/* HERO SECTION (Corporate Style) */}
            <section className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 overflow-hidden bg-corporate">
                {/* TECHNICAL BLUE GRID OVERLAY */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10 reveal">
                    <div className="flex w-fit items-center gap-2 px-4 py-1.5 bg-edil-light text-edil-blue rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm mx-auto">
                        FUNZIONALITÀ
                    </div>
                    <h1 className="text-[38px] sm:text-[56px] lg:text-[64px] font-black text-navy-deep tracking-[-0.04em] mb-8 leading-[1.05] max-w-5xl mx-auto">
                        Tutto ciò che serve per <br className="hidden sm:block"/><span className="text-edil-blue">governare la tua impresa edile.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 font-medium">
                        EdilManager24 collega controllo economico, cantieri, amministrazione, personale, clienti, documenti e logistica. Ogni modulo utilizza gli stessi dati e lavora insieme agli altri processi aziendali.
                    </p>
                    <p className="text-sm font-black text-edil-blue uppercase tracking-widest mx-auto">
                        Non nove strumenti separati, ma un unico sistema operativo aziendale.
                    </p>
                </div>
            </section>

            {/* Client Component per la gestione dello stato (filtri) */}
            <FunzionalitaClient features={FEATURES} />

            {/* UN UNICO FLUSSO */}
            <section className="py-32 bg-white border-y border-slate-200 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center reveal">
                    <div className="flex w-fit items-center gap-2 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-slate-200 mx-auto">
                        UN UNICO FLUSSO
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-navy-deep tracking-tight mb-6 mx-auto">
                        Ogni funzione utilizza gli stessi dati.<br/>Ogni area lavora con le altre.
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-16 mx-auto">
                        Un preventivo accettato può diventare una commessa. La commessa alimenta pianificazione, rapportini, documenti, costi, fatturazione e controllo dei margini. Le informazioni non devono essere inserite più volte o ricostruite tra strumenti separati.
                    </p>

                    {/* Diagramma */}
                    <div className="flex flex-col items-center max-w-xl mx-auto">
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center font-bold text-navy-deep shadow-sm">
                            Commerciale e preventivi
                        </div>
                        <ArrowDown size={24} className="text-edil-blue my-3" />
                        <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center font-bold text-edil-blue shadow-sm">
                            Commessa
                        </div>
                        <ArrowDown size={24} className="text-edil-blue my-3" />
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center font-bold text-navy-deep shadow-sm">
                            Cantieri e rapportini
                        </div>
                        <ArrowDown size={24} className="text-edil-blue my-3" />
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center font-bold text-navy-deep shadow-sm">
                            Costi, documenti e fatturazione
                        </div>
                        <ArrowDown size={24} className="text-edil-blue my-3" />
                        <div className="w-full bg-navy-deep border border-navy-deep rounded-2xl p-6 text-center font-bold text-white shadow-lg">
                            Controllo economico e Business Intelligence
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <div className="max-w-7xl mx-auto px-6 mt-32">
                <div className="p-12 lg:p-20 bg-[#020618] rounded-[32px] text-center relative overflow-hidden reveal">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-edil-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10 text-center">
                        <div className="flex w-fit items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20 backdrop-blur-md mx-auto">
                            VEDILO SUI TUOI PROCESSI
                        </div>
                        <h2 className="text-3xl sm:text-[40px] md:text-[48px] font-black text-white tracking-tighter mb-8 leading-[1.1] mx-auto">
                            Scopri come collegare tutta la tua impresa<br className="hidden md:block"/>in un unico sistema.
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                            Prenota una demo e scopri come EdilManager24 può organizzare le funzioni realmente utilizzate dalla tua impresa, dall’ufficio al cantiere.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contatti" className="w-full sm:w-auto bg-edil-blue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2">
                                Prenota una demo
                            </Link>
                        </div>
                        
                        <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Oltre 40 aziende hanno attivato EdilManager24
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

