'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { 
  HardHat, Users, FileText, Receipt, 
  Euro, ClipboardList, Plus, Search,
  Zap, ArrowRight, Shield, Activity
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getCommandPaletteData } from '@/app/(app)/cmdk-actions';

export default function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [data, setData] = useState<{
    projects: { id: string; name: string; number: number | null }[];
    clients: { id: string; name: string }[];
    fatture: { id: string; numero: string; soggetto: string }[];
    lavoratori: { id: string; nome: string; cognome: string | null }[];
  }>({ projects: [], clients: [], fatture: [], lavoratori: [] });

  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;
    setIsPublic(!path.includes('/dashboard') && !path.includes('/projects') && !path.includes('/clients') && !path.includes('/workflow'));
  }, []);

  useEffect(() => {
    if (open && data.projects.length === 0) {
      getCommandPaletteData().then(setData as any);
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <>
      {!isPublic && (
        <div className="fixed bottom-10 right-10 z-40">
          <button 
            onClick={() => setOpen(true)}
            className="group relative bg-slate-900 hover:bg-blue-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10"
            title="Enterprise Search (Ctrl+K)"
          >
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
            
            <div className="absolute right-full mr-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-premium translate-x-4 group-hover:translate-x-0 border border-white/5">
              Command Palette <span className="text-blue-400 ml-2">⌘K</span>
            </div>
          </button>
        </div>
      )}

      {open && (
        <Command.Dialog 
          open={open} 
          onOpenChange={setOpen} 
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-300"
        >
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-premium w-full max-w-3xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-500">
            <Dialog.Title className="sr-only">Enterprise Search</Dialog.Title>
            <Dialog.Description className="sr-only">Execute global commands, search projects, and manage operations.</Dialog.Description>
            
            <div className="flex items-center px-8 border-b border-slate-100 text-slate-400">
              <Search size={22} className="mr-4 text-blue-600" />
              <Command.Input 
                autoFocus 
                placeholder="Search projects, clients, or commands..." 
                className="flex-1 py-8 bg-transparent outline-none text-slate-900 font-black uppercase tracking-tighter placeholder:text-slate-300 text-xl"
              />
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">ESC</span>
              </div>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
              <Command.Empty className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Search size={32} />
                   </div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching results found</p>
                </div>
              </Command.Empty>

              <Command.Group heading="⚡ Rapid Execution" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Command.Item onSelect={() => runCommand(() => router.push('/projects/new'))} className="flex items-center gap-4 px-4 py-4 text-sm text-slate-700 rounded-2xl hover:bg-slate-900 hover:text-white cursor-pointer aria-selected:bg-slate-900 aria-selected:text-white transition-all group/item">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-aria-selected/item:bg-blue-600 group-aria-selected/item:text-white transition-colors"><Plus size={16} /></div> 
                    <span className="font-black uppercase tracking-tight">New Project Commission</span>
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push('/lavoratori'))} className="flex items-center gap-4 px-4 py-4 text-sm text-slate-700 rounded-2xl hover:bg-slate-900 hover:text-white cursor-pointer aria-selected:bg-slate-900 aria-selected:text-white transition-all group/item">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-aria-selected/item:bg-emerald-600 group-aria-selected/item:text-white transition-colors"><Plus size={16} /></div> 
                    <span className="font-black uppercase tracking-tight">Register Field Personnel</span>
                  </Command.Item>
                </div>
              </Command.Group>

              {data.projects.length > 0 && (
                <Command.Group heading="🏗️ Active Projects" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 py-4 mt-4 border-t border-slate-50">
                  <div className="space-y-1">
                    {data.projects.map(p => (
                      <Command.Item key={p.id} onSelect={() => runCommand(() => router.push(`/projects/${p.id}`))} className="flex items-center justify-between px-4 py-4 text-sm text-slate-700 rounded-2xl hover:bg-slate-50 cursor-pointer aria-selected:bg-slate-50 transition-all group/row">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-aria-selected/row:text-blue-600 transition-colors">
                              <HardHat size={18} />
                           </div>
                           <span className="font-black uppercase tracking-tighter">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-300 uppercase">{p.number ? `#${p.number}` : ''}</span>
                           <ArrowRight size={14} className="text-slate-200 group-aria-selected/row:text-slate-400" />
                        </div>
                      </Command.Item>
                    ))}
                  </div>
                </Command.Group>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.lavoratori.length > 0 && (
                  <Command.Group heading="👷 Human Resources" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 py-4 mt-4 border-t border-slate-50">
                    {data.lavoratori.slice(0, 5).map(l => (
                      <Command.Item key={l.id} onSelect={() => runCommand(() => router.push(`/lavoratori`))} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer aria-selected:bg-slate-50">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">{l.nome[0]}{l.cognome?.[0]}</div>
                        <span className="font-black uppercase tracking-tight text-xs">{l.nome} {l.cognome || ''}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {data.fatture.length > 0 && (
                  <Command.Group heading="📄 Finance Ledger" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 py-4 mt-4 border-t border-slate-50">
                    {data.fatture.slice(0, 5).map(f => (
                      <Command.Item key={f.id} onSelect={() => runCommand(() => router.push(`/fatture`))} className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer aria-selected:bg-slate-50">
                        <div className="flex items-center gap-3">
                           <Receipt size={16} className="text-slate-300" />
                           <span className="font-black text-xs uppercase">{f.numero}</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase">{f.soggetto.slice(0, 10)}...</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </div>
            </Command.List>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-8">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="p-1 bg-white border border-slate-200 rounded text-slate-600">↑↓</span> Navigate
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="p-1 bg-white border border-slate-200 rounded text-slate-600">ENTER</span> Select
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enterprise Encrypted</span>
               </div>
            </div>
          </div>
        </Command.Dialog>
      )}
    </>
  );
}

