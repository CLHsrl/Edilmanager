'use client';

import { useRef } from 'react';
import { User } from 'lucide-react';

interface TaskAssignmentSelectProps {
    taskId: string;
    currentUserId: string | null | undefined;
    currentUserName: string | null | undefined;
    users: { id: string; name: string | null; role: string }[];
    onAssign: (formData: FormData) => Promise<void>;
}

export default function TaskAssignmentSelect({
    taskId,
    currentUserId,
    currentUserName,
    users,
    onAssign,
}: TaskAssignmentSelectProps) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form ref={formRef} action={onAssign}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User size={12} />
                Assegna a
            </label>
            <div className="flex gap-2">
                <select
                    name="assignedToId"
                    defaultValue={currentUserId ?? ''}
                    className="flex-1 h-10 px-3 border border-slate-200 text-xs font-medium bg-slate-50 text-slate-800 focus:outline-none focus:border-[#003F61]"
                >
                    <option value="">— Nessuno —</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name ?? u.id} ({u.role})
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    OK
                </button>
            </div>
            {currentUserName && (
                <p className="text-[10px] text-slate-400 mt-2">
                    Attualmente: <span className="font-semibold text-slate-600">{currentUserName}</span>
                </p>
            )}
        </form>
    );
}
