'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { logAuditEvent } from '@/lib/auditLog';

// ─── Rapportini ────────────────────────────────────────────────────────────

export async function getRapportini(projectId: string) {
  return prisma.rapportino.findMany({
    where: { projectId },
    include: {
      lavoratori: {
        include: { lavoratore: true }
      },
      signature: true
    },
    orderBy: { data: 'desc' },
  });
}

export async function createRapportino(projectId: string, formData: FormData) {
  const session = await getServerSession();
  const data = new Date(formData.get('data') as string);
  const attivita = formData.get('attivita') as string;
  const note = (formData.get('note') as string) || undefined;
  const mezzi = (formData.get('mezzi') as string) || undefined;
  const materiali = (formData.get('materiali') as string) || undefined;

  const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined;
  const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined;

  // Extraction of all required fields
  const lavoratoriRaw = formData.get('lavoratori') as string;
  let lavoratori: { lavoratoreId: string; ore: number }[] = [];
  try { lavoratori = JSON.parse(lavoratoriRaw || '[]'); } catch {}

  const attrezzatureRaw = formData.get('attrezzature') as string;
  let attrezzature: { attrezzaturaId: string; oreUtilizzo: number }[] = [];
  try { attrezzature = JSON.parse(attrezzatureRaw || '[]'); } catch {}

  const articoliRaw = formData.get('articoli') as string;
  let articoli: { articoloMagazzinoId: string; quantita: number }[] = [];
  try { articoli = JSON.parse(articoliRaw || '[]'); } catch {}

  const signatureData = formData.get('signatureData') as string;
  const signerName = formData.get('signerName') as string;
  const aiSafetyCheck = formData.get('aiSafetyCheck') === 'true';
  const photos = formData.get('photos') as string || '[]';

  // --- PILLAR: GEOFENCING VALIDATION ---
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      fatture: { where: { tipo: 'PASSIVA', stato: 'PAGATA' } },
      rapportini: { include: { lavoratori: { include: { lavoratore: true } } } }
    }
  });

  if (latitude && longitude && project?.latitude && project?.longitude) {
    const R = 6371e3; // metres
    const φ1 = (latitude * Math.PI) / 180;
    const φ2 = (project.latitude * Math.PI) / 180;
    const Δφ = ((project.latitude - latitude) * Math.PI) / 180;
    const Δλ = ((project.longitude - longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance > 500) {
      await logAuditEvent('GEOFENCING_ALERT', `PROJECT_ID:${projectId}`, `Rapportino creato FUORI CANTIERE (Distanza: ${Math.round(distance)}m).`, session.userId);
    }
  }

  // --- PILLAR: HARD BUDGET CHECK ---
  if (project && project.budget) {
      const workerIds = lavoratori.map(l => l.lavoratoreId);
      const workersData = await prisma.lavoratore.findMany({
        where: { id: { in: workerIds } },
        select: { id: true, costoOrario: true }
      });
      const rapportinoLaborCost = lavoratori.reduce((sum, l) => {
        const w = workersData.find(wd => wd.id === l.lavoratoreId);
        return sum + (l.ore * (w?.costoOrario || 30));
      }, 0);

      const pastFatturiCosi = project.fatture.reduce((sum, f) => sum + f.totale, 0);
      const pastLaborCosts = project.rapportini.reduce((sum, r) => {
          return sum + r.lavoratori.reduce((subSum, rl) => subSum + (rl.ore * (rl.lavoratore?.costoOrario || 30)), 0);
      }, 0);

      const totalSpent = pastFatturiCosi + pastLaborCosts;
      if (totalSpent + rapportinoLaborCost > project.budget) {
          if (session.role !== 'ADMIN') {
              throw new Error(`HARD BUDGET BLOCK: Budget superato. Contatta la Direzione.`);
          } else {
              await logAuditEvent('BUDGET_OVERRIDE', `PROJECT_ID:${projectId}`, `Admin ha autorizzato over-budget.`, session.userId);
          }
      }
  }

  const rapportino = await prisma.rapportino.create({
    data: {
      projectId,
      data,
      attivita,
      note,
      mezzi,
      materiali,
      latitude,
      longitude,
      aiSafetyCheck,
      photos,
      lavoratori: {
        create: lavoratori.map(l => ({ lavoratoreId: l.lavoratoreId, ore: l.ore })),
      },
      attrezzature: {
        create: attrezzature.map(a => ({ attrezzaturaId: a.attrezzaturaId, oreUtilizzo: a.oreUtilizzo })),
      },
      articoliMagazzino: {
        create: articoli.map(a => ({ articoloMagazzinoId: a.articoloMagazzinoId, quantita: a.quantita })),
      },
    },
  });

  await logAuditEvent('CREATE_RAPPORTINO', `RAPPORTINO_ID:${rapportino.id}`, `Creato rapportino per ${attivita}`, session.userId);

  if (signatureData) {
    await prisma.digitalSignature.create({
      data: {
        signatureData,
        signerName,
        role: 'OPERAIO', // Default for rapportino
        rapportinoId: rapportino.id
      }
    });
  }

  // Aggiorna giacenze magazzino (decrementa)
  for (const a of articoli) {
    await prisma.articoloMagazzino.update({
      where: { id: a.articoloMagazzinoId },
      data: { giacenza: { decrement: a.quantita } }
    });
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteRapportino(id: string, projectId: string) {
  const session = await getServerSession();
  if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo gli ADMIN possono eliminare rapportini.");

  await prisma.rapportino.delete({ where: { id } });
  await logAuditEvent('DELETE_RAPPORTINO', `RAPPORTINO_ID:${id}`, `Eliminato rapportino`, session.userId);
  revalidatePath(`/projects/${projectId}`);
}

// ─── DDT ──────────────────────────────────────────────────────────────────

export async function getDdts(projectId: string) {
  return prisma.ddt.findMany({
    where: { projectId },
    include: { articoli: true, signature: true },
    orderBy: { data: 'desc' },
  });
}

export async function createDdt(projectId: string, formData: FormData) {
  const numeroDdt = formData.get('numeroDdt') as string;
  const fornitoreId = formData.get('fornitoreId') as string;
  const fornitoreName = (formData.get('fornitoreName') as string) || (formData.get('fornitore') as string);
  const data = new Date(formData.get('data') as string);
  const note = (formData.get('note') as string) || undefined;
  const importo = formData.get('importo') ? parseFloat(formData.get('importo') as string) : undefined;
  const signatureData = formData.get('signatureData') as string;

  const ddt = await prisma.ddt.create({
    data: { 
      projectId, 
      numeroDdt, 
      fornitoreId: fornitoreId || undefined, 
      fornitoreName, 
      data, 
      note, 
      importo 
    },
  });

  if (signatureData) {
    await prisma.digitalSignature.create({
      data: {
        signatureData,
        signerName: fornitoreName,
        role: 'FORNITORE',
        ddtId: ddt.id
      }
    });
  }

  if (fornitoreId) {
    await prisma.fornitore.update({
      where: { id: fornitoreId },
      data: { totalOrders: { increment: 1 } }
    });
  }

  revalidatePath(`/projects/${projectId}`);
  return ddt;
}

export async function deleteDdt(id: string, projectId: string) {
  const session = await getServerSession();
  if (session.role !== 'ADMIN') throw new Error("AUTHORIZATION ERROR: Solo gli ADMIN possono eliminare DDT.");

  await prisma.ddt.delete({ where: { id } });
  await logAuditEvent('DELETE_DDT', `DDT_ID:${id}`, `Eliminato DDT`, session.userId);
  revalidatePath(`/projects/${projectId}`);
}

// ─── SAL ──────────────────────────────────────────────────────────────────

export async function getSals(projectId: string) {
  return prisma.sal.findMany({
    where: { projectId },
    include: { voci: true },
    orderBy: { numero: 'asc' },
  });
}

export async function createSal(projectId: string, formData: FormData) {
  const data = new Date(formData.get('data') as string);
  const note = (formData.get('note') as string) || undefined;
  const importo = parseFloat(formData.get('importo') as string) || 0;

  // Numero progressivo automatico
  const last = await prisma.sal.findFirst({
    where: { projectId },
    orderBy: { numero: 'desc' },
  });
  const numero = (last?.numero ?? 0) + 1;

  const vociRaw = formData.get('voci') as string;
  let voci: { descrizione: string; percentuale: number; importoVoce: number }[] = [];
  try {
    voci = JSON.parse(vociRaw || '[]');
  } catch {}

  await prisma.sal.create({
    data: {
      projectId,
      numero,
      data,
      note,
      importo,
      voci: { create: voci },
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteSal(id: string, projectId: string) {
  await prisma.sal.delete({ where: { id } });
  revalidatePath(`/projects/${projectId}`);
}

// ─── Previsionale ─────────────────────────────────────────────────────────

export async function getPrevisionali(projectId: string) {
  return prisma.previsionale.findMany({
    where: { projectId },
    orderBy: { data: 'asc' },
  });
}

export async function createPrevisionale(projectId: string, formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const categoria = (formData.get('categoria') as string) || undefined;
  const data = new Date(formData.get('data') as string);
  const importo = parseFloat(formData.get('importo') as string);
  const descrizione = (formData.get('descrizione') as string) || undefined;

  await prisma.previsionale.create({
    data: { projectId, tipo, categoria, data, importo, descrizione },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function deletePrevisionale(id: string, projectId: string) {
  await prisma.previsionale.delete({ where: { id } });
  revalidatePath(`/projects/${projectId}`);
}

// ─── Aggiorna campi cantiere ───────────────────────────────────────────────

export async function updateProjectCantiere(id: string, formData: FormData) {
  const committente = (formData.get('committente') as string) || undefined;
  const indirizzo = (formData.get('indirizzo') as string) || undefined;
  const citta = (formData.get('citta') as string) || undefined;
  const cap = (formData.get('cap') as string) || undefined;

  await prisma.project.update({
    where: { id },
    data: { committente, indirizzo, citta, cap },
  });

  revalidatePath(`/projects/${id}`);
}

// ─── Documents ─────────────────────────────────────────────────────────────

export async function getProjectDocuments(projectId: string) {
  return prisma.projectDocument.findMany({
    where: { projectId },
    include: { versions: { orderBy: { versionNumber: 'desc' } } },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createProjectDocument(projectId: string, formData: FormData) {
  const session = await getServerSession();
  const name = formData.get('name') as string;
  const category = (formData.get('category') as string) || "TECHNICAL";
  const fileUrl = (formData.get('fileUrl') as string) || "";
  const notes = (formData.get('notes') as string) || "";

  const doc = await prisma.projectDocument.create({
    data: {
      projectId,
      name,
      category,
      status: 'PENDING',
      versions: {
        create: {
          versionNumber: 1,
          fileUrl,
          notes,
          uploadedBy: session.userName || session.userId,
        }
      }
    }
  });

  await logAuditEvent('CREATE_DOCUMENT', `DOC_ID:${doc.id}`, `Caricato documento: ${name}`, session.userId);
  revalidatePath(`/projects/${projectId}`);
  return doc;
}

export async function addDocumentVersion(docId: string, projectId: string, formData: FormData) {
  const session = await getServerSession();
  const fileUrl = formData.get('fileUrl') as string;
  const notes = formData.get('notes') as string;

  const lastVersion = await prisma.documentVersion.findFirst({
    where: { documentId: docId },
    orderBy: { versionNumber: 'desc' },
  });

  const nextVersion = (lastVersion?.versionNumber ?? 0) + 1;

  await prisma.documentVersion.create({
    data: {
      documentId: docId,
      versionNumber: nextVersion,
      fileUrl,
      notes,
      uploadedBy: session.userName || session.userId,
    }
  });

  await prisma.projectDocument.update({
    where: { id: docId },
    data: { updatedAt: new Date() }
  });

  await logAuditEvent('UPDATE_DOCUMENT_VERSION', `DOC_ID:${docId}`, `Nuova versione ${nextVersion} caricata`, session.userId);
  revalidatePath(`/projects/${projectId}`);
}

// ─── RFIs ──────────────────────────────────────────────────────────────────

export async function getProjectRFIs(projectId: string) {
  return prisma.rFI.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createRFI(projectId: string, formData: FormData) {
  const session = await getServerSession();
  const title = formData.get('title') as string;
  const question = formData.get('question') as string;
  const priority = (formData.get('priority') as string) || "MEDIUM";
  const dueDateRaw = formData.get('dueDate') as string;
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : undefined;

  const lastRFI = await prisma.rFI.findFirst({
    where: { projectId },
    orderBy: { number: 'desc' },
  });
  const number = (lastRFI?.number ?? 0) + 1;

  const rfi = await prisma.rFI.create({
    data: {
      projectId,
      number,
      title,
      question,
      priority,
      dueDate,
    }
  });

  await logAuditEvent('CREATE_RFI', `RFI_ID:${rfi.id}`, `Creata RFI #${number}: ${title}`, session.userId);
  revalidatePath(`/projects/${projectId}`);
  return rfi;
}

export async function updateRFI(id: string, projectId: string, formData: FormData) {
  const session = await getServerSession();
  const answer = formData.get('answer') as string;
  const status = formData.get('status') as string;

  await prisma.rFI.update({
    where: { id },
    data: {
      answer,
      status,
      answeredAt: status === 'CLOSED' || status === 'ANSWERED' ? new Date() : undefined,
      answeredBy: session.userName || session.userId,
    }
  });

  await logAuditEvent('UPDATE_RFI', `RFI_ID:${id}`, `Aggiornata RFI status: ${status}`, session.userId);
  revalidatePath(`/projects/${projectId}`);
}

export async function generateFatturaFromSal(salId: string, projectId: string) {
  const session = await getServerSession();
  
  const sal = await prisma.sal.findUnique({
    where: { id: salId },
    include: { project: true }
  });

  if (!sal) throw new Error("SAL non trovato");
  if (!sal.project) throw new Error("Cantiere non trovato");

  // Generazione automatica numero fattura (es: FPA-12/26)
  const lastFattura = await prisma.fattura.findFirst({
    where: { tipo: 'ATTIVA' },
    orderBy: { numero: 'desc' }
  });

  const nextNum = lastFattura ? parseInt(lastFattura.numero.split('-')[1] || '0') + 1 : 1;
  const anno = new Date().getFullYear().toString().slice(2);
  const numero = `FPA-${nextNum}/${anno}`;

  const importo = sal.importo;
  const iva = 22;
  const totale = importo + (importo * iva / 100);

  const fattura = await prisma.fattura.create({
    data: {
      numero,
      tipo: 'ATTIVA',
      soggetto: sal.project.committente || 'Committente',
      dataEmissione: new Date(),
      dataScadenza: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30gg
      importo,
      iva,
      totale,
      note: `Fattura generata automaticamente da SAL n. ${sal.numero} del Cantiere: ${sal.project.name}`,
      stato: 'DA_INCASSARE',
      projects: {
        connect: [{ id: projectId }]
      }
    }
  });

  await logAuditEvent('CREATE_FATTURA_DA_SAL', `FATTURA_ID:${fattura.id}`, `Generata fattura da SAL ${sal.numero}`, session.userId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/fatture`);
  return fattura.id;
}
