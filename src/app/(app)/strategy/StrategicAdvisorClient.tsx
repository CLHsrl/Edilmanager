'use client';

import { useState } from 'react';
import { 
  Zap, Target, TrendingUp, ShieldCheck, 
  ArrowUpRight, ChevronRight, BrainCircuit, 
  Trophy, Flame, Sparkles, BarChart3, Clock
} from 'lucide-react';
import { completeMission } from './advisor-actions';

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: number;
  status: string;
  priority: string;
  difficulty: number;
  rewardXp: number;
  aiRationale: string;
}

export default function StrategicAdvisorClient({ data }: { data: any }) {
  const { missions, advisor, metrics } = data;
  const [activeMissions, setActiveMissions] = useState(missions);
  const aiInsights = JSON.parse(advisor.aiInsights || '{}');

  const handleComplete = async (id: string) => {
    await completeMission(id);
    setActiveMissions((prev: any) => prev.map((m: any) => 
      m.id === id ? { ...m, status: 'COMPLETED' } : m
    ));
  };

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Background Glows (Subtle for white theme) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] -z-10"></div>

      {/* Unified Header (Dark Version) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <BrainCircuit className="text-blue-600" size={14} />
            Enterprise Strategy & AI Coaching
          </div>
          <h1 className="page-title">Growth Advisor</h1>
          <p className="page-description">
             Growth Phase: <span className="text-blue-600">{advisor.currentGrowthPhase}</span> • Powered by Antigravity v2.0
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm no-print">
           <div className="px-8 py-1 border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Global Health Score</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-slate-900">{advisor.globalHealthScore}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${advisor.globalHealthScore}%` }}></div>
                </div>
              </div>
           </div>
           <div className="px-8 py-1">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Optimization Agent</p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">Live active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metrics & Insights */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* AI Insight Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative group overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <Sparkles className="absolute top-6 right-6 text-blue-400/40" size={24} />
             <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Strategic Focus</p>
             </div>
             <h3 className="text-2xl font-black mb-4 leading-tight text-white tracking-tighter uppercase">Ottimizza il margine netto del 3.5% agendo sugli acquisti.</h3>
             <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
               I dati indicano che i prezzi dei materiali sono stabili, ma i tuoi costi logistici sono aumentati del 12%. Unifica le consegne per risparmiare.
             </p>
             <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                Approfondisci Analisi Dati <ArrowUpRight size={14} />
             </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <TrendingUp className="text-emerald-500 mb-3" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Margine Netto</p>
                <p className="text-xl font-black text-slate-900">{metrics.currentMargin.toFixed(1)}%</p>
             </div>
             <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <Target className="text-blue-500 mb-3" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target 2026</p>
                <p className="text-xl font-black text-slate-900">{advisor.targetMargin}%</p>
             </div>
             <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <Flame className="text-orange-500 mb-3" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Crescita MoM</p>
                <p className="text-xl font-black text-slate-900">+{metrics.growthRate}%</p>
             </div>
             <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <Zap className="text-blue-600 mb-3" size={20} />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Missioni Goal</p>
                <p className="text-xl font-black text-slate-900">{missions.filter((m: any) => m.status === 'COMPLETED').length}/10</p>
             </div>
          </div>

          {/* Roadmap Widget */}
          <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <BarChart3 size={14} className="text-blue-600" /> Roadmap di Crescita
             </h4>
             <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-50"></div>
                {[
                  { label: 'Stabilizzazione', status: 'COMPLETED', color: 'bg-emerald-500' },
                  { label: 'Ottimizzazione Margine', status: 'ACTIVE', color: 'bg-blue-600' },
                  { label: 'Espansione Scalabile', status: 'LOCKED', color: 'bg-slate-100' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 relative">
                    <div className={`w-6 h-6 rounded-full ${step.color} border-4 border-white flex items-center justify-center text-[8px] font-black text-white`}>
                      {step.status === 'COMPLETED' ? '✓' : ''}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[11px] font-black uppercase ${step.status === 'LOCKED' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                      {step.status === 'ACTIVE' && <p className="text-[9px] text-blue-600 font-bold uppercase mt-1">Phase focus: Missioni Efficienza</p>}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Growth Missions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Missioni di Crescita</h2>
            <div className="flex gap-2">
              <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-400 border border-white/10 tracking-widest">
                Active: {activeMissions.filter((m: any) => m.status !== 'COMPLETED').length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeMissions.map((mission: Mission) => (
              <div 
                key={mission.id} 
                className={`group relative p-8 rounded-[2rem] border transition-all duration-500 ${
                  mission.status === 'COMPLETED' 
                    ? 'bg-emerald-50/30 border-emerald-100' 
                    : 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        mission.category === 'COST_REDUCTION' ? 'border-red-500/30 text-red-400 bg-red-400/5' :
                        mission.category === 'MARGIN_UP' ? 'border-blue-500/30 text-blue-400 bg-blue-400/5' :
                        'border-purple-500/30 text-purple-400 bg-purple-400/5'
                      } uppercase tracking-widest`}>
                        {mission.category.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} /> {mission.difficulty}h impegno
                      </span>
                      {mission.status === 'COMPLETED' && (
                        <span className="bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 animate-pulse">
                          <ShieldCheck size={10} /> Missione Compiuta
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-3 tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{mission.title}</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wide leading-relaxed max-w-2xl">{mission.description}</p>
                    
                    <div className="mt-6 flex items-center gap-6">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impatto Stimato</p>
                          <p className="text-lg font-black text-slate-900 tracking-tighter">€ {mission.impact.toLocaleString('it-IT')}</p>
                       </div>
                       <div className="w-px h-8 bg-slate-100"></div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ricompensa</p>
                          <p className="text-lg font-black text-blue-600 flex items-center gap-2 tracking-tighter">
                             <Trophy size={16} /> {mission.rewardXp} XP
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    {mission.status !== 'COMPLETED' ? (
                      <button 
                        onClick={() => handleComplete(mission.id)}
                        className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                      >
                        Avvia Missione <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-center">
                         <p className="text-[10px] font-black text-green-500 uppercase">Valore Reale Generato</p>
                         <p className="text-lg font-black text-white">€ {mission.impact.toLocaleString('it-IT')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute -top-3 -right-3 bg-slate-900 border border-white/20 p-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-2">
                      <BrainCircuit size={12} className="text-blue-400" />
                      <span className="text-[8px] font-black uppercase text-blue-100">AI Suggested</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Reasoning Section */}
          <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] relative group overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={120} />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-3">
                <Sparkles size={16} /> Logica Advisor in Tempo Reale
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                   <p className="text-sm text-slate-300 font-bold leading-relaxed uppercase tracking-widest italic">
                     "L'analisi dei dati incrociati tra DDT e Preventivi ha evidenziato un'opportunità di arbitraggio sui subappalti. Le missioni suggerite mirano a consolidare il margine netto entro il prossimo Q2."
                   </p>
                </div>
                <div className="bg-white/10 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Market Sentiment Alert</p>
                   <p className="text-[12px] text-white leading-relaxed font-bold">
                     Aumento prezzi acciaio (+5%) previsto a 30 giorni. <br/>
                     <span className="text-blue-400">Consiglio:</span> Anticipa l'acquisto per i cantieri attivi.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
