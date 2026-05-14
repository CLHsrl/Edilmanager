import { prisma } from '@/lib/prisma';
import { generateContractHtml } from '@/lib/contracts';
import { notFound } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
        where: { id },
        include: { client: true }
    });

    if (!quote) notFound();

    const htmlContent = generateContractHtml({
        clientName: quote.client.name,
        clientAddress: quote.client.address || '',
        clientTaxId: quote.client.taxId || '',
        quoteNumber: quote.number,
        quoteTotal: quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 }),
        companyName: 'Edil Costruzioni SRL'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 print:bg-white print:p-0">
            <div
                className="max-w-[210mm] mx-auto bg-white p-12 shadow-sm border border-gray-200 print:shadow-none print:border-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="fixed bottom-8 right-8 print:hidden">
                <PrintButton />
            </div>
        </div>
    );
}
