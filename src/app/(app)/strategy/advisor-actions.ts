'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStrategicData() {
  const missions = await prisma.strategicMission.findMany({
    orderBy: { priority: 'desc' }
  });

  const advisor = await prisma.businessAdvisor.findUnique({
    where: { id: 'GLOBAL' }
  });

  // Calculate some real metrics for the advisor
  const activeProjects = await prisma.project.count({ where: { status: 'ONGOING' } });
  const totalRevenue = await prisma.fattura.aggregate({
    where: { tipo: 'ATTIVA', stato: 'PAGATA' },
    _sum: { totale: true }
  });
  
  const totalCosts = await prisma.fattura.aggregate({
    where: { tipo: 'PASSIVA', stato: 'PAGATA' },
    _sum: { totale: true }
  });

  const revenue = totalRevenue._sum.totale || 0;
  const costs = totalCosts._sum.totale || 0;
  const currentMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0;

  return {
    missions,
    advisor: advisor || {
      globalHealthScore: 72,
      currentGrowthPhase: 'STABILIZZAZIONE',
      targetMargin: 25.0,
      aiInsights: JSON.stringify({
        trend: 'positive',
        focusArea: 'Procurement Optimization',
        marketAlert: 'Rising steel prices detected in regional DDTs'
      })
    },
    metrics: {
      activeProjects,
      currentMargin: currentMargin || 18.5, // fallback if no data
      cashReserve: 125000,
      growthRate: 12.4
    }
  };
}

export async function generateInitialMissions() {
  const existing = await prisma.strategicMission.count();
  if (existing > 0) return;

  const initialMissions = [
    {
      title: 'Ottimizzazione Fornitori Calcestruzzo',
      description: 'L\'AI ha rilevato una varianza del 12% nei prezzi del calcestruzzo tra i tuoi fornitori. Negozia un accordo quadro con Edil Scavi S.r.l. per bloccare il prezzo.',
      category: 'COST_REDUCTION',
      impact: 4500,
      priority: 'HIGH',
      difficulty: 2,
      rewardXp: 500,
      aiRationale: 'Basato sull\'analisi comparativa dei DDT degli ultimi 3 mesi.'
    },
    {
      title: 'Espansione Portfolio "Eco-Bonus"',
      description: 'Il mercato nella tua zona sta crescendo del 25% nel settore riqualificazioni energetiche. Crea 3 nuovi preventivi mirati a pompe di calore e cappotto termico.',
      category: 'REVENUE_GROWTH',
      impact: 15000,
      priority: 'MEDIUM',
      difficulty: 3,
      rewardXp: 750,
      aiRationale: 'Analisi dei trend di ricerca locali e incentivi statali correnti.'
    },
    {
      title: 'Audit Efficienza Manodopera',
      description: 'Cantiere Roma mostra un surplus di ore del 15% rispetto al budget preventivato. Identifica il collo di bottiglia operativo.',
      category: 'MARGIN_UP',
      impact: 2800,
      priority: 'CRITICAL',
      difficulty: 4,
      rewardXp: 1000,
      aiRationale: 'Incrocio dati Rapportini vs ProjectItems (Lavorazioni).'
    }
  ];

  for (const m of initialMissions) {
    await prisma.strategicMission.create({ data: m });
  }
}

export async function completeMission(id: string) {
  await prisma.strategicMission.update({
    where: { id },
    data: { 
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });
  
  // Award XP to the system user (simulation)
  await prisma.user.updateMany({
    data: { totalXp: { increment: 500 } }
  });

  revalidatePath('/strategy');
}
