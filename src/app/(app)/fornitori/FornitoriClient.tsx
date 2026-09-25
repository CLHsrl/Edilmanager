'use client';

import { useState, useTransition } from 'react';
import { Truck, Star, Plus, Mail, Phone, Search, Award, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import SlideOver from '@/components/SlideOver';
import { createFornitore } from '../fornitori-actions';

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
  const [tipoFilter, setTipoFilter] = useState('ALL');
  const [isPending, startTransition] = useTransition();

  const filteredFornitori = fornitori.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        f.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        f.vatId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'ALL' || f.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createFornitore(fd);
      setIsSlideOpen(false);
    });
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const avgRating = fornitori.length > 0 
    ? (fornitori.reduce((acc, f) => acc + f.rating, 0) / fornitori.length).toFixed(1)
    : '0.0';

  const subappaltatoriCount = fornitori.filter(f => f.tipo === 'SUBAPPALTATORE').length;
  const totalMovimenti = fornitori.reduce((acc, f) => acc + (f._count.ddts + f._count.fatture), 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Truck size={14} className="text-[#003F61]" />
            <span>Finanza / Supply Chain & Fornitori</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Anagrafica Fornitori</h1>
          <p className="text-sm text-slate-500 mt-1">Gestione parco fornitori, subappaltatori, condizioni commerciali e storico documenti.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSlideOpen(true)}
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Nuovo Fornitore
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fornitori Accreditati</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Truck size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{fornitori.length}</div>
            <div className="text-xs text-slate-500 mt-1">Partner commerciali attivi</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Subappaltatori</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{subappaltatoriCount}</div>
            <div className="text-xs text-slate-500 mt-1">Ditte e imprese terze</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rating Medio Fornitori</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <Award size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span></div>
            <div className="text-xs text-slate-500 mt-1">Valutazione affidabilità</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Movimenti Complessivi</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{totalMovimenti}</div>
            <div className="text-xs text-slate-500 mt-1">DDT e fatture passive registrate</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cerca per ragione sociale, categoria o P.IVA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
          >
            <option value="ALL">Tutte le tipologie</option>
            <option value="FORNITORE">Fornitore Materiali</option>
            <option value="SUBAPPALTATORE">Subappaltatore</option>
            <option value="CONSULENTE">Consulente Tecnico</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 overflow-x-auto">
        {filteredFornitori.length === 0 ? (
          <div className="p-12 text-center">
            <Truck size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessun fornitore trovato</p>
            <p className="text-xs text-slate-500 mt-1">Nessun partner registrato corrisponde ai filtri impostati.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Ragione Sociale</th>
                <th className="px-4 py-3">Partita IVA</th>
                <th className="px-4 py-3">Tipologia / Categoria</th>
                <th className="px-4 py-3">Contatti</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-right">Movimenti</th>
                <th className="px-4 py-3 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredFornitori.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block hover:text-[#003F61]">{f.name}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                    {f.vatId || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-700 border-slate-200">
                      {f.tipo} {f.category ? `• ${f.category}` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    <div className="flex flex-col gap-0.5">
                      {f.email && <span className="flex items-center gap-1"><Mail size={11} className="text-slate-400" /> {f.email}</span>}
                      {f.phone && <span className="flex items-center gap-1"><Phone size={11} className="text-slate-400" /> {f.phone}</span>}
                      {!f.email && !f.phone && <span className="text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <Star size={13} className={getRatingColor(f.rating)} fill="currentColor" />
                      <span className={`text-xs font-bold ${getRatingColor(f.rating)}`}>{f.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-700">
                    {f._count.ddts + f._count.fatture} doc
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button 
                      onClick={() => {}}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                    >
                      Dettaglio <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SlideOver Form */}
      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title={<div className="text-lg font-bold text-slate-900">Nuovo Fornitore</div>}>
        <form onSubmit={handleCreate} className="space-y-4 pb-10">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Ragione Sociale *</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Es. Edilizia Moderna S.p.A." 
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Partita IVA</label>
              <input 
                type="text" 
                name="vatId" 
                placeholder="IT00000000000" 
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Tipo Rapporto</label>
              <select 
                name="tipo" 
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              >
                <option value="FORNITORE">Fornitore Materiali</option>
                <option value="SUBAPPALTATORE">Subappaltatore</option>
                <option value="CONSULENTE">Consulente Tecnico</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Categoria Merceologica</label>
            <input 
              type="text" 
              name="category" 
              placeholder="Es. Idraulica, Strutture, Materiali edili" 
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Telefono</label>
              <input 
                type="tel" 
                name="phone" 
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full h-10 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isPending ? 'Salvataggio in corso...' : 'Salva Fornitore'}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
