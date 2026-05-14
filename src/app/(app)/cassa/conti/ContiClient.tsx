'use client';

import { useState, useTransition } from 'react';
import { createConto, updateConto } from '@/app/(app)/cassa-actions';
import { Plus, CreditCard, Check, X, Edit, Trash2 } from 'lucide-react';

interface Conto {
  id: string;
  nome: string;
  tipo: string;
  saldoIniziale: number;
  saldoAttuale: number;
  iban: string | null;
  note: string | null;
  attivo: boolean;
}

export default function ContiClient({ conti }: { conti: Conto[] }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      if (editingId) {
        await updateConto(editingId, fd);
        setEditingId(null);
      } else {
        await createConto(fd);
        setOpen(false);
      }
    });
  }

  const handleEdit = (conto: Conto) => {
    setEditingId(conto.id);
    setOpen(true);
  };

  const attivi = conti.filter(c => c.attivo);
  const disattivi = conti.filter(c => !c.attivo);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestione Conti e Casse</h2>
          <p className="text-sm text-gray-500">Aggiungi e gestisci conti correnti, casse contanti o conti virtuali.</p>
        </div>
        <button onClick={() => { setOpen(!open); setEditingId(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all">
          <Plus size={16} /> Nuovo Conto
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">{editingId ? 'Modifica Conto' : 'Nuovo Conto'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Nome *</label>
              <input type="text" name="nome" required defaultValue={editingId ? conti.find(c => c.id === editingId)?.nome : ''} placeholder="Es. Unicredit Aziendale"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            {!editingId && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Tipo *</label>
                <select name="tipo" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  <option value="BANCARIO">Bancario</option>
                  <option value="CASSA_CONTANTI">Cassa Contanti</option>
                  <option value="VIRTUALE">Virtuale / Carta Prepagata</option>
                </select>
              </div>
            )}
            {!editingId && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Saldo Iniziale / Attuale (€) *</label>
                <input type="number" name="saldoIniziale" required step="0.01" defaultValue="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">IBAN</label>
              <input type="text" name="iban" defaultValue={editingId ? conti.find(c => c.id === editingId)?.iban || '' : ''} placeholder="IT00..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Note</label>
            <input type="text" name="note" defaultValue={editingId ? conti.find(c => c.id === editingId)?.note || '' : ''} placeholder="Note aggiuntive..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {editingId && (
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="attivo" id="attivo" value="true" defaultChecked={conti.find(c => c.id === editingId)?.attivo} className="rounded text-blue-600 focus:ring-blue-500" />
              <label htmlFor="attivo" className="text-sm font-medium text-gray-700">Conto Attivo (mostrato nelle dropdown)</label>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button type="submit" disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">
              {isPending ? 'Salvataggio...' : 'Salva Conto'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setEditingId(null); }}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-lg text-sm font-semibold transition-all">
              Annulla
            </button>
          </div>
        </form>
      )}

      {/* Grid Conti */}
      <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-2">Conti Attivi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attivi.map(conto => (
          <div key={conto.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow transition-shadow relative group">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(conto)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors">
                <Edit size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <CreditCard size={20} />
              </div>
              <div className="pr-8">
                <h3 className="font-bold text-gray-900 leading-tight">{conto.nome}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{conto.tipo}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center mt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Saldo Attuale</p>
              <p className={`text-2xl font-bold ${conto.saldoAttuale < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                € {conto.saldoAttuale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {conto.iban && (
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-center font-mono text-gray-500 tracking-wider">
                  {conto.iban}
                </p>
              </div>
            )}
          </div>
        ))}
        {attivi.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400">Nessun conto attivo.</p>
          </div>
        )}
      </div>

      {disattivi.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-4">Conti Archiviati</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {disattivi.map(conto => (
               <div key={conto.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative group">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(conto)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm transition-colors">
                      <Edit size={14} />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-600 leading-tight">{conto.nome}</h3>
                  <p className="font-bold text-gray-500 mt-2">Saldo: € {conto.saldoAttuale.toLocaleString('it-IT')}</p>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
