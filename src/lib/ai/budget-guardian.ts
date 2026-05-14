import { prisma } from '@/lib/prisma';

export interface BudgetAnomaly {
  type: 'MATERIAL_OVERCOST' | 'LABOR_INEFFICIENCY' | 'MARGIN_EROSION' | 'PROGRESS_DELAY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  impactValue: number;
  suggestedAction: string;
}

export async function analyzeProjectBudget(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      items: true,
      ddts: { include: { articoli: true } },
      rapportini: {
        include: {
          lavoratori: { include: { lavoratore: true } }
        }
      },
      sal: true
    }
  });

  if (!project) return null;

  const anomalies: BudgetAnomaly[] = [];

  // 1. ANALISI COSTO MATERIALI (Budget vs DDT)
  const totalBudgetMaterials = project.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalActualMaterials = project.ddts.reduce((sum, ddt) => {
    return sum + ddt.articoli.reduce((s, art) => s + ((art.prezzoUn || 0) * art.quantita), 0);
  }, 0);

  if (totalActualMaterials > totalBudgetMaterials * 0.8 && totalActualMaterials < totalBudgetMaterials) {
    anomalies.push({
      type: 'MARGIN_EROSION',
      severity: 'MEDIUM',
      description: `Il costo dei materiali ha raggiunto l'80% del budget previsto, nonostante l'avanzamento lavori sia stimato inferiore.`,
      impactValue: totalActualMaterials,
      suggestedAction: 'Verificare gli sfridi in cantiere o rinegoziare i prezzi con i fornitori.'
    });
  }

  // 2. ANALISI MANODOPERA (Costo Orario Effettivo)
  let totalLaborCost = 0;
  project.rapportini.forEach(r => {
    r.lavoratori.forEach(rl => {
      totalLaborCost += rl.ore * (rl.lavoratore.costoOrario || 30); // Default 30€/h if missing
    });
  });

  // 3. MARGINE REAL-TIME
  const totalCertifiedRevenue = project.sal.reduce((sum, s) => sum + s.importo, 0);
  const currentMargin = totalCertifiedRevenue - (totalActualMaterials + totalLaborCost);

  if (currentMargin < 0 && totalCertifiedRevenue > 0) {
    anomalies.push({
      type: 'MARGIN_EROSION',
      severity: 'CRITICAL',
      description: `Margine negativo rilevato. I costi certificati (Materiali + Ore) superano il valore dei SAL emessi.`,
      impactValue: currentMargin,
      suggestedAction: 'Emettere urgentemente un SAL di allineamento o bloccare le varianti non autorizzate.'
    });
  }

  return {
    summary: {
      budgetMaterials: totalBudgetMaterials,
      actualMaterials: totalActualMaterials,
      actualLabor: totalLaborCost,
      certifiedRevenue: totalCertifiedRevenue,
      currentMargin: currentMargin,
      marginPercentage: totalCertifiedRevenue > 0 ? (currentMargin / totalCertifiedRevenue) * 100 : 0
    },
    anomalies
  };
}
