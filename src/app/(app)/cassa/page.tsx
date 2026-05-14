import { getDashboardData } from '../cassa-actions';
import Link from 'next/link';
import { ArrowRightLeft, TrendingDown, TrendingUp, Building2, Calendar, MoreHorizontal } from 'lucide-react';

export default async function CassaDashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <ArrowRightLeft className="text-blue-600" size={14} />
            Cashflow Integrity & Liquidity
          </div>
          <h1 className="page-title">Gestione Tesoreria</h1>
          <p className="page-description">Monitoraggio flussi di cassa, conti correnti e liquidità operativa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Saldo Totale */}
        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden group hover:shadow-blue-900/20 transition-all col-span-1">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <Building2 size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Consolidato</p>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter">
                € {data.saldoTotale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-6 flex gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="text-emerald-400 flex items-center gap-1">
                    <TrendingUp size={12}/> +€ {data.entrate30.toLocaleString('it-IT')}
                </div>
                <div className="text-rose-400 flex items-center gap-1">
                    <TrendingDown size={12}/> -€ {data.uscite30.toLocaleString('it-IT')}
                </div>
            </div>
        </div>

        {/* Elenco Casse Rapido */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Situazione Conti</h2>
            <Link href="/cassa/conti" className="text-sm text-blue-600 font-semibold hover:underline">Vedi tutti &rarr;</Link>
          </div>
          
          {data.conti.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-4">
              <p className="text-sm">Nessun conto configurato.</p>
              <Link href="/cassa/conti" className="mt-2 text-sm text-blue-600 font-medium">Configura il primo conto</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {data.conti.slice(0, 4).map(conto => (
                <div key={conto.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{conto.nome}</h3>
                    <p className="text-xs text-gray-500 uppercase">{conto.tipo}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    € {conto.saldoAttuale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ultimi Movimenti */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-blue-600"/> Ultimi Movimenti
          </h2>
          <Link href="/cassa/movimenti" className="text-sm text-blue-600 font-semibold hover:underline">Tutti i movimenti</Link>
        </div>
        
        {data.ultimiMovimenti.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nessun movimento recente registrato.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrizione</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Conto</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Importo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.ultimiMovimenti.map(mov => (
                <tr key={mov.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400"/>
                    {new Date(mov.data).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{mov.descrizione || mov.categoria || '—'}</p>
                    <p className="text-xs text-gray-500">{mov.controparte}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {mov.conto.nome}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${mov.tipo === 'ENTRATA' ? 'text-green-600' : 'text-red-500'}`}>
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
  );
}
