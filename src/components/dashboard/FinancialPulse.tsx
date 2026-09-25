'use client';

import { useState } from 'react';
import { TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinancialPulseProps {
    weeklyTrend: { name: string, balance: number }[];
    monthlyTrend: number[];
    globalMargin: number;
}

export default function FinancialPulse({ weeklyTrend, monthlyTrend, globalMargin }: FinancialPulseProps) {
    const [view, setView] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

    const totalWeekly = weeklyTrend.reduce((sum, day) => sum + day.balance, 0);
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const currentMonthData = monthlyTrend.map((v, i) => ({ name: months[i % 12], value: v }));

    return (
        <div className="bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-semibold text-[#003F61] flex items-center gap-2">
                      <Activity size={18} className="text-[#003F61]" />
                      Flussi di Cassa & Liquidità
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Andamento entrate e uscite operative</p>
                </div>
                
                <div className="flex gap-1.5 bg-slate-100 p-1">
                    <button 
                        onClick={() => setView('WEEKLY')}
                        className={`px-3 py-1 text-xs font-medium transition-colors ${view === 'WEEKLY' ? 'bg-white text-[#003F61] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Settimana
                    </button>
                    <button 
                        onClick={() => setView('MONTHLY')}
                        className={`px-3 py-1 text-xs font-medium transition-colors ${view === 'MONTHLY' ? 'bg-white text-[#003F61] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Mese
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50/70 p-4 border border-slate-200/80">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Saldo ({view === 'WEEKLY' ? 'Ultimi 7 Giorni' : 'Anno Corrente'})
                    </p>
                    <p className="text-2xl font-bold text-[#003F61]">€ {totalWeekly.toLocaleString('it-IT')}</p>
                </div>
                <div className="bg-slate-50/70 p-4 border border-slate-200/80">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Margine Operativo Globale
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-[#003F61]">{globalMargin}%</p>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200">A target</span>
                    </div>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {view === 'WEEKLY' ? (
                        <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#64748b' }} 
                                dy={8} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar 
                                dataKey="balance" 
                                radius={[4, 4, 0, 0]} 
                                fill="#003F61" 
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={currentMonthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#003F61" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#003F61" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 12, fill: '#64748b' }} 
                                dy={8} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#003F61" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
