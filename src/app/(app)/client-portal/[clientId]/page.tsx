import { getClientDashboardData } from '../actions';
import { notFound } from 'next/navigation';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  Receipt,
  Building2,
  TrendingUp
} from 'lucide-react';
import PrintButton from '@/components/PrintButton';

export default async function ClientDashboardPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const data = await getClientDashboardData(clientId);
  
  if (!data) notFound();

  const totalBudget = data.projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSAL = data.projects.reduce((acc, p) => acc + p.sal.reduce((s, sal) => s + sal.importo, 0), 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 bg-[#003F61]" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Area Riservata Committente
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" /> Accesso Verificato
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
            Benvenuto, {data.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Panoramica esecutiva e avanzamento economico-lavorativo delle tue commesse.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003F61] text-[#FEDE59] flex items-center justify-center font-bold text-lg">
              {data.name[0]}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Codice Fiscale / P.IVA</div>
              <div className="text-xs font-mono font-bold text-slate-800">{data.taxId}</div>
            </div>
          </div>
          <PrintButton label="Stampa Riepilogo" className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider" />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cantieri in Gestione</span>
            <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
              <Briefcase size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61]">{data.projects.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Commesse attive a tuo nome</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Totale Certificato (SAL)</span>
            <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">
              € {totalSAL.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Lavorazioni eseguite e certificate</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Budget Totale Contratti</span>
            <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
              <Building2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              € {totalBudget.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Valore contrattuale complessivo</div>
          </div>
        </div>
      </div>

      {/* 3. Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.projects.map(project => {
          const projectSAL = project.sal.reduce((sum, s) => sum + s.importo, 0);
          const budget = project.budget || 0;
          const progress = budget > 0 ? Math.min(100, Math.round((projectSAL / budget) * 100)) : 0;
          
          return (
            <div key={project.id} className="bg-white border border-slate-200 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#003F61]">{project.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin size={13} className="text-slate-400" />
                      {[project.indirizzo, project.citta].filter(Boolean).join(', ') || 'Indirizzo cantiere'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                    project.status === 'ONGOING'
                      ? 'bg-blue-50 text-[#003F61] border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {project.status === 'ONGOING' ? 'In Opera' : 'Completato'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="bg-slate-50 border border-slate-100 p-4">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">Avanzamento SAL</span>
                    <span className="font-bold text-[#003F61]">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2">
                    <div className="bg-[#003F61] h-2 transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Economic breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificato Emesso</span>
                    <span className="text-base font-bold text-emerald-700">€ {projectSAL.toLocaleString('it-IT')}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Budget Contrattuale</span>
                    <span className="text-base font-bold text-slate-800">€ {budget.toLocaleString('it-IT')}</span>
                  </div>
                </div>
              </div>

              {/* Timeline pills */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  Avvio: {new Date(project.startDate).toLocaleDateString('it-IT')}
                </span>
                {project.ddts.length > 0 && (
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <FileText size={13} className="text-slate-400" /> {project.ddts.length} DDT
                  </span>
                )}
                {project.fatture.length > 0 && (
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Receipt size={13} className="text-slate-400" /> {project.fatture.length} Fatture
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Transparency banner */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#003F61] text-[#FEDE59] flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Garanzia di Trasparenza Cantieri EDILMANAGER24</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tutti i dati di cantiere sono sincronizzati in tempo reale con i rapportini tecnici certificati della direzione lavori.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
