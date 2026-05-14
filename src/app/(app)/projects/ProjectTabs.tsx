'use client';

import { useState } from 'react';
import { 
  HardHat, FileText, Truck, BarChart2, TrendingUp, 
  Wrench, GanttChartSquare, ShieldCheck, FolderOpen, 
  HelpCircle, Activity, Layout
} from 'lucide-react';

const TABS = [
  { id: 'panoramica', label: 'Panoramica', icon: Layout },
  { id: 'feed', label: 'Site Feed', icon: Activity },
  { id: 'sicurezza', label: 'Sicurezza & POS', icon: ShieldCheck },
  { id: 'documenti', label: 'Documenti', icon: FolderOpen },
  { id: 'rfis', label: 'RFIs', icon: HelpCircle },
  { id: 'budget-ai', label: 'Analisi AI', icon: TrendingUp, roles: ['ADMIN', 'PM'] },
  { id: 'gantt', label: 'Planning', icon: GanttChartSquare },
  { id: 'lavorazioni', label: 'Task List', icon: Wrench },
  { id: 'rapportini', label: 'Rapportini', icon: FileText },
  { id: 'ddt', label: 'DDT', icon: Truck },
  { id: 'sal', label: 'SAL', icon: BarChart2 },
  { id: 'previsionale', label: 'Forecast', icon: TrendingUp },
];

interface ProjectTabsProps {
  children: React.ReactNode[];
}

export default function ProjectTabs({ children }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8">
      {/* Tab Bar Container */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-blue-400' : ''} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-500">
        {children.map((child, i) => (
          <div key={i} className={activeTab === i ? 'block animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

