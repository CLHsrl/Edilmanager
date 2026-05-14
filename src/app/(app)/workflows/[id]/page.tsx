import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Calendar, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import TaskAssignmentSelect from '@/components/TaskAssignmentSelect';

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const task = await prisma.workflowTask.findUnique({
        where: { id },
        include: { assignedTo: true }
    });

    // Fetch users for assignment dropdown
    const users = await prisma.user.findMany({
        orderBy: { name: 'asc' }
    });

    if (!task) notFound();

    async function updateStatus(formData: FormData) {
        'use server';
        const newStatus = formData.get('status') as string;
        await prisma.workflowTask.update({
            where: { id },
            data: { status: newStatus }
        });
        revalidatePath('/workflows');
        redirect('/workflows');
    }

    async function markAsDone() {
        'use server';
        await prisma.workflowTask.update({
            where: { id },
            data: { status: 'DONE' }
        });
        revalidatePath('/workflows');
        redirect('/workflows');
    }

    async function updateAssignee(formData: FormData) {
        'use server';
        const assignedToId = formData.get('assignedToId') as string;
        await prisma.workflowTask.update({
            where: { id },
            data: { assignedToId: assignedToId || null }
        });
        revalidatePath(`/workflows/${id}`);
    }

    async function deleteTask() {
        'use server';
        await prisma.workflowTask.delete({ where: { id } });
        revalidatePath('/workflows');
        redirect('/workflows');
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/workflows" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Gestione Attività</h1>
                    <p className="text-sm text-gray-500">ID: {id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
                        </div>
                        <div className="mb-6 flex gap-2">
                            {task.priority === 'HIGH' && (
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded uppercase">Urgente</span>
                            )}
                            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded uppercase">{task.roleScope || 'Generale'}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {task.status === 'DONE' ? 'Completato' : task.status === 'IN_PROGRESS' ? 'In Corso' : 'Da Fare'}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 min-h-[100px]">
                            {task.description}
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-bold text-gray-900">Azioni Rapide</h3>
                        <div className="flex gap-4">
                            <form action={markAsDone} className="flex-1">
                                <button
                                    type="submit"
                                    disabled={task.status === 'DONE'}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle size={20} />
                                    {task.status === 'DONE' ? 'Già Completata' : 'Segna come Completata'}
                                </button>
                            </form>
                            <form action={deleteTask}>
                                <button type="submit" className="h-full px-4 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Status Select */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <form action={updateStatus}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stato</label>
                            <div className="flex gap-2">
                                <select name="status" defaultValue={task.status} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                                    <option value="TODO">Da Fare</option>
                                    <option value="IN_PROGRESS">In Corso</option>
                                    <option value="DONE">Completato</option>
                                </select>
                                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Assignment Select (Client Component) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <TaskAssignmentSelect
                            taskId={task.id}
                            currentUserId={task.assignedToId}
                            currentUserName={task.assignedTo?.name ?? null}
                            users={users}
                            onAssign={updateAssignee}
                        />
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-sm text-gray-500 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2"><Calendar size={14} /> Creato il</span>
                            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Priorità</span>
                            <span className="font-bold">{task.priority}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
