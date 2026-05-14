import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, User, Edit,
  Wallet, Calendar, Clock, HardHat, CheckCircle,
  Home, AlertCircle, Globe, ArrowRight, TrendingUp,
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
    PROGRAMMATO: { label: 'Programmato', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    ONGOING: { label: 'In Corso', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    COMPLETED: { label: 'Concluso', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  };
  const statusInfo = statusLabels[project.status] ?? { label: project.status, color: 'bg-slate-50 text-slate-600 border-slate-200' };

  return (
    <div className="flex flex-col gap-10 reveal">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 no-print">
        <div className="flex gap-8 items-start">
          <Link href="/projects" className="p-5 bg-white hover:bg-slate-50 border border-slate-100 rounded-[1.5rem] shadow-sm transition-all text-slate-400 hover:text-slate-900 group">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="page-label m-0">
                <HardHat className="text-blue-600" size={14} />
                Asset Intel & Execution
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none max-w-3xl">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-6">
               <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <Link href={`/clients/${project.client.id}`} className="hover:text-blue-600 transition-colors text-slate-600">
                    {project.client.name}
                  </Link>
               </div>
               <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <MapPin size={16} className="text-slate-400" />
                  </div>
                  <span className="text-slate-600">{[project.indirizzo, project.citta].filter(Boolean).join(', ')}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 no-print w-full xl:w-auto">
          <PrintButton label="Report Tecnico" className="flex-1 xl:flex-none py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest" />
          <Link
            href={`/projects/${project.id}/edit`}
            className="flex-1 xl:flex-none bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all text-[10px] shadow-2xl transform active:scale-95"
          >
            <Edit size={16} /> Edit Asset
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 no-print">
         {[
           { label: 'Budget Totale', val: project.budget ? `€ ${project.budget.toLocaleString('it-IT')}` : '—', sub: 'Valore Contrattuale', icon: Wallet, color: 'blue' },
           { label: 'Avanzamento', val: `${completion}%`, sub: 'Work Progress', icon: Activity, color: 'emerald', progress: completion },
           { label: 'Capitale Umano', val: `${totalOre.toFixed(0)}h`, sub: 'Ore Consuntivate', icon: Clock, color: 'purple' },
           { label: 'Produzione Certificata', val: `€ ${totaleAccertato.toLocaleString('it-IT')}`, sub: 'Accertato SAL', icon: TrendingUp, color: 'orange' }
         ].map((kpi, idx) => (
           <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4" style={{ borderBottomColor: `var(--tw-color-${kpi.color}-500)` }}>
              <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                      <kpi.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              </div>
              <div className="space-y-4">
                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{kpi.val}</p>
                {kpi.progress !== undefined ? (
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${kpi.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${kpi.progress}%` }} />
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.sub}</p>
                )}
              </div>
           </div>
         ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side — Tabs */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <ProjectTabs>
            {/* 0: Panoramica */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-4">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                Specifiche Commessa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { label: 'Committente', val: project.committente || project.client.name },
                  { label: 'Cantiere', val: project.indirizzo ? `${project.indirizzo}, ${project.citta || ''}` : 'Non definito' },
                  { label: 'Apertura', val: new Date(project.startDate).toLocaleDateString('it-IT') },
                  { label: 'Consegna Stimata', val: project.endDate ? new Date(project.endDate).toLocaleDateString('it-IT') : 'Pending' },
                  { label: 'Stato Task', val: `${completedItems} completati su ${totalItems}` },
                  { label: 'Volume Rapportini', val: `${project.rapportini.length} registrati` }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                    <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.val}</p>
                  </div>
                ))}
              </div>
              {project.description && (
                <div className="mt-10 pt-10 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Visione & Note Strategiche</p>
                  <p className="text-base text-slate-600 font-medium leading-relaxed italic">"{project.description}"</p>
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

        {/* Right Side — Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-8">
          {/* Client Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group">
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h2 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                <User size={16} className="text-blue-400" /> Stakeholder
              </h2>
              {project.client.number && (
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black rounded-lg">
                  #{project.client.number}
                </span>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-900 font-black text-2xl border border-slate-100 shadow-inner group-hover:scale-110 transition-transform uppercase">
                  {project.client.name.charAt(0)}
                </div>
                <div>
                  <Link href={`/clients/${project.client.id}`} className="font-black text-xl text-slate-900 hover:text-blue-600 transition-colors block leading-none uppercase tracking-tighter">
                    {project.client.name}
                  </Link>
                  <span className="inline-block mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    {project.client.type === 'COMPANY' ? 'Professional' : 'Private'}
                  </span>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-50">
                {[
                  { icon: Mail, val: project.client.email },
                  { icon: Phone, val: project.client.phone },
                  { icon: MapPin, val: project.client.city }
                ].filter(i => i.val).map((info, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <info.icon size={16} className="text-slate-300" />
                    <span className="truncate">{info.val}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/clients/${project.client.id}`}
                className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-slate-100"
              >
                Vai al Profilo <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Portal Card */}
          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <Globe size={24} className="text-blue-400" />
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em]">External Portal</h3>
             </div>
             
             {project.portalKey ? (
               <div className="relative z-10">
                 <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">Accesso privilegiato attivato. Condividi il link sicuro con il committente per il monitoraggio in tempo reale.</p>
                 <div className="bg-white/5 rounded-2xl p-4 mb-6 truncate text-[10px] font-mono border border-white/10 select-all tracking-tight">
                    /portal/{project.portalKey}
                 </div>
                 <Link 
                    href={`/portal/${project.portalKey}`}
                    target="_blank"
                    className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                 >
                    Launch Portal <ArrowRight size={16} />
                 </Link>
               </div>
             ) : (
               <div className="relative z-10 text-center py-4">
                 <p className="text-xs font-medium text-slate-400 mb-6">Nessun accesso esterno configurato per questa commessa.</p>
                 <ClientPortalActivator projectId={project.id} />
               </div>
             )}
          </div>

          {/* Security Summary */}
          <div className="bg-emerald-900 rounded-[2.5rem] shadow-xl p-8 text-white group">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-emerald-400" />
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em]">Safety Status</h3>
            </div>
            <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">POS Compliance</p>
              <p className="text-xl font-black">Certificato 100%</p>
              <div className="h-1 bg-white/10 rounded-full mt-4">
                <div className="h-full bg-emerald-400 rounded-full w-full"></div>
              </div>
            </div>
            <p className="text-[9px] font-bold text-emerald-200 uppercase mt-6 tracking-widest text-center">Nessun incidente rilevato</p>
          </div>
        </div>
      </div>
    </div>
  );
}

