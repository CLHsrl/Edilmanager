'use client';

import { createClient } from '../actions';
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

// Define specific interface for Client data
interface ClientData {
    id?: string;
    type?: string;
    number?: number | null; 
    name: string;
    email: string | null;
    phone: string | null;
    taxId: string | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    address: string | null;
    city?: string | null;
    cap?: string | null;
    province?: string | null;
    pec?: string | null;
    sdiCode?: string | null;
}

interface Props {
    initialData?: ClientData;
    action?: (formData: FormData) => Promise<void>;
}

export default function ClientForm({ initialData, action }: Props) {
    const formAction = action || createClient;
    const buttonLabel = initialData ? 'Commit Client Update' : 'Initialize Client Registry';
    const isCompany = initialData?.type === 'COMPANY';

    return (
        <form action={formAction} className="flex flex-col gap-10 max-w-4xl bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Onboarding & Registry</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Client <span className="italic text-slate-400">Master</span></h2>
            </div>

            <input type="hidden" name="type" value={initialData?.type || 'PRIVATE'} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-3">
                    <label htmlFor="number" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client ID (Registry #)</label>
                    <input
                        type="number"
                        name="number"
                        defaultValue={initialData?.number || ''}
                        className="block w-40 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                        placeholder="#"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    {!isCompany ? (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label htmlFor="firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Given Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    defaultValue={initialData?.firstName || ''}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="lastName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Surname</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    defaultValue={initialData?.lastName || ''}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identification</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="gender" value="M" defaultChecked={initialData?.gender === 'M'} className="w-5 h-5 text-blue-600 focus:ring-blue-600 border-slate-200" />
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Male</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="gender" value="F" defaultChecked={initialData?.gender === 'F'} className="w-5 h-5 text-blue-600 focus:ring-blue-600 border-slate-200" />
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label htmlFor="companyName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Title / Registered Name</label>
                            <input
                                type="text"
                                name="companyName"
                                required
                                defaultValue={initialData?.name}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                                placeholder="e.g., Global Infrastructure Partners SPA"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <label htmlFor="taxId" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {isCompany ? 'VAT Identification (P.IVA)' : 'Fiscal Code (CF)'}
                    </label>
                    <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        defaultValue={initialData?.taxId || ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Digital Correspondence (Email)</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={initialData?.email || ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Telemetry (Phone)</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        defaultValue={initialData?.phone || ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                        placeholder="+39 000 0000000"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-3">
                    <label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        defaultValue={initialData?.address || ''}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="city" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Municipality</label>
                    <input type="text" id="city" name="city" defaultValue={initialData?.city || ''} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                    <label htmlFor="cap" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code (CAP)</label>
                    <input type="text" id="cap" name="cap" defaultValue={initialData?.cap || ''} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
                </div>
                <div className="space-y-3">
                    <label htmlFor="province" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Province (Code)</label>
                    <input type="text" id="province" name="province" defaultValue={initialData?.province || ''} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" maxLength={2} />
                </div>

                {isCompany && (
                    <>
                        <div className="space-y-3">
                            <label htmlFor="pec" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certified Email (PEC)</label>
                            <input type="email" id="pec" name="pec" defaultValue={initialData?.pec || ''} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="sdiCode" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Electronic Invoicing (SDI)</label>
                            <input type="text" id="sdiCode" name="sdiCode" defaultValue={initialData?.sdiCode || ''} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm uppercase" maxLength={7} />
                        </div>
                    </>
                )}
            </div>

            <div className="pt-8 border-t border-slate-50">
                <SubmitButton label={buttonLabel} />
            </div>
        </form>
    );
}
