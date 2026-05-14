'use client';

import { createProject } from '../actions'; // Fallback
import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
        >
            <Save size={18} />
            {pending ? 'Synchronizing...' : label}
        </button>
    );
}

interface ProjectData {
    id?: string;
    clientId: string;
    number?: number | null;
    name: string;
    description: string | null;
    status: string;
    budget: number | null;
    startDate: Date;
    endDate: Date | null;
    latitude?: number | null;
    longitude?: number | null;
}

interface Props {
    initialData?: ProjectData;
    action?: (formData: FormData) => Promise<void>;
}

export default function ProjectForm({ initialData, action }: Props) {
    const buttonLabel = initialData ? 'Commit Project Update' : 'Initialize Project Registry';

    const detectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latInput = document.getElementById('latitude') as HTMLInputElement;
                const lngInput = document.getElementById('longitude') as HTMLInputElement;
                if (latInput) latInput.value = position.coords.latitude.toString();
                if (lngInput) lngInput.value = position.coords.longitude.toString();
            });
        } else {
            alert("Geolocation not available");
        }
    };

    return (
        <form action={action} className="flex flex-col gap-10 max-w-4xl bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Administrative Setup</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Project <span className="italic text-slate-400">Architect</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="hidden" name="name" value={initialData?.name || ''} />

                <div className="md:col-span-2 space-y-3">
                    <label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Designation / Title</label>
                    <input
                        type="text"
                        name="description"
                        defaultValue={initialData?.description || ''}
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                        placeholder="e.g., Luxury Residential Complex 'Emerald Bay'"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="status" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Lifecycle</label>
                    <select
                        name="status"
                        defaultValue={initialData?.status || 'ONGOING'}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm bg-white cursor-pointer"
                    >
                        <option value="ONGOING">Active (Ongoing)</option>
                        <option value="COMPLETED">Finalized (Completed)</option>
                        <option value="SUSPENDED">Dormant (Suspended)</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label htmlFor="budget" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Financial Quantum (€)</label>
                    <input
                        type="number"
                        name="budget"
                        step="0.01"
                        defaultValue={initialData?.budget || ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm text-right"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="startDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Activation Date</label>
                    <input
                        type="date"
                        name="startDate"
                        defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ''}
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="endDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Maturity Date</label>
                    <input
                        type="date"
                        name="endDate"
                        defaultValue={initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>

                <div className="md:col-span-2 pt-6 border-t border-slate-50 space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Precision Geofencing (GPS)</p>
                        <button 
                            type="button" 
                            onClick={detectLocation}
                            className="text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-600/20"
                        >
                            Detect Current Position
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label htmlFor="latitude" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                            <input
                                id="latitude"
                                type="number"
                                name="latitude"
                                step="any"
                                defaultValue={initialData?.latitude || ''}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                                placeholder="45.1234"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="longitude" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                            <input
                                id="longitude"
                                type="number"
                                name="longitude"
                                step="any"
                                defaultValue={initialData?.longitude || ''}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm"
                                placeholder="9.1234"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
                <SubmitButton label={buttonLabel} />
            </div>
        </form>
    );
}
