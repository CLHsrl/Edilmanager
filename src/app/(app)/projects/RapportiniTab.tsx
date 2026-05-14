'use client';

import { useState, useTransition, useEffect } from 'react';
import { createRapportino, deleteRapportino } from '@/app/(app)/cantiere-actions';
import { Plus, Trash2, ChevronDown, ChevronUp, Users, Calendar, Wrench, Package, FileText, X, Loader2, RotateCcw, Check, Camera, Image as ImageIcon, ShieldCheck, ShieldAlert, Wand2, MapPin } from 'lucide-react';
import SlideOver from '@/components/SlideOver';
import SignaturePad from '@/components/SignaturePad';
import { SyncStore } from '@/lib/sync-store';
import { parseNaturalLanguageRapportino, analyzePhotoSafety } from '@/app/(app)/ai-actions';

interface AnalysisResult {
    helmetDetected: boolean;
    confidence: number;
    detectedObjects: string[];
    warning: string | null;
}

interface LavoratoreAnagrafica { id: string; nome: string; cognome: string | null }
interface ArticoloMagazzinoAnagrafica { id: string; nome: string; codice: string; unitaMisura: string }
interface AttrezzaturaAnagrafica { id: string; nome: string; targa: string | null }

interface RapportinoLavoratore { id: string; ore: number; lavoratore: LavoratoreAnagrafica }
interface RapportinoAttrezzatura { id: string; oreUtilizzo: number; attrezzatura: AttrezzaturaAnagrafica }
interface RapportinoArticolo { id: string; quantita: number; articoloMagazzino: ArticoloMagazzinoAnagrafica }

interface DigitalSignature { id: string; signatureData: string; signerName: string | null }

interface Rapportino {
  id: string;
  data: Date;
  attivita: string;
  note: string | null;
  mezzi: string | null;
  materiali: string | null;
  latitude: number | null;
  longitude: number | null;
  lavoratori: RapportinoLavoratore[];
  attrezzature: RapportinoAttrezzatura[];
  articoliMagazzino: RapportinoArticolo[];
  signature?: DigitalSignature | null;
  photos?: string | null;
  aiSafetyCheck?: boolean;
}

export default function RapportiniTab({ 
  projectId, 
  rapportini, 
  allLavoratori, 
  allArticoli = [], 
  allAttrezzature = [],
  projectLat,
  projectLng
}: { 
  projectId: string; 
  rapportini: Rapportino[]; 
  allLavoratori: LavoratoreAnagrafica[];
  allArticoli: ArticoloMagazzinoAnagrafica[];
  allAttrezzature: AttrezzaturaAnagrafica[];
  projectLat?: number | null;
  projectLng?: number | null;
}) {
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Rows State
  const [rows, setRows] = useState<{ lavoratoreId: string; ore: number }[]>([{ lavoratoreId: '', ore: 8 }]);
  const [attrezzaturaRows, setAttrezzaturaRows] = useState<{ attrezzaturaId: string; oreUtilizzo: number }[]>([]);
  const [articoloRows, setArticoloRows] = useState<{ articoloMagazzinoId: string; quantita: number }[]>([]);
  
  // Horizon State
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [aiResult, setAiResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  // GPS State
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geofencingWarning, setGeofencingWarning] = useState<string | null>(null);
  const [magicText, setMagicText] = useState('');
  const [isMagicProcessing, setIsMagicProcessing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOffline(!navigator.onLine);
    const handleOnline = () => { setIsOffline(false); syncOfflineData(); };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
     let item = SyncStore.pop();
     while (item) {
        console.log("Sincronizzando rapportino offline...", item.id);
        const fd = new FormData();
        Object.entries(item.data).forEach(([key, value]) => {
           if (value !== null && value !== undefined) fd.set(key, value as string);
        });
        try {
          await createRapportino(item.projectId, fd);
        } catch (err) {
          console.error("Errore durante sync item", item.id, err);
        }
        item = SyncStore.pop();
     }
  };

  const handleAddPhoto = async () => {
     setIsAnalyzing(true);
     setAiResult(null);
     const mockPhoto = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UzZTdlYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEhPVE88L3RleHQ+PC9zdmc+"; 
     try {
        const result = await analyzePhotoSafety(mockPhoto);
        setAiResult(result as any);
        setPhotos(p => [...p, mockPhoto]);
     } catch (err) {
        console.error("AI failed", err);
     } finally {
        setIsAnalyzing(false);
     }
  };

  const captureLocation = () => {
    setIsLocating(true);
    setGeofencingWarning(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setIsLocating(false);

        // Geofencing Check
        if (projectLat && projectLng) {
          const R = 6371e3;
          const φ1 = (lat * Math.PI) / 180;
          const φ2 = (projectLat * Math.PI) / 180;
          const Δφ = ((projectLat - lat) * Math.PI) / 180;
          const Δλ = ((projectLng - lng) * Math.PI) / 180;
          const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance > 500) {
            setGeofencingWarning(`ATTENZIONE: Sei a ${Math.round(distance)}m dal cantiere. Posizione non valida per operatività standard.`);
          }
        }
      },
      (err) => {
        console.error(err);
        alert("Impossibile ottenere la posizione GPS.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const addRow = () => setRows(r => [...r, { lavoratoreId: '', ore: 8 }]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: 'lavoratoreId' | 'ore', value: string | number) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const addAttrizzaturaRow = () => setAttrezzaturaRows(r => [...r, { attrezzaturaId: '', oreUtilizzo: 1 }]);
  const removeAttrezzaturaRow = (i: number) => setAttrezzaturaRows(r => r.filter((_, idx) => idx !== i));
  const updateAttrezzaturaRow = (i: number, field: 'attrezzaturaId' | 'oreUtilizzo', value: string | number) =>
    setAttrezzaturaRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const addArticoloRow = () => setArticoloRows(r => [...r, { articoloMagazzinoId: '', quantita: 1 }]);
  const removeArticoloRow = (i: number) => setArticoloRows(r => r.filter((_, idx) => idx !== i));
  const updateArticoloRow = (i: number, field: 'articoloMagazzinoId' | 'quantita', value: string | number) =>
    setArticoloRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const handleMagicProcess = () => {
    if (!magicText.trim()) return;
    setIsMagicProcessing(true);
    startTransition(async () => {
        try {
            const data = await parseNaturalLanguageRapportino(magicText, projectId);
            if (data.lavoratori.length > 0) setRows(data.lavoratori);
            if (data.articoli.length > 0) setArticoloRows(data.articoli);
            setMagicText('');
        } catch (err) {
            console.error("Magic fail", err);
        } finally {
            setIsMagicProcessing(false);
        }
    });
  };


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('lavoratori', JSON.stringify(rows.filter(r => r.lavoratoreId)));
    fd.set('attrezzature', JSON.stringify(attrezzaturaRows.filter(r => r.attrezzaturaId)));
    fd.set('articoli', JSON.stringify(articoloRows.filter(r => r.articoloMagazzinoId)));
    
    if (location) {
      fd.set('latitude', location.lat.toString());
      fd.set('longitude', location.lng.toString());
    }

    if (signatureData) {
      fd.set('signatureData', signatureData);
    }
    
    if (aiResult) {
       fd.set('aiSafetyCheck', aiResult.helmetDetected ? 'true' : 'false');
    }

    if (isOffline) {
       // Serialize full state for offline sync
       const offlineData: Record<string, string> = {};
       fd.forEach((value, key) => {
         if (typeof value === 'string') offlineData[key] = value;
       });

       SyncStore.addToQueue(projectId, offlineData);
       alert("⚠️ Offline: Rapportino salvato localmente. Verrà inviato appena torni online.");
       setIsSlideOpen(false);
       return;
    }
    
    startTransition(async () => {
      await createRapportino(projectId, fd);
      setIsSlideOpen(false);
      setRows([{ lavoratoreId: '', ore: 8 }]);
      setAttrezzaturaRows([]);
      setArticoloRows([]);
      setLocation(null);
      setSignatureData(null);
      setAiResult(null);
      setPhotos([]);
    });
  }

  async function handleDelete(id: string) {
    if (confirm('Eliminare questo rapportino?')) {
      startTransition(async () => { await deleteRapportino(id, projectId); });
    }
  }

  const totalOreAll = rapportini.reduce((s, r) => s + r.lavoratori.reduce((h, l) => h + l.ore, 0), 0);

  return (
    <div className="space-y-4">
      {/* Offline Alert */}
      {isOffline && (
        <div className="bg-red-500 text-white p-3 rounded-xl text-center text-xs font-black uppercase tracking-widest animate-pulse">
           Modalità Offline Attiva — I dati verranno salvati localmente
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Operational Site Diary</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
             {rapportini.length} registri archiviati · {totalOreAll.toFixed(0)} ore totali di manodopera
          </p>
        </div>
        <button 
          onClick={() => { setLocation(null); setSignatureData(null); setPhotos([]); setAiResult(null); setIsSlideOpen(true); }} 
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 transition-all transform active:scale-95"
        >
          <Plus size={18} /> Nuovo Rapportino
        </button>
      </div>

      {/* List */}
      {rapportini.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-24 text-center">
          <FileText size={64} className="mx-auto text-slate-100 mb-8" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nessuna Registrazione</h3>
          <p className="text-sm text-slate-400 font-medium mt-2">Inizia a tracciare le attività quotidiane e le presenze in cantiere.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rapportini.map(r => {
            const oreRap = r.lavoratori.reduce((h, l) => h + l.ore, 0);
            const isExpanded = expanded === r.id;
            return (
              <div key={r.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row items-center gap-6 p-8 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setExpanded(isExpanded ? null : r.id)}>
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-900 shrink-0 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <span className="text-xs font-black leading-none uppercase">{new Date(r.data).toLocaleDateString('it-IT', { day: 'numeric' })}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">{new Date(r.data).toLocaleDateString('it-IT', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-slate-900 text-lg uppercase tracking-tighter leading-none">{r.attivita}</p>
                      {r.signature && (
                        <span className="bg-blue-50 text-blue-600 p-1 rounded-full" title="Validato con Firma">
                          <Check size={10} className="stroke-[4]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} className="text-blue-500" /> {new Date(r.data).toLocaleDateString('it-IT', { weekday: 'long' })} · {r.lavoratori.length} operatori
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{oreRap}<span className="text-xs text-slate-300 ml-1">H</span></p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Labor Volume</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e => { e.stopPropagation(); handleDelete(r.id); }} className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" disabled={isPending}>
                        <Trash2 size={18} />
                      </button>
                      <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-50 p-10 space-y-8 bg-slate-50/30 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      
                      {/* Left: Personnel & Details */}
                      <div className="xl:col-span-8 space-y-8">
                        {r.lavoratori.length > 0 && (
                          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Users size={14} className="text-blue-600" /> Field Force Deployment
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {r.lavoratori.map(l => (
                                <div key={l.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group/worker">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center text-xs font-black border border-slate-100 shadow-sm group-hover/worker:bg-slate-900 group-hover/worker:text-white transition-all">
                                      {l.lavoratore.nome[0]}{l.lavoratore.cognome ? l.lavoratore.cognome[0] : ''}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{l.lavoratore.nome} {l.lavoratore.cognome}</p>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operator</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-black text-blue-600 tracking-tighter leading-none">{l.ore}<span className="text-[10px] ml-0.5">h</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {(r.attrezzature.length > 0 || r.mezzi) && (
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                <Wrench size={14} className="text-purple-600" /> Asset & Equipment
                              </h4>
                              <div className="space-y-3">
                                {r.attrezzature.map(a => (
                                   <div key={a.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl">
                                      <span className="text-xs font-bold text-slate-700">{a.attrezzatura.nome} {a.attrezzatura.targa ? `[${a.attrezzatura.targa}]` : ''}</span>
                                      <span className="text-xs font-black text-slate-900">{a.oreUtilizzo}h</span>
                                   </div>
                                ))}
                                {r.mezzi && <p className="text-xs text-slate-500 font-medium italic mt-4 border-t border-slate-50 pt-3">"{r.mezzi}"</p>}
                              </div>
                            </div>
                          )}
                          {(r.articoliMagazzino.length > 0 || r.materiali) && (
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                <Package size={14} className="text-orange-600" /> Material Consumption
                              </h4>
                              <div className="space-y-3">
                                {r.articoliMagazzino.map(a => (
                                   <div key={a.id} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl">
                                      <span className="text-xs font-bold text-slate-700">{a.articoloMagazzino.nome}</span>
                                      <span className="text-xs font-black text-slate-900">{a.quantita} {a.articoloMagazzino.unitaMisura}</span>
                                   </div>
                                ))}
                                {r.materiali && <p className="text-xs text-slate-500 font-medium italic mt-4 border-t border-slate-50 pt-3">"{r.materiali}"</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Validation & Media */}
                      <div className="xl:col-span-4 space-y-8">
                         {r.latitude && r.longitude && (
                           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                <MapPin size={14} className="text-emerald-600" /> GPS Verification
                              </h4>
                              <a 
                                href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/map relative block rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200"
                              >
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white font-black text-[10px] uppercase tracking-widest opacity-0 group-hover/map:opacity-100 transition-opacity z-10">Visualizza Mappa</div>
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                  <MapPin size={48} className="animate-bounce" />
                                </div>
                              </a>
                           </div>
                         )}

                         {r.signature && (
                           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Digital Signature</h4>
                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-4 flex items-center justify-center">
                                <img src={r.signature.signatureData} alt="Firma" className="max-h-20 opacity-80" />
                              </div>
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{r.signature.signerName || 'Authorized Personnel'}</p>
                           </div>
                         )}

                         {r.note && (
                          <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                            <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4 relative z-10">Field Intelligence</h4>
                            <p className="text-sm font-medium leading-relaxed relative z-10 italic">"{r.note}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver 
        isOpen={isSlideOpen} 
        onClose={() => setIsSlideOpen(false)} 
        title={<div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tighter text-2xl">📋 <span className="italic text-blue-600">Site Report</span></div>}
      >
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
          {/* Magic Assistant (Pillar AI style) */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="flex justify-between items-center mb-6 relative z-10">
                <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Wand2 size={18} className="text-blue-400 animate-pulse" /> AI Operational Assistant
                </label>
                <span className="text-[9px] font-black text-slate-500 uppercase">Natural Language</span>
             </div>
             <div className="relative z-10">
                <textarea 
                   value={magicText}
                   onChange={(e) => setMagicText(e.target.value)}
                   placeholder="Es: 'Rossi 8h, scaricato 50 sacchi cemento, lavori di scavo completati'..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 transition-all resize-none font-medium leading-relaxed"
                   rows={3}
                />
                <button 
                   type="button" 
                   onClick={handleMagicProcess}
                   disabled={!magicText || isMagicProcessing}
                   className="absolute bottom-4 right-4 bg-white text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 hover:text-white active:scale-95 transition-all disabled:opacity-50"
                >
                   {isMagicProcessing ? <Loader2 size={16} className="animate-spin" /> : 'PROCESSA'}
                </button>
             </div>
             <p className="text-[9px] font-bold text-slate-500 mt-4 text-center uppercase tracking-widest opacity-60">
                Compilazione automatica di ore e materiali tramite linguaggio naturale
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data del Rapportino *</label>
               <input 
                  type="date" 
                  name="data" 
                  required 
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm" 
               />
            </div>
            <div className={`p-6 rounded-[1.5rem] flex items-center justify-between border-2 transition-all ${location ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
               <div>
                 <p className={`text-[9px] font-black uppercase tracking-widest ${location ? 'text-emerald-600' : 'text-slate-400'}`}>Geo-Tagging</p>
                 <p className="text-xs font-black text-slate-900 mt-1 uppercase tracking-tight">{location ? "COORDINATE ACQUISITE" : "TAG GPS RICHIESTO"}</p>
               </div>
               <button 
                  type="button" 
                  onClick={captureLocation}
                  disabled={isLocating}
                  className={`p-3 rounded-xl shadow-lg transition-all active:scale-90 ${location ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
               >
                  {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
               </button>
            </div>

            {geofencingWarning && (
              <div className="md:col-span-2 bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4 text-red-600 animate-in slide-in-from-left-4">
                 <ShieldAlert size={24} className="shrink-0" />
                 <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                   {geofencingWarning}
                 </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sintesi Attività Operative *</label>
            <textarea 
              name="attivita" 
              required 
              rows={4} 
              placeholder="Descrivi dettagliatamente i lavori eseguiti, le milestone raggiunte e gli eventuali blocchi..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all resize-none shadow-sm placeholder:text-slate-300" 
            />
          </div>

          {/* Personale Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
             <div className="flex justify-between items-center mb-8 relative z-10">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Users size={18} className="text-blue-600"/> Deployment Log
                </label>
                <button 
                   type="button" 
                   onClick={addRow} 
                   className="bg-slate-50 text-slate-900 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Plus size={18}/>
                </button>
             </div>
             <div className="space-y-4 relative z-10">
                {rows.map((row, i) => (
                   <div key={i} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-blue-100">
                      <select 
                        value={row.lavoratoreId} 
                        onChange={e => updateRow(i, 'lavoratoreId', e.target.value)} 
                        required 
                        className="flex-1 bg-transparent border-none text-xs font-black text-slate-900 focus:ring-0 uppercase tracking-tight"
                      >
                         <option value="">Seleziona Operatore...</option>
                         {allLavoratori.map(l => <option key={l.id} value={l.id}>{l.nome} {l.cognome}</option>)}
                      </select>
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100">
                        <input 
                           type="number" 
                           step={0.5} 
                           value={row.ore} 
                           onChange={e => updateRow(i, 'ore', parseFloat(e.target.value))} 
                           className="w-10 text-center bg-transparent border-none text-sm font-black text-blue-600 focus:ring-0 p-0" 
                        />
                        <span className="text-[9px] font-black text-slate-400 uppercase">ore</span>
                      </div>
                      {rows.length > 1 && (
                        <button type="button" onClick={() => removeRow(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <X size={18}/>
                        </button>
                      )}
                   </div>
                ))}
             </div>
          </div>

          {/* Media & Safety Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Site Media & AI Scan</label>
               <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={handleAddPhoto}
                    disabled={isAnalyzing}
                    className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                  >
                    {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <Camera size={28} />}
                    <p className="text-[9px] font-black mt-3 uppercase tracking-widest">CATTURA</p>
                  </button>

                  {photos.map((p, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-white shadow-xl animate-in zoom-in-90">
                       <img src={p} alt="Site" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ))}

                  {aiResult && (
                    <div className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center text-center w-24 h-24 animate-in zoom-in-95 ${
                      aiResult.helmetDetected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                       {aiResult.helmetDetected ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                       <p className="text-[8px] font-black uppercase mt-2 leading-none tracking-tighter">
                         {aiResult.helmetDetected ? "Safety OK" : "DPI WARNING"}
                       </p>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Protocol validation</label>
               {signatureData ? (
                 <div className="relative bg-slate-50 p-6 rounded-3xl border-2 border-blue-100 text-center flex-1 flex flex-col justify-center animate-in zoom-in-95">
                   <img src={signatureData} alt="Firma" className="max-h-20 mx-auto mb-4 opacity-80" />
                   <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Firma Acquisita</p>
                   <button type="button" onClick={() => setSignatureData(null)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                     <RotateCcw size={18} />
                   </button>
                   <input 
                     type="text" 
                     name="signerName" 
                     placeholder="Digitare nome firmatario..." 
                     className="mt-6 w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 outline-none focus:border-blue-600 transition-all text-center uppercase tracking-tighter" 
                   />
                 </div>
               ) : (
                 <div className="flex-1">
                   <SignaturePad onSave={setSignatureData} />
                 </div>
               )}
            </div>
          </div>

          <div className="pt-10">
            <button 
              type="submit" 
              disabled={isPending || (!signatureData && rows.length > 0)}
              className="w-full bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white py-7 rounded-[2.5rem] text-lg font-black uppercase tracking-[0.3em] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Sincronizza Rapportino'}
            </button>
            {!signatureData && rows.length > 0 && (
              <p className="text-center text-[9px] font-black text-red-500 uppercase tracking-[0.2em] mt-6 animate-pulse">
                Attenzione: Firma obbligatoria per validare il deployment
              </p>
            )}
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
