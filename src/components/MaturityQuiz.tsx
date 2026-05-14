'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, LayoutDashboard, Send, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        text: "Come tieni traccia delle ore e dei rapportini?",
        options: [
            { text: "Fogli di carta o block-notes", score: 0 },
            { text: "Messaggi su WhatsApp / Foto", score: 10 },
            { text: "File Excel condivisi", score: 15 },
            { text: "App specifica o gestionale cloud", score: 25 }
        ]
    },
    {
        id: 2,
        text: "Quando sai se un cantiere è in utile o in perdita?",
        options: [
            { text: "Solo a lavori conclusi", score: 0 },
            { text: "Quando faccio il bilancio col commercialista", score: 10 },
            { text: "Ogni mese, facendo i calcoli a mano", score: 15 },
            { text: "In tempo reale, vedo il margine ogni giorno", score: 25 }
        ]
    },
    {
        id: 3,
        text: "Come gestisci fatture passive e DDT dei fornitori?",
        options: [
            { text: "Raccoglitore fisico in ufficio", score: 0 },
            { text: "Cartelle sul PC o Email", score: 10 },
            { text: "Software di contabilità separato", score: 15 },
            { text: "Sistema integrato con i cantieri", score: 25 }
        ]
    },
    {
        id: 4,
        text: "Come programmi la sicurezza e i mezzi?",
        options: [
            { text: "Agenda cartacea o memoria", score: 0 },
            { text: "Calendar su smartphone", score: 10 },
            { text: "Fogli Excel", score: 15 },
            { text: "Scadenziario automatico con notifiche", score: 25 }
        ]
    }
];

export default function MaturityQuiz() {
    const [step, setStep] = useState(0); // 0: Start, 1-4: Questions, 5: Form, 6: Result
    const [score, setScore] = useState(0);
    const [email, setEmail] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleOption = (points: number) => {
        setScore(score + points);
        setStep(step + 1);
    };

    if (!mounted) return <div className="h-[400px] bg-slate-900/50 animate-pulse rounded-3xl"></div>;

    const getDiagnosis = () => {
        if (score <= 30) return { title: "Livello: Emergenza", desc: "La tua impresa è ancora legata a processi analogici rischiosi. Stai perdendo tempo e denaro ogni giorno.", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
        if (score <= 70) return { title: "Livello: In Transizione", desc: "Hai iniziato a digitalizzare, ma i tuoi strumenti non si parlano. Hai troppi 'silos' di dati.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
        return { title: "Livello: Avanzato", desc: "Sei sulla buona strada, ma puoi ancora ottimizzare i margini del 15% con una piattaforma integrata.", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    };

    const containerClasses = "relative bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden";

    if (step === 0) {
        return (
            <div className={containerClasses}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_10px_30px_rgba(37,99,235,0.3)] mx-auto lg:mx-0">
                    <Sparkles size={40} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight">Analisi Tecnica <br/>dei Processi</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-lg">Identifichiamo i colli di bottiglia operativi e le opportunità di ottimizzazione della tua impresa in tempo reale.</p>
                <button 
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 group"
                >
                    Inizia Audit Strategico <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    if (step <= 4) {
        const question = QUESTIONS[step - 1];
        return (
            <div className={containerClasses}>
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">{step}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">di 4 domande</span>
                    </div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-700 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-10 tracking-tight leading-tight">{question.text}</h3>
                <div className="space-y-4">
                    {question.options.map((opt, i) => (
                        <button 
                            key={i}
                            onClick={() => handleOption(opt.score)}
                            className="w-full text-left p-6 rounded-2xl border border-white/5 bg-white/0 hover:bg-white/5 hover:border-blue-500/50 transition-all group flex items-center justify-between"
                        >
                            <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{opt.text}</span>
                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-all">
                                <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 5) {
        return (
            <div className={`${containerClasses} text-center`}>
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/30">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Elaborazione Completata</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">Inserisci l'indirizzo email dove desideri ricevere il report tecnico completo e i consigli personalizzati.</p>
                <form 
                    onSubmit={(e) => { e.preventDefault(); setStep(6); }}
                    className="space-y-6"
                >
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mario.rossi@impresa.it"
                        className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition-all text-center font-bold text-lg placeholder:text-slate-600"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                    >
                        Genera Report <Send size={18} />
                    </button>
                </form>
            </div>
        );
    }

    const diagnosis = getDiagnosis();
    return (
        <div className={containerClasses}>
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">Score Digitale</div>
                <div className="text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{score}%</div>
                <h2 className={`text-3xl font-black mb-4 ${diagnosis.color}`}>{diagnosis.title}</h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto">{diagnosis.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Audit Processi
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li className="flex items-start gap-3">
                            <ArrowRight size={14} className="mt-1 shrink-0 text-blue-500" />
                            <span>Colli di bottiglia nel flusso dati ufficio-cantiere</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ArrowRight size={14} className="mt-1 shrink-0 text-blue-500" />
                            <span>Opacità sul calcolo della marginalità netta giornaliera</span>
                        </li>
                    </ul>
                </div>
                <div className="p-8 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-600/10">
                    <h4 className="font-bold text-white mb-4">Piano d'Azione</h4>
                    <p className="text-sm text-blue-100 leading-relaxed">Implementazione immediata di un sistema di tracciamento real-time e riconciliazione automatica per recuperare il 15% di margine.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                    Richiedi Onboarding Strategico
                </button>
                <button 
                    onClick={() => { setStep(0); setScore(0); }}
                    className="bg-transparent text-slate-500 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-white border border-white/10 transition-all"
                >
                    Ripeti Audit
                </button>
            </div>
        </div>
    );
}
