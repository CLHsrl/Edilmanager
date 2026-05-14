'use client';

import { Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    action: (formData: FormData) => void; // Server action
    label?: string;
    confirmationMessage?: string;
}

export default function DeleteWithConfirmation({
    action,
    label = "Elimina",
    confirmationMessage = "Sei sicuro di voler procedere? Questa azione è irreversibile."
}: Props) {

    const handleSubmit = (e: FormEvent) => {
        if (!confirm(confirmationMessage)) {
            e.preventDefault();
        }
    };

    return (
        <form action={action} onSubmit={handleSubmit}>
            <button
                type="submit"
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100"
            >
                <Trash2 size={18} />
                {label}
            </button>
        </form>
    );
}
