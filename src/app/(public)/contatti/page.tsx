'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContattiPage() {
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        azienda: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceForm: 'Pagina Contatti',
                    nome: formData.nome,
                    cognome: formData.cognome,
                    azienda: formData.azienda,
                    email: formData.email
                })
            });
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white min-h-screen font-manrope relative">
            <section className="pt-28 lg:pt-40 pb-12 lg:pb-20 bg-navy-deep text-white relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-edil-blue/5 blur-3xl rounded-full"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="text-center lg:text-left">
                            <div className="flex w-fit items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md mx-auto lg:mx-0">
                                Contatti
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-8 leading-[0.95] mx-auto lg:mx-0">
                                Inizia il tuo percorso <br/>verso l'eccellenza.
                            </h1>
                            <p className="text-slate-500 text-xl mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Compila il modulo e un nostro consulente senior ti mostrerà come EdilManager24 può scalare la tua impresa.
                            </p>
                            
                            <div className="space-y-8 mb-16 flex flex-col items-start mx-auto lg:mx-0 w-fit">
                                <div className="flex items-center justify-start gap-4 text-slate-200 font-bold">
                                    <div className="w-12 h-12 bg-edil-blue rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                        <CheckCircle2 className="text-white" size={24}/>
                                    </div>
                                    <span className="text-left">Demo personalizzata di 30 minuti</span>
                                </div>
                                <div className="flex items-center justify-start gap-4 text-slate-200 font-bold">
                                    <div className="w-12 h-12 bg-edil-blue rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                        <CheckCircle2 className="text-white" size={24}/>
                                    </div>
                                    <span className="text-left">Analisi gratuita dei processi operativi</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-12">
                                <p className="text-sm text-slate-600 italic leading-relaxed max-w-lg">
                                    "Siamo nati nel fango dei cantieri. Abbiamo costruito EdilManager24 perché cercavamo uno strumento che ci restituisse il nostro tempo. Ora lo condividiamo con te."
                                </p>
                                <p className="text-sm font-black text-white mt-4">— I Fondatori di EdilManager24</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 lg:p-12 text-navy-deep shadow-2xl reveal">
                            <h3 className="text-2xl font-black tracking-tight mb-8">Richiedi una consulenza</h3>
                            
                            {success ? (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-6 rounded-2xl text-center">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                                    <h4 className="font-bold text-lg mb-2">Richiesta Inviata!</h4>
                                    <p className="text-sm">Grazie per averci contattato. Ti risponderemo al più presto.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
                                            Si è verificato un errore. Riprova più tardi.
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Nome</label>
                                            <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-navy-deep" placeholder="Mario" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Cognome</label>
                                            <input required type="text" name="cognome" value={formData.cognome} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-navy-deep" placeholder="Rossi" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Azienda</label>
                                        <input required type="text" name="azienda" value={formData.azienda} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-navy-deep" placeholder="Edilizia Srl" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-navy-deep" placeholder="mario@email.it" />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-edil-blue hover:bg-navy-deep text-white font-black uppercase tracking-[0.2em] text-xs py-6 rounded-2xl shadow-xl shadow-blue-200 transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-50">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                            <>Invia Richiesta <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ti risponderemo entro 2 ore lavorative</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

