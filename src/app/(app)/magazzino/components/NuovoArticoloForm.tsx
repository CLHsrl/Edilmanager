'use client';

import { useState, useTransition } from 'react';
import { createArticolo } from '../../magazzino-actions';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NuovoArticoloForm({ onSuccess }: { onSuccess: () => void }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        startTransition(async () => {
            try {
                await createArticolo(Object.fromEntries(formData));
                toast.success('Articolo registrato con successo!');
                onSuccess();
            } catch (error) {
                toast.error('Errore durante la creazione dell\'articolo');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Codice Articolo *</label>
                <input required name="codice" type="text" placeholder="Es. MAT-001" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 uppercase font-mono" />
            </div>
            
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nome / Descrizione *</label>
                <input required name="nome" type="text" placeholder="Es. Cemento Portland 32.5 R" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Categoria</label>
                    <input name="categoria" type="text" placeholder="Es. Inerti, Legname..." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Unità Misura *</label>
                    <select name="unitaMisura" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
                        <option value="PZ">Pezzi (PZ)</option>
                        <option value="KG">Chilogrammi (KG)</option>
                        <option value="MT">Metri (MT)</option>
                        <option value="MQ">Metri Quadri (MQ)</option>
                        <option value="LT">Litri (LT)</option>
                        <option value="BANCALE">Bancale</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Giacenza Attuale</label>
                    <input name="giacenza" type="number" step="0.01" defaultValue="0" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 font-mono text-right" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2 ml-1">Scorta Minima</label>
                    <input name="livelloScortaMin" type="number" step="0.01" defaultValue="0" className="w-full bg-orange-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-orange-900 font-mono text-right" />
                    <p className="text-[10px] font-bold text-slate-400 mt-2 ml-1">Sotto questo limite riceverai alert</p>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Costo Unitario Stimato (€)</label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">€</span>
                    <input name="costoUnitario" type="number" step="0.01" placeholder="0.00" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl text-sm focus:outline-none transition-all font-black text-slate-900 font-mono text-right" />
                </div>
            </div>

            <div className="pt-8">
                <button type="submit" disabled={isPending} className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2">
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isPending ? 'SALVATAGGIO...' : 'CREA ARTICOLO'}
                </button>
            </div>
        </form>
    );
}
