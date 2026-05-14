import { prisma } from '@/lib/prisma';

export async function suggestRfiAnswer(projectId: string, rfiTitle: string, rfiQuestion: string) {
  // Real scenario: Semantic search in ProjectDocuments + LLM
  // Mock logic for demonstration:
  
  const documents = await prisma.projectDocument.findMany({
    where: { projectId },
    select: { name: true }
  });

  const docNames = documents.map(d => d.name).join(', ');
  
  if (rfiQuestion.toLowerCase().includes('struttura') || rfiQuestion.toLowerCase().includes('cemento')) {
    return `In base all'analisi dei documenti tecnici (${docNames}), si suggerisce di fare riferimento alla Tavola Strutturale S-04. Il getto deve essere eseguito previa verifica dei ferri di armatura come da progetto esecutivo.`;
  }

  if (rfiQuestion.toLowerCase().includes('colore') || rfiQuestion.toLowerCase().includes('finitura')) {
    return `La scelta cromatica deve seguire il capitolato descrittivo. Si consiglia di verificare il campione materiale approvato nella cartella 'Documenti Architettonici'.`;
  }

  return `L'AI non ha trovato riferimenti univoci nei documenti caricati. Si consiglia di consultare il Direttore Lavori o allegare nuovi elaborati grafici per una risposta precisa.`;
}
