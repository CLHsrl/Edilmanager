'use client';

import { useState, useTransition } from 'react';
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle2, AlertTriangle, Send, User, Calendar, Filter, Sparkles, Loader2, Zap } from 'lucide-react';
import { createRFI, updateRFI } from '@/app/(app)/cantiere-actions';
import { getRfiSuggestion } from '@/app/(app)/ai-actions';
import SlideOver from '@/components/SlideOver';

interface RFI {
  id: string;
  number: number;
  title: string;
  question: string;
  answer: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  answeredAt: Date | null;
  answeredBy: string | null;
  createdAt: Date;
}

export default function RfiTab({ projectId, rfis }: { projectId: string; rfis: RFI[] }) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(null);
  const [isResponseSlideOpen, setIsResponseSlideOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [aiLoading, setAiLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    URGENT: 'bg-red-100 text-red-600 animate-pulse',
  };

  async function handleCreateRFI(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createRFI(projectId, fd);
      setIsSlideOpen(false);
    });
  }

  async function handleUpdateRFI(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedRFI) return;
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateRFI(selectedRFI.id, projectId, fd);
      setIsResponseSlideOpen(false);
      setSelectedRFI(null);
      setAnswer('');
    });
  }

  const handleAiSuggest = async () => {
    if (!selectedRFI) return;
    setAiLoading(true);
    const res = await getRfiSuggestion(projectId, selectedRFI.title, selectedRFI.question);
    if (res.success && res.data) setAnswer(res.data);
    setAiLoading(false);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Actions */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Requests for Information</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Formal Site-to-Office Communication Ledger</p>
        </div>
        <button 
          onClick={() => setIsSlideOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10 transform active:scale-95"
        >
          <Plus size={18} /> Initiate New RFI
        </button>
      </div>

      {/* RFI Cards List */}
      {rfis.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
          <HelpCircle size={64} className="mx-auto text-slate-100 mb-8" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Active RFIs</h3>
          <p className="text-sm text-slate-400 font-medium mt-2">Use formal RFIs to request technical clarifications or design variations from the engineering team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {rfis.map(rfi => (
            <div key={rfi.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl group-hover:scale-110 transition-transform">
                    #{rfi.number.toString().padStart(3, '0')}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{rfi.title}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                       <Calendar size={12} /> Logged: {new Date(rfi.createdAt).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${priorityColors[rfi.priority]} border-current shadow-sm`}>
                  {rfi.priority}
                </span>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 border border-slate-100 relative z-10">
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{rfi.question}"</p>
              </div>

              {rfi.answer ? (
                <div className="bg-emerald-50 p-8 rounded-[2rem] mb-8 border border-emerald-100 relative z-10 group/answer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Official Resolution</span>
                  </div>
                  <p className="text-sm text-slate-800 font-bold leading-relaxed">{rfi.answer}</p>
                  <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between">
                     <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                       <User size={10} /> Resolved by {rfi.answeredBy}
                     </p>
                     <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                       {new Date(rfi.answeredAt!).toLocaleString('it-IT')}
                     </p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-8 rounded-[2rem] mb-8 border border-blue-100 flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm animate-pulse">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Pending Engineering Review</span>
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1 italic">SLA: Response required within 24h</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                  <Zap size={14} className="text-amber-500" />
                  Target: {rfi.dueDate ? new Date(rfi.dueDate).toLocaleDateString('it-IT') : 'Unscheduled'}
                </div>
                <button 
                  onClick={() => {
                    setSelectedRFI(rfi);
                    setAnswer(rfi.answer || '');
                    setIsResponseSlideOpen(true);
                  }}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  {rfi.answer ? 'Revise Response' : 'Dispatch Resolution'} <Send size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SlideOver Nuova RFI */}
      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">❓ <span className="italic text-blue-600">Formal Inquiry</span></div>}>
        <form onSubmit={handleCreateRFI} className="space-y-10 pb-20">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="Es. Column C14 Reinforcement Clarification" 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Matrix</label>
                <select name="priority" className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm">
                  <option value="LOW">Low Complexity</option>
                  <option value="MEDIUM">Standard</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Critical Path</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Required By</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Inquiry Detail *</label>
              <textarea 
                name="question" 
                rows={6} 
                required 
                placeholder="Provide a comprehensive technical description of the inquiry..." 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3"
          >
            {isPending ? 'Invio in corso...' : 'Dispatch Formal Inquiry'}
          </button>
        </form>
      </SlideOver>

      {/* SlideOver Risposta RFI */}
      <SlideOver 
        isOpen={isResponseSlideOpen} 
        onClose={() => {
            setIsResponseSlideOpen(false);
            setAnswer('');
        }} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">💡 <span className="italic text-blue-600">Resolution Console</span></div>}
      >
        <div className="space-y-10 pb-20">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mb-16 -mr-16 group-hover:scale-150 transition-transform duration-1000"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 relative z-10 leading-none">Inquiry Reference #{selectedRFI?.number}</p>
             <h3 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">{selectedRFI?.title}</h3>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative z-10">
                <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{selectedRFI?.question}"</p>
             </div>
          </div>

          <form onSubmit={handleUpdateRFI} className="space-y-8">
            <div className="space-y-2 px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resolution Protocol</label>
              <select name="status" defaultValue={selectedRFI?.status} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm appearance-none">
                <option value="OPEN">Await Clarification</option>
                <option value="ANSWERED">Partial Resolution</option>
                <option value="CLOSED">Finalized / Resolved</option>
              </select>
            </div>
            
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Official Engineering Response</label>
                <button 
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 shadow-sm"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Guardian Draft
                </button>
              </div>
              <textarea 
                name="answer" 
                rows={10} 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required 
                placeholder="Fornisci la soluzione tecnica o il chiarimento..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
            >
              {isPending ? 'Salvataggio...' : 'Commit Resolution'}
            </button>
          </form>
        </div>
      </SlideOver>
    </div>
  );
}
