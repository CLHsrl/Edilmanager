'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

export async function getArticoli() {
  return await prisma.articoloMagazzino.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function createArticolo(data: any) {
  const session = await getServerSession();
  const articolo = await prisma.articoloMagazzino.create({
    data: {
      codice: data.codice,
      nome: data.nome,
      categoria: data.categoria,
      unitaMisura: data.unitaMisura || 'PZ',
      giacenza: Number(data.giacenza) || 0,
      livelloScortaMin: Number(data.livelloScortaMin) || 0,
      costoUnitario: Number(data.costoUnitario) || 0
    }
  });
  await logAuditEvent('CREATE_ARTICOLO', `ARTICOLO_ID:${articolo.id}`, `Caricato articolo: ${data.nome}`, session.userId);
  revalidatePath('/magazzino');
  return articolo;
}

export async function deleteArticolo(id: string) {
  const session = await getServerSession();
  if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo gli ADMIN possono rimuovere articoli dal magazzino centrale.");

  await prisma.articoloMagazzino.delete({ where: { id } });
  await logAuditEvent('DELETE_ARTICOLO', `ARTICOLO_ID:${id}`, `Rimosso articolo dal magazzino`, session.userId);
  revalidatePath('/magazzino');
}

export async function getAttrezzature() {
  return await prisma.attrezzatura.findMany({
    orderBy: { nome: 'asc' },
    include: { 
      documenti: true,
      project: true,
      dipendente: true
    }
  });
}

export async function createAttrezzatura(data: any) {
  const attrezzatura = await prisma.attrezzatura.create({
    data: {
      nome: data.nome,
      targa: data.targa || undefined,
      tipo: data.tipo || 'VEICOLO',
      stato: data.stato || 'DISPONIBILE',
      costoOrario: Number(data.costoOrario) || 0,
      note: data.note,
      dataManutenzione: data.dataManutenzione ? new Date(data.dataManutenzione) : undefined,
      cantiereId: data.cantiereId || undefined,
      dipendenteId: data.dipendenteId || undefined
    }
  });
  revalidatePath('/magazzino');
  return attrezzatura;
}

export async function updateAttrezzatura(id: string, data: any) {
  const attrezzatura = await prisma.attrezzatura.update({
    where: { id },
    data: {
      nome: data.nome,
      targa: data.targa || undefined,
      tipo: data.tipo || undefined,
      stato: data.stato || undefined,
      costoOrario: data.costoOrario !== undefined ? Number(data.costoOrario) : undefined,
      note: data.note,
      dataManutenzione: data.dataManutenzione ? new Date(data.dataManutenzione) : undefined,
      cantiereId: data.cantiereId !== undefined ? data.cantiereId : undefined,
      dipendenteId: data.dipendenteId !== undefined ? data.dipendenteId : undefined
    }
  });
  revalidatePath('/magazzino');
  return attrezzatura;
}

export async function updateStatoAttrezzatura(id: string, stato: string) {
  await prisma.attrezzatura.update({
    where: { id },
    data: { stato }
  });
  revalidatePath('/magazzino');
}

export async function deleteAttrezzatura(id: string) {
  await prisma.attrezzatura.delete({ where: { id } });
  revalidatePath('/magazzino');
}
