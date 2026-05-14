'use client';

import { useState, useTransition } from 'react';
import { Truck, Star, Plus, Mail, Phone, ExternalLink, Filter, Search, Award, TrendingDown, Clock, ShieldCheck } from 'lucide-react';
import SlideOver from '@/components/SlideOver';
import { createFornitore, updateSupplierRating } from '../fornitori-actions';

interface Fornitore {
  id: string;
  name: string;
  vatId: string | null;
  email: string | null;
  phone: string | null;
  category: string | null;
  tipo: string;
  rating: number;
  totalOrders: number;
  _count: {
    ddts: number;
    fatture: number;
  };
}

export default function FornitoriClient({ initialFornitori }: { initialFornitori: Fornitore[] }) {
  const [fornitori, setFornitori] = useState(initialFornitori);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredFornitori = fornitori.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createFornitore(fd);
      setIsSlideOpen(false);
    });
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-500';
    if (rating >= 3.5) return 'text-blue-500';
    if (rating >= 2.5) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <Truck className="text-blue-600" size={14} />
            Supply Chain & Partnership
          </div>
          <h1 className="page-title">Database Fornitori</h1>
          <p className="page-description">AI-Driven Supply Chain Management & Scoring</p>
        </div>
        <button 
          onClick={() => setIsSlideOpen(true)}
          className="action-btn-primary"
        >
          <Plus size={16} /> Aggiungi Partner Strategico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* KPI 1 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Truck size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fornitori Attivi</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{fornitori.length}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Partner accreditati nel sistema</p>
         </div>

         {/* KPI 2 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Award size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating Medio</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">
              {(fornitori.reduce((acc, f) => acc + f.rating, 0) / (fornitori.length || 1)).toFixed(1)}
              <span className="text-sm text-slate-300 ml-1">/ 5.0</span>
            </p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2">Performance globale eccellente</p>
         </div>

         {/* KPI 3 */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Clock size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Puntualità Media</p>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">94%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Basato su 128 consegne recenti</p>
         </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cerca per nome, categoria o P.IVA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                <th className="px-8 py-5">Fornitore / Partner</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5">Performance AI</th>
                <th className="px-8 py-5">Volume Ordini</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFornitori.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base">{f.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{f.vatId || 'P.IVA non inserita'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {f.category || 'Generico'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= Math.round(f.rating) ? getRatingColor(f.rating) : 'text-slate-200'}
                            fill={star <= Math.round(f.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-black ${getRatingColor(f.rating)}`}>{f.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-slate-900">{f._count.ddts + f._count.fatture} Movimenti</p>
                      <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                        <Mail size={18} />
                      </button>
                      <button className="p-3 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Nuovo Fornitore / Subappaltatore">
        <form onSubmit={handleCreate} className="space-y-8 pb-20">
           <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Ragione Sociale *</label>
                <input type="text" name="name" required placeholder="Es. Edilizia Moderna S.p.A." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Partita IVA</label>
                  <input type="text" name="vatId" placeholder="IT00000000000" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Tipo Rapporto</label>
                  <select name="tipo" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900">
                    <option value="FORNITORE">Fornitore Materiali</option>
                    <option value="SUBAPPALTATORE">Subappaltatore</option>
                    <option value="CONSULENTE">Consulente / Tecnico</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Categoria Merceologica</label>
                <input type="text" name="category" placeholder="Es. Idraulica, Strutture, etc." className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Email</label>
                  <input type="email" name="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Telefono</label>
                  <input type="tel" name="phone" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all font-black text-slate-900" />
                </div>
              </div>
           </div>
           
           <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Scoring AI Preliminare</p>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed font-bold mt-2">
                Il sistema analizzerà automaticamente la puntualità di consegna e la congruenza dei prezzi basandosi sui futuri DDT e Fatture caricati.
              </p>
           </div>
           
           <div className="pt-8">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl transition-all transform active:scale-95"
              >
                {isPending ? 'SALVATAGGIO...' : 'REGISTRA FORNITORE'}
              </button>
           </div>
        </form>
      </SlideOver>
    </div>
  );
}
