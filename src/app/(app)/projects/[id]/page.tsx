import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, User, Edit,
  Wallet, Calendar, Clock, HardHat, CheckCircle,
  AlertCircle, Globe, ArrowRight, TrendingUp,
  Activity, Shield
} from 'lucide-react';
import ItemsManager from '../ItemsManager';
import ProjectTabs from '../ProjectTabs';
import RapportiniTab from '../RapportiniTab';
import DdtTab from '../DdtTab';
import SalTab from '../SalTab';
import PrevisionaleTab from '../PrevisionaleTab';
import GanttTab from '../GanttTab';
import DocumentsTab from '../DocumentsTab';
import RfiTab from '../RfiTab';
import BudgetAnalysisTab from '../BudgetAnalysisTab';
import { getLavoratori } from '@/app/(app)/lavoratori-actions';
import { getServerSession } from '@/lib/auth-server';
import SiteDiary from '@/components/SiteDiary';
import SafetyTab from '@/components/SafetyTab';
import PrintButton from '@/components/PrintButton';
import ClientPortalActivator from '@/components/ClientPortalActivator';
import { getFornitori } from '@/app/(app)/fornitori-actions';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession();
  const [project, allLavoratori, allArticoli, allAttrezzature, allFornitori] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        items: { orderBy: { createdAt: 'asc' } },
        rapportini: {
          include: { 
            lavoratori: { include: { lavoratore: true } },
            attrezzature: { include: { attrezzatura: true } },
            articoliMagazzino: { include: { articoloMagazzino: true } }
          },
          orderBy: { data: 'desc' },
        },
        ddts: {
          include: { articoli: true, fornitore: true },
          orderBy: { data: 'desc' },
        },
        sal: {
          include: { voci: true },
          orderBy: { numero: 'asc' },
        },
        previsionali: { orderBy: { data: 'asc' } },
        updates: { orderBy: { createdAt: 'desc' } },
        safetyPlans: { orderBy: { updatedAt: 'desc' } },
        documents: {
          include: { versions: { orderBy: { versionNumber: 'desc' } } },
          orderBy: { updatedAt: 'desc' }
        },
        rfis: { orderBy: { createdAt: 'desc' } },
        lavoratori: true,
        attrezzature: true
      },
    }),
    getLavoratori(),
    prisma.articoloMagazzino.findMany({ orderBy: { nome: 'asc' } }),
    prisma.attrezzatura.findMany({ orderBy: { nome: 'asc' } }),
    getFornitori()
  ]);

  if (!project) notFound();

  const completedItems = project.items.filter(i => i.completed).length;
  const totalItems = project.items.length;
  const completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const totalOre = project.rapportini.reduce(
    (s, r) => s + r.lavoratori.reduce((h, l) => h + l.ore, 0),
    0
  );
  const totaleAccertato = project.sal.reduce((s, sal) => s + sal.importo, 0);

  const statusLabels: Record<string, { label: string; color: string }> = {
    PROGRAMMATO: { label: 'Programmato', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ONGOING: { label: 'In Corso', color: 'bg-blue-50 text-[#003F61] border-blue-200' },
    COMPLETED: { label: 'Concluso', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };
  const statusInfo = statusLabels[project.status] ?? { label: project.status, color: 'bg-slate-50 text-slate-600 border-slate-200' };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-start gap-4">
          <Link 
            href="/projects" 
            className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shrink-0"
            title="Torna ai Cantieri"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 bg-[#003F61]" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Commessa Attiva
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-slate-400" />
                <Link href={`/clients/${project.client.id}`} className="hover:text-[#003F61] font-semibold text-slate-700 underline">
                  {project.client.name}
                </Link>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                <span>{[project.indirizzo, project.citta].filter(Boolean).join(', ') || 'Nessun indirizzo'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PrintButton label="Stampa Scheda" className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider" />
          <Link
            href={`/projects/${project.id}/edit`}
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Edit size={15} /> Modifica Dati
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Budget Totale</span>
            <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61]">
              {project.budget ? `€ ${project.budget.toLocaleString('it-IT')}` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Valore contrattuale approvato</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avanzamento Lavori</span>
            <div className="p-2 bg-blue-50 border border-blue-100 text-[#003F61]">
              <Activity size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61]">{completion}%</div>
            <div className="w-full bg-slate-100 h-1.5 mt-2">
              <div className="bg-[#003F61] h-1.5" style={{ width: `${completion}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{completedItems} su {totalItems} lavorazioni completate</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ore Lavorate</span>
            <div className="p-2 bg-slate-50 border border-slate-100 text-slate-600">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalOre.toFixed(0)} h</div>
            <div className="text-[11px] text-slate-500 mt-1">Manodopera consuntivata da rapportini</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Produzione Certificata</span>
            <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">
              € {totaleAccertato.toLocaleString('it-IT')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Totale SAL accertati ed emessi</div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Tabs */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <ProjectTabs>
            {/* 0: Panoramica */}
            <div className="bg-white border border-slate-200 p-6 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-sm font-bold text-[#003F61] uppercase tracking-wider">
                  Specifiche Tecniche Commessa
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Committente</span>
                  <span className="text-sm font-semibold text-slate-900">{project.committente || project.client.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ubicazione Cantiere</span>
                  <span className="text-sm font-semibold text-slate-900">{project.indirizzo ? `${project.indirizzo}, ${project.citta || ''}` : 'Non definito'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Data Consegna Cantiere</span>
                  <span className="text-sm font-semibold text-slate-900">{new Date(project.startDate).toLocaleDateString('it-IT')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Data Fine Lavori Stimata</span>
                  <span className="text-sm font-semibold text-slate-900">{project.endDate ? new Date(project.endDate).toLocaleDateString('it-IT') : 'In programmazione'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lavorazioni Esecutive</span>
                  <span className="text-sm font-semibold text-slate-900">{completedItems} completate / {totalItems} totali</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rapportini Giornalieri</span>
                  <span className="text-sm font-semibold text-slate-900">{project.rapportini.length} inseriti</span>
                </div>
              </div>

              {project.description && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Note & Prescrizioni Esecutive</span>
                  <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
                </div>
              )}
            </div>

            {/* 1: Site Feed */}
            <SiteDiary projectId={project.id} updates={project.updates as any} isManager={session.role !== 'OPERAIO'} />

            {/* 2: Sicurezza */}
            <SafetyTab projectId={project.id} projectName={project.name} lavoratori={(project as any).lavoratori as any} attrezzature={(project as any).attrezzature as any} plans={project.safetyPlans as any} />

            {/* 3: Documenti */}
            <DocumentsTab projectId={project.id} documents={project.documents as any} />

            {/* 4: RFIs */}
            <RfiTab projectId={project.id} rfis={project.rfis as any} />

            {/* 5: Budget AI */}
            <BudgetAnalysisTab projectId={project.id} />

            {/* 6: GANTT */}
            <GanttTab project={project as any} items={project.items as any} />

            {/* 7: Lavorazioni */}
            <ItemsManager projectId={project.id} items={project.items} />

            {/* 8: Rapportini */}
            <RapportiniTab 
              projectId={project.id} 
              rapportini={project.rapportini as any} 
              allLavoratori={allLavoratori as any} 
              allArticoli={allArticoli as any} 
              allAttrezzature={allAttrezzature as any}
              projectLat={project.latitude}
              projectLng={project.longitude}
            />

            {/* 9: DDT */}
            <DdtTab projectId={project.id} ddts={project.ddts as any} allFornitori={allFornitori as any} />

            {/* 10: SAL */}
            <SalTab projectId={project.id} sals={project.sal as any} budgetTotale={project.budget ?? 0} />

            {/* 11: Previsionale */}
            <PrevisionaleTab projectId={project.id} previsionali={project.previsionali as any} />
          </ProjectTabs>
        </div>

        {/* Right Side: Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Stakeholder Card */}
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#003F61] uppercase tracking-wider flex items-center gap-2">
                <User size={15} /> Scheda Committente
              </h3>
              {project.client.number && (
                <span className="text-[10px] font-bold text-slate-500">#{project.client.number}</span>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Link href={`/clients/${project.client.id}`} className="text-base font-bold text-slate-900 hover:text-[#003F61] block">
                  {project.client.name}
                </Link>
                <span className="inline-block mt-1 text-[10px] font-bold text-[#003F61] bg-slate-100 px-2 py-0.5 uppercase tracking-wider">
                  {project.client.type === 'COMPANY' ? 'Azienda' : 'Privato'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {project.client.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{project.client.email}</span>
                  </div>
                )}
                {project.client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{project.client.phone}</span>
                  </div>
                )}
                {project.client.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{project.client.city}</span>
                  </div>
                )}
              </div>

              <Link
                href={`/clients/${project.client.id}`}
                className="w-full h-9 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                Apri Scheda Cliente <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* External Portal */}
          <div className="bg-[#003F61] text-white p-5 border border-[#003F61]">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={18} className="text-[#FEDE59]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Portale Trasparenza</h3>
            </div>
            
            {project.portalKey ? (
              <div className="space-y-3">
                <p className="text-xs text-white/80 leading-relaxed">
                  Accesso sicuro attivo per il committente.
                </p>
                <div className="bg-white/10 p-2.5 text-[11px] font-mono border border-white/20 select-all truncate text-white/90">
                  /portal/{project.portalKey}
                </div>
                <Link
                  href={`/portal/${project.portalKey}`}
                  target="_blank"
                  className="w-full h-10 bg-[#FEDE59] text-[#003F61] hover:bg-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  Visualizza Portale <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-white/70">
                  Nessun link esterno configurato per questa commessa.
                </p>
                <ClientPortalActivator projectId={project.id} />
              </div>
            )}
          </div>

          {/* Safety Status */}
          <div className="bg-white border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Conformità Sicurezza</h3>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">POS & Normativa 81/08</span>
              <span className="text-sm font-bold text-emerald-700">Attivo & Conforme</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Nessun incidente o prescrizione aperta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
