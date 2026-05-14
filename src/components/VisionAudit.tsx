'use client';

import { useState } from 'react';
import { getVisionAnalysis } from '@/app/(app)/ai-actions';
import { 
  Eye, ShieldAlert, CheckCircle2, 
  BarChart, Loader2, Sparkles, AlertTriangle
} from 'lucide-react';

interface VisionAuditProps {
  imageUrl: string;
}

export default function VisionAudit({ imageUrl }: VisionAuditProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    const res = await getVisionAnalysis(imageUrl);
    if (res.success) setAnalysis(res.data);
    setLoading(false);
  };

  if (!analysis && !loading) {
    return (
      <button 
        onClick={runAnalysis}
        className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
      >
        <Eye size={12} /> Esegui Vision AI Audit
      </button>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 animate-pulse">
        <Loader2 size={16} className="animate-spin text-blue-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analisi Vision in corso...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in zoom-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-blue-600" />
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vision AI Audit Results</h4>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${analysis.safetyScore > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          Safety Score: {analysis.safetyScore}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Oggetti Rilevati</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.detectedObjects.map((obj: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">{obj}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Avanzamento Stimato</p>
          <div className="flex items-center gap-2">
            <BarChart size={14} className="text-blue-600" />
            <span className="text-sm font-black text-slate-900">{analysis.progressEstimate}%</span>
          </div>
        </div>
      </div>

      {analysis.complianceIssues.length > 0 ? (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-2">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Criticità Sicurezza</span>
          </div>
          <ul className="space-y-1">
            {analysis.complianceIssues.map((issue: string, i: number) => (
              <li key={i} className="text-[11px] font-bold text-red-900 leading-tight flex items-start gap-1.5">
                <div className="w-1 h-1 rounded-full bg-red-600 mt-1" /> {issue}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2 text-emerald-700">
          <CheckCircle2 size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Nessun rischio sicurezza rilevato</span>
        </div>
      )}
    </div>
  );
}
