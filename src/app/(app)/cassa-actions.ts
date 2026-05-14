'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

// ─── Conti Bancari ────────────────────────────────────────────────────────

export async function getConti() {
  return await prisma.contoBancario.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getConto(id: string) {
  return await prisma.contoBancario.findUnique({
    where: { id }
  });
}

export async function createConto(formData: FormData) {
  const nome = formData.get('nome') as string;
  const tipo = formData.get('tipo') as string;
  const saldoIniziale = parseFloat(formData.get('saldoIniziale') as string) || 0;
  const iban = formData.get('iban') as string | undefined;
  const note = formData.get('note') as string | undefined;

  const session = await getServerSession();

  const conto = await prisma.contoBancario.create({
    data: {
      nome,
      tipo,
      saldoIniziale,
      iban,
      note,
      attivo: true
    }
  });

  await logAuditEvent('CREATE_CONTO', `CONTO_ID:${conto.id}`, `Creato nuovo conto: ${nome}`, session.userId);

  revalidatePath('/cassa');
  revalidatePath('/cassa/conti');
  redirect('/cassa/conti');
}

export async function updateConto(id: string, formData: FormData) {
  const nome = formData.get('nome') as string;
  const iban = formData.get('iban') as string | undefined;
  const note = formData.get('note') as string | undefined;
  const attivo = formData.get('attivo') === 'true';

  await prisma.contoBancario.update({
    where: { id },
    data: { nome, iban, note, attivo }
  });

  revalidatePath('/cassa');
  revalidatePath('/cassa/conti');
}

// ─── Movimenti ────────────────────────────────────────────────────────────

export async function getMovimenti(filters?: { contoId?: string; tipo?: string; categoria?: string }) {
  const where: any = {};
  if (filters?.contoId) where.contoId = filters.contoId;
  if (filters?.tipo) where.tipo = filters.tipo;
  if (filters?.categoria) where.categoria = filters.categoria;

  return await prisma.movimento.findMany({
    where,
    include: {
      conto: true,
      projects: { select: { id: true, name: true, number: true } }
    },
    orderBy: { data: 'desc' },
    take: 100 // Limit for display
  });
}

export async function createMovimento(formData: FormData) {
  const contoId = formData.get('contoId') as string;
  const tipo = formData.get('tipo') as string; // ENTRATA | USCITA
  const categoria = formData.get('categoria') as string;
  const data = new Date(formData.get('data') as string);
  const importo = parseFloat(formData.get('importo') as string);
  const descrizione = formData.get('descrizione') as string;
  const controparte = formData.get('controparte') as string | undefined;
  const riferimento = formData.get('riferimento') as string | undefined;
  
  // Associating to projects
  const projectIdsStr = formData.get('projectIds') as string;
  let projectIds: string[] = [];
  try {
    if (projectIdsStr) projectIds = JSON.parse(projectIdsStr);
  } catch {}

  const session = await getServerSession();

  // --- PILLAR 4: DURC COMPLIANCE (SOFT) ON PAYMENTS ---
  if (tipo === 'USCITA' && controparte) {
    const fornitore = await prisma.fornitore.findFirst({
        where: { ragioneSociale: controparte }
    });
    if (fornitore && fornitore.dataScadenzaDurc && new Date(fornitore.dataScadenzaDurc) < new Date()) {
        await logAuditEvent('COMPLIANCE_WARNING_PAYMENT', `FORNITORE:${fornitore.id}`, `Autorizzato pagamento USCITA verso ${controparte} con DURC SCADUTO.`, session.userId);
    }
  }

  const movimento = await prisma.movimento.create({
    data: {
      contoId,
      tipo,
      categoria,
      data,
      importo,
      descrizione,
      controparte,
      riferimento,
      projects: {
        connect: projectIds.map(id => ({ id }))
      }
    }
  });

  await logAuditEvent('CREATE_MOVIMENTO', `MOVIMENTO_ID:${movimento.id}`, `Registrato movimento ${tipo} di €${importo}`, session.userId);

  revalidatePath('/cassa');
  revalidatePath('/cassa/movimenti');
  redirect('/cassa/movimenti');
}

export async function deleteMovimento(id: string) {
  const session = await getServerSession();
  if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo gli Amministratori possono eliminare movimenti di cassa.");

  await prisma.movimento.delete({ where: { id } });
  await logAuditEvent('DELETE_MOVIMENTO', `MOVIMENTO_ID:${id}`, `Eliminato movimento di cassa`, session.userId);
  revalidatePath('/cassa');
  revalidatePath('/cassa/movimenti');
}

// ─── Aggregazioni Globali ──────────────────────────────────────────────────

export async function getDashboardData() {
  const conti = await prisma.contoBancario.findMany();
  const movimenti = await prisma.movimento.findMany({
    include: { conto: true }
  });

  // Saldo for each conto
  const balPerConto = conti.map(conto => {
    const movConto = movimenti.filter(m => m.contoId === conto.id);
    const entrate = movConto.filter(m => m.tipo === 'ENTRATA').reduce((sum, m) => sum + m.importo, 0);
    const uscite = movConto.filter(m => m.tipo === 'USCITA').reduce((sum, m) => sum + m.importo, 0);
    return {
      ...conto,
      saldoAttuale: conto.saldoIniziale + entrate - uscite
    }
  });

  const saldoTotale = balPerConto.reduce((sum, c) => sum + c.saldoAttuale, 0);
  
  // Last 30 days specific sums
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const movRecent = movimenti.filter(m => new Date(m.data) >= thirtyDaysAgo);
  const entrate30 = movRecent.filter(m => m.tipo === 'ENTRATA').reduce((sum, m) => sum + m.importo, 0);
  const uscite30 = movRecent.filter(m => m.tipo === 'USCITA').reduce((sum, m) => sum + m.importo, 0);

  return {
    conti: balPerConto,
    saldoTotale,
    entrate30,
    uscite30,
    ultimiMovimenti: movimenti.sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5)
  };
}

export async function getCashflowGlobalData() {
  const movimenti = await prisma.movimento.findMany({ select: { id: true, importo: true, tipo: true, data: true }});
  const previsionali = await prisma.previsionale.findMany({ select: { id: true, importo: true, tipo: true, data: true }});

  // Group by "YYYY-MM"
  const monthlyData: Record<string, { month: string, entrate: number, uscite: number, saldoEffettivo: number, entratePrev: number, uscitePrev: number, saldoPrevisto: number }> = {};

  const getMonthKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const allDates = [...movimenti.map(m => m.data), ...previsionali.map(p => p.data)];
  const uniqueMonths = Array.from(new Set(allDates.map(d => getMonthKey(d)))).sort();

  for (const ym of uniqueMonths) {
    monthlyData[ym] = {
      month: ym,
      entrate: 0,
      uscite: 0,
      saldoEffettivo: 0,
      entratePrev: 0,
      uscitePrev: 0,
      saldoPrevisto: 0
    };
  }

  // Populate Actuals
  for (const m of movimenti) {
    const ym = getMonthKey(m.data);
    if (m.tipo === 'ENTRATA') monthlyData[ym].entrate += m.importo;
    if (m.tipo === 'USCITA') monthlyData[ym].uscite += m.importo;
  }

  // Populate Forecasts
  for (const p of previsionali) {
    const ym = getMonthKey(p.data);
    if (p.tipo === 'ENTRATA') monthlyData[ym].entratePrev += p.importo;
    if (p.tipo === 'USCITA') monthlyData[ym].uscitePrev += p.importo;
  }

  // Calculate Cumulative balances sequentially
  let currentSaldo = 0;
  let currentSaldoPrev = 0;
  
  const sortedKeys = uniqueMonths.sort();
  for (const key of sortedKeys) {
    const m = monthlyData[key];
    
    // Net per month
    const netEffettivo = m.entrate - m.uscite;
    const netPrevisto = m.entratePrev - m.uscitePrev;
    
    currentSaldo += netEffettivo;
    // Saldo Previsto should realistically start from currentSaldo or be cumulative of prev?
    // Let's make it truly isolated cumulative or just cumulative delta
    currentSaldoPrev += netPrevisto;

    m.saldoEffettivo = currentSaldo;
    m.saldoPrevisto = currentSaldoPrev;
  }

  return Object.values(monthlyData);
}
