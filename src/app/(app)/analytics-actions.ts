'use server';

import { prisma } from '@/lib/prisma';

export async function getBIStats() {
  const [fatture, previsionali, projects] = await Promise.all([
    prisma.fattura.findMany({
      where: { stato: { not: 'ANNULLATA' } }
    }),
    prisma.previsionale.findMany(),
    prisma.project.findMany({
      include: {
        _count: { select: { rapportini: true } }
      }
    })
  ]);

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return d.toISOString().slice(0, 7); // YYYY-MM
  });

  const forecast = months.map(month => {
    // Collect from Invoices (Actual/Planned)
    const inFatture = fatture.filter(f => f.tipo === 'ATTIVA' && (f.dataScadenza || f.dataEmissione)?.toISOString().startsWith(month))
      .reduce((sum, f) => sum + f.totale, 0);
    const outFatture = fatture.filter(f => f.tipo === 'PASSIVA' && (f.dataScadenza || f.dataEmissione)?.toISOString().startsWith(month))
      .reduce((sum, f) => sum + f.totale, 0);
    
    // Collect from Forecasts (Estimated)
    const inPrev = previsionali.filter(p => p.tipo === 'INCASSO' && p.data.toISOString().startsWith(month))
      .reduce((sum, p) => sum + p.importo, 0);
    const outPrev = previsionali.filter(p => p.tipo === 'COSTO' && p.data.toISOString().startsWith(month))
      .reduce((sum, p) => sum + p.importo, 0);

    const totalIn = inFatture + inPrev;
    const totalOut = outFatture + outPrev;
    
    return {
      name: new Date(month).toLocaleDateString('it-IT', { month: 'short' }),
      incassi: totalIn,
      pagamenti: totalOut,
      balance: totalIn - totalOut
    };
  });

  const projectMargins = projects.map(p => {
    const revenue = p.budget || 0;
    const laborCost = (p._count.rapportini * 8) * 35; 
    return {
      name: p.name,
      margin: revenue > 0 ? ((revenue - laborCost) / revenue) * 100 : 0,
      revenue,
      cost: laborCost
    };
  });

  return { forecast, projectMargins };
}
