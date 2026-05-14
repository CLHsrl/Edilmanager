'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/auditLog';
import { getServerSession } from '@/lib/auth-server';

export async function getFatture() {
  return await prisma.fattura.findMany({
    include: {
      projects: { select: { id: true, name: true, number: true } },
      movimenti: true
    },
    orderBy: { dataEmissione: 'desc' },
  });
}

export async function createFattura(formData: FormData) {
  const session = await getServerSession();
  const numero = formData.get('numero') as string;
  const tipo = formData.get('tipo') as string;
  const soggetto = formData.get('soggetto') as string;
  const dataEmissione = new Date(formData.get('dataEmissione') as string);
  const dataScadenzaStr = formData.get('dataScadenza') as string;
  const dataScadenza = dataScadenzaStr ? new Date(dataScadenzaStr) : null;
  const importo = parseFloat(formData.get('importo') as string);
  const iva = parseFloat(formData.get('iva') as string) || 22;
  const note = formData.get('note') as string | undefined;
  
  const totale = importo + (importo * iva / 100);
  
  // Associating to projects
  const projectIdsStr = formData.get('projectIds') as string;
  let projectIds: string[] = [];
  try {
    if (projectIdsStr) projectIds = JSON.parse(projectIdsStr);
  } catch {}

  // --- PILLAR 2: DURC COMPLIANCE CHECK (SOFT) ---
  if (tipo === 'PASSIVA') {
    const fornitore = await prisma.fornitore.findFirst({
      where: { ragioneSociale: soggetto }
    });
    if (fornitore && fornitore.dataScadenzaDurc && new Date(fornitore.dataScadenzaDurc) < new Date()) {
      await logAuditEvent('COMPLIANCE_WARNING', `FORNITORE:${fornitore.id}`, `Registrata fattura con DURC SCADUTO per ${soggetto}.`, session.userId);
      // NON lanciamo errore perché è un blocco "morbido"
    }
  }

  // --- PILLAR 3: HARD BUDGETING CHECK ---
  if (tipo === 'PASSIVA' && projectIds.length > 0) {
    for (const pId of projectIds) {
      const project = await prisma.project.findUnique({
        where: { id: pId },
        include: { fatture: true }
      });
      if (project && project.budget) {
        const currentExpenses = project.fatture
          .filter(f => f.tipo === 'PASSIVA')
          .reduce((sum, f) => sum + f.totale, 0);
        
        // Se la nuova fattura supera il budget rimanente
        if (currentExpenses + totale > project.budget) {
           if (session.role !== 'ADMIN') {
             throw new Error(`HARD BUDGET BLOCK: La spesa di €${totale} fa sforare il budget del cantiere ${project.name} (Max: €${project.budget}). L'operazione richiede lo sblocco della Direzione.`);
           } else {
             await logAuditEvent('BUDGET_OVERRIDE', `PROJECT_ID:${project.id}`, `L'amministratore ha autorizzato una spesa oltre il budget per ${project.name}`, session.userId);
           }
        }
      }
    }
  }

  const newFattura = await prisma.fattura.create({
    data: {
      numero,
      tipo,
      soggetto,
      dataEmissione,
      dataScadenza,
      importo,
      iva,
      totale,
      note,
      stato: 'DA_PAGARE',
      projects: {
        connect: projectIds.map(id => ({ id }))
      }
    }
  });

  await logAuditEvent('CREATE_FATTURA', `FATTURA_ID:${newFattura.id}`, `Creata fattura ${tipo} ${numero} per €${totale}`, session.userId);

  revalidatePath('/fatture');
  redirect('/fatture');
}

export async function markFatturaStato(id: string, stato: string) {
  const session = await getServerSession();
  await prisma.fattura.update({
    where: { id },
    data: { stato }
  });
  await logAuditEvent('UPDATE_FATTURA_STATO', `FATTURA_ID:${id}`, `Stato cambiato in ${stato}`, session.userId);
  revalidatePath('/fatture');
}

export async function deleteFattura(id: string) {
  const session = await getServerSession();
  // --- PILLAR 4: RBAC STRICT CHECK ---
  if (session.role !== 'ADMIN') {
    throw new Error('AUTHORIZATION ERROR: Solo gli Amministratori possono eliminare record contabili fatturati. (Strict RBAC)');
  }

  const deleted = await prisma.fattura.delete({ where: { id } });
  await logAuditEvent('DELETE_FATTURA', `FATTURA_ID:${id}`, `Eliminata fattura ${deleted.numero}`, session.userId);
  revalidatePath('/fatture');
}

export async function getFattureDashboardStats() {
  const fatture = await prisma.fattura.findMany();
  
  const now = new Date();
  const daIncassare = fatture.filter(f => f.tipo === 'ATTIVA' && f.stato !== 'PAGATA').reduce((sum, f) => sum + f.totale, 0);
  const daPagare = fatture.filter(f => f.tipo === 'PASSIVA' && f.stato !== 'PAGATA').reduce((sum, f) => sum + f.totale, 0);
  
  const scadute = fatture.filter(f => f.stato !== 'PAGATA' && f.dataScadenza && new Date(f.dataScadenza) < now).reduce((sum, f) => sum + f.totale, 0);
  
  return {
    daIncassare,
    daPagare,
    scadute
  };
}

export async function getFatturaDetails(id: string) {
  const fattura = await prisma.fattura.findUnique({
    where: { id },
    include: {
      projects: true,
      movimenti: { include: { conto: true } }
    }
  });

  if (!fattura) return null;

  // Potential movimenti for reconciliation
  const actionTipo = fattura.tipo === 'ATTIVA' ? 'ENTRATA' : 'USCITA';
  const potentialMovimenti = await prisma.movimento.findMany({
    where: { tipo: actionTipo },
    include: { conto: true, projects: true },
    orderBy: { data: 'desc' },
    take: 50
  });

  return { fattura, potentialMovimenti };
}
