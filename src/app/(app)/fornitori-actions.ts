'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getFornitori() {
  return await prisma.fornitore.findMany({
    include: {
      _count: {
        select: { ddts: true, fatture: true }
      }
    },
    orderBy: { rating: 'desc' }
  });
}

export async function createFornitore(formData: FormData) {
  const name = formData.get('name') as string;
  const vatId = formData.get('vatId') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const category = formData.get('category') as string;
  const tipo = formData.get('tipo') as string;

  await prisma.fornitore.create({
    data: {
      name,
      vatId,
      email,
      phone,
      category,
      tipo: tipo || 'FORNITORE'
    }
  });

  revalidatePath('/fornitori');
}

export async function updateSupplierRating(id: string, rating: number) {
  await prisma.fornitore.update({
    where: { id },
    data: { rating }
  });
  revalidatePath('/fornitori');
}
