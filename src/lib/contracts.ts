export const CONTRACT_TEMPLATE = `
<div style="font-family: 'Arial', sans-serif; max-width: 210mm; margin: 0 auto; background: white; color: #333; line-height: 1.5; padding: 40px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="font-family: 'Inter', sans-serif;">
            <h1 style="font-size: 24px; font-weight: normal; margin: 0 0 5px 0; color: #000;">Contratto d'Appalto</h1>
            <p style="margin: 0; color: #666; font-size: 14px;">Rif. N. {{QUOTE_NUMBER}}</p>
        </div>
        <div style="text-align: right; font-size: 12px; color: #888;">
            <p style="margin: 0 0 2px 0;">Data: {{CURRENT_DATE}}</p>
            <p style="margin: 0;">{{COMPANY_NAME}}</p>
        </div>
    </div>

    <!-- Info Cards -->
    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 40px; display: flex; gap: 40px;">
        <div style="flex: 1;">
            <h3 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1a73e8; margin: 0 0 10px 0;">Committente</h3>
            <p style="font-size: 16px; font-weight: 500; margin: 0 0 5px 0; color: #202124;">{{CLIENT_NAME}}</p>
            <p style="margin: 0 0 5px 0; color: #5f6368; font-size: 14px;">{{CLIENT_ADDRESS}}</p>
            <p style="margin: 0; color: #70757a; font-size: 12px; font-family: monospace;">{{CLIENT_TAX_ID}}</p>
        </div>
        <div style="width: 1px; background-color: #dadce0;"></div>
        <div style="flex: 1;">
            <h3 style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1a73e8; margin: 0 0 10px 0;">Appaltatrice</h3>
            <p style="font-size: 16px; font-weight: 500; margin: 0 0 5px 0; color: #202124;">{{COMPANY_NAME}}</p>
            <p style="margin: 0 0 5px 0; color: #5f6368; font-size: 14px;">Sede Legale: Via Roma 1, Milano</p>
            <p style="margin: 0; color: #70757a; font-size: 12px; font-family: monospace;">P.IVA: 03774540128</p>
        </div>
    </div>

    <!-- Sections -->
    <div style="font-size: 14px; color: #3c4043;">
        <section style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 15px;">1. Oggetto del Contratto</h2>
            <p style="margin: 0;">
                L'Appaltatrice si impegna ad eseguire i lavori di ristrutturazione/costruzione presso l'immobile del Committente.
                Le specifiche tecniche, le quantità e i prezzi unitari sono dettagliatamente descritti nel <strong>Preventivo N. {{QUOTE_NUMBER}}</strong>, che viene allegato al presente contratto formandone parte integrante.
            </p>
        </section>

        <section style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 15px;">2. Corrispettivo e Pagamenti</h2>
            <div style="background: #fff; border: 1px solid #dadce0; border-radius: 6px; padding: 15px; display: inline-flex; align-items: center; margin-bottom: 10px;">
                <span style="color: #5f6368; margin-right: 15px;">Importo Totale Stimato:</span>
                <span style="font-size: 18px; font-weight: 500; color: #202124;">€ {{QUOTE_TOTAL}}</span>
            </div>
            <p style="margin-top: 5px; font-size: 12px; color: #70757a;">
                Il pagamento avverrà secondo le scadenze concordate (Acconto, SAL, Saldo).
            </p>
        </section>

        <section style="margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 15px;">3. Obblighi e Garanzie</h2>
            <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 8px;">L'Appaltatrice garantisce l'esecuzione a regola d'arte e il rispetto delle norme di sicurezza (D.Lgs 81/08).</li>
                <li style="margin-bottom: 8px;">Il Committente dichiara di avere la disponibilità giuridica dell'immobile.</li>
                <li>Le parti elegono domicilio presso i rispettivi indirizzi indicati in epigrafe.</li>
            </ul>
        </section>
    </div>

    <!-- Signatures -->
    <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; display: flex; gap: 50px;">
        <div style="flex: 1;">
            <p style="font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin-bottom: 40px;">Firma Committente</p>
            <div style="border-bottom: 1px solid #000; height: 1px;"></div>
        </div>
        <div style="flex: 1;">
            <p style="font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; margin-bottom: 40px;">Firma Appaltatrice</p>
            <div style="border-bottom: 1px solid #000; height: 1px;"></div>
        </div>
    </div>
</div>
`;

export function generateContractHtml(data: {
    clientName: string;
    clientAddress: string;
    clientTaxId: string;
    quoteNumber: number | string;
    quoteTotal: string;
    companyName: string;
}) {
    let html = CONTRACT_TEMPLATE;
    html = html.replace(/{{CLIENT_NAME}}/g, data.clientName);
    html = html.replace(/{{CLIENT_ADDRESS}}/g, data.clientAddress || 'Indirizzo non specificato');
    html = html.replace(/{{CLIENT_TAX_ID}}/g, data.clientTaxId || '---');
    html = html.replace(/{{QUOTE_NUMBER}}/g, data.quoteNumber.toString());
    html = html.replace(/{{QUOTE_TOTAL}}/g, data.quoteTotal);
    html = html.replace(/{{COMPANY_NAME}}/g, data.companyName);
    html = html.replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString('it-IT'));

    return html;
}
