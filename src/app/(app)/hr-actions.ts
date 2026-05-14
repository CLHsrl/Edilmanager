'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- ATTENDANCE (PRESENZE) ---

export async function checkIn(lavoratoreId: string, lat?: number, lng?: number) {
  // Check if already checked in
  const existing = await prisma.presenza.findFirst({
    where: { 
      lavoratoreId, 
      uscita: null 
    }
  });

  if (existing) throw new Error('Risulta già un ingresso attivo.');

  await prisma.presenza.create({
    data: {
      lavoratoreId,
      latIn: lat,
      longIn: lng,
      entrata: new Date()
    }
  });

  revalidatePath('/lavoratori');
}

export async function checkOut(lavoratoreId: string, lat?: number, lng?: number) {
  const active = await prisma.presenza.findFirst({
    where: { 
      lavoratoreId, 
      uscita: null 
    },
    orderBy: { entrata: 'desc' }
  });

  if (!active) throw new Error('Nessun ingresso attivo trovato.');

  await prisma.presenza.update({
    where: { id: active.id },
    data: {
      uscita: new Date(),
      latOut: lat,
      longOut: lng
    }
  });

  revalidatePath('/lavoratori');
}

// --- LEAVE & VACATION (ASSENZE) ---

export async function requestAssenza(formData: FormData) {
  const lavoratoreId = formData.get('lavoratoreId') as string;
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
      stato: 'PENDENTE'
    }
  });

  revalidatePath('/lavoratori');
}

export async function updateAssenzaStato(id: string, stato: string) {
  await prisma.assenza.update({
    where: { id },
    data: { stato }
  });

  revalidatePath('/lavoratori');
}

// --- COMPLIANCE ---

export async function upsertComplianceDoc(formData: FormData) {
  const id = formData.get('id') as string;
  const nome = formData.get('nome') as string;
  const dataScadenza = new Date(formData.get('dataScadenza') as string);
  const lavoratoreId = formData.get('lavoratoreId') as string || null;
  const attrezzaturaId = formData.get('attrezzaturaId') as string || null;

  if (id) {
    await prisma.complianceDoc.update({
      where: { id },
      data: { nome, dataScadenza, lavoratoreId, attrezzaturaId }
    });
  } else {
    await prisma.complianceDoc.create({
      data: { nome, dataScadenza, lavoratoreId, attrezzaturaId }
    });
  }

  revalidatePath('/lavoratori');
}
