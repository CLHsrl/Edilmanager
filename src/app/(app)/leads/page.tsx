import { getLeads } from '../lead-actions';
import LeadsClient from './LeadsClient';
import { getServerSession } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'CRM Avanzato | Edil Manager',
  description: 'Gestione trattative commerciali, lead e sopralluoghi.',
};

export default async function LeadsPage() {
  const session = await getServerSession();
  
  if (session.role === 'OPERAIO') {
      redirect('/');
  }

  const leads = await getLeads();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, totalXp: true, rank: true }
  });

  const stats = {
      total: leads.length,
      open: leads.filter(l => l.status !== 'WON' && l.status !== 'LOST').length,
      potentialBudget: leads.reduce((acc, l) => acc + (l.estimatedBudget || 0), 0),
      won: leads.filter(l => l.status === 'WON').length
  };

  return <LeadsClient leads={leads as any} stats={stats} isAdmin={session.role === 'ADMIN'} user={user as any} />;
}
