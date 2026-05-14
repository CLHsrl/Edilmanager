'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardToDoList() {
  const now = new Date();
  
  // 1. Fatture Attive e Passive SCADUTE e non pagate
  const fattureScadute = await prisma.fattura.findMany({
    where: {
      stato: { not: 'PAGATA' },
      dataScadenza: { lt: now }
    },
    take: 10,
    orderBy: { dataScadenza: 'asc' },
    select: { id: true, numero: true, soggetto: true, totale: true, dataScadenza: true, tipo: true }
  });

  // 2. Movimenti recenti non ancora associati a nessuna fattura
  const movimentiNonAssociati = await prisma.movimento.findMany({
    where: {
      fatturaId: null
    },
    take: 10,
    orderBy: { data: 'desc' },
    include: { conto: { select: { nome: true } } }
  });

  // Health Stats & Anomalies
  const allOngoingProjects = await prisma.project.findMany({
    where: { status: 'ONGOING' },
    include: {
      items: true,
      rapportini: {
        include: {
          lavoratori: true,
          articoliMagazzino: { include: { articoloMagazzino: true } }
        }
      }
    }
  });

  const anomalies = allOngoingProjects.map(p => {
    const budget = p.budget || 0;
    const laborCost = p.rapportini.reduce((sum, r) => 
      sum + r.lavoratori.reduce((subSum, l) => subSum + (l.ore * 25), 0), 0); // Mock cost per hour
    const materialCost = p.rapportini.reduce((sum, r) => 
      sum + r.articoliMagazzino.reduce((subSum, a) => subSum + (a.quantita * (a.articoloMagazzino.costoUnitario || 10)), 0), 0);
    
    const totalCost = laborCost + materialCost;
    const usagePercent = budget > 0 ? (totalCost / budget) * 100 : 0;

    return {
      id: p.id,
      name: p.name,
      usagePercent,
      isAtRisk: usagePercent > 85
    };
  }).filter(a => a.isAtRisk);

  // 3. Cantieri Attivi con il loro valore
  const cantieriAttivi = await prisma.project.findMany({
    where: { status: 'ONGOING' },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: {
      client: { select: { name: true } }
    }
  });

  // Preventivi in bozza o inviati ma non accettati
  const preventiviAperti = await prisma.quote.findMany({
    where: { status: { in: ['DRAFT', 'SENT'] } },
    take: 5,
    orderBy: { date: 'desc' },
    include: { client: { select: { name: true } } }
  });

  // Calculate real global margin
  const allFatture = await prisma.fattura.findMany({
    select: { importo: true, tipo: true }
  });
  
  const entrateTotali = allFatture.filter(f => f.tipo === 'ATTIVA').reduce((acc, f) => acc + f.importo, 0);
  const usciteTotali = allFatture.filter(f => f.tipo === 'PASSIVA').reduce((acc, f) => acc + f.importo, 0);
  let globalMargin = 0;
  if (entrateTotali > 0) {
    globalMargin = Number((((entrateTotali - usciteTotali) / entrateTotali) * 100).toFixed(1));
  }

  // Calculate monthly cashflow trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const movimenti = await prisma.movimento.findMany({
    where: { data: { gte: sixMonthsAgo } },
    select: { importo: true, tipo: true, data: true }
  });

  // Initialize array for last 6 months
  const monthlyCashflowTrend = Array(6).fill(0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  movimenti.forEach(m => {
    const mDate = new Date(m.data);
    const mMonth = mDate.getMonth();
    const mYear = mDate.getFullYear();
    // Calculate index from 0 to 5 (0 is 5 months ago, 5 is current month)
    const monthDiff = (currentYear - mYear) * 12 + (currentMonth - mMonth);
    if (monthDiff >= 0 && monthDiff < 6) {
      const idx = 5 - monthDiff;
      if (m.tipo === 'ENTRATA') monthlyCashflowTrend[idx] += m.importo;
      if (m.tipo === 'USCITA') monthlyCashflowTrend[idx] -= m.importo;
    }
  });

  // Convert to absolute values or keep as net flow? The chart currently uses absolute height: `(v / 25000) * 100`. 
  // Let's ensure it's positive for visual rendering, or use a minimum base.
  // We'll pass the actual net flows.
  const visualTrend = monthlyCashflowTrend.map(v => Math.max(0, v)); // To avoid negative heights

  // Get current cashflow projection (sum of all incoming minus outgoing over next 30 days)
  const futFatture = await prisma.fattura.findMany({
    where: { 
      stato: { not: 'PAGATA' }, 
      dataScadenza: { gte: now } 
    },
    select: { totale: true, tipo: true }
  });
  const futEntrate = futFatture.filter(f => f.tipo === 'ATTIVA').reduce((acc, f) => acc + f.totale, 0);
  const futUscite = futFatture.filter(f => f.tipo === 'PASSIVA').reduce((acc, f) => acc + f.totale, 0);
  const projectedCashflow = futEntrate - futUscite;

  // Stock Alerts
  const articoliSottoScorta = await prisma.articoloMagazzino.findMany({
    where: {
      giacenza: {
        lte: prisma.articoloMagazzino.fields.livelloScortaMin
      }
    },
    take: 3
  });

  // Geofencing Alerts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const geofencingAlertsCount = await prisma.systemAuditLog.count({
    where: {
      action: 'GEOFENCING_ALERT',
      createdAt: { gte: sevenDaysAgo }
    }
  });

  return {
    fattureScadute,
    movimentiNonAssociati,
    cantieriAttivi,
    preventiviAperti,
    projectedCashflow,
    articoliSottoScorta,
    geofencingAlertsCount,
    health: {
      anomalies,
      totalActiveProjects: allOngoingProjects.length,
      globalMargin,
      monthlyCashflowTrend: visualTrend
    }
  };
}
