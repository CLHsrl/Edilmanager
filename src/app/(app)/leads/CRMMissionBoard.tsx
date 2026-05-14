'use client';

import { useState } from 'react';
import { 
  Trophy, Star, ShieldCheck, Zap, 
  Map as MapIcon, Target, ChevronRight, 
  Lightbulb, CheckCircle2, AlertTriangle, MessageSquare, Info,
  LayoutGrid
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  clientName: string | null;
  status: string;
  level: number;
  xp: number;
  stagnationAlert: boolean;
}

interface Props {
  leads: Lead[];
  onStatusUpdate: (id: string, status: string) => void;
}

const COACH_TIPS: Record<number, { title: string, tip: string, mission: string, requirements: string[] }> = {
  1: {
    title: "POSA DELLA PRIMA PIETRA",
    tip: "Ogni grande opera inizia con un singolo mattone. Verifica la fonte del lead per capire dove piantare il cartello di cantiere!",
    mission: "Inserisci la fonte del lead (WEB, Social, ecc.)",
    requirements: ['source']
  },
  2: {
    title: "SCAVO E RILIEVO",
    tip: "Prima di costruire, dobbiamo scavare a fondo. Assicurati di avere i contatti diretti per coordinare i lavori.",
    mission: "Valida Telefono e Email del cliente.",
    requirements: ['clientPhone', 'clientEmail']
  },
  3: {
    title: "FONDAMENTA GETTATE",
    tip: "Senza fondamenta solide, tutto crolla. Inserisci la tipologia di lavoro e i dettagli del sopralluogo per stabilizzare il progetto.",
    mission: "Specifica Tipologia Lavoro e Note Sopralluogo.",
    requirements: ['workType', 'notes']
  },
  4: {
    title: "PARETI ALZATE",
    tip: "Ora si vede la struttura! Definisci il budget per comprare i materiali e preparare il preventivo finale.",
    mission: "Inserisci il Budget Stimato.",
    requirements: ['estimatedBudget']
  },
  5: {
    title: "INAUGURAZIONE",
    tip: "Il cantiere è pronto, manca solo il taglio del nastro. Preparati alla sfida finale per far firmare il contratto!",
    mission: "Vinci la Boss Fight finale!",
    requirements: []
  }
};

export default function CRMMissionBoard({ leads, onStatusUpdate }: Props) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const levelLabels: Record<number, string> = {
    1: 'NEW',
    2: 'CONTACTED',
    3: 'SURVEY_SCHEDULED',
    4: 'QUOTED',
    5: 'WON'
  };

  const getMissingMaterials = (lead: Lead) => {
    const reqs = COACH_TIPS[lead.level].requirements;
    return reqs.filter(r => !(lead as any)[r]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
      {/* interactive Map / List of Missions */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
                <LayoutGrid size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic underline decoration-amber-400 decoration-4">Cantiere Aperto</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scegli un lotto di costruzione per rimboccarti le maniche</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.filter(l => l.status !== 'WON' && l.status !== 'LOST').map(lead => (
            <div 
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              className={`relative overflow-hidden cursor-pointer group p-5 rounded-[2.5rem] border-4 transition-all duration-500 ${
                selectedLeadId === lead.id 
                  ? 'border-amber-500 bg-amber-50 shadow-2xl scale-[1.02]' 
                  : 'border-gray-100 bg-white hover:border-amber-200'
              }`}
            >
              {getMissingMaterials(lead).length > 0 && (
                <div className="absolute top-4 right-4 text-amber-600 bg-amber-100 p-1.5 rounded-lg flex items-center gap-1 text-[8px] font-black uppercase">
                   <AlertTriangle size={12} /> Materiali Mancanti
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-b-4 ${
                  lead.level >= 4 ? 'bg-orange-500 text-white border-orange-700' : 'bg-amber-400 text-gray-900 border-amber-600'
                }`}>
                  <Trophy size={20} className={lead.level === 5 ? "animate-bounce" : ""} />
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-gray-900 uppercase leading-none tracking-tighter">{lead.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase truncate max-w-[150px]">{lead.clientName}</p>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-[8px] font-black uppercase text-gray-400 tracking-widest">
                    <span>Stato dell'Opera</span>
                    <span className="text-orange-600 font-black">{lead.xp} XP</span>
                 </div>
                 <div className="h-3 w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 relative shadow-inner"
                      style={{ width: `${(lead.level / 5) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-gray-900 text-white uppercase tracking-tighter">
                       Lvl {lead.level}: {COACH_TIPS[lead.level].title}
                    </span>
                    <ChevronRight size={16} className={`text-amber-500 transition-transform ${selectedLeadId === lead.id ? 'translate-x-1' : ''}`} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control console / AI Coach */}
      <div className="lg:col-span-4 space-y-6">
        {selectedLead ? (
          <div className="bg-white border-4 border-gray-900 rounded-[3rem] p-8 text-gray-900 shadow-2xl shadow-amber-200/50 sticky top-8 animate-in slide-in-from-right-10 duration-500 overflow-hidden">
             
             {/* Background decorative crane */}
             <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <Target size={200} />
             </div>

             <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-400 flex items-center justify-center border-b-4 border-amber-600 shadow-lg">
                   <Zap size={28} className="text-white fill-white" />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tighter leading-none uppercase italic">{selectedLead.name}</h3>
                   <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Ufficio di Cantiere</p>
                </div>
             </div>

             {/* COACH TIPS PANEL */}
             <div className="bg-gray-50 rounded-[2rem] p-6 border-2 border-gray-100 mb-8 relative group">
                <div className="absolute -top-3 -left-3 bg-gray-900 text-white p-2 rounded-xl shadow-lg rotate-[-10deg]">
                   <Lightbulb size={20} />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Direttore Lavori (Coaching)</p>
                <p className="text-sm font-bold leading-relaxed text-gray-800 italic">
                  "{COACH_TIPS[selectedLead.level].tip}"
                </p>
             </div>

             {/* DAILY MISSION / REQUIREMENTS */}
             <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> Ordine del Giorno
                </p>
                
                <div className="bg-amber-100 border-2 border-amber-200 p-5 rounded-3xl flex items-center gap-4">
                   <div className="p-2 bg-amber-400 rounded-xl text-white">
                      <Target size={18} />
                   </div>
                   <p className="text-sm font-black uppercase tracking-tight leading-tight text-amber-800">
                     {COACH_TIPS[selectedLead.level].mission}
                   </p>
                </div>

                {getMissingMaterials(selectedLead).length > 0 && (
                  <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
                     <p className="text-[10px] font-black text-red-600 uppercase mb-2">⚠ Materiali Mancanti per Avanzare:</p>
                     <ul className="flex flex-wrap gap-2">
                        {getMissingMaterials(selectedLead).map(m => (
                            <li key={m} className="px-2 py-1 bg-white border border-red-200 rounded-lg text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                                {m.replace('client', '').replace('estimated', '')}
                            </li>
                        ))}
                     </ul>
                  </div>
                )}

                <div className="pt-8">
                   <button 
                     onClick={() => onStatusUpdate(selectedLead.id, levelLabels[selectedLead.level + 1])}
                     disabled={selectedLead.level >= 5 || getMissingMaterials(selectedLead).length > 0}
                     className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale group"
                   >
                     Prosegui i Lavori <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                   <p className="text-[9px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">
                     Passerai a: {COACH_TIPS[selectedLead.level + 1]?.title || 'BOSS FIGHT'}
                   </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[3rem] p-12 text-center h-[500px] flex flex-col items-center justify-center translate-y-2">
             <div className="p-6 bg-white rounded-full shadow-lg mb-4 text-amber-400 border-4 border-gray-100">
                <LayoutGrid size={48} />
             </div>
             <p className="text-gray-400 font-bold uppercase text-sm tracking-widest">Seleziona un Progetto<br/>per allestire il cantiere</p>
          </div>
        )}
      </div>
    </div>
  );
}
