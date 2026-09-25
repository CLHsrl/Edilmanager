import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Trash2, ArrowRight, Calendar } from 'lucide-react';
import TaskAssignmentSelect from '../TaskAssignmentSelect';
import { revalidatePath } from 'next/cache';

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const task = await prisma.workflowTask.findUnique({
        where: { id },
        include: {
            assignedTo: { select: { id: true, name: true } },
        }
    });

    if (!task) {
        notFound();
    }

    const users = await prisma.user.findMany({
        select: { id: true, name: true, role: true }
    });

    async function updateStatus(formData: FormData) {
        'use server';
        const newStatus = formData.get('status') as string;
        await prisma.workflowTask.update({
            where: { id },
            data: { status: newStatus }
        });
        revalidatePath(`/workflows/${id}`);
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
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link 
                        href="/workflows" 
                        className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                        title="Torna ai Workflow"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 bg-[#003F61]" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Task Workflow
                            </span>
                            <span className="text-xs text-slate-400">ID: {id}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">{task.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {task.priority === 'HIGH' && (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
                            Urgente
                        </span>
                    )}
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
                        {task.roleScope || 'Generale'}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                        task.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                        {task.status === 'DONE' ? 'Completato' : task.status === 'IN_PROGRESS' ? 'In Corso' : 'Da Fare'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Descrizione Attività</h3>
                        <div className="bg-slate-50 p-4 border border-slate-200 text-slate-700 text-sm leading-relaxed min-h-[120px]">
                            {task.description || 'Nessuna descrizione specificata.'}
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-white border border-slate-200 p-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Azioni Rapide</h3>
                        <div className="flex gap-4">
                            <form action={markAsDone} className="flex-1">
                                <button
                                    type="submit"
                                    disabled={task.status === 'DONE'}
                                    className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle size={18} />
                                    {task.status === 'DONE' ? 'Attività Già Completata' : 'Segna come Completata'}
                                </button>
                            </form>
                            <form action={deleteTask}>
                                <button type="submit" className="h-11 px-4 text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors" title="Elimina Attività">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Status Select */}
                    <div className="bg-white border border-slate-200 p-5">
                        <form action={updateStatus}>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aggiorna Stato</label>
                            <div className="flex gap-2">
                                <select name="status" defaultValue={task.status} className="flex-1 h-10 px-3 border border-slate-200 text-xs font-bold uppercase bg-slate-50 text-slate-800 focus:outline-none focus:border-[#003F61]">
                                    <option value="TODO">Da Fare</option>
                                    <option value="IN_PROGRESS">In Corso</option>
                                    <option value="DONE">Completato</option>
                                </select>
                                <button type="submit" className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center transition-colors">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Assignment Select */}
                    <div className="bg-white border border-slate-200 p-5">
                        <TaskAssignmentSelect
                            taskId={task.id}
                            currentUserId={task.assignedToId}
                            currentUserName={task.assignedTo?.name ?? null}
                            users={users}
                            onAssign={updateAssignee}
                        />
                    </div>

                    {/* Metadata */}
                    <div className="bg-white border border-slate-200 p-5 text-xs text-slate-600 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]"><Calendar size={13} /> Creato il</span>
                            <span className="font-semibold text-slate-800">{new Date(task.createdAt).toLocaleDateString('it-IT')}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Priorità</span>
                            <span className="font-bold text-slate-800">{task.priority}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
