'use client';

import { useTransition } from 'react';
import { generatePortalKey } from '@/app/(app)/actions';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ClientPortalActivator({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleActivate = () => {
    startTransition(async () => {
      await generatePortalKey(projectId);
    });
  };

  return (
    <button 
      onClick={handleActivate}
      disabled={isPending}
      className="w-full bg-white text-blue-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-blue-400 disabled:opacity-50"
    >
      {isPending ? (
        <>
          <Loader2 size={14} className="animate-spin" /> ATTIVAZIONE IN CORSO...
        </>
      ) : (
        <>
          <Sparkles size={14} className="animate-pulse" /> ATTIVA PORTALE CLIENTI
        </>
      )}
    </button>
  );
}
