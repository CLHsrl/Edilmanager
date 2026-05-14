'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function linkMovimentoToFattura(fatturaId: string, movimentoId: string) {
  await prisma.movimento.update({
    where: { id: movimentoId },
    data: { fatturaId }
  });
  
  // Calculate if the fattura is now fully paid
  const fattura = await prisma.fattura.findUnique({
    where: { id: fatturaId },
    include: { movimenti: true }
  });

  if (fattura) {
    const totaleIncassato = fattura.movimenti.reduce((sum, m) => sum + m.importo, 0);
    let newStato = fattura.stato;
    if (totaleIncassato >= fattura.totale) {
      newStato = 'PAGATA';
    } else if (totaleIncassato > 0) {
      newStato = 'PARZIALE';
    }
    await prisma.fattura.update({
      where: { id: fattura.id },
      data: { stato: newStato }
    });
  }

  revalidatePath(`/fatture/${fatturaId}`);
  revalidatePath('/fatture');
}

export async function unlinkMovimento(movimentoId: string, fatturaId: string) {
  await prisma.movimento.update({
    where: { id: movimentoId },
    data: { fatturaId: null }
  });
  
  // Recalculate status
  const fattura = await prisma.fattura.findUnique({
    where: { id: fatturaId },
    include: { movimenti: true }
  });

  if (fattura) {
    const totaleIncassato = fattura.movimenti.reduce((sum, m) => sum + m.importo, 0);
    let newStato = fattura.stato;
    if (totaleIncassato === 0) {
      newStato = 'DA_PAGARE';
    } else if (totaleIncassato < fattura.totale) {
      newStato = 'PARZIALE';
    }
    
    await prisma.fattura.update({
      where: { id: fatturaId },
      data: { stato: newStato }
    });
  }

  revalidatePath(`/fatture/${fatturaId}`);
  revalidatePath('/fatture');
}
