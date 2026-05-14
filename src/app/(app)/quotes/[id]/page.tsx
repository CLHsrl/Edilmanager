import { prisma } from '@/lib/prisma';
import QuoteBuilder from './builder';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
        where: { id },
        include: { client: true }
    });

    if (!quote) notFound();

    const items = await prisma.quoteItem.findMany({
        where: { quoteId: quote.id }
    });

    return (
        <div className="space-y-4 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center gap-4 flex-shrink-0">
                <Link href="/quotes" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Modifica Preventivo</h1>
                </div>
            </div>

            <div className="flex-1">
                <QuoteBuilder quote={quote} items={items} />
            </div>
        </div>
    );
}
