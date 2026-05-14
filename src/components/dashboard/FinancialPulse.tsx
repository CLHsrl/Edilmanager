'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinancialPulseProps {
    weeklyTrend: { name: string, balance: number }[];
    monthlyTrend: number[];
}

export default function FinancialPulse({ weeklyTrend, monthlyTrend }: FinancialPulseProps) {
    const [view, setView] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

    const totalWeekly = weeklyTrend.reduce((sum, day) => sum + day.balance, 0);
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const currentMonthData = monthlyTrend.map((v, i) => ({ name: months[i % 12], value: v }));

    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-premium p-10 h-full flex flex-col group transition-all hover:border-blue-600/10">
            <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <Activity size={20} />
                      </div>
                      Financial Pulse
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Enterprise Liquidity Monitor</p>
                </div>
                
                <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
                    <button 
                        onClick={() => setView('WEEKLY')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WEEKLY' ? 'bg-white shadow-xl text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Weekly
                    </button>
                    <button 
                        onClick={() => setView('MONTHLY')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MONTHLY' ? 'bg-white shadow-xl text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/card hover:bg-white hover:border-emerald-200 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Balance ({view === 'WEEKLY' ? '7D' : 'Current'})</p>
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic">€ {totalWeekly.toLocaleString('it-IT')}</p>
                        <div className="p-1 bg-emerald-100 rounded-lg text-emerald-600">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group/card hover:bg-white hover:border-blue-200 transition-all">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gross Margin</p>
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic">24.8%</p>
                        <div className="p-1 bg-blue-100 rounded-lg text-blue-600">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    {view === 'WEEKLY' ? (
                        <BarChart data={weeklyTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                dy={10} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar 
                                dataKey="balance" 
                                radius={[6, 6, 6, 6]} 
                                fill="#10b981" 
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={currentMonthData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                dy={10} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3b82f6" 
                                strokeWidth={4}
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
