'use client';

import { useState } from 'react';
import { requestAssenza, updateAssenzaStato } from '@/app/(app)/hr-actions';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, FileText, Timer, Umbrella, Stethoscope, Briefcase } from 'lucide-react';

export default function HRDashboard({ lavoratore }: { lavoratore: any }) {
  const [isLocating, setIsLocating] = useState(false);
  
  const activePresenza = lavoratore.presenze?.find((p: any) => p.uscita === null);
  const ferieUtilizzate = lavoratore.assenze?.filter((a: any) => a.tipo === 'FERIE' && a.stato === 'APPROVATA')
    .reduce((acc: number, curr: any) => acc + (curr.giorniTotali || 0), 0) || 0;
  
  const saldoFerie = (lavoratore.ferieAnnuetot || 20) - ferieUtilizzate;

  const [isAddingAbsence, setIsAddingAbsence] = useState(false);

  const handleAbsenceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('lavoratoreId', lavoratore.id);
    try {
      await requestAssenza(formData);
      setIsAddingAbsence(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. STATO FERIE E PERMESSI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Umbrella size={16} />
            <span className="text-[10px] font-black uppercase">Saldo Ferie</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{saldoFerie} <span className="text-xs font-bold text-gray-400">giorni</span></p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
             <div className="bg-blue-500 h-full" style={{ width: `${Math.max(0, (saldoFerie / 20) * 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Timer size={16} />
            <span className="text-[10px] font-black uppercase">Permessi Fruiti</span>
          </div>
          <p className="text-2xl font-black text-gray-900">
            {lavoratore.assenze?.filter((a: any) => a.tipo === 'PERMESSO').reduce((acc: number, curr: any) => acc + (curr.giorniTotali || 0), 0) * 8 || 0} 
            <span className="text-xs font-bold text-gray-400 ml-1">ore</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-2 italic">Aggiornato da presenze</p>
        </div>
      </div>

      {/* 2. RICHIESTA ASSENZA FORM */}
      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" /> Richiesta Assenza
          </h4>
          {!isAddingAbsence && (
            <button 
              onClick={() => setIsAddingAbsence(true)}
              className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase"
            >
              + Nuova Richiesta
            </button>
          )}
        </div>

        {isAddingAbsence ? (
          <form onSubmit={handleAbsenceSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Tipo</label>
                <select name="tipo" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500">
                  <option value="FERIE">Ferie</option>
                  <option value="MALATTIA">Malattia</option>
                  <option value="PERMESSO">Permesso</option>
                </select>
              </div>
              <div />
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Inizio</label>
                <input type="date" name="dataInizio" required className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Fine</label>
                <input type="date" name="dataFine" required className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
              </div>
            </div>
            <input type="text" name="note" placeholder="Note facoltative..." className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium" />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100">Invia</button>
              <button type="button" onClick={() => setIsAddingAbsence(false)} className="px-4 bg-gray-200 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest">Annulla</button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
             {lavoratore.assenze?.slice(0, 3).map((a: any) => (
                <div key={a.id} className="bg-white p-3 rounded-xl flex justify-between items-center border border-gray-50 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${a.tipo === 'MALATTIA' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {a.tipo === 'MALATTIA' ? <Stethoscope size={14} /> : <Umbrella size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{a.tipo}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                          {new Date(a.dataInizio).toLocaleDateString()} - {new Date(a.dataFine).toLocaleDateString()}
                        </p>
                      </div>
                   </div>
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                     a.stato === 'APPROVATA' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     {a.stato}
                   </span>
                </div>
             ))}
             {(!lavoratore.assenze || lavoratore.assenze.length === 0) && (
               <p className="text-xs text-center text-gray-400 py-2 italic">Nessun evento registrato</p>
             )}
          </div>
        )}
      </div>

      {/* 2. RICHIESTA ASSENZA FORM */}
      {/* ... previous content ... */}

      {/* 2.5 ATTIVITÀ ASSEGNATE */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Attività Assegnate</h4>
        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden shadow-sm">
          {lavoratore.tasks?.map((task: any) => (
            <div key={task.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${
                  task.status === 'DONE' ? 'bg-green-50 text-green-600 border-green-100' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {task.status === 'DONE' ? <CheckCircle2 size={18} /> : 
                   task.status === 'IN_PROGRESS' ? <Clock size={18} className="animate-pulse" /> :
                   <AlertCircle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{task.title}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                    {task.dueDate ? `Scadenza: ${new Date(task.dueDate).toLocaleDateString()}` : 'Nessuna scadenza'}
                  </p>
                </div>
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border ${
                task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
          {(!lavoratore.tasks || lavoratore.tasks.length === 0) && (
            <div className="p-8 text-center bg-gray-50/30">
              <p className="text-xs text-gray-400 italic font-medium">Nessuna attività assegnata al momento.</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Compliance & Sicurezza</h4>
        <div className="space-y-2">
          {lavoratore.documenti?.map((doc: any) => (
            <div key={doc.id} className="bg-white border border-gray-100 p-3 rounded-xl flex justify-between items-center group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${new Date(doc.dataScadenza) < new Date() ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                  {doc.nome.toLowerCase().includes('medica') ? <Stethoscope size={16} /> : <FileText size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{doc.nome}</p>
                  <p className={`text-[10px] font-bold ${new Date(doc.dataScadenza) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                    Scadenza: {new Date(doc.dataScadenza).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
              <CheckCircle2 size={16} className={new Date(doc.dataScadenza) < new Date() ? 'text-gray-200' : 'text-green-500'} />
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-200 hover:text-gray-500 transition-all">
            + AGGIUNGI CERTIFICATO
          </button>
        </div>
      </div>

      {/* 4. ULTIME ATTIVITÀ (PRESENZE) */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Cronologia Presenze</h4>
        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
          {lavoratore.presenze?.slice(0, 5).map((p: any) => (
            <div key={p.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-900">{new Date(p.entrata).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-1">
                   <Clock size={10} /> {new Date(p.entrata).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {p.uscita ? new Date(p.uscita).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[10px] text-blue-500 font-black uppercase">
                  <MapPin size={10} /> {p.latIn ? 'Georeferenziata' : 'Manuale'}
                </div>
                {p.latIn && (
                  <p className="text-[8px] text-gray-300 font-mono mt-0.5">{p.latIn.toFixed(4)}, {p.longIn.toFixed(4)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
