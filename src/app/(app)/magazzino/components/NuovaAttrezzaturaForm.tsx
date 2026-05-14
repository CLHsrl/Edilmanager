'use client';

import { useState, useTransition } from 'react';
import { createAttrezzatura } from '../../magazzino-actions';
import { Loader2, Save, Truck, Wrench, Calendar, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    projects: any[];
    lavoratori: any[];
    onSuccess: () => void;
}

export default function NuovaAttrezzaturaForm({ projects, lavoratori, onSuccess }: Props) {
    const [isPending, startTransition] = useTransition();
    const [tipo, setTipo] = useState('VEICOLO');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        startTransition(async () => {
            try {
                await createAttrezzatura(Object.fromEntries(formData));
                toast.success('Asset registrato con successo!');
                onSuccess();
            } catch (error) {
                toast.error('Errore durante la registrazione dell\'asset');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl mb-4 shadow-inner border border-gray-200/50">
                <button 
                    type="button"
                    onClick={() => setTipo('VEICOLO')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipo === 'VEICOLO' ? 'bg-white text-blue-700 shadow-md border border-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Truck size={14} /> Veicolo
                    <input type="hidden" name="tipo" value={tipo} />
                </button>
                <button 
                    type="button"
                    onClick={() => setTipo('ATTREZZATURA')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipo === 'ATTREZZATURA' ? 'bg-white text-blue-700 shadow-md border border-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Wrench size={14} /> Attrezzatura
                </button>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Anagrafica Asset</h4>
                
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nome / Modello *</label>
                    <input required name="nome" type="text" placeholder="Es. Iveco Daily o Trapano Hilti TE 70" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                </div>
                
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Targa / Codice Identificativo</label>
                    <input name="targa" type="text" placeholder="Es. AA123BB o SN-998877" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 font-mono uppercase" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Stato Operativo</label>
                    <select name="stato" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
                        <option value="DISPONIBILE">Disponibile</option>
                        <option value="IN_USO">In Uso</option>
                        <option value="MANUTENZIONE">Manutenzione</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Costo Orario (€)</label>
                    <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">€</span>
                        <input name="costoOrario" type="number" step="0.01" placeholder="0.00" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl text-sm focus:outline-none transition-all font-black text-slate-900 text-right" />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assegnazione & Manutenzione</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                            <MapPin size={12} /> Cantiere
                        </label>
                        <select name="cantiereId" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
                            <option value="">In Magazzino</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                            <User size={12} /> Dipendente
                        </label>
                        <select name="dipendenteId" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
                            <option value="">Nessuno</option>
                            {lavoratori.map(l => <option key={l.id} value={l.id}>{l.nome} {l.cognome}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                        <Calendar size={12} /> Ultima Manutenzione
                    </label>
                    <input name="dataManutenzione" type="date" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900" />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Note Operative</label>
                <textarea name="note" rows={3} placeholder="Es. Caratteristiche tecniche o alert particolari..." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300"></textarea>
            </div>

            <div className="pt-8">
                <button type="submit" disabled={isPending} className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2">
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isPending ? 'SALVATAGGIO...' : 'REGISTRA ASSET'}
                </button>
            </div>
        </form>
    );
}
