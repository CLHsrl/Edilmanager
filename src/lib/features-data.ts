import { 
    LayoutDashboard, HardHat, ClipboardCheck, 
    Receipt, Package, ShieldCheck, Globe, 
    FileText, TrendingUp 
} from 'lucide-react';

export const FEATURES_DATA = [
    {
        slug: "management",
        title: "Command Center Analitico",
        macroTitle: "Il controllo totale della tua impresa, in un unico schermo.",
        desc: "EdilManager trasforma la complessità dei dati aziendali in una visione cristallina e azionabile. Non dovrai più rincorrere le informazioni: saranno loro a dirti dove intervenire.",
        icon: "LayoutDashboard",
        image: "/dashboard-preview.png",
        benefits: [
            { title: "Decisioni basate sui fatti", desc: "Smetti di decidere 'a naso'. Monitora i margini reali e proietta il cashflow con precisione chirurgica." },
            { title: "Reattività immediata", desc: "Ricevi alert automatici se un cantiere devia dal budget previsto o se una fattura è in ritardo." },
            { title: "Trasparenza totale", desc: "Ogni membro del management ha accesso ai dati di cui ha bisogno, con permessi granulari." }
        ],
        details: [
            { label: "Dashboard Personalizzate", text: "Crea la tua vista ideale con i widget che contano per te: fatturato, debiti v/fornitori, ore uomo e molto altro." },
            { label: "Multi-Cantiere", text: "Passa da una visione macro-aziendale al dettaglio del singolo bullone in un click." },
            { label: "Export Avanzato", text: "Genera report PDF o Excel professionali per banche, soci o consulenti in pochi secondi." }
        ]
    },
    {
        slug: "cantieri",
        title: "Gestione Cantieri (SAL)",
        macroTitle: "Produci di più, spendi di meno. Gestione commesse 2.0.",
        desc: "Il cuore dell'edilizia è il cantiere. Con EdilManager, la gestione operativa diventa un flusso fluido che collega l'ufficio tecnico alla produzione sul campo.",
        icon: "HardHat",
        image: "/project-preview.png",
        benefits: [
            { title: "Zero sorprese di budget", desc: "Monitora i costi diretti (materiali, noli, subappalti) man mano che vengono caricati." },
            { title: "SAL in un click", desc: "Genera lo Stato Avanzamento Lavori basandoti sui dati reali inseriti dai tecnici, senza errori di calcolo." },
            { title: "Archivio Fotografico", desc: "Ogni avanzamento è documentato con foto geolocalizzate, pronte per essere condivise o usate in caso di varianti." }
        ],
        details: [
            { label: "Gantt Dinamico", text: "Pianifica le fasi di lavoro e ricevi notifiche se una scadenza critica è a rischio." },
            { label: "Gestione Varianti", text: "Traccia ogni richiesta extra-capitolato, calcola l'impatto sui margini e ottieni l'approvazione digitale." },
            { label: "Noli e Attrezzature", text: "Assegna i mezzi ai cantieri e monitora i giorni di utilizzo per non sforare i budget di noleggio." }
        ]
    },
    {
        slug: "rapportini",
        title: "Rapportini Digitali",
        macroTitle: "Il cantiere non è mai stato così vicino all'ufficio.",
        desc: "Dì addio ai fogli di carta sporchi e illeggibili. L'app mobile di EdilManager permette ai tuoi operai di inviare dati precisi in tempo reale, senza alcuno sforzo.",
        icon: "ClipboardCheck",
        image: "/iphone-preview.png",
        benefits: [
            { title: "Addio data-entry manuale", desc: "I dati fluiscono dal cantiere alla contabilità istantaneamente. Recupera ore di lavoro in ufficio ogni settimana." },
            { title: "Precisione nei costi uomo", desc: "Sapere esattamente quante ore sono state dedicate a ogni fase permette di calcolare la redditività reale." },
            { title: "Controllo Materiali", desc: "Traccia i materiali arrivati e usati per evitare sprechi o ammanchi inspiegabili." }
        ],
        details: [
            { label: "Firma Digitale", text: "Il capocantiere o il cliente possono firmare il rapportino direttamente sullo schermo dello smartphone." },
            { label: "Geolocalizzazione", text: "Certifica la presenza sul posto dei lavoratori per una maggiore sicurezza e trasparenza." },
            { label: "Note Vocali", text: "Permetti agli operai di segnalare problemi o varianti tramite messaggi vocali, trascritti automaticamente dal sistema." }
        ]
    },
    {
        slug: "amministrazione",
        title: "Fatturazione & SDI",
        macroTitle: "Amministrazione snella, flusso di cassa garantito.",
        desc: "Integra il flusso della fatturazione elettronica direttamente con la gestione dei cantieri. Meno burocrazia, più controllo finanziario.",
        icon: "Receipt",
        image: "/dashboard-preview.png",
        benefits: [
            { title: "Automazione SDI", desc: "Ricevi le fatture passive e il sistema le associa automaticamente al cantiere e all'ordine di acquisto corretto." },
            { title: "Pianificazione Scadenze", desc: "Non mancare mai un pagamento e monitora gli incassi per mantenere un cashflow sempre positivo." },
            { title: "Riconciliazione Bancaria", desc: "Collega i tuoi conti correnti per riconciliare i pagamenti con le fatture in modo semiautomatico." }
        ],
        details: [
            { label: "XML Editor", text: "Crea e invia fatture elettroniche (B2B e PA) direttamente dall'interfaccia, senza software esterni." },
            { label: "Gestione Reverse Charge", text: "Gestione automatica dell'IVA in regime di inversione contabile, tipica del settore edile." },
            { label: "Ritenute e Cassa Edile", text: "Calcolo automatico delle ritenute d'acconto e dei contributi previdenziali in fattura." }
        ]
    },
    {
        slug: "logistica",
        title: "Logistica & Mezzi",
        macroTitle: "Fai muovere la tua impresa come un orologio svizzero.",
        desc: "Gestire un parco mezzi pesante non è mai stato così semplice. Monitora costi, posizioni e scadenze da un unico centro di controllo.",
        icon: "Package",
        image: "/feature-logistics.png",
        benefits: [
            { title: "Zero fermi macchina", desc: "Le manutenzioni programmate ti avvisano prima che un guasto blocchi il lavoro in cantiere." },
            { title: "Efficienza carburante", desc: "Traccia i consumi per ogni mezzo e identifica sprechi o anomalie." },
            { title: "Localizzazione flotta", desc: "Sappi sempre dove si trovano i tuoi escavatori, furgoni e attrezzature speciali." }
        ],
        details: [
            { label: "Scadenziario Tagliandi", text: "Gestione automatica di revisioni, bolli, assicurazioni e manutenzioni ordinarie." },
            { label: "Checklist Pre-partenza", text: "Gli autisti possono compilare brevi checklist di sicurezza sullo smartphone prima di iniziare il turno." },
            { label: "Costi di Esercizio", text: "Calcola il costo orario/chilometrico reale di ogni mezzo per una preventivazione impeccabile." }
        ]
    },
    {
        slug: "compliance",
        title: "Sicurezza & DPI",
        macroTitle: "Sicurezza prima di tutto. Conformità senza stress.",
        desc: "Gestire la sicurezza in edilizia è un compito critico. EdilManager ti aiuta a mantenere tutto sotto controllo, proteggendo i tuoi dipendenti e la tua azienda.",
        icon: "ShieldCheck",
        image: "/feature-safety.png",
        benefits: [
            { title: "Conformità garantita", desc: "Uno scadenziario centralizzato per corsi di formazione, visite mediche e patentini." },
            { title: "Tracciabilità DPI", desc: "Certifica la consegna dei dispositivi di protezione individuale con firma digitale del lavoratore." },
            { title: "Riduzione rischi legali", desc: "Tutta la documentazione è archiviata e pronta per eventuali audit o controlli degli enti paritetici." }
        ],
        details: [
            { label: "Gestione POS", text: "Genera il Piano Operativo di Sicurezza partendo dai dati del cantiere e del personale assegnato." },
            { label: "Qualifica Fornitori", text: "Monitora il DURC e la documentazione di sicurezza dei tuoi subappaltatori in tempo reale." },
            { label: "Registri Infortuni", text: "Gestione digitalizzata dei quasi-infortuni e degli eventi critici per migliorare costantemente la sicurezza." }
        ]
    },
    {
        slug: "collaborazione",
        title: "Portale Clienti & Committenti",
        macroTitle: "Trasparenza che genera fiducia.",
        desc: "Offri ai tuoi clienti una finestra sul loro progetto. Riduci le richieste di informazioni via telefono e distinguiti dalla concorrenza con un servizio premium.",
        icon: "Globe",
        image: "/ipad-preview.png",
        benefits: [
            { title: "Soddisfazione del cliente", desc: "Il committente vede i progressi, le foto e i documenti senza doverli richiedere continuamente." },
            { title: "Approvazioni rapide", desc: "Le varianti e i preventivi extra vengono approvati online, accelerando i tempi di cantiere." },
            { title: "Pagamenti chiari", desc: "Il cliente ha sempre sott'occhio la situazione dei pagamenti e delle fatture emesse." }
        ],
        details: [
            { label: "Area Download", text: "Tutti i certificati, le planimetrie e i libretti d'uso sono sempre a disposizione del cliente." },
            { label: "Galleria Fotografica", text: "Una timeline visiva del cantiere, dalla prima pietra fino alla consegna delle chiavi." },
            { label: "Chat Integrata", text: "Comunicazione centralizzata tra ufficio, cantiere e cliente, per non perdere nessuna informazione." }
        ]
    },
    {
        slug: "commerciale",
        title: "Commerciale & Preventivi",
        macroTitle: "Più preventivi, più contratti firmati.",
        desc: "Creare un preventivo edile preciso è un'arte. EdilManager ti fornisce gli strumenti tecnici per farlo velocemente e con margini garantiti.",
        icon: "FileText",
        image: "/project-preview.png",
        benefits: [
            { title: "Preventivazione Analitica", desc: "Calcola i costi basandoti su listini aggiornati e analisi prezzi reali." },
            { title: "Professionalità estrema", desc: "Invia proposte eleganti, chiare e complete di allegati tecnici che colpiscono il cliente." },
            { title: "Monitoraggio Pipeline", desc: "Non perdere mai un lead. Gestisci le trattative e pianifica i follow-up in modo sistematico." }
        ],
        details: [
            { label: "Import Listini", text: "Sincronizza i listini dei tuoi fornitori principali per avere costi sempre aggiornati." },
            { label: "Modelli pronti all'uso", text: "Crea modelli per le lavorazioni più comuni per generare preventivi in pochi minuti." },
            { label: "Analisi Margine", text: "Vedi immediatamente quanto guadagnerai su ogni singola voce del preventivo prima di inviarlo." }
        ]
    },
    {
        slug: "strategia",
        title: "Business Intelligence",
        macroTitle: "Dati che parlano la lingua del tuo business.",
        desc: "La BI di EdilManager analizza milioni di dati per fornirti insight strategici. Scopri i punti di forza e le aree di miglioramento della tua impresa.",
        icon: "TrendingUp",
        image: "/dashboard-preview.png",
        benefits: [
            { title: "Visione Prospettica", desc: "Prevedi il fatturato e le necessità di cassa dei prossimi 6-12 mesi." },
            { title: "Ranking Produttività", desc: "Identifica le squadre o le tipologie di cantiere che generano più profitto." },
            { title: "Controllo costi fissi", desc: "Analizza l'incidenza delle spese generali sulla marginalità globale." }
        ],
        details: [
            { label: "Report Custom", text: "Costruisci le tue analisi incrociando dati di cantiere, contabilità e personale." },
            { label: "Analisi Scostamenti", text: "Confronta il preventivo con il consuntivo finale per imparare da ogni errore." },
            { label: "Dashboard per Soci", text: "Fornisci viste sintetiche ad alto livello per il board aziendale o i soci investitori." }
        ]
    }
];
