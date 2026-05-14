'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  oldRank: string;
  newRank: string;
}

export default function RankUpModal({ isOpen, onClose, oldRank, newRank }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Trigger confetti!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl overflow-hidden transform transition-all duration-700 ${show ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center relative z-10">
          <div className="mb-8 inline-flex relative">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-8 rounded-full text-white shadow-xl relative">
              <Trophy size={64} className="animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg">
              <Star size={24} fill="white" />
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-2">Nuovo Grado Sbloccato!</p>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-6 italic leading-none">
            {newRank}
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-xs font-bold text-gray-400 line-through uppercase tracking-widest">{oldRank}</span>
            <div className="w-8 h-px bg-gray-200"></div>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={12} /> Promozione
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 mb-10">
            <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
              "Hai dimostrato un prestigio senza pari. Il tuo nome ora risuona nei cantieri più prestigiosi dell'intera regione."
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-xl hover:shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            Ricevi Onorificenza
          </button>
        </div>
      </div>
    </div>
  );
}
