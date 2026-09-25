'use client';

import { useState, useTransition } from 'react';
import { 
    Package, Truck, Search, Plus, Wrench, AlertTriangle, 
    Trash2, ArrowRight, CheckCircle2, 
    AlertCircle, TrendingUp, MapPin, User,
    BarChart3, Settings2, ShieldCheck, Warehouse
} from 'lucide-react';
import { deleteArticolo, deleteAttrezzatura, updateStatoAttrezzatura } from '../magazzino-actions';
import { useAuth } from '@/lib/auth-mock';
import NuovaAttrezzaturaForm from './components/NuovaAttrezzaturaForm';
import NuovoArticoloForm from './components/NuovoArticoloForm';
import SchedaAttrezzo from './components/SchedaAttrezzo';
import SlideOver from '@/components/SlideOver';

type Props = {
    articoli: any[];
    attrezzature: any[];
    projects: any[];
    lavoratori: any[];
};

export default function MagazzinoClient({ articoli, attrezzature, projects, lavoratori }: Props) {
    const { role } = useAuth();
    const [activeTab, setActiveTab] = useState<'magazzino' | 'mezzi' | 'attrezzi'>('magazzino');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState<string>('ALL');
    const [scortaFilter, setScortaFilter] = useState<'ALL' | 'CRITICA' | 'OK'>('ALL');
    const [statoMezzoFilter, setStatoMezzoFilter] = useState<string>('ALL');
    const [sortKey, setSortKey] = useState<string>('nome');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [isNuovoArticoloOpen, setIsNuovoArticoloOpen] = useState(false);
    const [isNuovaAttrezzaturaOpen, setIsNuovaAttrezzaturaOpen] = useState(false);
    const [selectedAttrezzo, setSelectedAttrezzo] = useState<any>(null);
    const [isPending, startTransition] = useTransition();

    const filteredArticoli = articoli.filter(a => {
        const searchMatch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.codice.toLowerCase().includes(searchTerm.toLowerCase());
        const categoriaMatch = categoriaFilter === 'ALL' || a.categoria === categoriaFilter;
        const lowStock = a.giacenza <= a.livelloScortaMin;
        const scortaMatch = scortaFilter === 'ALL' || (scortaFilter === 'CRITICA' && lowStock) || (scortaFilter === 'OK' && !lowStock);
        
        return searchMatch && categoriaMatch && scortaMatch;
    }).sort((a, b) => {
        let comp = 0;
        if (sortKey === 'nome') comp = a.nome.localeCompare(b.nome);
        else if (sortKey === 'giacenza') comp = a.giacenza - b.giacenza;
        else if (sortKey === 'costo') comp = (a.costoUnitario || 0) - (b.costoUnitario || 0);
        return sortOrder === 'asc' ? comp : -comp;
    });

    const getTabAssets = () => {
        if (activeTab === 'mezzi') return attrezzature.filter(a => a.tipo === 'VEICOLO');
        if (activeTab === 'attrezzi') return attrezzature.filter(a => a.tipo === 'ATTREZZATURA');
        return [];
    };

    const filteredAssets = getTabAssets().filter(a => {
        const searchMatch = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || (a.targa && a.targa.toLowerCase().includes(searchTerm.toLowerCase()));
        const statoMatch = statoMezzoFilter === 'ALL' || a.stato === statoMezzoFilter;
        return searchMatch && statoMatch;
    }).sort((a, b) => {
        let comp = 0;
        if (sortKey === 'nome') comp = a.nome.localeCompare(b.nome);
        else if (sortKey === 'stato') comp = a.stato.localeCompare(b.stato);
        return sortOrder === 'asc' ? comp : -comp;
    });

    const handleStatoChange = async (e: any, id: string, newStato: string) => {
        e.stopPropagation();
        startTransition(async () => {
            await updateStatoAttrezzatura(id, newStato);
        });
    };

    // KPI Calculations
    const totalArticoli = articoli.length;
    const lowStockCount = articoli.filter(a => a.giacenza <= a.livelloScortaMin).length;
    const totalStockValue = articoli.reduce((acc, a) => acc + ((a.giacenza || 0) * (a.costoUnitario || 0)), 0);

    const veicoli = attrezzature.filter(a => a.tipo === 'VEICOLO');
    const totalVeicoli = veicoli.length;
    const availableFleet = veicoli.filter(v => v.stato === 'DISPONIBILE').length;
    const maintenanceMezzi = veicoli.filter(v => v.stato === 'MANUTENZIONE').length;

    const attrezzi = attrezzature.filter(a => a.tipo === 'ATTREZZATURA');
    const totalAttrezzi = attrezzi.length;
    const inUsoAttrezzi = attrezzi.filter(a => a.stato === 'IN_USO' || a.cantiereId || a.dipendenteId).length;
    const criticalAttrezzi = attrezzi.filter(a => (a.dataManutenzione && new Date(a.dataManutenzione) < new Date())).length;

    const categories = Array.from(new Set(articoli.map(a => a.categoria || 'Generico')));

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <Warehouse size={14} className="text-[#003F61]" />
                        <span>Operazioni / Gestione Magazzino & Logistica</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Logistica & Magazzino</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestione scorte materiali, anagrafica parco mezzi e attrezzature di cantiere.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => activeTab === 'magazzino' ? setIsNuovoArticoloOpen(true) : setIsNuovaAttrezzaturaOpen(true)}
                        className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Plus size={16} /> {activeTab === 'magazzino' ? 'Nuovo Articolo' : activeTab === 'mezzi' ? 'Registra Mezzo' : 'Aggiungi Attrezzo'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border border-slate-200 bg-white w-fit">
                <button 
                    onClick={() => { setActiveTab('magazzino'); setSortKey('nome'); }}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeTab === 'magazzino' ? 'bg-[#003F61] text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Package size={14} /> Materiali & Merci
                </button>
                <button 
                    onClick={() => { setActiveTab('mezzi'); setSortKey('nome'); }}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-l border-slate-200 ${
                        activeTab === 'mezzi' ? 'bg-[#003F61] text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Truck size={14} /> Parco Mezzi
                </button>
                <button 
                    onClick={() => { setActiveTab('attrezzi'); setSortKey('nome'); }}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-l border-slate-200 ${
                        activeTab === 'attrezzi' ? 'bg-[#003F61] text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Wrench size={14} /> Attrezzatura Tecnica
                </button>
            </div>

            {/* 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeTab === 'magazzino' && (
                    <>
                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Referenze SKU</span>
                                <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                                    <Package size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[#003F61] tracking-tight">{totalArticoli}</div>
                                <div className="text-xs text-slate-500 mt-1">Articoli registrati a magazzino</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Sottoscorta (Alert)</span>
                                <div className="p-2 bg-slate-50 text-amber-600 border border-slate-100">
                                    <AlertTriangle size={16} />
                                </div>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold tracking-tight ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{lowStockCount}</div>
                                <div className="text-xs text-slate-500 mt-1">Giacenza al di sotto della soglia minima</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Valore Inventario</span>
                                <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
                                    <TrendingUp size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[#003F61] tracking-tight">€ {totalStockValue.toLocaleString('it-IT')}</div>
                                <div className="text-xs text-slate-500 mt-1">Valore economico complessivo scorte</div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'mezzi' && (
                    <>
                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Flotta Aziendale</span>
                                <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                                    <Truck size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[#003F61] tracking-tight">{totalVeicoli}</div>
                                <div className="text-xs text-slate-500 mt-1">Veicoli aziendali a libro cespiti</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Mezzi Operativi</span>
                                <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
                                    <ShieldCheck size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-600 tracking-tight">{availableFleet}</div>
                                <div className="text-xs text-slate-500 mt-1">Disponibili o in regolare servizio</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Fermo Tecnico</span>
                                <div className="p-2 bg-slate-50 text-rose-600 border border-slate-100">
                                    <Settings2 size={16} />
                                </div>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold tracking-tight ${maintenanceMezzi > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{maintenanceMezzi}</div>
                                <div className="text-xs text-slate-500 mt-1">In officina / manutenzione</div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'attrezzi' && (
                    <>
                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Attrezzature Censite</span>
                                <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
                                    <Wrench size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[#003F61] tracking-tight">{totalAttrezzi}</div>
                                <div className="text-xs text-slate-500 mt-1">Asset tecnici e macchinari</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">In Uso su Cantiere</span>
                                <div className="p-2 bg-slate-50 text-indigo-600 border border-slate-100">
                                    <User size={16} />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-[#003F61] tracking-tight">{inUsoAttrezzi}</div>
                                <div className="text-xs text-slate-500 mt-1">Assegnati al personale operativo</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider">Scadenze Manutenzione</span>
                                <div className="p-2 bg-slate-50 text-rose-600 border border-slate-100">
                                    <AlertCircle size={16} />
                                </div>
                            </div>
                            <div>
                                <div className={`text-2xl font-bold tracking-tight ${criticalAttrezzi > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{criticalAttrezzi}</div>
                                <div className="text-xs text-slate-500 mt-1">Revisioni o verifiche periodiche scadute</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={activeTab === 'magazzino' ? "Cerca per codice SKU o nome materiale..." : "Cerca per modello, targa o matricola..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61] transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                    {activeTab === 'magazzino' ? (
                        <>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Categoria</label>
                                <select 
                                    value={categoriaFilter}
                                    onChange={(e) => setCategoriaFilter(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                                >
                                    <option value="ALL">Tutte le categorie</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Stato Scorta</label>
                                <select 
                                    value={scortaFilter}
                                    onChange={(e) => setScortaFilter(e.target.value as any)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                                >
                                    <option value="ALL">Qualsiasi livello</option>
                                    <option value="CRITICA">Sottoscorta (Critico)</option>
                                    <option value="OK">Giacenza Regolare</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Stato Operativo</label>
                            <select 
                                value={statoMezzoFilter}
                                onChange={(e) => setStatoMezzoFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                            >
                                <option value="ALL">Qualsiasi stato</option>
                                <option value="DISPONIBILE">Disponibile</option>
                                <option value="IN_USO">In Uso</option>
                                <option value="MANUTENZIONE">Manutenzione</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Ordina per</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-2 outline-none focus:border-[#003F61] cursor-pointer"
                        >
                            <option value="nome">Nome / Modello</option>
                            {activeTab === 'magazzino' ? (
                                <>
                                    <option value="giacenza">Quantità in Giacenza</option>
                                    <option value="costo">Costo Unitario</option>
                                </>
                            ) : (
                                <option value="stato">Stato di Servizio</option>
                            )}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setCategoriaFilter('ALL'); setScortaFilter('ALL');
                                setStatoMezzoFilter('ALL'); setSortKey('nome'); setSortOrder('asc');
                            }}
                            className="w-full h-[34px] border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'magazzino' ? (
                <div className="bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Codice SKU</th>
                                <th className="px-4 py-3">Nome Articolo</th>
                                <th className="px-4 py-3">Categoria</th>
                                <th className="px-4 py-3 text-right">Giacenza</th>
                                <th className="px-4 py-3 text-right">Costo Unitario</th>
                                <th className="px-4 py-3 text-center">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredArticoli.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                                        Nessun articolo a magazzino
                                    </td>
                                </tr>
                            ) : (
                                filteredArticoli.map((art) => {
                                    const inEsaurimento = art.giacenza <= art.livelloScortaMin;
                                    return (
                                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-500">{art.codice}</td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                                    {inEsaurimento && <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
                                                    {art.nome}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold">
                                                    {art.categoria || 'Generico'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <span className={`px-2 py-0.5 text-xs font-bold border ${
                                                    inEsaurimento 
                                                    ? 'text-amber-800 bg-amber-50 border-amber-200' 
                                                    : 'text-slate-800 bg-slate-50 border-slate-200'
                                                }`}>
                                                    {Number(art.giacenza).toLocaleString('it-IT')} {art.unitaMisura}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                                                {art.costoUnitario ? `€ ${art.costoUnitario.toLocaleString('it-IT')}` : '—'}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {role === 'ADMIN' && (
                                                        <button 
                                                            onClick={() => deleteArticolo(art.id)} 
                                                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                            title="Elimina"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAssets.map((asset) => (
                        <div 
                            key={asset.id} 
                            onClick={() => setSelectedAttrezzo(asset)}
                            className="bg-white border border-slate-200 hover:border-slate-400 transition-all flex flex-col p-5 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-slate-50 border border-slate-200 text-[#003F61]">
                                    {asset.tipo === 'VEICOLO' ? <Truck size={20} /> : <Wrench size={20} />}
                                </div>
                                <select 
                                    value={asset.stato}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleStatoChange(e, asset.id, e.target.value)}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border cursor-pointer ${
                                        asset.stato === 'DISPONIBILE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        asset.stato === 'IN_USO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                >
                                    <option value="DISPONIBILE">Disponibile</option>
                                    <option value="IN_USO">In Uso</option>
                                    <option value="MANUTENZIONE">Manutenzione</option>
                                </select>
                            </div>
                            
                            <h3 className="font-bold text-slate-900 text-base mb-1 hover:text-[#003F61] transition-colors">{asset.nome}</h3>
                            {asset.targa && (
                                <span className="text-[11px] font-mono text-slate-500 block mb-3 font-semibold">TARGA: {asset.targa.toUpperCase()}</span>
                            )}

                            <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 my-auto">
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-[#003F61] shrink-0" />
                                    <span className="truncate">Cantiere: {asset.project?.name || 'Sede Centrale'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={12} className="text-[#003F61] shrink-0" />
                                    <span className="truncate">Assegnatario: {asset.dipendente ? `${asset.dipendente.nome} ${asset.dipendente.cognome || ''}` : 'Non assegnato'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-3 flex justify-between items-center text-xs">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Costo Orario</span>
                                    <span className="font-bold text-slate-900 text-sm">
                                        {asset.costoOrario ? `€ ${asset.costoOrario.toLocaleString('it-IT')}/h` : '—'}
                                    </span>
                                </div>
                                <button className="px-3 py-1 bg-slate-50 hover:bg-[#003F61] text-slate-700 hover:text-white border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1">
                                    Scheda <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredAssets.length === 0 && (
                        <div className="col-span-full bg-white border border-slate-200 p-12 text-center">
                            <Wrench size={36} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nessun asset trovato</p>
                            <p className="text-xs text-slate-500 mt-1">Nessun mezzo o attrezzo corrisponde ai criteri di ricerca.</p>
                        </div>
                    )}
                </div>
            )}

            <SlideOver 
                isOpen={isNuovoArticoloOpen} 
                onClose={() => setIsNuovoArticoloOpen(false)} 
                title={<div className="text-lg font-bold text-slate-900">Registrazione Nuovo Articolo</div>}
            >
                <NuovoArticoloForm onSuccess={() => setIsNuovoArticoloOpen(false)} />
            </SlideOver>

            <SlideOver 
                isOpen={isNuovaAttrezzaturaOpen} 
                onClose={() => setIsNuovaAttrezzaturaOpen(false)} 
                title={<div className="text-lg font-bold text-slate-900">Nuova Attrezzatura / Mezzo</div>}
            >
                <NuovaAttrezzaturaForm 
                    projects={projects} 
                    lavoratori={lavoratori} 
                    onSuccess={() => setIsNuovaAttrezzaturaOpen(false)} 
                />
            </SlideOver>

            <SlideOver 
                isOpen={!!selectedAttrezzo} 
                onClose={() => setSelectedAttrezzo(null)} 
                title={<div className="text-lg font-bold text-slate-900">Scheda Tecnica Asset</div>}
            >
                {selectedAttrezzo && <SchedaAttrezzo attrezzo={selectedAttrezzo} />}
            </SlideOver>
        </div>
    );
}
