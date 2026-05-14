'use client';

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen pt-16 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-20 text-center reveal">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium">Ultimo aggiornamento: 24 Aprile 2026</p>
                </div>

                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">1. Informazioni Generali</h2>
                        <p>
                            Benvenuto su EdilManager. La tua privacy è fondamentale per noi. Questa Privacy Policy descrive come raccogliamo, utilizziamo, condividiamo e proteggiamo i tuoi dati personali quando utilizzi la nostra piattaforma SaaS per la gestione edile.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">2. Dati Raccolti</h2>
                        <p>Raccogliamo le seguenti categorie di informazioni:</p>
                        <ul className="list-disc pl-6 space-y-4 mt-4">
                            <li><strong>Informazioni Account:</strong> Nome, email, ragione sociale, partita IVA e recapiti telefonici.</li>
                            <li><strong>Dati Operativi:</strong> Informazioni relative a cantieri, dipendenti, mezzi e materiali inseriti nella piattaforma.</li>
                            <li><strong>Dati di Navigazione:</strong> Indirizzo IP, tipo di browser, orari di accesso e pagine visitate per scopi statistici e di sicurezza.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">3. Finalità del Trattamento</h2>
                        <p>Utilizziamo i tuoi dati esclusivamente per:</p>
                        <ul className="list-disc pl-6 space-y-4 mt-4">
                            <li>Fornire e mantenere le funzionalità del software EdilManager.</li>
                            <li>Gestire l'assistenza tecnica e rispondere alle tue richieste.</li>
                            <li>Adempiere agli obblighi di legge (es. fatturazione elettronica tramite SDI).</li>
                            <li>Migliorare le prestazioni e la sicurezza della piattaforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">4. Sicurezza dei Dati</h2>
                        <p>
                            Adottiamo misure di sicurezza avanzate, tra cui crittografia AES-256 e protocolli TLS/SSL, per proteggere i tuoi dati da accessi non autorizzati o perdite. I dati sono conservati su server situati nell'Unione Europea, in conformità con il GDPR.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">5. I Tuoi Diritti</h2>
                        <p>
                            In conformità con il Regolamento UE 2016/679 (GDPR), hai il diritto di accedere, rettificare, cancellare o limitare il trattamento dei tuoi dati personali. Per esercitare questi diritti, puoi contattarci all'indirizzo privacy@edilmanager.it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">6. Contatti</h2>
                        <p>
                            Per qualsiasi domanda relativa a questa informativa, puoi contattare il Responsabile della Protezione dei Dati (DPO) all'email: dpo@edilmanager.it.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
