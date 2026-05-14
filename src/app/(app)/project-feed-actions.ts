'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getProjectUpdates(projectId: string) {
    return await prisma.projectUpdate.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createProjectUpdate(projectId: string, content: string, photos?: string, type: string = 'UPDATE') {
    const session = await getServerSession();
    
    // By default isVisibleToClient is false (Manager Approval required)
    const update = await prisma.projectUpdate.create({
        data: {
            projectId,
            authorName: session.userName,
            content,
            photos,
            type,
            isVisibleToClient: false 
        }
    });

    await logAuditEvent('CREATE_PROJECT_UPDATE', `PROJECT_ID:${projectId}`, `Nuovo aggiornamento cantiere inserito`, session.userId);
    revalidatePath(`/projects/${projectId}`);
    return update;
}

export async function approveUpdateForClient(id: string, isVisible: boolean = true) {
    const session = await getServerSession();
    if (session.role === 'OPERAIO') throw new Error("Solo PM e Admin possono approvare contenuti per il portale clienti.");

    const update = await prisma.projectUpdate.update({
        where: { id },
        data: { isVisibleToClient: isVisible }
    });

    await logAuditEvent('APPROVE_CLIENT_CONTENT', `UPDATE_ID:${id}`, `Contenuto approvato per il portale cliente: ${isVisible}`, session.userId);
    
    const project = await prisma.project.findUnique({ where: { id: update.projectId } });
    if (project) {
        revalidatePath(`/projects/${project.id}`);
        revalidatePath(`/portal/${project.portalKey}`);
    }
}

export async function deleteProjectUpdate(id: string) {
    const session = await getServerSession();
    const update = await prisma.projectUpdate.delete({ where: { id } });
    
    await logAuditEvent('DELETE_PROJECT_UPDATE', `UPDATE_ID:${id}`, `Eliminato aggiornamento cantiere`, session.userId);
    revalidatePath(`/projects/${update.projectId}`);
}
