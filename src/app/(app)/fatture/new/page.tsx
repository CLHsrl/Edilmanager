import { getProjects } from '../../actions';
import NuovaFatturaClient from './NuovaFatturaClient';
import { prisma } from '@/lib/prisma';

export default async function NuovaFatturaPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const params = await searchParams;
  const defaultTipo = params.tipo === 'PASSIVE' ? 'PASSIVA' : 'ATTIVA';
  const projects = await getProjects();
  const fornitori = await prisma.fornitore.findMany({ orderBy: { ragioneSociale: 'asc' } });

  return <NuovaFatturaClient defaultTipo={defaultTipo} projects={projects as any} fornitori={fornitori} />;
}
