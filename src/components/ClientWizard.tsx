'use client';

import { useState } from 'react';
import { User, Building2, ArrowRight, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { createClient } from '@/app/(app)/actions';

export default function ClientWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        taxId: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        cap: '',
        province: '',
        pec: '',
        sdiCode: '',
        notes: ''
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const isStep1Valid = formData.type !== '';
    const isStep2Valid = formData.name !== ''; // Minimal validation

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center text-sm font-medium text-gray-500">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : ''}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>1</span>
                    Tipo
                </div>
                <div className="h-0.5 w-10 bg-gray-200" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : ''}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>2</span>
                    Anagrafica
                </div>
                <div className="h-0.5 w-10 bg-gray-200" />
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : ''}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>3</span>
                    Contatti
                </div>
            </div>

            <form action={createClient} className="p-8">
                {/* Hidden Fields for Server Action */}
                {Object.entries(formData).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                ))}

                {/* STEP 1: Type Selection */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Chi stai registrando?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => { updateField('type', 'PRIVATE'); nextStep(); }}
                                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-all hover:shadow-md ${formData.type === 'PRIVATE' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <User size={32} className={formData.type === 'PRIVATE' ? 'text-blue-600' : 'text-gray-400'} />
                                </div>
                                <span className="font-bold text-lg">Privato</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { updateField('type', 'COMPANY'); nextStep(); }}
                                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-all hover:shadow-md ${formData.type === 'COMPANY' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <Building2 size={32} className={formData.type === 'COMPANY' ? 'text-blue-600' : 'text-gray-400'} />
                                </div>
                                <span className="font-bold text-lg">Azienda</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Anagrafica */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <button type="button" onClick={prevStep} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><ArrowLeft size={20} /></button>
                            <h2 className="text-xl font-bold text-gray-800">Dati Anagrafici</h2>
                        </div>

                        <div className="space-y-4">
                            {formData.type === 'COMPANY' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ragione Sociale *</label>
                                    <input
                                        type="text"
                                        value={formData.name} // Used as companyName holder in this local state simplified version, or we update the state structure
                                        onChange={e => updateField('name', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="es. Edilizia SRL"
                                        autoFocus
                                    />
                                    <input type="hidden" name="companyName" value={formData.name} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            onChange={e => updateField('firstName', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            placeholder="Mario"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cognome *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            onChange={e => updateField('lastName', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            placeholder="Rossi"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Sesso</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" value="M" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                                                <span>Maschio</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" value="F" className="text-blue-600 focus:ring-blue-500" />
                                                <span>Femmina</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {formData.type === 'COMPANY' ? 'P.IVA *' : 'Codice Fiscale'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={e => updateField('taxId', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Indirizzo</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => updateField('address', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="Via / Piazza..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Città</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={e => updateField('city', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">CAP</label>
                                    <input
                                        type="text"
                                        value={formData.cap}
                                        onChange={e => updateField('cap', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prov.</label>
                                    <input
                                        type="text"
                                        value={formData.province}
                                        onChange={e => updateField('province', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={nextStep}
                                // disabled={!isStep2Valid} // Simplified validation skipped for now
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                Avanti <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Contatti & Extra */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <button type="button" onClick={prevStep} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><ArrowLeft size={20} /></button>
                            <h2 className="text-xl font-bold text-gray-800">Contatti e Fatturazione</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => updateField('email', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => updateField('phone', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>

                            {/* Company Specific Fields */}
                            {formData.type === 'COMPANY' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">PEC</label>
                                        <input
                                            type="email"
                                            value={formData.pec}
                                            onChange={e => updateField('pec', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Codice SDI</label>
                                        <input
                                            type="text"
                                            value={formData.sdiCode}
                                            onChange={e => updateField('sdiCode', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase"
                                            maxLength={7}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Note</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => updateField('notes', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors"
                            >
                                <Save size={18} />
                                Salva Cliente
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
