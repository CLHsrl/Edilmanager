'use client';

import { useState } from 'react';
import { 
  FileText, Truck, BarChart2, TrendingUp, 
  Wrench, GanttChartSquare, ShieldCheck, FolderOpen, 
  HelpCircle, Activity, Layout
} from 'lucide-react';

const TABS = [
  { id: 'panoramica', label: 'Panoramica', icon: Layout },
  { id: 'feed', label: 'Site Feed', icon: Activity },
  { id: 'sicurezza', label: 'Sicurezza & POS', icon: ShieldCheck },
  { id: 'documenti', label: 'Documenti', icon: FolderOpen },
  { id: 'rfis', label: 'RFIs', icon: HelpCircle },
  { id: 'budget-ai', label: 'Analisi Budget', icon: TrendingUp },
  { id: 'gantt', label: 'Cronoprogramma', icon: GanttChartSquare },
  { id: 'lavorazioni', label: 'Lavorazioni', icon: Wrench },
  { id: 'rapportini', label: 'Rapportini', icon: FileText },
  { id: 'ddt', label: 'DDT', icon: Truck },
  { id: 'sal', label: 'SAL', icon: BarChart2 },
  { id: 'previsionale', label: 'Previsionale', icon: TrendingUp },
];

interface ProjectTabsProps {
  children: React.ReactNode[];
}

export default function ProjectTabs({ children }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      {/* Tab Bar Container */}
      <div className="bg-white border border-slate-200 p-1.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === i;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#003F61] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#FEDE59]' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all">
        {children.map((child, i) => (
          <div key={i} className={activeTab === i ? 'block' : 'hidden'}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
