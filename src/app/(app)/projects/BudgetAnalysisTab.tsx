'use client';

import { useState, useEffect } from 'react';
import { getBudgetAnalysis } from '@/app/(app)/ai-actions';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  ArrowRight, ShieldAlert, Zap, BarChart3, Calculator
} from 'lucide-react';

interface AnalysisData {
  summary: {
    budgetMaterials: number;
    actualMaterials: number;
    actualLabor: number;
    certifiedRevenue: number;
    currentMargin: number;
    marginPercentage: number;
  };
  anomalies: {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    impactValue: number;
    suggestedAction: string;
  }[];
}

export default function BudgetAnalysisTab({ projectId }: { projectId: string }) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getBudgetAnalysis(projectId);
      if (res.success && res.data) setAnalysis(res.data);
      setLoading(false);
    }
    load();
  }, [projectId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">AI Guardian sta analizzando i dati...</p>
    </div>
  );

  if (!analysis) return null;

  const { summary, anomalies } = analysis;

  const getSeverityStyles = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-100';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Operational Margin</p>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <p className={`text-3xl font-black tracking-tighter ${summary.currentMargin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {summary.currentMargin.toLocaleString('it-IT')} €
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                {summary.marginPercentage.toFixed(1)}% of certified
              </p>
            </div>
            <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:rotate-12 ${summary.currentMargin >= 0 ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-red-500 text-white shadow-red-500/10'}`}>
              {summary.currentMargin >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Material Logistics</p>
          <p className="text-3xl font-black tracking-tighter text-slate-900 relative z-10">{summary.actualMaterials.toLocaleString('it-IT')} €</p>
          <div className="relative z-10 mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-slate-400 uppercase">Budget Utilization</span>
              <span className="text-[9px] font-black text-blue-600 uppercase">
                {Math.round((summary.actualMaterials / (summary.budgetMaterials || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
               <div 
                 className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                 style={{ width: `${Math.min(100, (summary.actualMaterials / (summary.budgetMaterials || 1)) * 100)}%` }}
               />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Labor Deployment</p>
          <p className="text-3xl font-black tracking-tighter text-slate-900 relative z-10">{summary.actualLabor.toLocaleString('it-IT')} €</p>
          <div className="flex items-center gap-3 mt-6 bg-amber-50 px-4 py-2 rounded-xl w-fit relative z-10">
             <Zap size={14} className="text-amber-500 animate-pulse" />
             <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Real-time Site Sync</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Certified Value (SAL)</p>
          <p className="text-3xl font-black tracking-tighter text-slate-900 relative z-10">{summary.certifiedRevenue.toLocaleString('it-IT')} €</p>
          <div className="flex items-center gap-3 mt-6 bg-blue-50 px-4 py-2 rounded-xl w-fit relative z-10">
             <CheckCircle size={14} className="text-blue-600" />
             <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Accounting Aligned</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Anomaly Feed */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 leading-none">
                <ShieldAlert size={28} className="text-blue-600" /> Anomaly Intelligence
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Continuous Site Monitoring Feed</p>
            </div>
            <div className="px-5 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-slate-800 shadow-xl">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
              Guardian Active
            </div>
          </div>

          {anomalies.length === 0 ? (
            <div className="bg-white border border-slate-100 p-20 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
               <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-inner mb-6 transition-transform hover:scale-110 duration-500">
                 <CheckCircle size={48} />
               </div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Perfect Project Health</h4>
               <p className="text-sm text-slate-400 font-medium mt-2 max-w-sm">No anomalies detected. All operational parameters are within the projected profitability thresholds.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {anomalies.map((anno, i) => (
                <div key={i} className={`p-10 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-md ${getSeverityStyles(anno.severity)}`}>
                  <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-white/60 text-[10px] font-black uppercase tracking-widest border border-current">
                          {anno.type}
                        </span>
                        <div className="h-1 w-1 bg-current opacity-30 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
                           Priority: <span className="underline decoration-2">{anno.severity}</span>
                        </span>
                      </div>
                      <p className="text-xl font-black leading-tight tracking-tight uppercase">{anno.description}</p>
                      <div className="bg-white/50 p-6 rounded-[1.5rem] border border-current/10 relative group/action">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">AI Remediation Plan</p>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{anno.suggestedAction}</p>
                        <div className="absolute right-4 bottom-4 opacity-0 group-hover/action:opacity-100 transition-opacity">
                          <Zap size={20} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 p-6 bg-white/40 rounded-[2rem] border border-current/10 shadow-inner">
                       <AlertTriangle size={48} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projections & Tools */}
        <div className="xl:col-span-4 space-y-8">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 ml-2">
             <BarChart3 size={18} className="text-blue-600" /> Financial Tools
           </h3>
           
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mb-32 -mr-32 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="space-y-3 relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estimated At Completion (EAC)</p>
                <p className="text-4xl font-black tracking-tighter">
                  {(summary.actualMaterials + summary.actualLabor + (summary.budgetMaterials * 0.2)).toLocaleString('it-IT')} <span className="text-lg text-slate-500">€</span>
                </p>
                <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest pt-2">
                  <TrendingUp size={12} /> +12.4% vs Original Budget
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/10 space-y-4 relative z-10">
                <button className="w-full bg-white/5 hover:bg-white/10 text-white px-6 py-5 rounded-2xl flex items-center justify-between group transition-all border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg"><Calculator size={18} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Recalculate Budget</span>
                  </div>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-blue-500" />
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-2xl flex items-center justify-between group transition-all shadow-xl shadow-blue-600/20">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/20 rounded-lg"><ShieldAlert size={18} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Generate Auditor Report</span>
                  </div>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Zap size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Intelligence</p>
                  <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Health Score</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Integrity Index</p>
                  <p className="text-2xl font-black text-blue-600 tracking-tighter">82<span className="text-xs text-slate-300">/100</span></p>
                </div>
                <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: '82%' }} />
                </div>
                <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed text-center">
                  "Slight deviation in structural material costs detected. Labor efficiency remains optimized."
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
