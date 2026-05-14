'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GENERAL_FAQS = [
    {
        q: "Quanto tempo richiede l'onboarding da Excel?",
        a: "Il nostro team 'Concierge' si occupa della migrazione dei tuoi dati. Solitamente, una media impresa è operativa al 100% in meno di 7 giorni lavorativi, senza interrompere i flussi di cantiere esistenti."
    },
    {
        q: "I miei dati sono al sicuro e conformi al GDPR?",
        a: "Assolutamente sì. Utilizziamo infrastrutture server criptate in Europa con backup giornalieri ridondati. EdilManager è pienamente conforme alle normative GDPR."
    },
    {
        q: "L'app funziona anche offline in zone con poco segnale?",
        a: "Sì, l'app mobile per gli operai è progettata per funzionare offline. I dati vengono salvati localmente sul dispositivo e sincronizzati automaticamente non appena viene rilevata una connessione."
    },
    {
        q: "È possibile integrare EdilManager con il mio software di contabilità?",
        a: "Certamente. EdilManager dispone di API aperte e moduli di esportazione compatibili con i principali software gestionali e di contabilità italiani."
    }
];

const PRICING_FAQS = [
    {
        q: "Come funziona la prova gratuita di 14 giorni?",
        a: "Avrai accesso illimitato a tutte le funzionalità del piano scelto. Non è richiesta alcuna carta di credito per iniziare. Al termine dei 14 giorni, potrai decidere se attivare l'abbonamento o meno."
    },
    {
        q: "Posso cambiare piano in qualsiasi momento?",
        a: "Certamente. Puoi effettuare l'upgrade o il downgrade del tuo piano direttamente dalla dashboard. La differenza di prezzo verrà ricalcolata proporzionalmente (pro-rata) sul ciclo di fatturazione corrente."
    },
    {
        q: "Cosa succede se supero il numero di utenti del mio piano?",
        a: "Il sistema ti avviserà quando raggiungi il limite. Potrai aggiungere singoli utenti con un costo extra mensile o passare al piano superiore per una gestione più economica dei grandi team."
    },
    {
        q: "Offrite sconti per le associazioni di categoria?",
        a: "Sì, abbiamo convenzioni attive con diverse associazioni nazionali. Contatta il nostro reparto commerciale per verificare se la tua azienda ha diritto a tariffe agevolate."
    }
];

interface FAQProps {
    mode?: 'general' | 'pricing';
}

export default function StrategicFAQ({ mode = 'general' }: FAQProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    const faqs = mode === 'pricing' ? PRICING_FAQS : GENERAL_FAQS;

    return (
        <section id="faq" className="py-32 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20 reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-100">
                        {mode === 'pricing' ? 'Billing Support' : 'Supporto Tecnico'}
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">
                        {mode === 'pricing' ? 'Dettagli sull\'investimento.' : 'Risposte alle tue domande.'}
                    </h2>
                    <p className="text-slate-600">
                        {mode === 'pricing' 
                            ? 'Tutto quello che c\'è da sapere su piani, fatturazione e modalità di pagamento.'
                            : 'Tutto quello che devi sapere prima di fare il salto di qualità.'}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                            <button 
                                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                className="w-full px-8 py-6 text-left flex items-center justify-between group"
                            >
                                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{faq.q}</span>
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openIdx === i && (
                                <div className="px-8 pb-8 text-slate-500 text-sm leading-relaxed animate-fadeIn">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
