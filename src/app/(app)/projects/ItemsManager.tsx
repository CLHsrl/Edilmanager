'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Calculator, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { addProjectItem, deleteProjectItem, toggleProjectItemCompletion } from '../actions';

interface ProjectItem {
    id: string;
    description: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    completed: boolean;
}

interface ItemsManagerProps {
    projectId: string;
    items: ProjectItem[];
}

export default function ItemsManager({ projectId, items }: ItemsManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isPending, startTransition] = useTransition();

    const totalBudget = items.reduce((sum, item) => sum + item.totalPrice, 0);

    async function handleAdd(formData: FormData) {
        startTransition(async () => {
            await addProjectItem(projectId, formData);
            setIsAdding(false);
        });
    }

    async function handleDelete(itemId: string) {
        if (confirm('Sei sicuro di voler eliminare questo lavoro?')) {
            startTransition(async () => {
                await deleteProjectItem(itemId, projectId);
            });
        }
    }

    async function handleToggle(itemId: string, completed: boolean) {
        startTransition(async () => {
            await toggleProjectItemCompletion(itemId, completed, projectId);
        });
    }
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="bg-slate-50/30 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <Calculator size={24} className="text-blue-600" /> Work Ledger & Asset List
                    </h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Quantitative analysis & Execution tracking</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <Plus size={16} /> {isAdding ? 'Decline' : 'Register Entry'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/20 border-b border-slate-100">
                            <th className="px-10 py-6 w-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Description</th>
                            <th className="px-10 py-6 w-24 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">U.M.</th>
                            <th className="px-10 py-6 w-32 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                            <th className="px-10 py-6 w-40 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Quote</th>
                            <th className="px-10 py-6 w-40 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Asset</th>
                            <th className="px-10 py-6 w-24 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isAdding && (
                            <tr className="bg-blue-50/30 animate-in slide-in-from-top-4 duration-500">
                                <td className="px-10 py-8 text-center">
                                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600">
                                        <Plus size={20} />
                                    </div>
                                </td>
                                <td className="px-10 py-8" colSpan={6}>
                                    <form action={handleAdd} className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                                        <div className="lg:col-span-2 space-y-2">
                                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Asset Description</label>
                                            <input
                                                name="description"
                                                required
                                                placeholder="Enter work details..."
                                                className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Metric Unit</label>
                                            <input
                                                name="unit"
                                                required
                                                placeholder="MQ, ML, KG..."
                                                className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Quantity</label>
                                            <input
                                                name="quantity"
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm text-right"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Price</label>
                                            <input
                                                name="unitPrice"
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm text-right"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                disabled={isPending}
                                                className="w-full bg-blue-600 text-white p-5 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                            >
                                                {isPending ? <Loader2 size={24} className="animate-spin mx-auto" /> : <CheckCircle2 size={24} className="mx-auto" />}
                                            </button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        )}

                        {items.length === 0 && !isAdding ? (
                            <tr>
                                <td colSpan={7} className="px-10 py-32 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                                        <Calculator size={32} />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No assets registered in ledger</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className={`hover:bg-slate-50/50 transition-all group ${item.completed ? 'bg-emerald-50/5' : ''}`}>
                                    <td className="px-10 py-8 text-center">
                                        <button
                                            onClick={() => handleToggle(item.id, !item.completed)}
                                            className={`transition-all duration-500 transform active:scale-75 ${item.completed ? 'text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-slate-200 hover:text-slate-300'}`}
                                        >
                                            {item.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                        </button>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className={`text-sm font-black uppercase tracking-tight transition-all ${item.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                            {item.description}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref ID: {item.id.slice(0, 8)}</p>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 ${item.completed ? 'bg-slate-50 text-slate-300' : 'bg-white text-slate-500 shadow-sm'}`}>
                                            {item.unit}
                                        </span>
                                    </td>
                                    <td className={`px-10 py-8 text-sm font-bold text-right ${item.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                                        {item.quantity.toLocaleString('it-IT')}
                                    </td>
                                    <td className={`px-10 py-8 text-sm font-bold text-right ${item.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                                        € {item.unitPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className={`px-10 py-8 text-base font-black text-right ${item.completed ? 'text-slate-400' : 'text-slate-900 tracking-tighter'}`}>
                                        € {item.totalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
