import { prisma } from '@/lib/prisma';
import QuotesClient from './QuotesClient';

export default async function QuotesPage() {
    const quotes = await prisma.quote.findMany({
        include: { client: true },
        orderBy: { createdAt: 'desc' }
    });

    const stats = {
        totalValue: quotes.reduce((acc, q) => acc + q.total, 0),
        pendingValue: quotes.filter(q => ['DRAFT', 'SENT'].includes(q.status)).reduce((acc, q) => acc + q.total, 0),
        count: quotes.length
    };

    return (
        <div className="page-content">
            <QuotesClient 
                quotes={quotes as any} 
                stats={stats} 
            />
        </div>
    );
}
