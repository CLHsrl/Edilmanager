import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  Building2, MapPin, Calendar, HardHat, 
  CheckCircle2, Camera, Clock, FileText, 
  Phone, Mail, ArrowRight, ShieldCheck,
  TrendingUp, Globe, Activity
} from 'lucide-react';
import Link from 'next/link';

export default async function ClientPortalPage({ params }: { params: Promise<{ portalKey: string }> }) {
  const { portalKey } = await params;

  const project = await prisma.project.findUnique({
    where: { portalKey },
    include: {
      client: true,
      items: { orderBy: { createdAt: 'asc' } },
      updates: { 
          where: { isVisibleToClient: true },
          orderBy: { createdAt: 'desc' } 
      },
      sal: { orderBy: { numero: 'desc' }, take: 1 }
    }
  });

  if (!project) notFound();

  const completedItems = project.items.filter(i => i.completed).length;
  const totalItems = project.items.length;
  const completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="reveal space-y-12 pb-24">
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <div className="grid grid-cols-6 h-full">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="border-l border-white/20 h-20 w-full"></div>
                ))}
             </div>
          </div>
          
          <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      Private Access Portal
                  </span>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-400" /> Secure Connection Active
                  </span>
              </div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                  <div className="max-w-3xl">
                      <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
                        {project.name}
                      </h1>
                      <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-3 text-white/50 text-xs font-black uppercase tracking-widest">
                              <MapPin size={18} className="text-blue-400" /> {project.indirizzo || project.citta}
                          </div>
                          <div className="flex items-center gap-3 text-white/50 text-xs font-black uppercase tracking-widest">
                              <Calendar size={18} className="text-blue-400" /> Start: {new Date(project.startDate).toLocaleDateString('it-IT')}
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex items-center gap-8 shadow-2xl">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                              <circle cx="48" cy="48" r="42" stroke="#2563eb" strokeWidth="8" fill="none" strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * completion) / 100} strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-2xl font-black">{completion}%</span>
                      </div>
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Avanzamento Lavori</p>
                          <p className="text-lg font-black text-white italic">Execution Phase</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-10">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-12 flex items-center gap-4">
                      <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                      Site Activity Journal
                  </h3>
                  
                  <div className="space-y-12">
                      {project.updates.length === 0 ? (
                          <div className="py-20 text-center">
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for first site report...</p>
                          </div>
                      ) : (
                          project.updates.map((u: any) => (
                              <div key={u.id} className="group relative pl-12 pb-12 border-l-2 border-slate-50 last:pb-0">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-4 border-white group-hover:bg-blue-600 group-hover:scale-125 transition-all"></div>
                                  <div className="flex justify-between items-start mb-4">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                                          {new Date(u.createdAt).toLocaleString('it-IT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <Activity size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                                  </div>
                                  <p className="text-xl text-slate-900 font-medium leading-relaxed tracking-tight">
                                      {u.content}
                                  </p>
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Technical Milestones */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex items-center gap-4">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                      Execution Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.items.slice(0, 6).map((item) => (
                          <div key={item.id} className={`p-6 rounded-3xl border transition-all ${item.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                              <div className="flex justify-between items-center mb-3">
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${item.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                                      {item.completed ? 'Certified' : 'In Progress'}
                                  </span>
                                  {item.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-slate-300" />}
                              </div>
                              <p className={`font-black uppercase tracking-tighter truncate ${item.completed ? 'text-emerald-900' : 'text-slate-600'}`}>{item.description}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
              {/* Financial Status Summary */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-600" /> Ledger Summary
                  </h3>
                  <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Certified SAL</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">
                            {project.sal[0] ? `€ ${project.sal[0].importo.toLocaleString('it-IT')}` : 'Pending'}
                          </p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Total</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter italic">€ {project.budget?.toLocaleString('it-IT') || '—'}</p>
                      </div>
                  </div>
              </div>

              {/* Stakeholder Support */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 relative z-10">Direct Support</h3>
                  <div className="space-y-4 relative z-10">
                      <a href="tel:+39000000000" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all group/btn">
                          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                            <Phone size={18} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Call Head Office</span>
                      </a>
                      <a href="mailto:info@edilmanager.it" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all group/btn">
                          <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-colors">
                            <Mail size={18} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">Send Inquiry</span>
                      </a>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-10 text-center opacity-60">EdilManager Enterprise Portal v2.0</p>
              </div>
          </div>
      </div>
    </div>
  );
}

