'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CircleDashed, Calendar, Folder, Link as LinkIcon, Trash2, ArrowRightLeft, Printer } from 'lucide-react';
import { linkMovimentoToFattura, unlinkMovimento } from './riconciliazione-actions';

export default function DettaglioFatturaClient({ fattura, movimentiRecenti, onClose }: { fattura: any; movimentiRecenti: any[], onClose?: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleLink = (movimentoId: string) => {
    startTransition(async () => {
      await linkMovimentoToFattura(fattura.id, movimentoId);
    });
  };

  const handleUnlink = (movimentoId: string) => {
    startTransition(async () => {
      await unlinkMovimento(movimentoId, fattura.id);
    });
  };

  const totaleIncassato = fattura.movimenti.reduce((sum: number, m: any) => sum + m.importo, 0);
  const residuo = fattura.totale - totaleIncassato;
  
  // Available movimenti are those NOT already linked to this fattura. We can filter out those linked to ANY fattura for strictness, but for now just not this one.
  const availableMovimenti = movimentiRecenti.filter(m => m.fatturaId !== fattura.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header Fattura */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <div className="flex items-center flex-wrap gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 mr-2">{fattura.numero}</h2>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              fattura.stato === 'PAGATA' ? 'bg-green-100 text-green-700' :
              fattura.stato === 'PARZIALE' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {fattura.stato}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
              {fattura.tipo}
            </span>
            <Link href={`/fatture/${fattura.id}/print`} target="_blank" className="ml-auto md:ml-4 bg-gray-900 hover:bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105">
               <Printer size={14} /> Stampa / PDF
            </Link>
          </div>
          <p className="text-xl font-medium text-gray-700">{fattura.soggetto}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1"><Calendar size={14} /> Emessa: {new Date(fattura.dataEmissione).toLocaleDateString('it-IT')}</span>
            {fattura.dataScadenza && <span className="flex items-center gap-1"><Calendar size={14} /> Scad.: {new Date(fattura.dataScadenza).toLocaleDateString('it-IT')}</span>}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-500 uppercase">Totale Documento</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">€ {fattura.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-400 mt-1">Imponibile: € {fattura.importo.toLocaleString('it-IT')} | IVA ({fattura.iva}%): € {(fattura.totale - fattura.importo).toLocaleString('it-IT')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Colonna Sinistra: Dati e Cantieri */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Riferimenti Cantieri</h3>
            {fattura.projects.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nessun cantiere associato.</p>
            ) : (
              <div className="space-y-2">
                {fattura.projects.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Folder className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.number ? `Prog. #${p.number}` : p.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fattura.note && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Note</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{fattura.note}</p>
            </div>
          )}
        </div>

        {/* Colonna Destra: Riconciliazione Pagamenti */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest flex items-center gap-2">
                  <ArrowRightLeft size={16} className="text-blue-600" /> Riconciliazione Movimenti
                </h3>
                <p className="text-xs text-gray-500 mt-1">Collega transazioni reali a questa fattura</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Residuo da saldare</p>
                <p className={`text-xl font-bold ${residuo === 0 ? 'text-green-600' : 'text-red-500'}`}>
                  € {residuo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Movimenti collegati */}
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-gray-900">Movimenti Collegati</h4>
              {fattura.movimenti.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-sm flex items-center gap-2">
                  <CircleDashed size={16} /> Nessun pagamento associato a questa fattura.
                </div>
              ) : (
                <div className="space-y-2">
                  {fattura.movimenti.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center p-3 sm:p-4 bg-green-50 border border-green-100 rounded-xl group transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{m.descrizione}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="font-medium text-gray-700">{m.conto?.nome}</span> • 
                            {new Date(m.data).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 border-l border-green-200 pl-4">
                        <span className="text-lg font-bold text-green-700">€ {m.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => handleUnlink(m.id)} disabled={isPending} className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100" title="Scollega">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Movimenti Disponibili Recenti */}
            {residuo > 0 && availableMovimenti.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Suggerimenti (Ultimi Movimenti non collegati)</h4>
                <div className="space-y-2">
                  {availableMovimenti.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all">
                      <div>
                         <p className="text-sm font-bold text-gray-800">{m.descrizione} <span className="text-gray-400 font-normal">({m.conto?.nome})</span></p>
                         <p className="text-xs text-gray-500">{new Date(m.data).toLocaleDateString('it-IT')} • {m.controparte || 'Nessuna controparte'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-900 text-right">
                          € {m.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </span>
                        <button onClick={() => handleLink(m.id)} disabled={isPending} className="bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1">
                          <LinkIcon size={12} /> Associa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
