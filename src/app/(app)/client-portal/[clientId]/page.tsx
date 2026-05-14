import { getClientDashboardData } from '../actions';
import { notFound } from 'next/navigation';
import { 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  ImageIcon,
  Receipt
} from 'lucide-react';
import PrintButton from '@/components/PrintButton';

export default async function ClientDashboardPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const data = await getClientDashboardData(clientId);
  
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f8fafc] p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600/20 text-blue-500 p-2 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Accesso Protetto Certificato</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Benvenuto, {data.name}</h1>
            <p className="text-gray-500 font-medium">Panoramica executive dei tuoi cantieri in corso.</p>
          </div>
          <div className="bg-[#11141b] border border-[#1e232d] p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">
              {data.name[0]}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#64748b]">ID Committente</p>
              <p className="text-sm font-bold text-[#94a3b8]">{data.taxId}</p>
            </div>
          </div>
        </header>

        {/* Dynamic Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.projects.map(project => {
            const totalSAL = project.sal.reduce((sum, s) => sum + s.importo, 0);
            const budget = project.budget || 0;
            const progress = budget > 0 ? (totalSAL / budget) * 100 : 0;
            
            return (
              <div key={project.id} className="relative group overflow-hidden bg-[#11141b] border border-[#1e232d] rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-20 transition-all">
                  <Briefcase size={120} className="text-blue-500" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Project Status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-black tracking-tight mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 font-medium italic mb-4">
                        <MapPin size={14} className="text-blue-500" /> {project.indirizzo}, {project.citta}
                      </p>
                      <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        project.status === 'ONGOING' ? 'bg-blue-600/10 text-blue-500' : 'bg-green-600/10 text-green-500'
                      }`}>
                         ● Stato: {project.status === 'ONGOING' ? 'In Opera' : 'Completato'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Horizon */}
                  <div className="space-y-3 bg-[#0a0c10]/50 p-6 rounded-3xl border border-[#1e232d]">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Avanzamento Certificato (SAL)</p>
                      <p className="text-xl font-black text-blue-500">{progress.toFixed(0)}%</p>
                    </div>
                    <div className="h-4 bg-[#1e232d] rounded-full overflow-hidden p-1 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 shadow-lg shadow-blue-600/20" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0c10]/50 p-6 rounded-3xl border border-[#1e232d]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Certificazioni Emesse</p>
                      <p className="text-2xl font-black text-[#f1f5f9]">€ {totalSAL.toLocaleString('it-IT')}</p>
                    </div>
                    <div className="bg-[#0a0c10]/50 p-6 rounded-3xl border border-[#1e232d]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Budget Stimato</p>
                      <p className="text-2xl font-black text-[#64748b]">€ {budget.toLocaleString('it-IT')}</p>
                    </div>
                  </div>

                  {/* Timeline & Documents */}
                  <div className="flex flex-wrap gap-4 pt-4 no-print">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-[#0a0c10]/40 px-4 py-2 rounded-xl">
                      <Calendar size={14} className="text-blue-500" />
                      Inizio: {new Date(project.startDate).toLocaleDateString('it-IT')}
                    </div>
                    {project.ddts.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                        <FileText size={14} /> {project.ddts.length} DDT Disponibili
                      </div>
                    )}
                    {project.fatture.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                        <Receipt size={14} /> {project.fatture.length} Fatture
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Transparency Alert */}
        <div className="bg-gradient-to-br from-[#11141b] to-[#0a0c10] border-2 border-dashed border-blue-500/20 rounded-[3rem] p-10 text-center space-y-4">
           <div className="bg-blue-600 inline-flex p-4 rounded-3xl mb-4 shadow-2xl shadow-blue-500/20">
              <CheckCircle2 size={32} className="text-white" />
           </div>
           <h3 className="text-2xl font-black tracking-tight">Trasparenza Totale Garantita</h3>
           <p className="max-w-2xl mx-auto text-[#64748b] font-medium leading-relaxed">
             Tutti i dati visualizzati provengono in tempo reale dai rapportini firmati digitalmente dai nostri operatori sul campo.
             Certifichiamo ogni ora di lavoro tramite geolocalizzazione GPS per la vostra massima tranquillità.
           </p>
           <PrintButton label="Scarica Report Riepilogativo" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
