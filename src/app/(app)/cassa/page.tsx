import { getDashboardData } from '../cassa-actions';
import Link from 'next/link';
import { ArrowRightLeft, TrendingDown, TrendingUp, Building2, Calendar, Euro, Plus, Wallet, ChevronRight } from 'lucide-react';

export default async function CassaDashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Euro size={14} className="text-[#003F61]" />
            <span>Finanza / Tesoreria & Flussi di Cassa</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Cassa & Tesoreria</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoraggio liquidità consolidata, conti correnti bancari e cashflow operativo.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/cassa/movimenti" 
            className="h-10 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            Tutti i Movimenti
          </Link>
          <Link 
            href="/cassa/conti" 
            className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Gestione Conti
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Saldo Consolidato</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">
              € {data.saldoTotale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">Liquidità totale disponibile</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Entrate (Ultimi 30gg)</span>
            <div className="p-2 bg-slate-50 text-emerald-600 border border-slate-100">
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              +€ {data.entrate30.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">Incassi registrati a libro</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Uscite (Ultimi 30gg)</span>
            <div className="p-2 bg-slate-50 text-rose-600 border border-slate-100">
              <TrendingDown size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600 tracking-tight">
              -€ {data.uscite30.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-1">Pagamenti e spese effettuate</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conti Attivi</span>
            <div className="p-2 bg-slate-50 text-[#003F61] border border-slate-100">
              <Building2 size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#003F61] tracking-tight">{data.conti.length}</div>
            <div className="text-xs text-slate-500 mt-1">Banche e casse operative</div>
          </div>
        </div>
      </div>

      {/* Main Grid: 2/3 and 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Ultimi Movimenti */}
        <div className="lg:col-span-2 bg-white border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <ArrowRightLeft size={16} className="text-[#003F61]" />
              <span>Ultimi Movimenti Registrati</span>
            </div>
            <Link href="/cassa/movimenti" className="text-xs font-semibold text-[#003F61] hover:underline">
              Vedi Tutti &rarr;
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {data.ultimiMovimenti.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <ArrowRightLeft size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-bold uppercase tracking-wider">Nessun movimento recente</p>
                <p className="text-xs text-slate-400 mt-1">Non risultano transazioni recenti di cassa o banca.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Descrizione / Controparte</th>
                    <th className="px-4 py-3">Conto</th>
                    <th className="px-4 py-3 text-right">Importo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data.ultimiMovimenti.map(mov => (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(mov.data).toLocaleDateString('it-IT')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">
                          {mov.descrizione || mov.categoria || '—'}
                        </span>
                        {mov.controparte && (
                          <span className="text-[11px] text-slate-500">{mov.controparte}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-700 border-slate-200">
                          {mov.conto.nome}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        <span className={mov.tipo === 'ENTRATA' ? 'text-emerald-600' : 'text-rose-600'}>
                          {mov.tipo === 'ENTRATA' ? '+' : '-'}€ {mov.importo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Situazione Conti */}
        <div className="bg-white border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Building2 size={16} className="text-[#003F61]" />
              <span>Situazione Conti Bancari</span>
            </div>
            <Link href="/cassa/conti" className="text-xs font-semibold text-[#003F61] hover:underline">
              Gestisci &rarr;
            </Link>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {data.conti.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Building2 size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Nessun conto configurato</p>
                <Link href="/cassa/conti" className="text-xs text-[#003F61] font-bold hover:underline block mt-2">
                  + Aggiungi il primo conto
                </Link>
              </div>
            ) : (
              data.conti.map(conto => (
                <div key={conto.id} className="p-3.5 border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{conto.nome}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                      {conto.tipo}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-base">
                      € {conto.saldoAttuale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
