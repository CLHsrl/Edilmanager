'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getSafetySettings() {
    let settings = await prisma.safetySettings.findUnique({
        where: { id: 'GLOBAL' }
    });
    
    if (!settings) {
        settings = await prisma.safetySettings.create({
            data: { id: 'GLOBAL' }
        });
    }
    return settings;
}

export async function updateSafetySettings(formData: FormData) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error("Solo gli amministratori possono modificare le impostazioni aziendali.");

    const data = {
        companyName: formData.get('companyName') as string,
        vatId: formData.get('vatId') as string,
        legalAddress: formData.get('legalAddress') as string,
        legalCity: formData.get('legalCity') as string,
        responsabileSicurezza: formData.get('responsabileSicurezza') as string,
        rspp: formData.get('rspp') as string,
        medicoCompetente: formData.get('medicoCompetente') as string,
    };

    await prisma.safetySettings.update({
        where: { id: 'GLOBAL' },
        data
    });

    await logAuditEvent('UPDATE_SAFETY_SETTINGS', 'GLOBAL', 'Aggiornate impostazioni sicurezza aziendali', session.userId);
    revalidatePath('/projects'); // May affect headers
}

export async function getProjectSafetyInfo(projectId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            lavoratori: {
                include: { documenti: true }
            },
            attrezzature: {
                include: { documenti: true }
            },
            safetyPlans: {
                orderBy: { updatedAt: 'desc' }
            }
        }
    });
    return project;
}

export async function createSafetyPlan(projectId: string, title: string, content: string, aiInsights?: string) {
    try {
        const session = await getServerSession();
        if (!session || !session.userId) throw new Error("Utente non autenticato.");

        const plan = await prisma.safetyPlan.create({
            data: {
                projectId,
                title,
                content,
                aiInsights,
                status: 'DRAFT'
            }
        });

        await logAuditEvent('CREATE_SAFETY_PLAN', `PROJECT_ID:${projectId}`, `Creato nuovo piano sicurezza: ${title}`, session.userId);
        revalidatePath(`/projects/${projectId}`);
        return { success: true, plan };
    } catch (error) {
        console.error("Errore nella creazione del piano sicurezza:", error);
        return { success: false, error: "Impossibile salvare il piano sicurezza." };
    }
}

export async function deleteSafetyPlan(id: string) {
    const session = await getServerSession();
    const plan = await prisma.safetyPlan.delete({ where: { id } });
    
    await logAuditEvent('DELETE_SAFETY_PLAN', `PLAN_ID:${id}`, `Eliminato piano sicurezza`, session.userId);
    revalidatePath(`/projects/${plan.projectId}`);
}
