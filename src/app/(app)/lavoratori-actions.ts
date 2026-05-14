'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getLavoratori() {
  return await prisma.lavoratore.findMany({
    orderBy: { nome: 'asc' },
    include: {
      projects: { select: { id: true, name: true } },
      presenze: { orderBy: { entrata: 'desc' }, take: 20 },
      assenze: { orderBy: { dataInizio: 'desc' } },
      documenti: { orderBy: { dataScadenza: 'asc' } },
      tasks: { orderBy: { dueDate: 'asc' } },
      _count: { select: { rapportini: true } }
    }
  });
}

export async function createLavoratore(formData: FormData) {
  const nome = formData.get('nome') as string;
  const cognome = formData.get('cognome') as string;
  const tipo = formData.get('tipo') as string;
  const costoOrario = parseFloat(formData.get('costoOrario') as string) || 0;
  const telefono = formData.get('telefono') as string;
  const email = formData.get('email') as string;
  const projectIds = JSON.parse(formData.get('projectIds') as string || '[]');

  const session = await getServerSession();

  const lavoratore = await prisma.lavoratore.create({
    data: {
      nome,
      cognome,
      tipo,
      costoOrario,
      telefono,
      email,
      projects: {
        connect: projectIds.map((id: string) => ({ id }))
      }
    }
  });

  await logAuditEvent('CREATE_LAVORATORE', `WORKER_ID:${lavoratore.id}`, `Assunto/Registrato lavoratore: ${nome} ${cognome}`, session.userId);

  revalidatePath('/lavoratori');
  revalidatePath('/projects');
}

export async function updateLavoratore(id: string, formData: FormData) {
  const nome = formData.get('nome') as string;
  const cognome = formData.get('cognome') as string;
  const tipo = formData.get('tipo') as string;
  const costoOrario = parseFloat(formData.get('costoOrario') as string) || 0;
  const telefono = formData.get('telefono') as string;
  const email = formData.get('email') as string;
  const projectIds = JSON.parse(formData.get('projectIds') as string || '[]');

  await prisma.lavoratore.update({
    where: { id },
    data: {
      nome,
      cognome,
      tipo,
      costoOrario,
      telefono,
      email,
      projects: {
        set: projectIds.map((id: string) => ({ id }))
      }
    }
  });

  revalidatePath('/lavoratori');
}

export async function deleteLavoratore(id: string) {
  const session = await getServerSession();
  if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo la Direzione può terminare o eliminare un record lavoratore.");

  const deleted = await prisma.lavoratore.delete({
    where: { id }
  });
  await logAuditEvent('DELETE_LAVORATORE', `WORKER_ID:${id}`, `Eliminato lavoratore ${deleted.nome} ${deleted.cognome}`, session.userId);
  revalidatePath('/lavoratori');
}

// ─── HR Operations (Clock-in / Clock-out) ───────────────────────────────────

export async function clockIn(lavoratoreId: string, latitude?: number, longitude?: number) {
  await prisma.presenza.create({
    data: {
      lavoratoreId,
      entrata: new Date(),
      latIn: latitude,
      longIn: longitude
    }
  });
  revalidatePath('/lavoratori');
}

export async function clockOut(lavoratoreId: string, latitude?: number, longitude?: number) {
  const lastPresenza = await prisma.presenza.findFirst({
    where: { lavoratoreId, uscita: null },
    orderBy: { entrata: 'desc' }
  });

  if (!lastPresenza) throw new Error("Nessun check-in attivo trovato.");

  await prisma.presenza.update({
    where: { id: lastPresenza.id },
    data: {
      uscita: new Date(),
      latOut: latitude,
      longOut: longitude
    }
  });
  revalidatePath('/lavoratori');
}

// ─── Absence Management ──────────────────────────────────────────────────────

export async function requestAbsence(lavoratoreId: string, formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const dataInizio = new Date(formData.get('dataInizio') as string);
  const dataFine = new Date(formData.get('dataFine') as string);
  const note = formData.get('note') as string;

  // Calculate days (simple diff)
  const diffTime = Math.abs(dataFine.getTime() - dataInizio.getTime());
  const giorniTotali = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  await prisma.assenza.create({
    data: {
      lavoratoreId,
      tipo,
      dataInizio,
      dataFine,
      giorniTotali,
      note,
      stato: 'APPROVATA' // In enterprise mode, auto-approve for now or PENDING
    }
  });

  revalidatePath('/lavoratori');
}
