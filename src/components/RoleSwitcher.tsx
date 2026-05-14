'use client';

import { useAuth } from '@/lib/auth-mock';
import { UserCircle, Shield, Briefcase, HardHat, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function RoleSwitcher() {
  const { role, setRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'ADMIN', label: 'Executive (Admin)', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'PM', label: 'Project Director', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'OPERAIO', label: 'Field Operator', icon: HardHat, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ] as const;

  const currentRole = roles.find(r => r.id === role) || roles[0];
  const Icon = currentRole.icon;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 w-full p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 group shadow-sm"
      >
        <div className={`w-10 h-10 rounded-xl ${currentRole.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <Icon size={20} className={currentRole.color} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Simulation Context</p>
          <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tighter">{currentRole.label}</p>
        </div>
        <ChevronUp size={14} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-4 bg-white border border-slate-100 rounded-[2rem] shadow-premium p-3 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-3 mb-2 border-b border-slate-50">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Authority Level</p>
          </div>
          <div className="space-y-1">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all relative overflow-hidden group/item ${
                  role === r.id 
                    ? 'bg-slate-900 text-white shadow-xl' 
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <r.icon size={18} className={role === r.id ? 'text-blue-400' : 'text-slate-400 group-hover/item:text-slate-900'} />
                <span className="text-[11px] font-black uppercase tracking-widest">{r.label}</span>
                {role === r.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 h-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

