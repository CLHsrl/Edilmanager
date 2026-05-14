
import ClientWizard from '@/components/ClientWizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/clients" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuovo Cliente</h1>
                    <p className="text-gray-500">Segui la procedura guidata per aggiungere un cliente.</p>
                </div>
            </div>

            <ClientWizard />
        </div>
    );
}
