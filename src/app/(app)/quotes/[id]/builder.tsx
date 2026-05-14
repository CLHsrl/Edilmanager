'use client';

import { useState, useTransition } from 'react';
import { getPriceItems, addItemToQuote } from '../../quote-actions';
import Link from 'next/link';
import { Search, Plus, Trash2, Save, FileText, Loader2 } from 'lucide-react';

type Props = {
    quote: any;
    items: any[];
};

export default function QuoteBuilder({ quote, items }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, startTransition] = useTransition();

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await getPriceItems(term);
            setSearchResults(results);
        } finally {
            setIsSearching(false);
        }
    };

    const addToQuote = (priceItemId: string) => {
        startTransition(async () => {
            await addItemToQuote(quote.id, priceItemId, 1);
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
            {/* Left: Item Search & Catalog */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Listino Prezzi</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cerca voce (es. scavo)..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {isSearching ? (
                        <div className="flex justify-center p-8 text-blue-500">
                            <Loader2 className="animate-spin" size={24} />
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map(item => (
                            <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.code}</span>
                                    <span className="text-xs font-medium text-gray-500">{item.source}</span>
                                </div>
                                <p className="text-sm text-gray-800 mb-2 line-clamp-2">{item.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">€ {item.price.toFixed(2)} <span className="text-xs font-normal text-gray-400">/ {item.unit}</span></span>
                                    <button
                                        onClick={() => addToQuote(item.id)}
                                        disabled={isAdding}
                                        className="p-1.5 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-md transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 rounded-lg text-sm text-center text-gray-400">
                            {searchTerm.length > 0 ? 'Nessun risultato trovato' : 'Inizia a scrivere per cercare nel prezzario'}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Quote Items */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg">Preventivo #{quote.number}</h2>
                        <p className="text-sm text-gray-500">{quote.client.name}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">TOTALE STIMATO</div>
                        <div className="text-2xl font-bold text-green-600">
                            € {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Descrizione</th>
                                <th className="px-4 py-3 w-20">U.M.</th>
                                <th className="px-4 py-3 w-28 text-right">Prezzo</th>
                                <th className="px-4 py-3 w-24 text-center">Q.tà</th>
                                <th className="px-4 py-3 w-32 text-right">Totale</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                        Il preventivo è vuoto.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{item.code || '-'}</div>
                                            <div className="text-gray-600">{item.description}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                        <td className="px-4 py-3 text-right">€ {item.price}</td>
                                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right font-medium">€ {item.total}</td>
                                        <td className="px-4 py-3">
                                            <button className="text-red-400 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-4 bg-gray-50">
                    <Link href={`/quotes/${quote.id}/print`} target="_blank" className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <FileText size={16} />
                        Stampa / Salva PDF
                    </Link>
                    <Link href={`/quotes/${quote.id}/contract`} className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium flex items-center gap-2">
                        <FileText size={16} />
                        Genera Contratto
                    </Link>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                        <Save size={16} />
                        Salva Preventivo
                    </button>
                </div>
            </div>
        </div>
    );
}
