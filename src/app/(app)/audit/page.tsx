import { prisma } from '@/lib/prisma';
import { ShieldAlert, Fingerprint, Activity, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage() {
    const logs = await prisma.systemAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <ShieldAlert className="text-red-600" size={14} />
            Governance & ISO Compliance
          </div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-description">Registro immutabile delle attività sensibili e critiche per audit ISO</p>
        </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={16} className="text-red-600" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eventi Registrati</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{logs.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utente / ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Azione</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risorsa (Target)</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dettagli</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-slate-300 font-medium">
                                    <Activity size={48} className="mx-auto mb-4 opacity-20" />
                                    Nessun evento registrato recentemente.
                                </td>
                            </tr>
                        ) : logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-8 py-6 whitespace-nowrap text-slate-500 font-medium flex items-center gap-2">
                                    <Clock size={14} className="text-slate-300" /> {new Date(log.createdAt).toLocaleString('it-IT')}
                                </td>
                                <td className="px-8 py-6 font-black text-slate-700 flex items-center gap-2">
                                    <Fingerprint size={14} className="text-blue-400" /> {log.userId}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border 
                                        ${log.action.includes('DELETE') ? 'bg-red-50 text-red-600 border-red-100' : 
                                        log.action.includes('UPDATE') ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-slate-500 font-mono text-[11px] uppercase tracking-tighter">{log.resource}</td>
                                <td className="px-8 py-6 text-slate-900 font-black text-xs">{log.details || '---'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
