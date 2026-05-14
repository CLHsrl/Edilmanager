import { prisma } from '@/lib/prisma';
import ClientForm from '../../form';
import { updateClient, deleteClient } from '@/app/(app)/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id }
    });

    if (!client) {
        notFound();
    }

    const updateClientAction = updateClient.bind(null, client.id);
    const deleteClientAction = deleteClient.bind(null, client.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/clients" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifica Cliente</h1>
                        <p className="text-gray-500">Aggiorna i dati anagrafici di {client.name}.</p>
                    </div>
                </div>

                <form action={deleteClientAction}>
                    <button
                        type="submit"
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100"
                        title="Elimina definitivamente questo cliente"
                    >
                        <Trash2 size={18} />
                        Elimina Cliente
                    </button>
                </form>
            </div>

            <ClientForm initialData={client} action={updateClientAction} />
        </div>
    );
}
