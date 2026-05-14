'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getPriceItems(query?: string) {
    if (!query) return [];
    return await prisma.priceItem.findMany({
        where: {
            OR: [
                { description: { contains: query } },
                { code: { contains: query } }
            ]
        },
        take: 20
    });
}

export async function createQuote(formData: FormData) {
    const clientId = formData.get('clientId') as string;

    if (!clientId) throw new Error('Client ID is required');

    const lastQuote = await prisma.quote.findFirst({
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQuote?.number || 0) + 1;

    const session = await getServerSession();

    const quote = await prisma.quote.create({
        data: {
            clientId,
            number: nextNumber,
            status: 'DRAFT',
        }
    });

    await logAuditEvent('CREATE_QUOTE', `QUOTE_ID:${quote.id}`, `Generato nuovo preventivo #${nextNumber}`, session.userId);

    redirect(`/quotes/${quote.id}`);
}

export async function deleteQuote(id: string) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo gli Amministratori possono eliminare preventivi registrati.");

    await prisma.quote.delete({ where: { id } });
    await logAuditEvent('DELETE_QUOTE', `QUOTE_ID:${id}`, `Eliminato preventivo`, session.userId);
    revalidatePath('/quotes');
    redirect('/quotes');
}

export async function addItemToQuote(quoteId: string, priceItemId: string, quantity: number) {
    const priceItem = await prisma.priceItem.findUnique({ where: { id: priceItemId } });
    if (!priceItem) throw new Error('Item not found');

    await prisma.quoteItem.create({
        data: {
            quoteId,
            priceItemId,
            description: priceItem.description,
            unit: priceItem.unit,
            price: priceItem.price,
            quantity: quantity,
            total: priceItem.price * quantity
        }
    });

    // Update total
    // simpler to recalculate all
    const items = await prisma.quoteItem.findMany({ where: { quoteId } });
    const total = items.reduce((acc, item) => acc + (item.total || 0), 0);

    await prisma.quote.update({
        where: { id: quoteId },
        data: { total }
    });

    revalidatePath(`/quotes/${quoteId}`);
}
