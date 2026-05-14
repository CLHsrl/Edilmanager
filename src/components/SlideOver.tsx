'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SlideOver({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string | React.ReactNode; children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:max-w-3xl bg-slate-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-slate-100 shadow-sm z-10">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2.5 bg-slate-100 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
