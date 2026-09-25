'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

// ─── COMPANY PROFILE ──────────────────────────────────────────────────────────

export async function getCompanyProfile() {
    let settings = await prisma.safetySettings.findUnique({ where: { id: 'GLOBAL' } });
    if (!settings) {
        settings = await prisma.safetySettings.create({ data: { id: 'GLOBAL' } });
    }
    return settings;
}

export async function updateCompanyProfile(formData: FormData) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error('Accesso negato.');

    await prisma.safetySettings.update({
        where: { id: 'GLOBAL' },
        data: {
            companyName:            formData.get('companyName') as string,
            vatId:                  formData.get('vatId') as string,
            legalAddress:           formData.get('legalAddress') as string,
            legalCity:              formData.get('legalCity') as string,
            responsabileSicurezza:  formData.get('responsabileSicurezza') as string,
            rspp:                   formData.get('rspp') as string,
            medicoCompetente:       formData.get('medicoCompetente') as string,
        },
    });

    await logAuditEvent('UPDATE_COMPANY_PROFILE', 'GLOBAL', 'Aggiornato profilo aziendale', session.userId);
    revalidatePath('/settings');
    revalidatePath('/settings/safety');
}

// ─── CONTI BANCARI ────────────────────────────────────────────────────────────

export async function getConti() {
    return prisma.contoBancario.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function createConto(formData: FormData) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error('Accesso negato.');

    await prisma.contoBancario.create({
        data: {
            nome:          formData.get('nome') as string,
            tipo:          formData.get('tipo') as string || 'BANCARIO',
            saldoIniziale: parseFloat(formData.get('saldoIniziale') as string || '0'),
            iban:          formData.get('iban') as string || null,
            note:          formData.get('note') as string || null,
        },
    });

    await logAuditEvent('CREATE_CONTO', 'GLOBAL', `Aggiunto conto: ${formData.get('nome')}`, session.userId);
    revalidatePath('/settings');
    revalidatePath('/cassa');
}

export async function deleteConto(id: string) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error('Accesso negato.');
    await prisma.contoBancario.delete({ where: { id } });
    await logAuditEvent('DELETE_CONTO', `CONTO_ID:${id}`, 'Eliminato conto bancario', session.userId);
    revalidatePath('/settings');
    revalidatePath('/cassa');
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export async function getCurrentUser() {
    const session = await getServerSession();
    return prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true, role: true, totalXp: true, rank: true, createdAt: true }
    });
}

export async function updateUserName(formData: FormData) {
    const session = await getServerSession();
    const name = formData.get('name') as string;
    await prisma.user.update({ where: { id: session.userId }, data: { name } });
    revalidatePath('/settings');
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export async function getSettingsStats() {
    const [projectsCount, clientsCount, lavoratoriCount, fattureCount] = await Promise.all([
        prisma.project.count(),
        prisma.client.count(),
        prisma.lavoratore.count(),
        prisma.fattura.count(),
    ]);
    return { projectsCount, clientsCount, lavoratoriCount, fattureCount };
}

// ─── GESTIONE RUOLI ───────────────────────────────────────────────────────────

export async function getStaffUsers() {
    return prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
        orderBy: { name: 'asc' },
    });
}

/** Cambia il ruolo di un utente specifico (solo ADMIN può farlo) */
export async function updateUserRole(formData: FormData) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error('Accesso negato.');

    const userId = formData.get('userId') as string;
    const newRole = formData.get('role') as string;

    const validRoles = ['ADMIN', 'PM', 'ACCOUNTANT', 'WORKER', 'VIEWER'];
    if (!validRoles.includes(newRole)) throw new Error('Ruolo non valido.');

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    await logAuditEvent('UPDATE_USER_ROLE', userId, `Ruolo aggiornato a ${newRole}`, session.userId);
    revalidatePath('/settings');
    revalidatePath('/settings/profile');
}

/** Trasferisce il ruolo ADMIN a un altro utente e abbassa l'admin corrente a PM */
export async function transferAdmin(formData: FormData) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error('Accesso negato.');

    const newAdminId = formData.get('newAdminId') as string;
    if (!newAdminId) throw new Error('Seleziona un utente.');
    if (newAdminId === session.userId) throw new Error('Sei già l\'admin.');

    // Transazione atomica: promuovi il nuovo admin, abbassa il corrente
    await prisma.$transaction([
        prisma.user.update({ where: { id: newAdminId },    data: { role: 'ADMIN' } }),
        prisma.user.update({ where: { id: session.userId }, data: { role: 'PM' } }),
    ]);

    await logAuditEvent('TRANSFER_ADMIN', newAdminId, `Ruolo ADMIN trasferito dall\'utente ${session.userId}`, session.userId);
    revalidatePath('/settings');
}
