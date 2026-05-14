
import { User, LogOut, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
    <div className="flex flex-col gap-10 pb-20 reveal max-w-4xl mx-auto">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <Shield className="text-blue-600" size={14} />
            System Configuration & Security
          </div>
          <h1 className="page-title">Impostazioni</h1>
          <p className="page-description">Gestione profilo, permessi e preferenze applicative</p>
        </div>
      </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {/* Profile Section */}
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-600" />
                        Profilo Utente
                    </h2>
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                            B
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                    <input type="text" value="Bruno Rossi" readOnly className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value="bruno@edilcostruzioni.it" readOnly className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Section */}
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-purple-600" />
                        Ruolo e Permessi
                    </h2>
                    <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Amministratore</p>
                            <p className="text-sm text-gray-600">Hai pieno accesso a tutte le funzionalità del sistema.</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end">
                    <button className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors">
                        <LogOut size={18} />
                        Disconnetti
                    </button>
                </div>
            </div>
        </div>
    );
}
