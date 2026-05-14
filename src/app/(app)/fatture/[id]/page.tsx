import { prisma } from '@/lib/prisma';
import DettaglioFatturaClient from './DettaglioFatturaClient';
import { getMovimenti } from '@/app/(app)/cassa-actions';

export default async function DettaglioFatturaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fattura = await prisma.fattura.findUnique({
    where: { id },
    include: {
      projects: true,
      movimenti: { include: { conto: true } }
    }
  });

  if (!fattura) return <div>Fattura non trovata</div>;

  // Let's get "unlinked" movimenti that could potentially be linked to this fattura
  // For simplicity, we just fetch recent ones of the correct type
  const potentialMovimenti = await getMovimenti({ tipo: fattura.tipo === 'ATTIVA' ? 'ENTRATA' : 'USCITA' });

  return <DettaglioFatturaClient fattura={fattura as any} movimentiRecenti={potentialMovimenti as any} />;
}
