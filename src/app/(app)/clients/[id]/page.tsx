import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, FileText, HardHat, Edit, TrendingUp, Wallet, ArrowRight, User } from 'lucide-react';
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
    const totalProjects = client.projects.length;
    const ongoingProjects = client.projects.filter(p => p.status === 'ONGOING').length;
    const completedProjects = client.projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = client.projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    const totalQuotes = client.quotes.length;
    const acceptedQuotes = client.quotes.filter(q => q.status === 'ACCEPTED').length;
    const pendingQuotes = client.quotes.filter(q => ['DRAFT', 'SENT'].includes(q.status)).length;
    const rejectedQuotes = client.quotes.filter(q => q.status === 'REJECTED').length;
    const totalQuoteValue = client.quotes.reduce((acc, curr) => acc + curr.total, 0);

    const projectStatusData = [
        { name: 'In Opera', value: ongoingProjects, color: '#003F61' },
        { name: 'Conclusi', value: completedProjects, color: '#10b981' }
    ].filter(d => d.value > 0);

    const quoteStatusData = [
        { name: 'Da Valutare', value: pendingQuotes, color: '#f59e0b' },
        { name: 'Accettati', value: acceptedQuotes, color: '#10b981' },
        { name: 'Rifiutati', value: rejectedQuotes, color: '#ef4444' }
    ].filter(d => d.value > 0);

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* 1. Header Card */}
            <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div className="flex items-start gap-4">
                    <Link 
                        href="/clients" 
                        className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                        title="Torna all'Anagrafica Clienti"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 bg-[#003F61]" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Scheda Anagrafica Committente
                            </span>
                            {client.number && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                                    #{client.number}
                                </span>
                            )}
                            <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                                client.type === 'COMPANY'
                                    ? 'bg-blue-50 text-[#003F61] border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                                {client.type === 'COMPANY' ? 'AZIENDA' : 'PRIVATO'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">
                            {client.name}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Profilo anagrafico, cantieri collegati e storico preventivi commerciali.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        href={`/clients/${client.id}/edit`} 
                        className="h-10 px-4 bg-[#003F61] text-white hover:bg-[#002f49] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                        <Edit size={15} /> Modifica Anagrafica
                    </Link>
                </div>
            </div>

            {/* 2. KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Valore Cantieri</span>
                        <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
                            <Wallet size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-[#003F61]">
                            € {totalBudget.toLocaleString('it-IT')}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Valore cumulativo contratti</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Preventivato</span>
                        <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-700">
                            € {totalQuoteValue.toLocaleString('it-IT')}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Somma offerte emesse</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Cantieri Attivi</span>
                        <div className="p-2 bg-slate-50 border border-slate-100 text-[#003F61]">
                            <HardHat size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            {ongoingProjects} / {totalProjects}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">In opera su totale commesse</div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Preventivi Accettati</span>
                        <div className="p-2 bg-amber-50 border border-amber-100 text-amber-700">
                            <FileText size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">
                            {acceptedQuotes} / {totalQuotes}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Tasso conversione cliente</div>
                    </div>
                </div>
            </div>

            {/* 3. Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-6 space-y-4">
                        <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-sm font-bold text-[#003F61] uppercase tracking-wider">
                                Dati di Contatto & Fiscali
                            </h2>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3 text-slate-700">
                                <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Indirizzo</span>
                                    <p className="font-medium">{client.address || "Non specificato"}</p>
                                    {(client.city || client.province) && (
                                        <p className="text-xs text-slate-500">
                                            {client.cap} {client.city} {client.province ? `(${client.province})` : ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-700">
                                <Mail size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                                    <p className="font-medium">{client.email || "Non specificata"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-700">
                                <Phone size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telefono</span>
                                    <p className="font-medium">{client.phone || "Non specificato"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-700">
                                <FileText size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        {client.type === 'COMPANY' ? 'Partita IVA' : 'Codice Fiscale'}
                                    </span>
                                    <p className="font-mono font-semibold">{client.taxId || "Non specificato"}</p>
                                </div>
                            </div>

                            {(client.pec || client.sdiCode) && (
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                    {client.pec && (
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PEC</span>
                                            <p className="text-xs font-mono">{client.pec}</p>
                                        </div>
                                    )}
                                    {client.sdiCode && (
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Codice SDI</span>
                                            <p className="text-xs font-mono bg-slate-50 px-2 py-0.5 border border-slate-200 inline-block">{client.sdiCode}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {client.notes && (
                            <div className="pt-4 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Note Interne</span>
                                <p className="text-xs text-slate-600 bg-slate-50 p-3 border border-slate-200 leading-relaxed">{client.notes}</p>
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
                    <div className="bg-white border border-slate-200">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                            <h3 className="text-xs font-bold text-[#003F61] uppercase tracking-wider flex items-center gap-2">
                                <HardHat size={16} /> Cantieri Associati
                            </h3>
                            <Link href="/projects/new" className="text-xs font-bold text-[#003F61] hover:underline uppercase">
                                + Nuovo Cantiere
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 text-sm">
                            {client.projects.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400">Nessun cantiere collegato a questo cliente.</div>
                            ) : (
                                client.projects.slice(0, 5).map(project => (
                                    <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <Link href={`/projects/${project.id}`} className="font-semibold text-slate-900 hover:text-[#003F61]">
                                                {project.name || project.description || "Cantiere senza nome"}
                                            </Link>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                Inizio: {new Date(project.startDate).toLocaleDateString('it-IT')}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                                project.status === 'ONGOING'
                                                    ? 'bg-blue-50 text-[#003F61] border-blue-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {project.status === 'ONGOING' ? 'In Opera' : 'Concluso'}
                                            </span>
                                            <Link 
                                                href={`/projects/${project.id}`} 
                                                className="h-8 w-8 border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600"
                                            >
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quotes List */}
                    <div className="bg-white border border-slate-200">
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                            <h3 className="text-xs font-bold text-[#003F61] uppercase tracking-wider flex items-center gap-2">
                                <FileText size={16} /> Preventivi & Offerte Emesse
                            </h3>
                            <Link href="/quotes/new" className="text-xs font-bold text-[#003F61] hover:underline uppercase">
                                + Nuova Offerta
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 text-sm">
                            {client.quotes.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400">Nessun preventivo registrato per questo cliente.</div>
                            ) : (
                                client.quotes.slice(0, 5).map(quote => (
                                    <div key={quote.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold text-slate-900">Preventivo #{quote.number}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{new Date(quote.date).toLocaleDateString('it-IT')}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-slate-900">€ {quote.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                            <Link 
                                                href={`/quotes/${quote.id}`} 
                                                className="h-8 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                                            >
                                                Apri
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
