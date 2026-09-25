'use client';

import { useState } from 'react';
import { Plus, Search as SearchIcon, LayoutGrid, List, User, Building2, MapPin, Mail, Phone, ChevronRight, Edit, Users, UserCheck } from 'lucide-react';
import Link from 'next/link';

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
    
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <Users size={14} className="text-[#003F61]" />
                        <span>Amministrazione / Anagrafica Committenti</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Anagrafica Clienti</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestione anagrafica clienti privati, società committenti e recapiti di fatturazione.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/clients/new"
                        className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Plus size={16} /> Nuovo Cliente
                    </Link>
                </div>
            </div>

            {/* 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Totale Clienti</span>
                        <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                            <Users size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{stats.total}</div>
                        <div className="text-xs text-slate-500 mt-1">Committenti registrati</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Clienti Privati</span>
                        <div className="p-2 bg-slate-50 text-blue-600 border border-slate-100">
                            <UserCheck size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{stats.privati}</div>
                        <div className="text-xs text-slate-500 mt-1">Committenza privata (B2C)</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Società & Aziende</span>
                        <div className="p-2 bg-slate-50 text-indigo-600 border border-slate-100">
                            <Building2 size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61] tracking-tight">{stats.aziende}</div>
                        <div className="text-xs text-slate-500 mt-1">Clientela business (B2B)</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cerca cliente per nome, email o Codice Fiscale / P.IVA..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
                        />
                    </div>
                    
                    <div className="flex border border-slate-200 shrink-0">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            title="Vista a Tabella"
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#003F61] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            title="Vista a Griglia"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Tipologia</label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="ALL">Tutti i tipi</option>
                            <option value="PRIVATE">Privato</option>
                            <option value="COMPANY">Azienda</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Città</label>
                        <select 
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="ALL">Tutte le città</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Ordina per</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="name">Ragione Sociale / Nominativo</option>
                            <option value="createdAt">Data Inserimento</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setTypeFilter('ALL'); setCityFilter('ALL');
                                setSortKey('name'); setSortOrder('asc');
                            }}
                            className="w-full h-[34px] border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'list' ? (
                <div className="bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Nominativo / Ragione Sociale</th>
                                <th className="px-4 py-3">Tipologia</th>
                                <th className="px-4 py-3">Località</th>
                                <th className="px-4 py-3">Contatti</th>
                                <th className="px-4 py-3">Codice Fiscale / P.IVA</th>
                                <th className="px-4 py-3 text-center">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <Link href={`/clients/${client.id}`} className="font-bold text-slate-900 block hover:text-[#003F61]">
                                            {client.name}
                                        </Link>
                                        <span className="text-[10px] text-slate-400 font-medium block">
                                            COD: CL-{String(client.number || 0).padStart(3, '0')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                            client.type === 'PRIVATE' 
                                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                        }`}>
                                            {client.type === 'PRIVATE' ? 'Privato' : 'Azienda'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} className="text-[#003F61]" />
                                            {client.city || '—'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-slate-600">
                                        <div>{client.email || '—'}</div>
                                        <div className="text-slate-400">{client.phone || ''}</div>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                                        {client.taxId || '—'}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link 
                                                href={`/clients/${client.id}`} 
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#003F61] bg-slate-50 hover:bg-[#003F61] hover:text-white border border-slate-200 transition-colors"
                                            >
                                                Apri <ChevronRight size={12} />
                                            </Link>
                                            <Link 
                                                href={`/clients/${client.id}/edit`} 
                                                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                                                title="Modifica"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="bg-white border border-slate-200 hover:border-slate-400 transition-all flex flex-col p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        CL-{String(client.number || 0).padStart(3, '0')}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-base mt-0.5 hover:text-[#003F61] transition-colors truncate max-w-[200px]">
                                        <Link href={`/clients/${client.id}`}>{client.name}</Link>
                                    </h3>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                    client.type === 'PRIVATE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                    {client.type === 'PRIVATE' ? 'Privato' : 'Azienda'}
                                </span>
                            </div>

                            <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 my-auto">
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-[#003F61] shrink-0" />
                                    <span>{client.city || 'Città non specificata'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={12} className="text-[#003F61] shrink-0" />
                                    <span className="truncate">{client.email || 'Nessuna email'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={12} className="text-[#003F61] shrink-0" />
                                    <span>{client.phone || 'Nessun telefono'}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                                <span className="font-mono text-slate-500 font-medium">{client.taxId || 'CF/P.IVA —'}</span>
                                <div className="flex items-center gap-2">
                                    <Link href={`/clients/${client.id}/edit`} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                                        <Edit size={14} />
                                    </Link>
                                    <Link 
                                        href={`/clients/${client.id}`} 
                                        className="px-3 py-1 bg-slate-50 hover:bg-[#003F61] text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                                    >
                                        Scheda <ChevronRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredClients.length === 0 && (
                <div className="bg-white border border-slate-200 p-12 text-center">
                    <UserCheck size={36} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessun committente trovato</p>
                    <p className="text-xs text-slate-500 mt-1">Nessun cliente corrisponde ai criteri di ricerca specificati.</p>
                </div>
            )}
        </div>
    );
}
