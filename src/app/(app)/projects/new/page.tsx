
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectWizard from '@/components/ProjectWizard';

export default function NewProjectPage() {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Nuovo Progetto</h1>
                    <p className="text-gray-500">Procedura guidata creazione commessa</p>
                </div>
            </div>

            <ProjectWizard />
        </div>
    );
}
