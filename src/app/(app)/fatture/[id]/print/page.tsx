import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export default async function FatturaPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const fattura = await prisma.fattura.findUnique({
        where: { id },
        include: { projects: true }
    });

    if (!fattura) notFound();

    return (
        <div className="max-w-4xl mx-auto bg-white p-10 min-h-screen text-gray-900 text-sm print:p-0">
            <PrintButton />
            
            {/* Header: Company Info & Client Info */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-blue-600 tracking-tighter">Edil<span className="text-gray-900">Manager</span></h1>
                    <p className="mt-2 text-gray-500 font-medium text-xs">Viale del Lavoro 22, 00100 Roma (RM)<br/>P.IVA 01234567890 • info@edilmanager.test</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Spett.le {fattura.tipo === 'ATTIVA' ? 'Cliente' : 'Fornitore'}</p>
                    <p className="text-xl font-bold text-gray-900">{fattura.soggetto}</p>
                </div>
            </div>

            {/* Document Details */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">FATTURA DI VENDITA</h2>
                    <p className="text-gray-500 font-medium">Doc. N° {fattura.numero}</p>
                </div>
                <div className="text-right flex gap-8">
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Data Scadenza</p>
                        <p className="text-lg font-bold text-red-600">{fattura.dataScadenza ? new Date(fattura.dataScadenza).toLocaleDateString('it-IT') : 'A Vista'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Data Documento</p>
                        <p className="text-lg font-bold text-gray-900">{new Date(fattura.dataEmissione).toLocaleDateString('it-IT')}</p>
                    </div>
                </div>
            </div>

            {/* Description / Cantieri */}
            <div className="mb-8 min-h-[300px]">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Descrizione Lavori / Servizi</h3>
                {fattura.projects.length > 0 && (
                    <div className="mb-4 text-gray-700">
                        <span className="font-bold text-gray-900">Rif. Cantiere: </span>
                        {fattura.projects.map(p => p.name).join(', ')}
                    </div>
                )}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {fattura.note || "Esecuzione lavori e opere murarie come da accordi aziendali."}
                </p>
            </div>

            {/* Totals Box */}
            <div className="flex justify-end page-break-inside-avoid">
                <div className="w-72 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                        <span>Imponibile Lordo:</span>
                        <span className="font-bold text-gray-900">€ {fattura.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>Aliquota IVA ({fattura.iva}%):</span>
                        <span className="font-bold text-gray-900">€ {(fattura.totale - fattura.importo).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                        <span className="font-bold text-blue-900 uppercase text-xs tracking-wider">Totale Documento</span>
                        <span className="font-black text-3xl text-blue-700">€ {fattura.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="mt-8 bg-gray-50 p-6 rounded-2xl page-break-inside-avoid">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-3">Coordinate Bancarie e Pagamento</h3>
                <p className="text-sm border-l-4 border-blue-500 pl-4 text-gray-600 font-medium leading-loose">
                    IBAN: <strong className="text-gray-900 font-mono tracking-widest ml-2">IT12 A123 4567 8900 0000 1234 567</strong><br/>
                    Banca: <strong className="text-gray-900 ml-2">Intesa Sanpaolo</strong><br/>
                    Causale: <strong className="text-gray-900 ml-2">Pagamento Fattura N° {fattura.numero}</strong>
                </p>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-100 pt-8 print:fixed print:bottom-4 print:w-full">
                Documento generato digitalmente da Edil Manager. Copia di cortesia, la fattura elettronica originale è disponibile nel cassetto fiscale.
            </div>
        </div>
    );
}
