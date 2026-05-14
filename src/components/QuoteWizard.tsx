'use client';

import { useState, useTransition, useEffect } from 'react';
import { Search, User, HardHat, FileText, Check, ChevronRight, ChevronLeft, Plus, Trash2, Calculator, Type, Loader2 } from 'lucide-react';
import { searchClients, searchProjectsByClient, createQuote } from '@/app/(app)/actions';

interface Client {
    id: string;
    name: string;
    firstName?: string | null;
    lastName?: string | null;
    number?: number | null;
}

interface Project {
    id: string;
    name: string;
    description?: string | null;
    items: any[];
}

interface QuoteWizardItem {
    id: string; // temp unique id
    type: 'ITEM' | 'TEXT';
    description: string;
    unit?: string;
    price?: number;
    quantity?: number;
    priceItemId?: string;
}

export default function QuoteWizard() {
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();

    // Step 1: Client Selection
    const [clientQuery, setClientQuery] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Step 2: Project Selection
    const [projectQuery, setProjectQuery] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

    // Step 3: Editor
    const [items, setItems] = useState<QuoteWizardItem[]>([]);
    const [vatType, setVatType] = useState('22%');

    // Searches
    useEffect(() => {
        if (clientQuery.length > 2) {
            searchClients(clientQuery).then(setClients);
        } else {
            setClients([]);
        }
    }, [clientQuery]);

    useEffect(() => {
        if (selectedClient && step === 2) {
            searchProjectsByClient(selectedClient.id, projectQuery).then(setProjects);
        }
    }, [selectedClient, step, projectQuery]);

    const handleNextStep = () => {
        if (step === 2) {
            // Pre-load items from selected projects
            const projectItems: QuoteWizardItem[] = [];
            projects.filter(p => selectedProjectIds.includes(p.id)).forEach(project => {
                project.items.forEach(pi => {
                    projectItems.push({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'ITEM',
                        description: pi.description,
                        unit: pi.unit,
                        price: pi.price,
                        quantity: pi.quantity
                    });
                });
            });
            if (items.length === 0) setItems(projectItems);
        }
        setStep(s => s + 1);
    };

    const handleBackStep = () => setStep(s => s - 1);

    const addItem = (type: 'ITEM' | 'TEXT') => {
        setItems([...items, {
            id: Math.random().toString(36).substr(2, 9),
            type,
            description: type === 'TEXT' ? 'Inserisci testo qui...' : 'Nuova voce di lavoro',
            price: type === 'ITEM' ? 0 : undefined,
            quantity: type === 'ITEM' ? 1 : undefined,
            unit: type === 'ITEM' ? 'cad' : undefined
        }]);
    };

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

    const updateItem = (id: string, updates: Partial<QuoteWizardItem>) => {
        setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    const calculateTaxable = () => items.reduce((sum, item) => sum + (item.type === 'ITEM' ? (item.price || 0) * (item.quantity || 0) : 0), 0);
    const taxable = calculateTaxable();
    const vatRate = vatType === '10%' ? 0.1 : vatType === '22%' ? 0.22 : 0;
    const vatAmount = taxable * vatRate;
    const total = taxable + vatAmount;

    const handleSubmit = () => {
        if (!selectedClient) return;
        startTransition(async () => {
            await createQuote({
                clientId: selectedClient.id,
                projectIds: selectedProjectIds,
                vatType,
                items: items.map(i => ({ ...i, id: undefined }))
            });
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Nav Steps */}
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? 'bg-blue-600 text-white ring-4 ring-blue-50' :
                                step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {step > s ? <Check size={16} /> : s}
                        </div>
                        <span className={`text-sm font-semibold ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                            {s === 1 ? 'Cliente' : s === 2 ? 'Progetti' : 'Editor'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 1: Cliente */}
            {step === 1 && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Associa Cliente</h2>
                        <p className="text-gray-500 text-sm">Cerca il cliente per cui vuoi creare il preventivo.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cerca per nome, cognome o P.IVA..."
                            value={clientQuery}
                            onChange={(e) => setClientQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        {clients.map(client => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${selectedClient?.id === client.id
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'hover:bg-gray-50 border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{client.name}</p>
                                        <p className="text-xs text-gray-500">#{client.number}</p>
                                    </div>
                                </div>
                                {selectedClient?.id === client.id && <Check className="text-blue-600" size={20} />}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled={!selectedClient}
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium disabled:opacity-50 transition-all"
                        >
                            Prosegui <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Progetti */}
            {step === 2 && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            <User size={12} /> {selectedClient?.name}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Seleziona Progetti</h2>
                        <p className="text-gray-500 text-sm">Scegli i cantieri da includere nel preventivo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map(project => (
                            <button
                                key={project.id}
                                onClick={() => {
                                    if (selectedProjectIds.includes(project.id)) {
                                        setSelectedProjectIds(selectedProjectIds.filter(id => id !== project.id));
                                    } else {
                                        setSelectedProjectIds([...selectedProjectIds, project.id]);
                                    }
                                }}
                                className={`p-4 rounded-xl border transition-all text-left space-y-2 group ${selectedProjectIds.includes(project.id)
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'hover:bg-gray-50 border-gray-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <HardHat className="text-blue-600" size={18} />
                                    </div>
                                    {selectedProjectIds.includes(project.id) && <Check className="text-blue-600" size={16} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{project.description}</p>
                                    <p className="text-xs text-gray-500 uppercase">{project.name}</p>
                                </div>
                                <div className="text-xs text-blue-600 font-bold">
                                    {project.items.length} voci lavoro pre-caricate
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4">
                        <button onClick={handleBackStep} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 font-medium">
                            <ChevronLeft size={18} /> Indietro
                        </button>
                        <button
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all"
                        >
                            Prosegui all'Editor <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Editor */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold text-gray-700">Tipo IVA:</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['ESENTE', '10%', '22%'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setVatType(type)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${vatType === type ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => addItem('TEXT')} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-all flex items-center gap-2 text-sm font-medium">
                                <Type size={16} /> Testo
                            </button>
                            <button onClick={() => addItem('ITEM')} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm">
                                <Plus size={16} /> Voce Lavoro
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {items.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 italic">
                                Trascina qui gli elementi o usa i pulsanti sopra per iniziare a comporre il preventivo.
                            </div>
                        ) : (
                            items.map((item, idx) => (
                                <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors group">
                                    <div className="text-gray-300 font-mono text-xs pt-3">{idx + 1}</div>
                                    <div className="flex-1 space-y-4">
                                        {item.type === 'TEXT' ? (
                                            <textarea
                                                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 p-0 resize-none min-h-[60px]"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                                placeholder="Contenuto testuale..."
                                            />
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                                <div className="md:col-span-3">
                                                    <input
                                                        className="w-full bg-transparent font-bold text-gray-900 border-none focus:ring-0 p-0"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                                        placeholder="Descrizione lavoro..."
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 bg-transparent border-none focus:ring-0 p-0 text-right"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) })}
                                                    />
                                                    <input
                                                        className="w-12 bg-transparent border-none focus:ring-0 p-0 text-gray-400 text-xs"
                                                        value={item.unit}
                                                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-400 text-xs">€</span>
                                                    <input
                                                        type="number"
                                                        className="w-20 bg-transparent border-none focus:ring-0 p-0 font-medium"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="text-right font-bold text-gray-900">
                                                    € {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-gray-900 text-white p-8 rounded-xl shadow-xl space-y-4">
                        <div className="flex justify-between text-gray-400 text-sm font-medium">
                            <span>Imponibile Lordo:</span>
                            <span>€ {taxable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm font-medium">
                            <span>IVA ({vatType}):</span>
                            <span>€ {vatAmount.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-gray-800 my-2" />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calculator className="text-blue-400" size={24} />
                                <span className="text-xl font-bold">Totale Preventivo</span>
                            </div>
                            <span className="text-3xl font-black text-blue-400">€ {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button onClick={handleBackStep} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 font-medium">
                            <ChevronLeft size={18} /> Indietro
                        </button>
                        <button
                            disabled={isPending || items.length === 0}
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                            Finalizza e Salva Preventivo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
