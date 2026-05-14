'use client';

import { useState, useTransition } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Maximize2, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import { updateProjectItemGantt } from '../actions';

interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
}

interface Item {
  id: string;
  description: string;
  completed: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  dependencies?: string | null;
  createdAt: Date;
}

export default function GanttTab({ project, items }: { project: Project, items: Item[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [isPending, startTransition] = useTransition();

  const generateTasks = (): Task[] => {
    const tasks: Task[] = [];
    
    const projStart = new Date(project.startDate);
    let projEnd = project.endDate ? new Date(project.endDate) : new Date(projStart);
    if (!project.endDate) {
      projEnd.setMonth(projEnd.getMonth() + 3); // default 3 months for visualization
    }

    // 1. Project Wrapper
    tasks.push({
      start: projStart,
      end: projEnd,
      name: project.name.toUpperCase(),
      id: 'Project',
      progress: items.length > 0 ? (items.filter(i => i.completed).length / items.length) * 100 : 0,
      type: 'project',
      hideChildren: false,
      displayOrder: 1,
      isDisabled: true,
      styles: { progressColor: '#0f172a', progressSelectedColor: '#1e293b', backgroundColor: '#f8fafc' }
    });

    // 2. Real tasks from items
    let lastEnd = new Date(projStart);
    items.forEach((item, index) => {
      const start = item.startDate ? new Date(item.startDate) : new Date(lastEnd);
      const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000);
      
      let dependencies: string[] = [];
      try {
        if (item.dependencies) dependencies = JSON.parse(item.dependencies);
      } catch {}

      tasks.push({
        start,
        end,
        name: item.description,
        id: item.id,
        type: 'task',
        progress: item.completed ? 100 : 0,
        isDisabled: false, // INTERACTIVE
        project: 'Project',
        dependencies,
        displayOrder: index + 2,
        styles: { 
          progressColor: item.completed ? '#16a34a' : '#2563eb', 
          progressSelectedColor: '#1e40af',
          backgroundColor: '#eff6ff'
        }
      });
      
      if (!item.endDate) lastEnd = end;
    });

    return tasks;
  };

  const handleTaskChange = (task: Task) => {
    startTransition(async () => {
      await updateProjectItemGantt(task.id, project.id, {
        startDate: task.start,
        endDate: task.end,
        progress: task.progress
      });
    });
  };

  const tasks = generateTasks();

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col relative group">
      {isPending && (
        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse shadow-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
            Syncing Schedule...
          </div>
        </div>
      )}

      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 leading-none">
            <Maximize2 size={24} className="text-blue-600" /> Executive Timeline
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">Drag & Scale activities to re-synchronize site operations</p>
        </div>
        
        <div className="flex gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          {[
            { mode: ViewMode.Day, label: 'Daily' },
            { mode: ViewMode.Week, label: 'Weekly' },
            { mode: ViewMode.Month, label: 'Monthly' }
          ].map(btn => (
            <button 
              key={btn.mode}
              onClick={() => setViewMode(btn.mode)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === btn.mode ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto p-8 custom-gantt-wrapper bg-white">
        {tasks.length > 1 ? (
          <Gantt 
            tasks={tasks} 
            viewMode={viewMode}
            locale="it"
            listCellWidth={"220px"}
            columnWidth={viewMode === ViewMode.Month ? 180 : viewMode === ViewMode.Week ? 250 : 80}
            onDateChange={handleTaskChange}
            onProgressChange={handleTaskChange}
            barBackgroundColor="#f8fafc"
            barBackgroundSelectedColor="#f1f5f9"
            projectProgressColor="#0f172a"
            todayColor="rgba(37, 99, 235, 0.08)"
            fontSize="10px"
            rowHeight={55}
            barCornerRadius={12}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-32 bg-slate-50/20 rounded-[2rem] border border-slate-50">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 shadow-inner">
               <AlertCircle size={40} />
             </div>
             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Timeline Empty</h4>
             <p className="text-sm text-slate-400 font-medium mt-2 max-w-xs">Initialize project items to generate the interactive Gantt visualization.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-gantt-wrapper ._3_a9P { border-radius: 2rem; border: 1px solid #f1f5f9; overflow: hidden; background: white; }
        .custom-gantt-wrapper text { fill: #1e293b !important; font-size: 9px !important; font-family: inherit !important; font-weight: 900 !important; text-transform: uppercase; letter-spacing: 0.1em; }
        .custom-gantt-wrapper ._2Xz_K { fill: #0f172a !important; rx: 8px; }
        .custom-gantt-wrapper ._3EAlQ { fill: #fff !important; rx: 8px; }
        .custom-gantt-wrapper ._1_v_m { stroke: #f1f5f9 !important; stroke-width: 1px; }
        .custom-gantt-wrapper ._2U56_ { fill: #fcfdfe !important; }
        .custom-gantt-wrapper ._36u_6 { border-bottom: 1px solid #f1f5f9 !important; }
        .custom-gantt-wrapper ._2_9YI { font-weight: 900 !important; color: #0f172a !important; }
        .custom-gantt-wrapper ._3_A45 { background: #f8fafc !important; }
      `}} />
    </div>
  );
}
