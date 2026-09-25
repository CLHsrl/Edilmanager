import { prisma } from '@/lib/prisma';
import { ShieldAlert, Fingerprint, Activity, Clock, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage() {
    const logs = await prisma.systemAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <FileText size={14} className="text-[#003F61]" />
                        <span>Amministrazione / Registro Eventi & Sicurezza</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">Audit Log di Sistema</h1>
                    <p className="text-sm text-slate-500 mt-1">Tracciamento immutabile delle operazioni critiche, accessi e modifiche sui dati.</p>
                </div>
                <div className="h-10 px-4 bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Activity size={16} className="text-[#003F61]" />
                    <span>{logs.length} Eventi Tracciati</span>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-4 py-3">Data e Ora</th>
                            <th className="px-4 py-3">Utente / ID Operatore</th>
                            <th className="px-4 py-3">Azione</th>
                            <th className="px-4 py-3">Risorsa (Target)</th>
                            <th className="px-4 py-3">Dettagli / Payload</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-400">
                                    <Activity size={36} className="mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm font-bold uppercase tracking-wider">Nessun evento registrato</p>
                                    <p className="text-xs text-slate-400 mt-1">Non risultano accessi o modifiche nel log recente.</p>
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600 flex items-center gap-1.5">
                                        <Clock size={12} className="text-slate-400" /> 
                                        {new Date(log.createdAt).toLocaleString('it-IT')}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                                        <span className="flex items-center gap-1.5">
                                            <Fingerprint size={13} className="text-[#003F61]" /> 
                                            {log.userId}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-800 border-slate-200">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                                        {log.entity} {log.entityId ? `[#${log.entityId}]` : ''}
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-slate-500 max-w-xs truncate font-mono">
                                        {log.metadata ? (typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : String(log.metadata)) : '—'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
