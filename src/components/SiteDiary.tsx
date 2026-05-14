'use client';

import { useState, useTransition } from 'react';
import { 
  Camera, MessageSquare, Check, X, 
  Eye, EyeOff, Trash2, Send, 
  Clock, ShieldCheck, Loader2, Image as ImageIcon, Sparkles, Zap
} from 'lucide-react';
import { createProjectUpdate, approveUpdateForClient, deleteProjectUpdate } from '@/app/(app)/project-feed-actions';
import { getSiteSummary } from '@/app/(app)/ai-actions';
import VisionAudit from './VisionAudit';

type Update = {
  id: string;
  authorName: string | null;
  content: string | null;
  photos: string | null;
  type: string;
  isVisibleToClient: boolean;
  createdAt: Date;
};

type Props = {
  projectId: string;
  updates: Update[];
  isManager: boolean;
};

export default function SiteDiary({ projectId, updates, isManager }: Props) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENT'>('ALL');
  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredUpdates = activeTab === 'ALL' 
    ? updates 
    : updates.filter(u => u.isVisibleToClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      await createProjectUpdate(projectId, content);
      setContent('');
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-[2rem] border-2 border-blue-50 p-6 shadow-xl shadow-blue-50/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <MessageSquare size={20} />
             </div>
             <div>
                <h3 className="font-black text-gray-900 uppercase tracking-tighter">Diario di Cantiere</h3>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Aggiornamenti in tempo reale</p>
             </div>
          </div>
          
          <div className="relative">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cosa sta succedendo in cantiere oggi?"
              className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all min-h-[100px] resize-none"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
               <button type="button" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm">
                  <Camera size={18} />
               </button>
               <button 
                  disabled={!content.trim() || isPending}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
               >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} PUBBLICA
               </button>
            </div>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
             <ShieldCheck size={12} className="text-gray-300" /> I post sono inizialmente solo interni. Richiedono approvazione per il Portale Cliente.
          </p>
        </form>
      </div>

      {/* AI Summary Section */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-all duration-700" />
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                 <Sparkles size={16} className="text-blue-400" />
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Smart Executive Summary</h3>
               </div>
               <p className="text-xl font-black tracking-tight">Analisi intelligente degli ultimi 7 giorni</p>
            </div>
            <button 
              onClick={async () => {
                setIsAiLoading(true);
                const res = await getSiteSummary(projectId);
                if (res.success) setAiSummary(res.data || '');
                setIsAiLoading(false);
              }}
              disabled={isAiLoading}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-xl flex items-center gap-2 group/btn"
            >
              {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
              {aiSummary ? 'RIGENERA REPORT' : 'GENERA REPORT AI'}
            </button>
         </div>

         {aiSummary && (
           <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
              <p className="text-sm font-medium leading-relaxed italic text-blue-50">
                "{aiSummary}"
              </p>
              <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black">AI</div>
                    ))}
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Generato istantaneamente da EdilManager AI Guardian</p>
              </div>
           </div>
         )}
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1.5 bg-gray-100 rounded-2xl w-max no-print">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tutti i log
        </button>
        <button 
          onClick={() => setActiveTab('CLIENT')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CLIENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Visibili al Cliente
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 && (
          <div className="py-20 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
             <Clock size={40} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nessun aggiornamento registrato</p>
          </div>
        )}

        {filteredUpdates.map((update) => (
          <div key={update.id} className={`group bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md ${!update.isVisibleToClient ? 'border-l-4 border-l-orange-400' : 'border-l-4 border-l-green-400'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400">
                  {update.authorName?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm uppercase leading-tight">{update.authorName || 'Sistema'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(update.createdAt).toLocaleString('it-IT')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                 {isManager && (
                   <button 
                    onClick={() => startTransition(() => approveUpdateForClient(update.id, !update.isVisibleToClient))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${update.isVisibleToClient ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600 hover:bg-green-50'}`}
                   >
                     {update.isVisibleToClient ? <><Eye size={12} /> Pubblicato</> : <><EyeOff size={12} /> Approva per Cliente</>}
                   </button>
                 )}
                 <button 
                  onClick={() => startTransition(() => deleteProjectUpdate(update.id))}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
            </div>

            <p className="text-gray-700 text-sm font-medium leading-relaxed mb-4">
              {update.content}
            </p>

            {/* Mock Photos */}
            {update.photos && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                   <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                      <ImageIcon size={32} />
                   </div>
                </div>
                <VisionAudit imageUrl={update.photos} />
              </div>
            )}

            {!update.isVisibleToClient && (
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                 <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest italic">Visibile solo allo staff interno</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
