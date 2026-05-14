
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, FileText, HardHat, ExternalLink, Edit, TrendingUp, Wallet, ArrowRight, User } from 'lucide-react';
import { updateProjectStatus } from '@/app/(app)/actions';
import ClientCharts from '@/components/ClientCharts';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            projects: { orderBy: { createdAt: 'desc' } },
            quotes: { orderBy: { createdAt: 'desc' } }
        }
    });

    if (!client) notFound();

    // --- Compute Metrics ---

    // 1. Projects
    const totalProjects = client.projects.length;
    const ongoingProjects = client.projects.filter(p => p.status === 'ONGOING').length;
    const completedProjects = client.projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = client.projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    // 2. Quotes
    const totalQuotes = client.quotes.length;
    const acceptedQuotes = client.quotes.filter(q => q.status === 'ACCEPTED').length;
    const pendingQuotes = client.quotes.filter(q => ['DRAFT', 'SENT'].includes(q.status)).length;
    const rejectedQuotes = client.quotes.filter(q => q.status === 'REJECTED').length;
    const totalQuoteValue = client.quotes.reduce((acc, curr) => acc + curr.total, 0);

    // 3. Chart Data
    const projectStatusData = [
        { name: 'In Opera', value: ongoingProjects, color: '#3b82f6' }, // blue-500
        { name: 'Conclusi', value: completedProjects, color: '#22c55e' } // green-500
    ].filter(d => d.value > 0);

    const quoteStatusData = [
        { name: 'Da Valutare', value: pendingQuotes, color: '#eab308' }, // yellow-500
        { name: 'Accettati', value: acceptedQuotes, color: '#22c55e' }, // green-500
        { name: 'Rifiutati', value: rejectedQuotes, color: '#ef4444' } // red-500
    ].filter(d => d.value > 0);


    return (
        <div className="flex flex-col gap-10 pb-20 reveal">
            {/* Unified Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
                <div className="flex items-start gap-6">
                    <Link href="/clients" className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-slate-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="page-label">
                            <User className="text-blue-600" size={14} />
                            Customer Relationship Management
                        </div>
                        <h1 className="page-title flex items-center gap-3">
                            {client.name}
                            {client.number && <span className="text-xl text-slate-300 font-mono">#{client.number}</span>}
                        </h1>
                        <p className="page-description">Profilo completo, storico progetti e preventivi attivi</p>
                    </div>
                </div>
                <Link href={`/clients/${client.id}/edit`} className="action-btn-primary">
                    <Edit size={16} /> Modifica Anagrafica
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Wallet size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valore Progetti</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">€ {totalBudget.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Valore cumulativo contratti</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preventivato</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">€ {totalQuoteValue.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2">Somma preventivi emessi</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-600"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <HardHat size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantieri</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{ongoingProjects} / {totalProjects}</p>
                    <p className="text-[10px] font-bold text-purple-500 uppercase mt-2">Progetti in corso su totale</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <FileText size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preventivi</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{acceptedQuotes} / {totalQuotes}</p>
                    <p className="text-[10px] font-bold text-amber-500 uppercase mt-2">Preventivi accettati</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Info & Timeline */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-start">
                            <h2 className="font-bold text-gray-900 text-lg mb-2">Dati Cliente</h2>
                            <div className="flex gap-2">
                                {client.number && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded border border-gray-200">
                                        #{client.number}
                                    </span>
                                )}
                                {client.type === 'COMPANY' ? (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">AZIENDA</span>
                                ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PRIVATO</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-gray-600">
                                <MapPin size={18} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Indirizzo</p>
                                    <p>{client.address || "Non specificato"}</p>
                                    {(client.city || client.province) && (
                                        <p className="text-sm text-gray-500">
                                            {client.cap} {client.city} {client.province ? `(${client.province})` : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600">
                                <Mail size={18} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                                    <p>{client.email || "Non specificata"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600">
                                <Phone size={18} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">Telefono</p>
                                    <p>{client.phone || "Non specificato"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600">
                                <FileText size={18} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase">
                                        {client.type === 'COMPANY' ? 'P.IVA' : 'Codice Fiscale'}
                                    </p>
                                    <p>{client.taxId || "Non specificato"}</p>
                                </div>
                            </div>

                            {/* Extra Fields */}
                            {client.gender && (
                                <div className="flex items-start gap-3 text-gray-600">
                                    <div className="w-[18px] flex justify-center mt-1 text-gray-400 font-bold text-xs border rounded">S</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">Sesso</p>
                                        <p>{client.gender === 'M' ? 'Maschio' : client.gender === 'F' ? 'Femmina' : client.gender}</p>
                                    </div>
                                </div>
                            )}

                            {(client.pec || client.sdiCode) && (
                                <div className="pt-2 border-t border-dashed border-gray-200 mt-2 space-y-2">
                                    {client.pec && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase">PEC</p>
                                            <p className="text-sm">{client.pec}</p>
                                        </div>
                                    )}
                                    {client.sdiCode && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase">Codice SDI</p>
                                            <p className="text-sm font-mono bg-gray-50 inline-block px-1 rounded">{client.sdiCode}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {client.notes && (
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Note Interne</p>
                                <p className="text-sm text-gray-600 italic bg-yellow-50 p-3 rounded-lg border border-yellow-100">{client.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Charts & Lists */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Charts Section */}
                    {(totalProjects > 0 || totalQuotes > 0) && (
                        <ClientCharts projectStatusData={projectStatusData} quoteStatusData={quoteStatusData} />
                    )}

                    {/* Projects List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <HardHat size={18} className="text-blue-600" /> Progetti Recenti
                            </h3>
                            <Link href="/projects/new" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                + Nuovo
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {client.projects.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">Nessun progetto.</div>
                            ) : (
                                client.projects.slice(0, 5).map(project => (
                                    <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                                        <div>
                                            <div className="font-semibold text-gray-900">{project.description || "Senza Titolo"}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {project.status === 'ONGOING' ? (
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">In Opera</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Concluso</span>
                                            )}
                                            <Link href={`/projects/${project.id}`} className="p-2 text-gray-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quotes List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={18} className="text-orange-600" /> Preventivi Recenti
                            </h3>
                            <Link href="/quotes/new" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                + Nuovo
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {client.quotes.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">Nessun preventivo.</div>
                            ) : (
                                client.quotes.slice(0, 5).map(quote => (
                                    <div key={quote.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                                        <div>
                                            <div className="font-semibold text-gray-900">Prev. #{quote.number}</div>
                                            <div className="text-sm text-gray-500">{new Date(quote.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gray-700">€ {quote.total.toLocaleString()}</span>
                                            <Link href={`/quotes/${quote.id}`} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium">
                                                Vedi
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
