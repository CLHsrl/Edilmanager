'use client';

import { useState, useTransition } from 'react';
import { FolderOpen, Plus, FileText, Download, History, CheckCircle2, AlertCircle, Trash2, Clock, User, Filter, MoreVertical } from 'lucide-react';
import { createProjectDocument, addDocumentVersion } from '@/app/(app)/cantiere-actions';
import SlideOver from '@/components/SlideOver';

interface DocumentVersion {
  id: string;
  versionNumber: number;
  fileUrl: string;
  notes: string | null;
  uploadedBy: string | null;
  createdAt: Date;
}

interface ProjectDocument {
  id: string;
  name: string;
  category: string;
  status: string;
  updatedAt: Date;
  versions: DocumentVersion[];
}

export default function DocumentsTab({ projectId, documents }: { projectId: string; documents: ProjectDocument[] }) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null);
  const [isVersionSlideOpen, setIsVersionSlideOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const categories = [
    { id: 'TECHNICAL', label: 'Disegni Tecnici', color: 'bg-blue-50 text-blue-600' },
    { id: 'LEGAL', label: 'Contratti & Legale', color: 'bg-purple-50 text-purple-600' },
    { id: 'ADMIN', label: 'Amministrazione', color: 'bg-orange-50 text-orange-600' },
    { id: 'PHOTO', label: 'Foto Cantiere', color: 'bg-emerald-50 text-emerald-600' },
  ];

  async function handleCreateDoc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createProjectDocument(projectId, fd);
      setIsSlideOpen(false);
    });
  }

  async function handleAddVersion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDoc) return;
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await addDocumentVersion(selectedDoc.id, projectId, fd);
      setIsVersionSlideOpen(false);
      setSelectedDoc(null);
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header Actions */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Document Archive</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Design Versioning & Compliance Registry</p>
        </div>
        <button 
          onClick={() => setIsSlideOpen(true)}
          className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 transform active:scale-95"
        >
          <Plus size={18} /> Upload New Assets
        </button>
      </div>

      {/* Stats/Quick Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(cat => {
          const count = documents.filter(d => d.category === cat.id).length;
          return (
            <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer group">
              <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                <FolderOpen size={20} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{count.toString().padStart(2, '0')}</p>
            </div>
          );
        })}
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
          <FileText size={64} className="mx-auto text-slate-100 mb-8" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Documentation Available</h3>
          <p className="text-sm text-slate-400 font-medium mt-2">Initialize the project archive by uploading technical drawings or administrative permits.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Name</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Revision</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Approval Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map(doc => {
                const latestVersion = doc.versions[0];
                const cat = categories.find(c => c.id === doc.category);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                             <Clock size={10} /> Sync: {new Date(doc.updatedAt).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cat?.color} border-current`}>
                        {cat?.label}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-lg font-black tracking-widest">V{latestVersion?.versionNumber}</span>
                        <span className="text-xs text-slate-500 font-bold truncate max-w-[200px]">"{latestVersion?.notes || 'Initial release'}"</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${doc.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{doc.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <a 
                          href={latestVersion?.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                        >
                          <Download size={18} />
                        </a>
                        <button 
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsVersionSlideOpen(true);
                          }}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                        >
                          <History size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SlideOver Caricamento Nuovo Documento */}
      <SlideOver isOpen={isSlideOpen} onClose={() => setIsSlideOpen(false)} title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">📁 <span className="italic text-blue-600">Asset Ingestion</span></div>}>
        <form onSubmit={handleCreateDoc} className="space-y-10 pb-20">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Identifier *</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Es. Structural Plan Level 0" 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Category</label>
              <select name="category" className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm">
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vault Link / Cloud URI *</label>
              <input 
                type="text" 
                name="fileUrl" 
                required 
                placeholder="https://vault.edilmanager.luxury/..." 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Release Notes</label>
              <textarea 
                name="notes" 
                rows={3} 
                placeholder="Detailed description of the asset..." 
                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              {isPending ? 'Syncing...' : 'Commit to Archive'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver Storico Versioni / Nuova Versione */}
      <SlideOver isOpen={isVersionSlideOpen} onClose={() => setIsVersionSlideOpen(false)} title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">⏳ <span className="italic text-blue-600">Revision Ledger</span></div>}>
        <div className="space-y-12 pb-20">
          <form onSubmit={handleAddVersion} className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-blue-700 uppercase tracking-[0.2em]">Deploy Revision</h3>
                <p className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Bump to version v{(selectedDoc?.versions[0]?.versionNumber || 0) + 1}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">New Asset URI</label>
                <input 
                  type="text" 
                  name="fileUrl" 
                  required 
                  className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Revision Changelog</label>
                <textarea 
                  name="notes" 
                  rows={2} 
                  required 
                  className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10"
              >
                {isPending ? 'Syncing...' : 'Deploy Revision'}
              </button>
            </div>
          </form>

          <div className="space-y-6 px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
               <History size={14} /> Revision History
            </h3>
            <div className="space-y-4">
              {selectedDoc?.versions.map(v => (
                <div key={v.id} className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between group/v transition-all hover:border-slate-200">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl group-hover/v:scale-110 transition-transform">
                      V{v.versionNumber}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{v.notes || 'System Update'}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                        <User size={10} /> {v.uploadedBy} · {new Date(v.createdAt).toLocaleString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <a href={v.fileUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-slate-100 group-hover/v:border-blue-200">
                    <Download size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
