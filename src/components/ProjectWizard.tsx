'use client';

import { useState, useTransition } from 'react';
import { createProject, getClients, getNextProjectNumber } from '@/app/(app)/actions';
import { ArrowRight, Search, UserPlus, Check, AlertCircle, Save, X, User, Briefcase, ChevronRight } from 'lucide-react';

type Props = {
    onSuccess?: () => void;
};

export default function ProjectWizard({ onSuccess }: Props) {
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();

    // Step 1 State
    const [searchQuery, setSearchQuery] = useState('');
    const [foundClient, setFoundClient] = useState<any>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [error, setError] = useState('');
    
    // New Client State
    const [isCreatingNewClient, setIsCreatingNewClient] = useState(false);
    const [newClientName, setNewClientName] = useState('');

    // Step 2 State
    const [formData, setFormData] = useState({
        description: '',
        budget: '',
        status: 'ONGOING'
    });

    const [nextProjectNum, setNextProjectNum] = useState<number | null>(null);

    const loadNextNumber = async (client: any) => {
        if (!client && !isCreatingNewClient) return;
        
        if (isCreatingNewClient) {
            setNextProjectNum(1);
            return;
        }

        const n = await getNextProjectNumber(client.id);
        setNextProjectNum(n);
    };

    const handleNameSearch = async (q: string) => {
        setSearchQuery(q);
        if (q.length < 2) {
            setSearchResults([]);
            return;
        }
        const clients = await getClients(q);
        setSearchResults(clients);
    };

    const selectClient = (client: any) => {
        setFoundClient(client);
        setIsCreatingNewClient(false);
        setSearchResults([]);
        setError('');
    };

    const startNewClient = () => {
        setIsCreatingNewClient(true);
        setFoundClient(null);
        setSearchResults([]);
        setError('');
    };

    const submitProject = async () => {
        if (!foundClient && !newClientName) {
            setError('Seleziona un cliente o inserisci il nome del nuovo cliente.');
            return;
        }

        const data = new FormData();
        data.append('description', formData.description);
        data.append('budget', formData.budget);
        data.append('status', formData.status);
        
        if (foundClient) {
            data.append('clientId', foundClient.id);
        } else {
            data.append('newClientName', newClientName);
        }

        startTransition(async () => {
            try {
                await createProject(data);
                if (onSuccess) onSuccess();
            } catch (e: any) {
                setError(e.message || 'Errore durante la creazione del progetto.');
            }
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 md:p-14 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10" />
            
            {/* Steps Progress */}
            <div className="flex items-center gap-4 mb-16">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${step >= 1 ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-300'}`}>01</div>
                    <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-slate-900' : 'bg-slate-50'}`} />
                </div>
                <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${step >= 2 ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-300'}`}>02</div>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div>
                      <div className="page-label mb-4">
                        <User className="text-blue-600" size={14} />
                        Identity Management
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Configurazione Committente</h2>
                      <p className="text-sm font-medium text-slate-500 mt-2">Identifica il cliente per l'emissione dei titoli e della fatturazione</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ricerca Anagrafica</label>
                            {!isCreatingNewClient && (
                                <button type="button" onClick={startNewClient} className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-2 uppercase tracking-widest">
                                    <UserPlus size={14} /> Nuovo Cliente
                                </button>
                            )}
                        </div>

                        {!isCreatingNewClient ? (
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleNameSearch(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all text-base font-bold text-slate-900 placeholder:text-slate-400 shadow-inner group-hover:bg-slate-100"
                                    placeholder="Cerca per nome, email o P.IVA..."
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 p-8 bg-blue-50/30 border border-blue-100 rounded-[2rem] relative animate-in zoom-in-95 duration-300">
                                <button onClick={() => setIsCreatingNewClient(false)} className="absolute top-6 right-6 text-blue-400 hover:text-blue-600 transition-colors">
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                        <UserPlus size={20} />
                                    </div>
                                    <span className="font-black text-blue-900 uppercase text-[10px] tracking-[0.2em]">Quick Enrollment</span>
                                </div>
                                <input
                                    type="text"
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    className="w-full px-8 py-5 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-8 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-lg font-black shadow-xl text-slate-900"
                                    placeholder="Ragione Sociale o Nome..."
                                    autoFocus
                                />
                                <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-widest italic">Anagrafica provvisoria. Dati fiscali editabili in seguito.</p>
                            </div>
                        )}

                        {!isCreatingNewClient && searchResults.length > 0 && (
                            <div className="space-y-3 mt-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                {searchResults.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => selectClient(c)}
                                        className={`w-full text-left p-6 rounded-[1.5rem] border transition-all flex justify-between items-center group/item ${
                                            foundClient?.id === c.id 
                                            ? 'bg-slate-900 border-slate-900 shadow-2xl text-white translate-x-1' 
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-900'
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="font-black text-base uppercase tracking-tight truncate leading-none mb-2 group-hover/item:text-blue-600 transition-colors">{c.name}</div>
                                            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${foundClient?.id === c.id ? 'text-slate-400' : 'text-slate-400'}`}>
                                                {c.taxId || 'Missing Tax ID / VAT'}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-4 ${foundClient?.id === c.id ? 'text-white' : 'text-slate-200'}`}>
                                            {c.number && <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${foundClient?.id === c.id ? 'bg-slate-800' : 'bg-slate-50 text-slate-400'}`}>#{c.number}</span>}
                                            {foundClient?.id === c.id ? <Check size={20} /> : <ChevronRight size={20} className="group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {!isCreatingNewClient && searchQuery.length > 2 && searchResults.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center gap-4">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Identità non rilevata nel database</p>
                                <button type="button" onClick={startNewClient} className="bg-white border border-slate-100 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-md">
                                    Iscrivi "{searchQuery}"
                                </button>
                            </div>
                        )}
                    </div>

                    {foundClient && (
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex justify-between items-center animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-200">
                                    {foundClient.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] leading-none mb-2 italic">Entity Validation OK</p>
                                    <p className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-none">{foundClient.name}</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                              <Check size={24} />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-6 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-4 border border-rose-100 animate-pulse">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-6">
                        <button
                            disabled={!foundClient && !newClientName}
                            onClick={() => {
                                setStep(2);
                                loadNextNumber(foundClient);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-20 disabled:grayscale text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all shadow-2xl hover:shadow-blue-900/20 active:scale-95 group"
                        >
                            Dettagli Tecnici <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-md">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2">Progetto Collegato A</p>
                                <p className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">
                                    {isCreatingNewClient ? newClientName : foundClient?.name}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-50">Switch Cliente</button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Codice Commessa</label>
                                <div className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 font-black text-base tracking-widest shadow-inner border-l-4 border-l-blue-600">
                                    {nextProjectNum ? `PRJ-${String(nextProjectNum).padStart(3, '0')}` : 'GENERAZIONE...'}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Inizializzazione Stato</label>
                                <select 
                                    className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 font-black text-[11px] uppercase tracking-widest outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all cursor-pointer shadow-sm appearance-none"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="ONGOING">✅ In Corso / Esecuzione</option>
                                    <option value="ESTIMATING">📝 Preventivazione / Studio</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Titolo Cantiere / Descrizione</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-8 py-5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 font-black text-base outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 uppercase tracking-tight"
                                placeholder="Esempio: Ristrutturazione Villa Palladium..."
                                autoFocus
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Budget di Commessa</label>
                            <div className="relative group">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg group-focus-within:text-blue-600 transition-colors">€</span>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full pl-16 pr-8 py-5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 font-black text-2xl outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-6">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full md:w-auto bg-white border border-slate-100 text-slate-400 hover:text-slate-600 font-black px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-50 active:scale-95"
                        >
                            Indietro
                        </button>
                        <button
                            onClick={submitProject}
                            disabled={!nextProjectNum || isPending || !formData.description}
                            className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale text-white px-12 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 group"
                        >
                            {isPending ? 'Propagazione dati...' : (
                                <>
                                    <Save size={20} className="group-hover:scale-110 transition-transform" /> Avvia Workflow Cantiere
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e2e8f0;
                }
            `}</style>
        </div>
    );
}
