'use server';
import { prisma } from '@/lib/prisma';

export async function getCommandPaletteData() {
  const [projects, clients, fatture, lavoratori] = await Promise.all([
    prisma.project.findMany({ select: { id: true, name: true, number: true }, take: 20, orderBy: { createdAt: 'desc' } }),
    prisma.client.findMany({ select: { id: true, name: true }, take: 20, orderBy: { createdAt: 'desc' } }),
    prisma.fattura.findMany({ select: { id: true, numero: true, soggetto: true }, take: 20, orderBy: { dataEmissione: 'desc' } }),
    prisma.lavoratore.findMany({ select: { id: true, nome: true, cognome: true }, take: 20, orderBy: { createdAt: 'desc' } })
  ]);
  
  return { projects, clients, fatture, lavoratori };
}
