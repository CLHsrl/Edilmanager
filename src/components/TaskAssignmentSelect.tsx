'use client';

import { User as UserIcon } from 'lucide-react';
import { useTransition } from 'react';

type User = {
    id: string;
    name: string | null;
};

type Props = {
    taskId: string;
    currentUserId: string | null;
    currentUserName: string | null;
    users: User[];
    onAssign: (formData: FormData) => Promise<void>;
};

export default function TaskAssignmentSelect({ taskId, currentUserId, currentUserName, users, onAssign }: Props) {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={onAssign}>
            <input type="hidden" name="assignedToId" value="" /> {/* Fallback or handled by select */}
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assegna a</label>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold shadow-sm">
                        {currentUserName?.charAt(0) || <UserIcon size={16} />}
                    </div>
                    <span className="text-sm font-medium text-blue-900">
                        {isPending ? 'Aggiornamento...' : (currentUserName || 'Non assegnato')}
                    </span>
                </div>

                <select
                    name="assignedToId"
                    defaultValue={currentUserId || ''}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                    onChange={(e) => e.target.form?.requestSubmit()}
                    disabled={isPending}
                >
                    <option value="">-- Seleziona Utente --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>
        </form>
    );
}
