
import { prisma } from '@/lib/prisma';
import { createTask } from '@/app/(app)/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default async function NewTaskPage() {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    const lavoratori = await prisma.lavoratore.findMany({ orderBy: { nome: 'asc' } });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/workflows" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuova Attività</h1>
                    <p className="text-gray-500">Crea un nuovo task per il team.</p>
                </div>
            </div>

            <form action={createTask} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-700">Titolo *</label>
                        <input type="text" name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Es. Ordine Materiale Cantiere X" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priorità</label>
                            <select name="priority" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
                                <option value="MEDIUM">Media</option>
                                <option value="HIGH">Alta</option>
                                <option value="LOW">Bassa</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="roleScope" className="text-sm font-semibold text-gray-700">Visibilità Ruolo</label>
                            <select name="roleScope" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
                                <option value="">Tutti</option>
                                <option value="OFFICE">Ufficio</option>
                                <option value="SITE">Cantiere</option>
                                <option value="SALES">Vendite</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="assignedToId" className="text-sm font-semibold text-gray-700">Assegna a (Ufficio)</label>
                            <select name="assignedToId" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
                                <option value="">-- Nessuna Assegnazione --</option>
                                {users.map((user: any) => (
                                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lavoratoreId" className="text-sm font-semibold text-gray-700">Assegna a (Cantiere)</label>
                            <select name="lavoratoreId" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white">
                                <option value="">-- Nessuna Assegnazione --</option>
                                {lavoratori.map((l: any) => (
                                    <option key={l.id} value={l.id}>{l.nome} {l.cognome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">Scadenza</label>
                        <input type="date" name="dueDate" className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">Descrizione</label>
                        <textarea name="description" rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Dettagli dell'attività..." />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium shadow-md transition-all">
                        <Save size={18} />
                        Crea Attività
                    </button>
                </div>
            </form>
        </div>
    );
}
