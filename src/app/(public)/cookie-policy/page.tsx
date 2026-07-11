'use client';

export default function CookiePolicyPage() {
    return (
        <div className="bg-white min-h-screen font-manrope">
            {/* HERO LEGALE */}
            <section className="relative pt-28 lg:pt-40 pb-12 lg:pb-20 overflow-hidden bg-corporate border-b border-slate-100">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center reveal">
                    <div className="flex w-fit items-center justify-center gap-2 px-4 py-1.5 bg-edil-light text-edil-blue rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm mx-auto">
                        LEGALE
                    </div>
                    <h1 className="text-[38px] sm:text-[56px] lg:text-[64px] font-black text-navy-deep tracking-[-0.04em] mb-8 leading-[1.05] max-w-4xl mx-auto">
                        Cookie Policy
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        Ultimo aggiornamento: 11 Luglio 2026
                    </p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-6 py-24 text-slate-600 leading-relaxed">
                    <section className="mb-16">
                        <h2 className="text-3xl font-black text-navy-deep mb-6 tracking-tight">1. Cosa sono i Cookie?</h2>
                        <p className="text-lg mb-6">
                            I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-3xl font-black text-navy-deep mb-6 tracking-tight">2. Quali Cookie utilizziamo</h2>
                        <ul className="list-disc pl-8 space-y-4 text-lg">
                            <li><strong className="text-navy-deep">Cookie Tecnici:</strong> Sono strettamente necessari per il funzionamento del sito EdilManager24 e per erogare il servizio richiesto dall'utente (es. mantenimento della sessione di login). Non richiedono consenso.</li>
                            <li><strong className="text-navy-deep">Cookie Analitici:</strong> Vengono utilizzati per raccogliere informazioni, in forma aggregata e anonima, sul numero degli utenti e su come questi visitano il sito (es. Google Analytics con IP anonimizzato).</li>
                            <li><strong className="text-navy-deep">Cookie di Profilazione:</strong> Attualmente il nostro software non utilizza cookie di profilazione volti a creare profili relativi all'utente al fine di inviare messaggi pubblicitari in linea con le preferenze manifestate.</li>
                        </ul>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-3xl font-black text-navy-deep mb-6 tracking-tight">3. Come gestire i Cookie</h2>
                        <p className="text-lg mb-6">
                            La maggior parte dei browser accetta automaticamente i cookie, ma puoi modificare le impostazioni del tuo browser per rifiutarli. Nota bene: disabilitando i cookie tecnici potresti non essere in grado di accedere a tutte le funzionalità della piattaforma EdilManager24.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-3xl font-black text-navy-deep mb-6 tracking-tight">4. Titolare del Trattamento</h2>
                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl mt-6">
                            <p className="text-lg mb-2">Il Titolare del trattamento dei dati è <strong>CLH Srl</strong>, P.IVA 03774540128.</p>
                            <p className="text-lg">Per maggiori informazioni puoi contattarci all'indirizzo <a href="mailto:info@edilmanager.it" className="text-edil-blue font-bold hover:underline">info@edilmanager.it</a>.</p>
                        </div>
                    </section>
            </div>
        </div>
    );
}
