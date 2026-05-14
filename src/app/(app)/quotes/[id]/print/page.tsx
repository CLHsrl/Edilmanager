import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export default async function QuotePrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
        where: { id },
        include: { client: true, items: { orderBy: { order: 'asc' } } }
    });

    if (!quote) notFound();

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
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Spett.le Cliente</p>
                    <p className="text-xl font-bold text-gray-900">{quote.client.name}</p>
                    {quote.client.address && <p className="text-gray-600 mt-1">{quote.client.address}<br/>{quote.client.cap} {quote.client.city} ({quote.client.province})</p>}
                    {quote.client.taxId && <p className="text-gray-600 mt-1">P.IVA/CF: {quote.client.taxId}</p>}
                </div>
            </div>

            {/* Document Details */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">PREVENTIVO</h2>
                    <p className="text-gray-500 font-medium">#{quote.number.toString().padStart(4, '0')}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Data Partenza</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(quote.date).toLocaleDateString('it-IT')}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-900">
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-600 w-3/5">Descrizione Lavori</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">U.M.</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">Q.tà</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">Prezzo Unit.</th>
                        <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">Totale</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {quote.items.map((item) => (
                        <tr key={item.id} className="page-break-inside-avoid">
                            <td className="py-4">
                                {item.type === 'TEXT' ? (
                                    <p className="text-gray-700 italic">{item.description}</p>
                                ) : (
                                    <p className="font-bold text-gray-900">{item.description}</p>
                                )}
                            </td>
                            <td className="py-4 text-right text-gray-600">{item.unit || '-'}</td>
                            <td className="py-4 text-right text-gray-900 font-medium">{item.quantity || '-'}</td>
                            <td className="py-4 text-right text-gray-600">{item.price ? `€ ${item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '-'}</td>
                            <td className="py-4 text-right font-bold text-gray-900">{item.total ? `€ ${item.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Box */}
            <div className="flex justify-end page-break-inside-avoid">
                <div className="w-64 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                        <span>Imponibile:</span>
                        <span className="font-bold text-gray-900">€ {quote.taxableAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>IVA ({quote.vatType}):</span>
                        <span className="font-bold text-gray-900">€ {quote.vatAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span className="font-bold text-gray-900 uppercase text-xs tracking-wider">Totale Iva Inclusa</span>
                        <span className="font-black text-2xl text-blue-600">€ {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-100 pt-8 print:fixed print:bottom-4 print:w-full">
                Documento generato digitalmente da Edil Manager. Condizioni generali di contratto in allegato se applicabili.
            </div>
        </div>
    );
}
