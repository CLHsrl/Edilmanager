import QuoteWizard from '@/components/QuoteWizard';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NewQuotePage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowLeft size={16} />
                        <Link href="/quotes" className="text-sm font-medium">Torna ai Preventivi</Link>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <FileText className="text-blue-600" size={32} />
                        Nuovo Preventivo
                    </h1>
                </div>
            </div>

            <QuoteWizard />
        </div>
    );
}
