'use client';

import { useTransition } from 'react';
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
  const availableMovimenti = movimentiRecenti.filter(m => m.fatturaId !== fattura.id);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Fattura */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="h-2 w-2 bg-[#003F61]" />
            <h2 className="text-2xl font-bold text-[#003F61] tracking-tight">Fattura {fattura.numero}</h2>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
              fattura.stato === 'PAGATA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              fattura.stato === 'PARZIALE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {fattura.stato}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              {fattura.tipo}
            </span>
          </div>
          <p className="text-base font-semibold text-slate-800">{fattura.soggetto}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Calendar size={13} /> Emessa: {new Date(fattura.dataEmissione).toLocaleDateString('it-IT')}</span>
            {fattura.dataScadenza && <span className="flex items-center gap-1.5"><Calendar size={13} /> Scad.: {new Date(fattura.dataScadenza).toLocaleDateString('it-IT')}</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Totale Documento</p>
            <p className="text-2xl font-bold text-[#003F61]">€ {fattura.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Imponibile € {fattura.importo.toLocaleString('it-IT')} + IVA {fattura.iva}%</p>
          </div>
          <Link
            href={`/fatture/${fattura.id}/print`}
            target="_blank"
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Printer size={15} /> Stampa
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonna Sinistra: Dati e Cantieri */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
              Riferimenti Cantieri
            </h3>
            {fattura.projects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nessun cantiere associato.</p>
            ) : (
              <div className="space-y-2">
                {fattura.projects.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200">
                    <Folder className="text-[#003F61]" size={16} />
                    <p className="text-xs font-bold text-slate-900">{p.number ? `Commessa #${p.number}` : p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {fattura.note && (
            <div className="bg-white border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Note Interne</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{fattura.note}</p>
            </div>
          )}
        </div>

        {/* Colonna Destra: Riconciliazione Pagamenti */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <ArrowRightLeft size={15} className="text-[#003F61]" /> Riconciliazione Movimenti di Cassa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Collega transazioni e incassi reali a questa fattura</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Residuo Aperto</span>
                <span className={`text-lg font-bold ${residuo === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  € {residuo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Movimenti collegati */}
            <div className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Transazioni Riconciliate</h4>
              {fattura.movimenti.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <CircleDashed size={15} /> Nessun pagamento riconciliato per questa fattura.
                </div>
              ) : (
                <div className="space-y-2">
                  {fattura.movimenti.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-emerald-50/50 border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.descrizione}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {m.conto?.nome} • {new Date(m.data).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 border-l border-emerald-200 pl-3">
                        <span className="text-sm font-bold text-emerald-700">€ {m.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        <button onClick={() => handleUnlink(m.id)} disabled={isPending} className="text-slate-400 hover:text-rose-600 transition-colors" title="Scollega">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Movimenti Disponibili Recenti */}
            {residuo > 0 && availableMovimenti.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Movimenti di Cassa Disponibili per Abbinamento</h4>
                <div className="space-y-2">
                  {availableMovimenti.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-white border border-slate-200">
                      <div>
                         <p className="text-xs font-bold text-slate-800">{m.descrizione} <span className="text-slate-400 font-normal">({m.conto?.nome})</span></p>
                         <p className="text-[11px] text-slate-500">{new Date(m.data).toLocaleDateString('it-IT')} • {m.controparte || 'Nessuna controparte'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">
                          € {m.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </span>
                        <button onClick={() => handleLink(m.id)} disabled={isPending} className="h-8 px-3 bg-white border border-slate-200 text-[#003F61] hover:bg-slate-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
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
