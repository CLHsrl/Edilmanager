import { prisma } from '@/lib/prisma';
import WorkflowsClient from './WorkflowsClient';

export const dynamic = 'force-dynamic';

export default async function WorkflowsPage() {
    const tasks = await prisma.workflowTask.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
            assignedTo: true,
            lavoratore: true
        }
    });

    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    const lavoratori = await prisma.lavoratore.findMany({ orderBy: { nome: 'asc' } });

    return <WorkflowsClient initialTasks={tasks} users={users} lavoratori={lavoratori} />;
}
