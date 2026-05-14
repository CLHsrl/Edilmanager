import { getSafetySettings, updateSafetySettings } from '@/app/(app)/safety-actions';
import { ShieldCheck, Building2, UserCheck, MapPin, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SafetySettingsPage() {
    const settings = await getSafetySettings();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/projects" className="text-sm font-bold text-gray-400 hover:text-blue-600 flex items-center gap-1 mb-2 transition-all">
                        <ArrowLeft size={16} /> Torna ai Progetti
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Impostazioni Sicurezza</h1>
                    <p className="text-gray-400 text-sm font-medium">Configura i dati dell'Impresa Esecutrice per la generazione automatica del POS.</p>
                </div>
            </div>

            <form action={updateSafetySettings} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Building2 size={20} />
                        </div>
                        <h2 className="font-black text-xs uppercase tracking-widest text-gray-600">Dati Aziendali (Intestazione POS)</h2>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Ragione Sociale</label>
                            <input 
                                name="companyName" 
                                defaultValue={settings.companyName} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Partita IVA / Codice Fiscale</label>
                            <input 
                                name="vatId" 
                                defaultValue={settings.vatId || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Sede Legale (Città)</label>
                            <input 
                                name="legalCity" 
                                defaultValue={settings.legalCity || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Indirizzo Sede Legale</label>
                            <input 
                                name="legalAddress" 
                                defaultValue={settings.legalAddress || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <UserCheck size={20} />
                        </div>
                        <h2 className="font-black text-xs uppercase tracking-widest text-gray-600">Responsabili & Figure della Sicurezza</h2>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Datore di Lavoro</label>
                            <input 
                                name="responsabileSicurezza" 
                                defaultValue={settings.responsabileSicurezza || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">RSPP Nominato</label>
                            <input 
                                name="rspp" 
                                defaultValue={settings.rspp || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1.5 ml-1">Medico Competente</label>
                            <input 
                                name="medicoCompetente" 
                                defaultValue={settings.medicoCompetente || ''} 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <Save size={20} /> Salva Configurazioni
                    </button>
                </div>
            </form>
        </div>
    );
}
