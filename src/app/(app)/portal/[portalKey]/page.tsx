import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  Building2, MapPin, Calendar, HardHat, 
  CheckCircle2, Clock, Phone, Mail, ShieldCheck,
  TrendingUp, Activity
} from 'lucide-react';
import Link from 'next/link';

export default async function ClientPortalPage({ params }: { params: Promise<{ portalKey: string }> }) {
  const { portalKey } = await params;

  const project = await prisma.project.findUnique({
    where: { portalKey },
    include: {
      client: true,
      items: { orderBy: { createdAt: 'asc' } },
      updates: { 
          where: { isVisibleToClient: true },
          orderBy: { createdAt: 'desc' } 
      },
      sal: { orderBy: { numero: 'desc' }, take: 1 }
    }
  });

  if (!project) notFound();

  const completedItems = project.items.filter(i => i.completed).length;
  const totalItems = project.items.length;
  const completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header Card */}
      <div className="bg-[#003F61] text-white p-6 border border-[#003F61] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[#FEDE59] text-[#003F61] text-[10px] font-bold uppercase tracking-wider">
              Portale Trasparenza Committente
            </span>
            <span className="text-white/60 text-xs flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#FEDE59]" /> Connessione Protetta
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {project.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#FEDE59]" /> {project.indirizzo || project.citta || 'Indirizzo in aggiornamento'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#FEDE59]" /> Avvio: {new Date(project.startDate).toLocaleDateString('it-IT')}
            </span>
          </div>
        </div>

        <div className="bg-white/10 border border-white/15 p-4 flex items-center gap-4 min-w-[220px]">
          <div className="text-3xl font-extrabold text-[#FEDE59]">
            {completion}%
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/70 font-bold">Avanzamento</div>
            <div className="text-xs text-white font-medium">Stato esecutivo certificato</div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avanzamento Globale</div>
          <div className="text-2xl font-bold text-[#003F61]">{completion}%</div>
          <div className="w-full bg-slate-100 h-1.5 mt-3">
            <div className="bg-[#003F61] h-1.5" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Budget Contrattuale</div>
          <div className="text-2xl font-bold text-slate-900">
            € {project.budget?.toLocaleString('it-IT') || '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Valore d'appalto concordato</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ultimo SAL Emesso</div>
          <div className="text-2xl font-bold text-emerald-700">
            {project.sal[0] ? `€ ${project.sal[0].importo.toLocaleString('it-IT')}` : 'In fase di elaborazione'}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Stato Avanzamento Lavori</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fasi Lavorative</div>
          <div className="text-2xl font-bold text-[#003F61]">
            {completedItems} / {totalItems}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Task esecutivi completati</div>
        </div>
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Site Activity Journal */}
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#003F61] uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> Giornale Lavori & Aggiornamenti
              </h3>
              <span className="text-xs text-slate-500">{project.updates.length} aggiornamenti</span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {project.updates.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Nessun aggiornamento di cantiere registrato al momento.
                </div>
              ) : (
                project.updates.map((u: any) => (
                  <div key={u.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {new Date(u.createdAt).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-bold uppercase tracking-wider">
                        Verificato
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {u.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Technical Milestones */}
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#003F61] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} /> Milestone Esecutive del Cantiere
              </h3>
              <span className="text-xs text-slate-500">{totalItems} voci d'opera</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      item.completed ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {item.completed ? 'Completato' : 'In Corso'}
                    </span>
                    {item.completed ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : (
                      <Clock size={16} className="text-slate-400" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Committente info */}
          <div className="bg-white border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-[#003F61] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 size={16} /> Dati Commessa
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Committente</span>
                <span className="font-semibold text-slate-900">{project.client?.name || project.committente || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Indirizzo Cantiere</span>
                <span className="font-semibold text-slate-900">{project.indirizzo || project.citta || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Data Inizio Lavori</span>
                <span className="font-semibold text-slate-900">{new Date(project.startDate).toLocaleDateString('it-IT')}</span>
              </div>
            </div>
          </div>

          {/* Direct Support */}
          <div className="bg-[#003F61] text-white p-5 border border-[#003F61]">
            <h3 className="text-xs font-bold text-[#FEDE59] uppercase tracking-wider mb-3">
              Assistenza Diretta Cantiere
            </h3>
            <p className="text-xs text-white/80 mb-4 leading-relaxed">
              Per chiarimenti sul cronoprogramma o richieste di variazione contatta direttamente la direzione tecnica.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+39000000000"
                className="h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Phone size={14} className="text-[#FEDE59]" /> Direzione Lavori
              </a>
              <a
                href="mailto:info@edilmanager.it"
                className="h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Mail size={14} className="text-[#FEDE59]" /> Contatto Mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
