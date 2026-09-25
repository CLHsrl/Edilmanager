'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2, Building, Wallet, ArrowUpRight } from 'lucide-react';
import { createConto, deleteConto } from '../settings-actions';
import { toast } from 'sonner';

export default function ContiSettingsClient({ initialConti }: { initialConti: any[] }) {
  const [conti, setConti] = useState<any[]>(initialConti || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await createConto(formData);
      toast.success('Nuovo conto registrato con successo');
      form.reset();
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Errore durante la creazione del conto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il conto "${nome}"?`)) return;
    try {
      await deleteConto(id);
      setConti(prev => prev.filter(c => c.id !== id));
      toast.success(`Conto "${nome}" eliminato`);
    } catch (err: any) {
      toast.error(err.message || 'Errore durante l\'eliminazione del conto');
    }
  };

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'CASSA':
        return Wallet;
      case 'CARTA':
        return CreditCard;
      default:
        return Building;
    }
  };

  return (
    <div className="space-y-6">
      {/* Conto Bancario / Cassa Cards */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <CreditCard size={16} />
            <span>Conti Attivi & Casse Aziendali ({conti.length})</span>
          </div>
        </div>

        <div className="p-6">
          {conti.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conti.map((conto) => {
                const IconComponent = getIconForType(conto.tipo);
                return (
                  <div
                    key={conto.id}
                    className="p-5 border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#003F61] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 text-[#003F61] border border-blue-100">
                            <IconComponent size={16} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{conto.nome}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {conto.tipo}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(conto.id, conto.nome)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Elimina conto"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {conto.iban ? (
                        <div className="bg-white border border-slate-200 px-2.5 py-1.5 mb-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IBAN</p>
                          <p className="text-xs font-mono font-medium text-slate-700 select-all">{conto.iban}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic mb-3">Nessun IBAN specificato (Cassa/Carta)</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-xs text-slate-500 font-medium">Saldo Iniziale:</span>
                      <span className="text-base font-bold text-slate-900">
                        € {(conto.saldoIniziale || 0).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 bg-slate-50/30">
              <CreditCard size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Nessun conto o cassa registrato</p>
              <p className="text-xs text-slate-400 mt-1">Aggiungi il tuo conto principale per collegare i flussi di cassa.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modulo Aggiungi Nuovo Conto */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#003F61]">
            <Plus size={16} />
            <span>Registra Nuovo Conto o Cassa</span>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Nome Identificativo *
              </label>
              <input
                type="text"
                name="nome"
                required
                placeholder="Es. Intesa Sanpaolo - Principale"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Tipologia Conto
              </label>
              <select
                name="tipo"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              >
                <option value="BANCARIO">Conto Bancario</option>
                <option value="CASSA">Cassa Contanti Cantiere</option>
                <option value="CARTA">Carta Aziendale</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Codice IBAN (Se applicabile)
              </label>
              <input
                type="text"
                name="iban"
                placeholder="IT60X0542811101000000123456"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Saldo Iniziale (€)
              </label>
              <input
                type="number"
                step="0.01"
                name="saldoIniziale"
                defaultValue="0.00"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#003F61]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 bg-[#003F61] hover:bg-[#002f49] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>{isSubmitting ? 'Salvataggio...' : 'Aggiungi Conto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
