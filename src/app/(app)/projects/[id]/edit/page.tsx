import { prisma } from '@/lib/prisma';
import ProjectForm from '../../form';
import { updateProject, deleteProject } from '@/app/(app)/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DeleteWithConfirmation from '@/components/DeleteWithConfirmation';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) {
        notFound();
    }

    const updateProjectAction = updateProject.bind(null, project.id);
    const deleteProjectAction = deleteProject.bind(null, project.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${project.id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifica Progetto</h1>
                        <p className="text-gray-500">Aggiorna i dettagli del progetto {project.description || project.name}.</p>
                    </div>
                </div>

                <DeleteWithConfirmation
                    action={deleteProjectAction}
                    label="Elimina Progetto"
                    confirmationMessage="Sei sicuro di voler eliminare questo progetto? Questa azione è irreversibile."
                />
            </div>

            <ProjectForm initialData={project} action={updateProjectAction} />
        </div>
    );
}
