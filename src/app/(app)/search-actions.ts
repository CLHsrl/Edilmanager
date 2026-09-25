'use server';

import { prisma } from '@/lib/prisma';

export type SearchResultCategory = 
  | 'CANTIERI' 
  | 'FATTURE' 
  | 'CLIENTI' 
  | 'FORNITORI' 
  | 'PERSONALE' 
  | 'MAGAZZINO';

export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  category: SearchResultCategory;
  url: string;
  badge?: string;
  badgeColor?: string;
  detail?: string;
};

export async function searchGlobal(query: string, filterCategory: string = 'ALL'): Promise<SearchResultItem[]> {
  const q = (query || '').trim();
  if (!q && filterCategory === 'ALL') {
    // Return recent high-priority items
    const [recentProjects, recentFatture] = await Promise.all([
      prisma.project.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { name: true } } }
      }),
      prisma.fattura.findMany({
        take: 3,
        orderBy: { dataEmissione: 'desc' }
      })
    ]);

    const results: SearchResultItem[] = [];

    recentProjects.forEach(p => {
      results.push({
        id: `project-${p.id}`,
        title: p.name,
        subtitle: p.client?.name ? `Committente: ${p.client.name}` : (p.indirizzo || 'Cantiere attivo'),
        category: 'CANTIERI',
        url: `/projects/${p.id}`,
        badge: p.status === 'ONGOING' ? 'In Corso' : p.status,
        badgeColor: p.status === 'ONGOING' ? 'bg-blue-50 text-[#003F61] border-blue-200' : 'bg-slate-100 text-slate-700'
      });
    });

    recentFatture.forEach(f => {
      results.push({
        id: `fattura-${f.id}`,
        title: `Fattura #${f.numero} - ${f.soggetto}`,
        subtitle: `${f.tipo} • € ${f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
        category: 'FATTURE',
        url: `/fatture/${f.id}`,
        badge: f.stato,
        badgeColor: f.stato === 'PAGATA' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      });
    });

    return results;
  }

  const results: SearchResultItem[] = [];
  const limitPerCategory = 6;

  // Search Cantieri
  if (filterCategory === 'ALL' || filterCategory === 'CANTIERI') {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { indirizzo: { contains: q, mode: 'insensitive' } },
          { citta: { contains: q, mode: 'insensitive' } },
          { committente: { contains: q, mode: 'insensitive' } },
          { client: { name: { contains: q, mode: 'insensitive' } } }
        ]
      },
      take: limitPerCategory,
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { name: true } } }
    });

    projects.forEach(p => {
      results.push({
        id: `project-${p.id}`,
        title: p.name,
        subtitle: [p.client?.name, p.indirizzo || p.citta].filter(Boolean).join(' • ') || 'Commessa',
        category: 'CANTIERI',
        url: `/projects/${p.id}`,
        badge: p.status === 'ONGOING' ? 'In Corso' : p.status,
        badgeColor: p.status === 'ONGOING' ? 'bg-blue-50 text-[#003F61] border-blue-200' : 'bg-slate-100 text-slate-700',
        detail: p.budget ? `€ ${p.budget.toLocaleString('it-IT')}` : undefined
      });
    });
  }

  // Search Fatture
  if (filterCategory === 'ALL' || filterCategory === 'FATTURE') {
    const fatture = await prisma.fattura.findMany({
      where: {
        OR: [
          { numero: { contains: q, mode: 'insensitive' } },
          { soggetto: { contains: q, mode: 'insensitive' } },
          { note: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: limitPerCategory,
      orderBy: { dataEmissione: 'desc' }
    });

    fatture.forEach(f => {
      results.push({
        id: `fattura-${f.id}`,
        title: `Fattura #${f.numero} - ${f.soggetto}`,
        subtitle: `${f.tipo} • Emessa: ${new Date(f.dataEmissione).toLocaleDateString('it-IT')}`,
        category: 'FATTURE',
        url: `/fatture/${f.id}`,
        badge: f.stato,
        badgeColor: f.stato === 'PAGATA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
        detail: `€ ${f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`
      });
    });
  }

  // Search Clienti
  if (filterCategory === 'ALL' || filterCategory === 'CLIENTI') {
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { taxId: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: limitPerCategory,
      orderBy: { createdAt: 'desc' }
    });

    clients.forEach(c => {
      results.push({
        id: `client-${c.id}`,
        title: c.name,
        subtitle: [c.city, c.email || c.phone].filter(Boolean).join(' • ') || 'Committente',
        category: 'CLIENTI',
        url: `/clients/${c.id}`,
        badge: c.type === 'COMPANY' ? 'Azienda' : 'Privato',
        badgeColor: c.type === 'COMPANY' ? 'bg-blue-50 text-[#003F61] border-blue-200' : 'bg-slate-100 text-slate-700',
        detail: c.taxId || undefined
      });
    });
  }

  // Search Fornitori
  if (filterCategory === 'ALL' || filterCategory === 'FORNITORI') {
    const fornitori = await prisma.fornitore.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { ragioneSociale: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { vatId: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: limitPerCategory,
      orderBy: { createdAt: 'desc' }
    });

    fornitori.forEach(f => {
      results.push({
        id: `fornitore-${f.id}`,
        title: f.ragioneSociale || f.name,
        subtitle: [f.category, f.vatId].filter(Boolean).join(' • ') || 'Fornitore / Subappalto',
        category: 'FORNITORI',
        url: `/fornitori`,
        badge: f.tipo === 'SUBAPPALTATORE' ? 'Subappalto' : 'Fornitore',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
      });
    });
  }

  // Search Personale
  if (filterCategory === 'ALL' || filterCategory === 'PERSONALE') {
    const lavoratori = await prisma.lavoratore.findMany({
      where: {
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { cognome: { contains: q, mode: 'insensitive' } },
          { tipo: { contains: q, mode: 'insensitive' } },
          { livello: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: limitPerCategory,
      orderBy: { createdAt: 'desc' }
    });

    lavoratori.forEach(l => {
      results.push({
        id: `lavoratore-${l.id}`,
        title: `${l.nome} ${l.cognome || ''}`.trim(),
        subtitle: [l.livello, l.tipo].filter(Boolean).join(' • ') || 'Personale',
        category: 'PERSONALE',
        url: `/lavoratori`,
        badge: l.tipo === 'DIPENDENTE' ? 'Dipendente' : 'Collaboratore',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
      });
    });
  }

  // Search Magazzino
  if (filterCategory === 'ALL' || filterCategory === 'MAGAZZINO') {
    const articoli = await prisma.articoloMagazzino.findMany({
      where: {
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { codice: { contains: q, mode: 'insensitive' } },
          { categoria: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: limitPerCategory,
      orderBy: { nome: 'asc' }
    });

    articoli.forEach(a => {
      const costo = a.costoUnitario || 0;
      results.push({
        id: `articolo-${a.id}`,
        title: a.nome,
        subtitle: `Cod: ${a.codice || 'N/A'} • Cat: ${a.categoria || 'Generale'}`,
        category: 'MAGAZZINO',
        url: `/magazzino`,
        badge: `Giacenza: ${a.giacenza} ${a.unitaMisura}`,
        badgeColor: a.giacenza <= (a.livelloScortaMin || 0) ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700',
        detail: `Costo: € ${costo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`
      });
    });
  }

  return results;
}
