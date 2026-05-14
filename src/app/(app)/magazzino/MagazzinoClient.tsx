'use client';

import { useState, useTransition } from 'react';
import { 
    Package, Truck, Search, Plus, Wrench, AlertTriangle, 
    Boxes, Trash2, ArrowRight, LayoutGrid, List, CheckCircle2, 
    AlertCircle, ShoppingCart, TrendingUp, MapPin, User,
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
        <div className="flex flex-col gap-10 pb-20 reveal">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                <div>
                    <div className="page-label">
                        <Warehouse className="text-blue-600" size={14} />
                        Supply Chain & Asset Infrastructure
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Logistica & Magazzino</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Monitoraggio inventario, flotta mezzi e attrezzatura tecnica in tempo reale</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => activeTab === 'magazzino' ? setIsNuovoArticoloOpen(true) : setIsNuovaAttrezzaturaOpen(true)}
                        className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        <Plus size={18} /> {activeTab === 'magazzino' ? 'Nuovo Articolo' : activeTab === 'mezzi' ? 'Registra Mezzo' : 'Aggiungi Attrezzo'}
                    </button>
                </div>
            </div>

            {/* Strategic Navigation & Contextual KPIs */}
            <div className="flex flex-col gap-8">
                <div className="flex bg-slate-50 p-1.5 rounded-[2rem] no-print border border-slate-100 self-start shadow-sm">
                    <button 
                        onClick={() => { setActiveTab('magazzino'); setSortKey('nome'); }}
                        className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'magazzino' ? 'bg-white text-blue-700 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Package size={14} /> Materiali
                    </button>
                    <button 
                        onClick={() => { setActiveTab('mezzi'); setSortKey('nome'); }}
                        className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mezzi' ? 'bg-white text-blue-700 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Truck size={14} /> Flotta Mezzi
                    </button>
                    <button 
                        onClick={() => { setActiveTab('attrezzi'); setSortKey('nome'); }}
                        className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'attrezzi' ? 'bg-white text-blue-700 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Wrench size={14} /> Attrezzatura
                    </button>
                </div>

                {/* KPI Ribbon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 no-print">
                    {activeTab === 'magazzino' && (
                        <>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Package size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referenze SKU</p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalArticoli}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Articoli attivi in inventario</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-orange-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Critico</p>
                                </div>
                                <p className={`text-4xl font-black tracking-tighter leading-none ${lowStockCount > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{lowStockCount}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Richiede riordino immediato</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <TrendingUp size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valore Totale</p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalStockValue.toLocaleString('it-IT')} <span className="text-lg text-slate-300 ml-1">€</span></p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Asset correnti immobilizzati</p>
                            </div>
                        </>
                    )}

                    {activeTab === 'mezzi' && (
                        <>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Truck size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flotta Aziendale</p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalVeicoli}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Veicoli registrati a sistema</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operativi</p>
                                </div>
                                <p className="text-4xl font-black text-emerald-600 tracking-tighter leading-none">{availableFleet}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Disponibilità immediata</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-rose-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                                        <Settings2 size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fermo Tecnico</p>
                                </div>
                                <p className={`text-4xl font-black tracking-tighter leading-none ${maintenanceMezzi > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{maintenanceMezzi}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">In manutenzione programmata</p>
                            </div>
                        </>
                    )}

                    {activeTab === 'attrezzi' && (
                        <>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Wrench size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Tecnici</p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{totalAttrezzi}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Attrezzatura registrata</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-indigo-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                        <User size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assegnati</p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{inUsoAttrezzi}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">In carico al personale operativo</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-rose-600">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                                        <AlertCircle size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scadenze Rev.</p>
                                </div>
                                <p className={`text-4xl font-black tracking-tighter leading-none ${criticalAttrezzi > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{criticalAttrezzi}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 italic tracking-wider">Alert manutenzione / verifica</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Action Bar & Filters */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 w-full relative">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={activeTab === 'magazzino' ? "Cerca codice o materiale..." : "Cerca per nome, targa o modello..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {activeTab === 'magazzino' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Class</label>
                                <select 
                                    value={categoriaFilter}
                                    onChange={(e) => setCategoriaFilter(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                                >
                                    <option value="ALL">Tutte le categorie</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Disponibilità</label>
                                <select 
                                    value={scortaFilter}
                                    onChange={(e) => setScortaFilter(e.target.value as any)}
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                                >
                                    <option value="ALL">Qualsiasi livello</option>
                                    <option value="CRITICA">Sottoscorta (Alert)</option>
                                    <option value="OK">Giacenza OK</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stato Asset</label>
                            <select 
                                value={statoMezzoFilter}
                                onChange={(e) => setStatoMezzoFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                            >
                                <option value="ALL">Qualsiasi stato</option>
                                <option value="DISPONIBILE">Disponibile</option>
                                <option value="IN_USO">In Uso</option>
                                <option value="MANUTENZIONE">Manutenzione</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Metrica Sort</label>
                        <select 
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-wider rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/10 cursor-pointer appearance-none"
                        >
                            <option value="nome">Nome / Modello</option>
                            {activeTab === 'magazzino' ? (
                                <>
                                    <option value="giacenza">Giacenza</option>
                                    <option value="costo">Costo Unitario</option>
                                </>
                            ) : (
                                <option value="stato">Stato Attuale</option>
                            )}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={() => {
                                setSearchTerm(''); setCategoriaFilter('ALL'); setScortaFilter('ALL');
                                setStatoMezzoFilter('ALL'); setSortKey('nome'); setSortOrder('asc');
                            }}
                            className="w-full h-[46px] border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            Reset Filtri
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'magazzino' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-10 py-6">SKU / Reference</th>
                                    <th className="px-6 py-6">Descrizione Articolo</th>
                                    <th className="px-6 py-6">Categoria</th>
                                    <th className="px-6 py-6 text-right">Giacenza Ledger</th>
                                    <th className="px-6 py-6 text-right">Costo Unit.</th>
                                    <th className="px-10 py-6 text-right">Analisi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredArticoli.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-10 py-24 text-center text-slate-400 font-black uppercase tracking-widest">Nessun articolo rilevato</td>
                                    </tr>
                                ) : (
                                    filteredArticoli.map((art) => {
                                        const inEsaurimento = art.giacenza <= art.livelloScortaMin;
                                        return (
                                            <tr key={art.id} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-10 py-6 font-mono text-[11px] font-black text-slate-400">{art.codice}</td>
                                                <td className="px-6 py-6">
                                                    <div className="font-black text-slate-900 uppercase tracking-tighter text-base flex items-center gap-3">
                                                        {inEsaurimento && <AlertTriangle size={16} className="text-orange-500" />}
                                                        {art.nome}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    {art.categoria || 'Generico'}
                                                  </span>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border flex items-center justify-center gap-2 w-fit ml-auto ${
                                                        inEsaurimento 
                                                        ? 'text-orange-700 bg-orange-50 border-orange-100' 
                                                        : 'text-blue-700 bg-blue-50 border-blue-100'
                                                    }`}>
                                                        {Number(art.giacenza).toLocaleString('it-IT')} {art.unitaMisura}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-right text-slate-900 font-black text-base tracking-tighter">
                                                    {art.costoUnitario ? `€ ${art.costoUnitario.toLocaleString('it-IT')}` : '-'}
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100">
                                                            <BarChart3 size={18} />
                                                        </button>
                                                        {role === 'ADMIN' && (
                                                            <button onClick={() => deleteArticolo(art.id)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all border border-slate-100 opacity-0 group-hover:opacity-100">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-orange-50/50 rounded-[2.5rem] p-8 border border-orange-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6">
                              <AlertCircle size={20} className="text-orange-600" />
                              <h3 className="font-black text-orange-900 text-[10px] uppercase tracking-[0.2em]">Priority Stock Alerts</h3>
                            </div>
                            <div className="space-y-4">
                                {articoli.filter(a => a.giacenza <= a.livelloScortaMin).slice(0, 5).map(art => (
                                    <div key={art.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-md border border-orange-100/50 group hover:translate-x-1 transition-transform">
                                        <div className="min-w-0 flex-1 pr-2">
                                          <p className="font-black text-slate-900 text-[11px] truncate uppercase tracking-tight leading-none mb-1">{art.nome}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Min: {art.livelloScortaMin}</p>
                                        </div>
                                        <span className="text-orange-600 font-black text-xs bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 shadow-inner">{art.giacenza}</span>
                                    </div>
                                ))}
                                {articoli.filter(a => a.giacenza <= a.livelloScortaMin).length === 0 && (
                                    <div className="text-center py-10 text-orange-400">
                                      <CheckCircle2 size={40} className="mx-auto mb-4 opacity-20" />
                                      <p className="text-[10px] font-black uppercase tracking-widest">Compliance OK</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 border-b-8 border-b-blue-600">
                            <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                              <BarChart3 size={20} className="text-blue-500" /> Distribution Matrix
                            </h3>
                            <div className="space-y-8">
                                {Array.from(new Set(articoli.map(a => a.categoria || 'Generico'))).slice(0, 4).map(cat => {
                                    const count = articoli.filter(a => (a.categoria || 'Generico') === cat).length;
                                    const percentage = Math.min(100, (count / (articoli.length || 1)) * 100);
                                    return (
                                        <div key={cat} className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-500 truncate mr-2">{cat}</span>
                                                <span className="text-slate-900">{count} SKU</span>
                                            </div>
                                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                              <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {filteredAssets.map((asset) => (
                        <div 
                            key={asset.id} 
                            onClick={() => setSelectedAttrezzo(asset)}
                            className="group cursor-pointer relative bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 hover:border-blue-600/30 transition-all flex flex-col hover:shadow-2xl hover:-translate-y-2 border-b-8 border-b-slate-50 hover:border-b-blue-600/20"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${asset.tipo === 'VEICOLO' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                                    {asset.tipo === 'VEICOLO' ? <Truck size={28} /> : <Wrench size={28} />}
                                </div>
                                <div className="flex items-center">
                                      <select 
                                          value={asset.stato}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) => handleStatoChange(e, asset.id, e.target.value)}
                                          className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none border shadow-sm transition-all text-center min-w-[120px] ${
                                              asset.stato === 'DISPONIBILE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                              asset.stato === 'IN_USO' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                              'bg-rose-50 text-rose-700 border-rose-100'
                                          }`}
                                      >
                                          <option value="DISPONIBILE">Disponibile</option>
                                          <option value="IN_USO">In Uso</option>
                                          <option value="MANUTENZIONE">Manutenzione</option>
                                      </select>
                                </div>
                            </div>
                            
                            <h3 className="font-black text-slate-900 text-2xl tracking-tighter uppercase leading-none mb-3 group-hover:text-blue-600 transition-colors">{asset.nome}</h3>
                            {asset.targa && (
                                <div className="inline-flex bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl shadow-inner mb-6 w-fit">
                                    <span className="font-mono text-[10px] font-black tracking-[0.2em] text-slate-500">{asset.targa.toUpperCase()}</span>
                                </div>
                            )}

                            {/* Assignment Indicators */}
                            <div className="space-y-4 py-6 border-y border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                        <MapPin size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Località / Cantiere</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{asset.project?.name || 'In Sede Centrale'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                        <User size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assegnatario</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{asset.dipendente ? `${asset.dipendente.nome} ${asset.dipendente.cognome || ''}` : 'Pool Asset'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-between items-end">
                                <div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Costo Operativo</p>
                                  <span className="font-black text-slate-900 text-2xl tracking-tighter leading-none">
                                    {asset.costoOrario ? `€ ${asset.costoOrario.toLocaleString('it-IT')}` : '-'}
                                    <span className="text-slate-300 text-sm font-black ml-1">/H</span>
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {asset.dataManutenzione && new Date(asset.dataManutenzione) < new Date() && (
                                        <div className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-pulse" title="Manutenzione Scaduta!">
                                            <AlertCircle size={18} />
                                        </div>
                                    )}
                                    <button className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg transform active:scale-90">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredAssets.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-32 bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                            <Wrench size={48} className="mx-auto text-slate-200 mb-6 opacity-30" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nessun asset rilevato nel catalogo</p>
                        </div>
                    )}
                </div>
            )}

            <SlideOver 
                isOpen={isNuovoArticoloOpen} 
                onClose={() => setIsNuovoArticoloOpen(false)} 
                title={<div className="flex items-center gap-2 uppercase tracking-widest font-black text-[10px]">📦 <span>Registrazione Nuovo Articolo</span></div>}
            >
                <NuovoArticoloForm onSuccess={() => setIsNuovoArticoloOpen(false)} />
            </SlideOver>

            <SlideOver 
                isOpen={isNuovaAttrezzaturaOpen} 
                onClose={() => setIsNuovaAttrezzaturaOpen(false)} 
                title={<div className="flex items-center gap-2 uppercase tracking-widest font-black text-[10px]">🚜 <span>Provisioning Asset Tecnico</span></div>}
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
                title={<div className="flex items-center gap-2 uppercase tracking-widest font-black text-[10px]">📜 <span>Analisi Scheda Tecnica</span></div>}
            >
                {selectedAttrezzo && <SchedaAttrezzo attrezzo={selectedAttrezzo} />}
            </SlideOver>
        </div>
    );
}
