'use client';

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen pt-16 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-20 text-center reveal">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Termini e Condizioni</h1>
                    <p className="text-slate-500 font-medium">Ultimo aggiornamento: 24 Aprile 2026</p>
                </div>

                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">1. Accettazione dei Termini</h2>
                        <p>
                            L'accesso e l'utilizzo di EdilManager sono subordinati all'accettazione dei presenti Termini e Condizioni. Utilizzando la piattaforma, confermi di aver letto, compreso e accettato di essere vincolato da questi termini.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">2. Descrizione del Servizio</h2>
                        <p>
                            EdilManager fornisce un software as a service (SaaS) per la gestione operativa, contabile e logistica delle imprese edili. Il servizio è fornito "così com'è" e può subire aggiornamenti e modifiche periodiche per migliorarne le funzionalità.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">3. Account Utente</h2>
                        <p>
                            Sei responsabile della riservatezza delle credenziali del tuo account e di tutte le attività che avvengono sotto il tuo account. EdilManager non sarà responsabile per eventuali perdite derivanti dall'uso non autorizzato delle tue credenziali.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">4. Proprietà Intellettuale</h2>
                        <p>
                            Tutti i contenuti, il codice, il design e i marchi associati a EdilManager sono di proprietà esclusiva di EdilManager Srl. Non è consentito copiare, modificare o distribuire alcuna parte del software senza autorizzazione scritta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">5. Limitazione di Responsabilità</h2>
                        <p>
                            EdilManager Srl non potrà essere ritenuta responsabile per danni indiretti, incidentali o consequenziali (inclusa la perdita di profitti o interruzione dell'attività) derivanti dall'utilizzo o dall'incapacità di utilizzare il software.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">6. Recesso e Risoluzione</h2>
                        <p>
                            Puoi recedere dal servizio in qualsiasi momento secondo i termini previsti dal tuo piano di abbonamento. EdilManager si riserva il diritto di sospendere l'accesso al servizio in caso di violazione dei presenti termini o mancato pagamento delle quote dovute.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">7. Legge Applicabile</h2>
                        <p>
                            I presenti termini sono regolati dalle leggi dello Stato Italiano. Per qualsiasi controversia sarà competente in via esclusiva il Foro di competenza della sede legale di EdilManager Srl.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
