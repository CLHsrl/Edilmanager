'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getLeads() {
    return await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function createLead(formData: FormData) {
    const session = await getServerSession();
    
    const name = formData.get('name') as string;
    const clientName = formData.get('clientName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const workType = formData.get('workType') as string;
    const source = formData.get('source') as string;
    const budgetStr = formData.get('estimatedBudget') as string;
    const notes = formData.get('notes') as string;
    
    const estimatedBudget = budgetStr ? parseFloat(budgetStr) : null;

    const lead = await prisma.lead.create({
        data: {
            name,
            clientName,
            clientEmail: email,
            clientPhone: phone,
            address,
            city,
            workType,
            source,
            estimatedBudget,
            notes,
            status: 'NEW'
        }
    });

    await logAuditEvent('CREATE_LEAD', `LEAD_ID:${lead.id}`, `Creato nuovo lead: ${name}`, session.userId);
    revalidatePath('/leads');
    return lead;
}

// Construction Level Requirements (Materiali)
const LEVEL_REQUIREMENTS: Record<number, string[]> = {
    1: ['source'], // Posa Prima Pietra
    2: ['clientPhone', 'clientEmail'], // Scavo e Rilievo
    3: ['workType', 'notes'], // Fondamenta Gettate
    4: ['estimatedBudget'], // Pareti Alzate
    5: [] // Inaugurazione (Boss Fight handles this)
};

export async function canAdvanceLevel(leadId: string, targetLevel: number) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { canAdvance: false, missing: ['Lead non trovato'] };
    
    // Level 1 is always accessible
    if (targetLevel <= 1) return { canAdvance: true, missing: [] };

    // Check requirements for the PREVIOUS level to ensure it was "built" correctly
    const requirements = LEVEL_REQUIREMENTS[targetLevel - 1] || [];
    const missing = requirements.filter(field => !lead[field as keyof typeof lead]);

    return { 
        canAdvance: missing.length === 0, 
        missing 
    };
}

export async function updateLeadStatus(id: string, status: string) {
    const session = await getServerSession();
    
    // Playful Construction Level Mapping
    const levelMap: Record<string, number> = {
        'NEW': 1,               // POSA DELLA PRIMA PIETRA
        'CONTACTED': 2,         // SCAVO E RILIEVO
        'SURVEY_SCHEDULED': 3,  // FONDAMENTA GETTATE
        'QUOTED': 4,            // PARETI ALZATE
        'WON': 5,               // INAUGURAZIONE (BOSS FIGHT)
        'LOST': 1
    };

    const newLevel = levelMap[status] || 1;

    // BLOCCANTE: Verifica se abbiamo tutti i "Materiali" per il nuovo livello
    const validation = await canAdvanceLevel(id, newLevel);
    if (!validation.canAdvance && status !== 'LOST') {
        throw new Error(`Mancano i materiali per avanzare: ${validation.missing.join(', ')}`);
    }

    // XP Rewards (approximate)
    const xpRewards: Record<string, number> = {
        'CONTACTED': 100,
        'SURVEY_SCHEDULED': 250,
        'QUOTED': 500,
        'WON': 2000
    };

    const addedXp = xpRewards[status] || 0;

    const lead = await prisma.lead.update({
        where: { id },
        data: { 
            status,
            level: newLevel,
            xp: { increment: addedXp }
        }
    });

    // Update Global User XP and Rank
    if (addedXp > 0 && session.userId) {
        const user = await prisma.user.findUnique({ where: { id: session.userId } });
        if (user) {
            const newTotalXp = user.totalXp + addedXp;
            let newRank = user.rank;

            // Simple Rank Ladder
            if (newTotalXp > 10000) newRank = "RE DEI CONTRATTI";
            else if (newTotalXp > 5000) newRank = "ELITE";
            else if (newTotalXp > 1000) newRank = "PROFESSIONISTA";
            else if (newTotalXp > 0) newRank = "NOVIZIO";

            await prisma.user.update({
                where: { id: session.userId },
                data: { 
                    totalXp: newTotalXp,
                    rank: newRank 
                }
            });
        }
    }

    await logAuditEvent('UPDATE_LEAD_STATUS', `LEAD_ID:${id}`, `Stato aggiornato a ${status}. XP guadagnati: ${addedXp}`, session.userId);
    revalidatePath('/leads');
    return lead;
}

export async function deleteLead(id: string) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') throw new Error("Solo gli amministratori possono eliminare Lead.");

    await prisma.lead.delete({ where: { id } });
    await logAuditEvent('DELETE_LEAD', `LEAD_ID:${id}`, `Eliminato lead`, session.userId);
    revalidatePath('/leads');
}
