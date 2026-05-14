import { prisma } from '@/lib/prisma';

export async function generateSiteAISummary(projectId: string) {
  const updates = await prisma.projectUpdate.findMany({
    where: { 
      projectId,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (updates.length === 0) return "Nessun aggiornamento rilevato negli ultimi 7 giorni per generare un riassunto.";

  // In a real scenario, we would call an LLM (OpenAI/Gemini) here.
  // For now, we simulate the AI reasoning based on the content.
  
  const contentBlob = updates.map(u => u.content).join('\n');
  
  // Basic heuristic analysis
  const hasSafety = contentBlob.toLowerCase().includes('sicurezza') || contentBlob.toLowerCase().includes('dpi');
  const hasDelays = contentBlob.toLowerCase().includes('ritardo') || contentBlob.toLowerCase().includes('pioggia');
  const hasCompletion = contentBlob.toLowerCase().includes('finito') || contentBlob.toLowerCase().includes('completato');

  let summary = `Nell'ultima settimana sono stati registrati ${updates.length} aggiornamenti. `;
  
  if (hasCompletion) {
    summary += "Si rileva il completamento di alcune fasi chiave della lavorazione. ";
  } else {
    summary += "Le attività procedono come da cronoprogramma. ";
  }

  if (hasSafety) {
    summary += "Il cantiere mantiene un alto standard di sicurezza con verifiche DPI registrate. ";
  }

  if (hasDelays) {
    summary += "ATTENZIONE: Sono stati segnalati potenziali rallentamenti che potrebbero influire sulla consegna. ";
  }

  summary += "Punti salienti: " + (updates[0]?.content?.substring(0, 100) || "") + "...";

  return summary;
}
