'use server';

import { prisma } from '@/lib/prisma';

export async function getPriceComparison() {
  const articoli = await prisma.ddtArticolo.findMany({
    include: {
      ddt: {
        include: {
          fornitore: true
        }
      }
    }
  });

  // Group by description (fuzzy matching would be better, but let's use exact for now)
  const grouped: Record<string, any[]> = {};
  articoli.forEach(art => {
    if (!art.descrizione) return;
    const key = art.descrizione.toUpperCase().trim();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      price: art.prezzoUn,
      fornitore: art.ddt.fornitore?.name || art.ddt.fornitoreName,
      date: art.ddt.data,
      project: art.ddt.projectId
    });
  });

  const comparison = Object.entries(grouped).map(([name, history]) => {
    const sorted = history.sort((a, b) => (a.price || 0) - (b.price || 0));
    return {
      name,
      minPrice: sorted[0].price,
      bestSupplier: sorted[0].fornitore,
      avgPrice: history.reduce((sum, h) => sum + (h.price || 0), 0) / history.length,
      historyCount: history.length
    };
  }).filter(c => c.historyCount > 1); // Only items with multiple entries

  return comparison.sort((a, b) => b.historyCount - a.historyCount);
}
