'use client';

import { useState } from 'react';
import { 
  Zap, Target, TrendingUp, ShieldCheck, 
  ChevronRight, BrainCircuit, BarChart3, Clock, CheckCircle2
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
  aiRationale: string;
}

export default function StrategicAdvisorClient({ data }: { data: any }) {
  const { missions, advisor, metrics } = data;
  const [activeMissions, setActiveMissions] = useState(missions);

  const handleComplete = async (id: string) => {
    await completeMission(id);
    setActiveMissions((prev: any) => prev.map((m: any) => 
      m.id === id ? { ...m, status: 'COMPLETED' } : m
    ));
  };

  const completedCount = activeMissions.filter((m: any) => m.status === 'COMPLETED').length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <BrainCircuit size={14} className="text-[#003F61]" />
            <span>Strategia / Business Advisory & Controllo di Gestione</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Growth Advisor & Controllo Strategico</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fase Operativa: <span className="font-semibold text-slate-800">{advisor.currentGrowthPhase}</span> • Raccomandazioni predittive di marginalità.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Health Score Aziendale</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold text-slate-900">{advisor.globalHealthScore}/100</span>
              <div className="w-24 h-2 bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#003F61]" style={{ width: `${advisor.globalHealthScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Margine Operativo Attuale</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{metrics.currentMargin?.toFixed(1) || '0.0'}%</div>
            <div className="text-xs text-slate-500 mt-1">Margine medio sui cantieri</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Target Margine</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Target size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{advisor.targetMargin}%</div>
            <div className="text-xs text-slate-500 mt-1">Obiettivo redditività commessa</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Crescita Ricavi MoM</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <BarChart3 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">+{metrics.growthRate}%</div>
            <div className="text-xs text-slate-500 mt-1">Variazione mensile fatturato</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Iniziative Completate</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{completedCount} / {activeMissions.length}</div>
            <div className="text-xs text-slate-500 mt-1">Piani di ottimizzazione attuati</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Roadmap & Outlook) and Right (Missions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Roadmap & Intelligence */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
              <BarChart3 size={16} className="text-[#003F61]" />
              <span>Roadmap Strategica di Sviluppo</span>
            </div>
            <div className="space-y-4">
              {[
                { label: '1. Stabilizzazione dei Flussi di Cassa', desc: 'Monitoraggio scadenziari e riduzione tempi incasso.', status: 'COMPLETED' },
                { label: '2. Ottimizzazione Margine di Commessa', desc: 'Controllo preventivo vs consuntivo e prezzi acquisti.', status: 'ACTIVE' },
                { label: '3. Scalabilità Operativa & Espansione', desc: 'Automazione DDT, contabilità di cantiere e nuovi appalti.', status: 'PENDING' },
              ].map((step, i) => (
                <div key={i} className="p-3 border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{step.label}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${
                      step.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      step.status === 'ACTIVE' ? 'bg-[#003F61] text-white border-[#003F61]' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {step.status === 'COMPLETED' ? 'Completata' : step.status === 'ACTIVE' ? 'In Corso' : 'In Coda'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
              <Zap size={16} className="text-[#003F61]" />
              <span>Direttiva Strategica Prioritaria</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Ottimizza il margine netto consolidando i fornitori chiave
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              I dati incrociati indicano stabilità nei prezzi di listino ma un incremento nei costi di trasporto. Raggruppare gli ordini per macro-cantiere ridurrà l'incidenza delle spese accessorie.
            </p>
          </div>
        </div>

        {/* Right Column (2/3): Strategic Missions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Target size={16} className="text-[#003F61]" />
              <span>Iniziative & Azioni Consigliate</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {activeMissions.filter((m: any) => m.status !== 'COMPLETED').length} in corso
            </span>
          </div>

          <div className="space-y-3">
            {activeMissions.map((mission: Mission) => {
              const isCompleted = mission.status === 'COMPLETED';

              return (
                <div 
                  key={mission.id}
                  className={`bg-white border p-5 transition-colors ${
                    isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border bg-slate-50 text-slate-700 border-slate-200">
                          {mission.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {mission.difficulty}h stimate
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            Applicata
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900">{mission.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{mission.description}</p>

                      <div className="pt-2 flex items-center gap-4 text-xs">
                        <span className="text-slate-500">Impatto Economico Stimato:</span>
                        <span className="font-bold text-slate-900 text-sm">€ {mission.impact.toLocaleString('it-IT')}</span>
                      </div>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto">
                      {!isCompleted ? (
                        <button 
                          onClick={() => handleComplete(mission.id)}
                          className="w-full sm:w-auto h-10 px-4 bg-[#003F61] hover:bg-[#002f49] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          Segna Come Attuata <ChevronRight size={14} />
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200">
                          <ShieldCheck size={16} /> Completata
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
