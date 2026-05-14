'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Sword, 
  Sparkles, Hammer, HardHat, 
  Handshake, XCircle, AlertCircle, CheckCircle2,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Objection {
  id: string;
  text: string;
  shield: number;
  solutions: { label: string, damage: number, tip: string }[];
}

interface Props {
  lead: { id: string, name: string };
  onWin: () => void;
  onCancel: () => void;
}

export default function ContractBossFight({ lead, onWin, onCancel }: Props) {
  const OBJECTIONS: Objection[] = [
    {
      id: 'price',
      text: "Il preventivo è troppo alto rispetto alla concorrenza...",
      shield: 100,
      solutions: [
        { label: "Qualità Materiali", damage: 40, tip: "Spiega che i nostri mattoni durano il doppio." },
        { label: "Detrazioni Fiscali", damage: 60, tip: "Mostra come recuperare il 50% della spesa." }
      ]
    },
    {
      id: 'trust',
      text: "Ho sentito storie terribili su ritardi nei cantieri...",
      shield: 100,
      solutions: [
        { label: "Garanzia Tempi", damage: 70, tip: "Offri una penale garantita in caso di ritardo." },
        { label: "Referenze Foto", damage: 30, tip: "Mostra le foto degli ultimi 5 cantieri finiti in anticipo." }
      ]
    }
  ];

  const [currentObjectionIdx, setCurrentObjectionIdx] = useState(0);
  const [shield, setShield] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>(["Il cliente lancia 'DUBBIO AMLETICO'!"]);
  const [isVictory, setIsVictory] = useState(false);

  const currentObjection = OBJECTIONS[currentObjectionIdx];

  const handleAction = (damage: number, label: string) => {
    const newShield = Math.max(0, shield - damage);
    setShield(newShield);
    setBattleLog([`Hai usato '${label.toUpperCase()}'! Danni al dubbio: ${damage}`, ...battleLog]);

    if (newShield === 0) {
      if (currentObjectionIdx < OBJECTIONS.length - 1) {
        setBattleLog(["DUBBIO SCONFITTO! Un altro ostacolo appare...", ...battleLog]);
        setTimeout(() => {
          setCurrentObjectionIdx(prev => prev + 1);
          setShield(100);
        }, 1000);
      } else {
        setIsVictory(true);
        setBattleLog(["VITTORIA TOTALE! Il cliente ha preso la penna in mano!", ...battleLog]);
        
        // Trigger celebratory confetti
        const end = Date.now() + 3 * 1000;
        const colors = ['#f59e0b', '#10b981', '#ffffff'];

        (function frame() {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    }
  }

  if (isVictory) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-950/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[4rem] p-16 text-center max-w-xl shadow-2xl relative overflow-hidden ring-8 ring-green-500/10">
           <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-green-400 via-green-600 to-green-400 animate-pulse"></div>
           
           {/* Animated Background Glow */}
           <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div>

           <div className="mb-10 inline-flex p-10 bg-green-100 text-green-600 rounded-[3rem] relative">
              <Sparkles size={80} className="animate-bounce" />
              <div className="absolute -inset-4 border-2 border-green-200 rounded-[3.5rem] animate-ping opacity-25"></div>
           </div>
           
           <div className="space-y-4 mb-12">
             <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                Inaugurazione <span className="text-green-600">Completata!</span>
             </h2>
             <p className="text-gray-500 font-black uppercase text-xs tracking-[0.4em]">
                Contratto Firmato • Edificio Consegnato
             </p>
           </div>

           <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-8 mb-12 flex items-center justify-center gap-6">
              <div className="text-left">
                <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Bonus Acquisito</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">+2,000 XP</p>
              </div>
              <div className="w-px h-12 bg-green-200"></div>
              <div className="text-left">
                <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Prestigio</p>
                <p className="text-3xl font-black text-green-600 tracking-tighter">+50 Fame</p>
              </div>
           </div>

           <button 
             onClick={onWin}
             className="group w-full bg-green-600 hover:bg-green-700 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-green-200 transition-all hover:scale-[1.03] active:scale-95 text-lg flex items-center justify-center gap-4"
           >
             <Handshake size={24} className="group-hover:rotate-12 transition-transform" />
             Taglia il Nastro
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 animate-in zoom-in-95 duration-300">
       <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Battle Visuals */}
          <div className="space-y-8">
             <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all"></div>
                <div className="relative bg-white/5 border-2 border-white/10 rounded-[4rem] p-12 text-center overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                      <HardHat size={120} className="text-white" />
                   </div>
                   
                   <p className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Fase Finale: Closing Battle</p>
                   <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-12 italic">Sfida con: {lead.name}</h2>

                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center px-2">
                         <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                           <ShieldAlert size={16} className="text-red-500" /> Resistenza Dubbio
                         </span>
                         <span className="text-lg font-black text-white">{shield}%</span>
                      </div>
                      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-500 relative"
                           style={{ width: `${shield}%` }}
                         >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-16 p-8 bg-red-500/10 border-2 border-red-500/20 rounded-3xl animate-pulse">
                      <p className="text-red-400 font-black text-sm uppercase tracking-tight leading-tight italic">
                        "{currentObjection.text}"
                      </p>
                   </div>
                </div>
             </div>

             <div className="bg-black/40 border border-white/5 rounded-3xl p-6 h-48 overflow-y-auto font-mono text-[10px] text-white/40 space-y-2 flex flex-col-reverse">
                {battleLog.map((log, i) => (
                  <p key={i} className={i === 0 ? "text-amber-400 font-bold" : ""}>
                    {`> ${log}`}
                  </p>
                ))}
             </div>
          </div>

          {/* Player Actions */}
          <div className="space-y-6">
             <div className="grid grid-cols-1 gap-4">
                <p className="text-white font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Sword size={16} className="text-amber-500 uppercase" /> Scegli la tua Mossa:
                </p>
                {currentObjection.solutions.map((sol, i) => (
                  <button
                    key={i}
                    onClick={() => handleAction(sol.damage, sol.label)}
                    className="group relative bg-white/5 hover:bg-amber-500 border-2 border-white/10 hover:border-amber-400 p-6 rounded-3xl text-left transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                  >
                     <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-white group-hover:text-gray-900 uppercase tracking-tighter text-lg">
                           {sol.label}
                        </span>
                        <span className="bg-amber-500 group-hover:bg-gray-900 text-white p-2 rounded-xl text-xs font-black">
                           ATK: {sol.damage}
                        </span>
                     </div>
                     <p className="text-xs font-bold text-white/40 group-hover:text-gray-900/60 uppercase tracking-widest">
                       {sol.tip}
                     </p>
                  </button>
                ))}
             </div>

             <div className="pt-12 text-center">
                <button 
                  onClick={onCancel}
                  className="text-white/30 hover:text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mx-auto transition-all"
                >
                  <XCircle size={16} /> Ritirati (Annulla Trattativa)
                </button>
             </div>
          </div>

       </div>
    </div>
  );
}
