'use client';

import { useState } from 'react';
import { Plus, Search as SearchIcon, LayoutGrid, List, TrendingUp, User, Building2, MapPin, Mail, Phone, ChevronRight, Edit, Trash2, Eye, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { deleteClient } from '../actions';

type Client = {
    id: string;
    number: number | null;
    type: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    taxId: string | null;
    createdAt: Date;
};

type SortKey = 'name' | 'createdAt';
type SortOrder = 'asc' | 'desc';

type Props = {
    clients: Client[];
    stats: {
        total: number;
        privati: number;
        aziende: number;
    };
};

export default function ClientsClient({ clients, stats }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'PRIVATE' | 'COMPANY'>('ALL');
    const [cityFilter, setCityFilter] = useState<string>('ALL');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Derived Data for Filters
    const uniqueCities = Array.from(new Set(clients.map(c => c.city).filter(Boolean))).sort() as string[];

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (c.taxId && c.taxId.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
        const matchesCity = cityFilter === 'ALL' || c.city === cityFilter;
        
        return matchesSearch && matchesType && matchesCity;
    }).sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortKey === 'createdAt') {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
        <div className="flex flex-col gap-10 pb-20 reveal">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                <div>
                  <div className="page-label">
                    <UserCheck className="text-blue-600" size={14} />
                    Corporate Client Relations
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Anagrafica Contatti</h1>
                  <p className="text-sm font-medium text-slate-500 mt-2">Gestione stakeholder, committenti privati e partner aziendali</p>
                </div>
                <Link 
                    href="/clients/new"
                    className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2 transform active:scale-95"
                >
                    <Plus size={18} /> Nuovo Stakeholder
                </Link>
            </div>

            {/* Strategic KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <User size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totale Contatti</p>
                  </div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.total}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Database globale relazionale</p>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <UserCheck size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clienti Privati</p>
                  </div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.privati}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Segmento B2C / Committenti diretti</p>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-purple-500">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                          <Building2 size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Aziendali</p>
                  </div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stats.aziende}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Segmento B2B / Fornitori strategici</p>
               </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full relative">
                        <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cerca per nome, email o P.IVA..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classificazione</label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                        >
                            <option value="ALL">Tutti i tipi</option>
                            <option value="PRIVATE">Privato</option>
                            <option value="COMPANY">Azienda / Fornitore</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Geolocalizzazione</label>
                        <select 
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                        >
                            <option value="ALL">Tutte le città</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ordina per</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                        >
                            <option value="name">Ragione Sociale</option>
                            <option value="createdAt">Data Inserimento</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Direzione</label>
                        <button 
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="w-full h-[46px] bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 hover:bg-slate-100 transition-all flex items-center justify-between"
                        >
                            {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                            <TrendingUp size={16} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </button>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setTypeFilter('ALL'); setCityFilter('ALL');
                                setSortKey('name'); setSortOrder('asc');
                            }}
                            className="w-full h-[46px] border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="group relative bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-blue-600/20 transform hover:-translate-y-1">
                            <div className="h-32 bg-slate-900 relative p-8 flex justify-between items-start">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                                <span className={`relative z-10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md ${
                                    client.type === 'PRIVATE' ? 'bg-blue-500/80 text-white' : 'bg-purple-500/80 text-white'
                                }`}>
                                    {client.type === 'PRIVATE' ? 'Privato' : 'Azienda'}
                                </span>
                                <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center text-white">
                                    {client.type === 'PRIVATE' ? <User size={20} /> : <Building2 size={20} />}
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase mb-2 truncate">
                                        <Link href={`/clients/${client.id}`}>{client.name}</Link>
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={10} className="text-blue-500" /> {client.city || 'Location non specificata'}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50 mb-8 flex-1">
                                    {client.email && (
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                            <Mail size={14} className="text-slate-300" />
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                    )}
                                    {client.phone && (
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                            <Phone size={14} className="text-slate-300" />
                                            <span>{client.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        <TrendingUp size={14} className="text-slate-300" />
                                        <span className="font-black text-slate-900 uppercase">VAT: {client.taxId || '—'}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">ID: {String(client.number).padStart(3, '0')}</span>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/clients/${client.id}/edit`} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all border border-slate-100">
                                            <Edit size={18} />
                                        </Link>
                                        <Link 
                                            href={`/clients/${client.id}`} 
                                            className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all border border-slate-100"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-10 py-6">Soggetto / Stakeholder</th>
                                <th className="px-6 py-6">Classificazione</th>
                                <th className="px-6 py-6">Luogo</th>
                                <th className="px-6 py-6">Digital Assets</th>
                                <th className="px-6 py-6">Tax ID</th>
                                <th className="px-10 py-6 text-right">Dettagli</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                                                client.type === 'PRIVATE' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 uppercase tracking-tighter text-base group-hover:text-blue-600 transition-colors">
                                                    <Link href={`/clients/${client.id}`}>{client.name}</Link>
                                                </p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">CODE: CL-{String(client.number).padStart(3, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                                            client.type === 'PRIVATE' 
                                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                        }`}>
                                            {client.type === 'PRIVATE' ? 'Privato' : 'Azienda'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                            <MapPin size={14} className="text-blue-500" /> {client.city || '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-slate-900">{client.email || '—'}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{client.phone || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-black text-slate-900 font-mono tracking-tighter bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                            {client.taxId || '—'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <Link href={`/clients/${client.id}`} className="inline-flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100">
                                            <ChevronRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredClients.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <UserCheck size={48} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">Nessuno stakeholder rilevato</p>
                    <p className="text-xs text-slate-400 mt-2">Modifica i criteri di ricerca per sbloccare i dati.</p>
                </div>
            )}
        </div>
    );
}
