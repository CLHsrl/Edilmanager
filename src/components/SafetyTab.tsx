'use client';

import { useState, useTransition } from 'react';
import { 
    ShieldCheck, AlertTriangle, FileText, 
    Printer, Trash2, Wand2, CheckCircle2, 
    Clock, HardHat, Wrench, ChevronRight,
    Search, AlertCircle, Calendar
} from 'lucide-react';
import SlideOver from '@/components/SlideOver';
import AISafetyWizard from './AISafetyWizard';
import { deleteSafetyPlan } from '@/app/(app)/safety-actions';

type Doc = {
    id: string;
    nome: string;
    dataScadenza: Date;
    stato: string;
};

type Lavoratore = {
    id: string;
    nome: string;
    cognome: string | null;
    documenti: Doc[];
};

type Attrezzatura = {
    id: string;
    nome: string;
    documenti: Doc[];
};

type Plan = {
    id: string;
    title: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

type Props = {
    projectId: string;
    projectName: string;
    lavoratori: Lavoratore[];
    attrezzature: Attrezzatura[];
    plans: Plan[];
};

export default function SafetyTab({ 
    projectId, 
    projectName, 
    lavoratori = [], 
    attrezzature = [], 
    plans = [] 
}: Props) {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const allDocs = [
        ...(lavoratori || []).flatMap(l => (l.documenti || []).map(d => ({ ...d, owner: `${l.nome} ${l.cognome || ''}`, type: 'Lavoratore' }))),
        ...(attrezzature || []).flatMap(a => (a.documenti || []).map(d => ({ ...d, owner: a.nome, type: 'Attrezzatura' })))
    ];

    const expiredDocs = allDocs.filter(d => new Date(d.dataScadenza) < new Date());
    const validDocs = allDocs.filter(d => new Date(d.dataScadenza) >= new Date());

    return (
        <div className="flex flex-col gap-10">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-emerald-500" /> Compliant Documentation
                        </p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{validDocs.length.toString().padStart(2, '0')}</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-6 bg-emerald-50 inline-block px-3 py-1 rounded-lg">Audit Registry OK</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                           <AlertCircle size={12} className="text-amber-500" /> Critical Exposures
                        </p>
                        <p className={`text-5xl font-black tracking-tighter leading-none ${expiredDocs.length > 0 ? 'text-amber-500' : 'text-slate-200'}`}>
                            {expiredDocs.length.toString().padStart(2, '0')}
                        </p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-6 inline-block px-3 py-1 rounded-lg ${expiredDocs.length > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                           Revision Required
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mb-24 -mr-24 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                           <ShieldCheck size={12} className="text-blue-400" /> Global Safety Rating
                        </p>
                        <p className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                            {expiredDocs.length > 0 ? 'High Risk' : 'ISO 45001 GOLD'}
                        </p>
                        <div className="flex items-center gap-3 mt-8">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900"></div>)}
                           </div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Site Audit</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Wizard Launch Banner */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-900/5 flex flex-col xl:flex-row items-center gap-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl relative z-10 group-hover:rotate-12 transition-transform">
                    <Wand2 size={48} className="text-blue-400" />
                </div>
                <div className="flex-1 text-center xl:text-left z-10">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-3 leading-none">AI Safety Copilot <span className="text-blue-600 italic">POS Architect</span></h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">
                        Leverage neural risk analysis to architect a comprehensive Safety Operating Plan. 
                        Our AI engine synthesizes site specifics into compliant prevention protocols automatically.
                    </p>
                </div>
                <button 
                  onClick={() => setIsWizardOpen(true)}
                  className="w-full xl:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-3 z-10"
                >
                    Initialize AI Generation <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Generated Plans List */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-4">
                        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Safety Asset Ledger</h4>
                    </div>
                    
                    {plans.length === 0 ? (
                        <div className="bg-slate-50/30 rounded-[2.5rem] border-2 border-dashed border-slate-100 py-24 text-center">
                            <FileText size={64} className="mx-auto text-slate-100 mb-8" />
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">No safety artifacts deployed</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-600/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none">{plan.title}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                               <Calendar size={12} /> Issued: {new Date(plan.createdAt).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-slate-100">
                                            <Printer size={20} />
                                        </button>
                                        <button 
                                            onClick={() => startTransition(() => deleteSafetyPlan(plan.id))}
                                            className="p-4 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-slate-100"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compliance Sidebar */}
                <div className="flex flex-col gap-6">
                    <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] px-4">Compliance Watch</h4>
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                            <ShieldCheck size={20} className="text-blue-600" />
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Resource Compliance</span>
                        </div>
                        <div className="p-8 flex flex-col gap-6 max-h-[500px] overflow-y-auto no-scrollbar">
                            {allDocs.map((doc) => {
                                const isExpired = new Date(doc.dataScadenza) < new Date();
                                return (
                                    <div key={doc.id} className="flex gap-5 items-start group/doc transition-all">
                                        <div className={`mt-1.5 flex-shrink-0 w-3 h-3 rounded-full border-4 border-white shadow-sm ${isExpired ? 'bg-amber-500 shadow-amber-500/50 animate-pulse' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 truncate group-hover/doc:text-blue-600 transition-colors">
                                                {doc.type === 'Lavoratore' ? <HardHat size={12} className="text-slate-300" /> : <Wrench size={12} className="text-slate-300" />}
                                                {doc.owner}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{doc.nome}</p>
                                            <p className={`text-[9px] font-black uppercase mt-2 tracking-widest ${isExpired ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                Expiry: {new Date(doc.dataScadenza).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Wizard SlideOver */}
            <SlideOver 
                isOpen={isWizardOpen} 
                onClose={() => setIsWizardOpen(false)} 
                title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">⚡ <span className="italic text-blue-600">AI Safety Copilot</span></div>}
            >
                <div className="pb-20">
                    <AISafetyWizard projectId={projectId} projectName={projectName} onClose={() => setIsWizardOpen(false)} />
                </div>
            </SlideOver>
        </div>
    );
}
