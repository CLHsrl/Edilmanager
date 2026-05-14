'use client';

import { Calendar, User, MapPin, Wrench, History, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface SchedaAttrezzoProps {
  attrezzo: any;
}

export default function SchedaAttrezzo({ attrezzo }: SchedaAttrezzoProps) {
  const isManutenzioneScaduta = attrezzo.dataManutenzione && new Date(attrezzo.dataManutenzione) < new Date();
  
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Info */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-4 rounded-2xl ${attrezzo.tipo === 'VEICOLO' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
              <Wrench size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{attrezzo.nome}</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{attrezzo.targa || 'Nessuna targa'}</p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            attrezzo.stato === 'DISPONIBILE' ? 'bg-green-100 text-green-700' :
            attrezzo.stato === 'IN_USO' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          }`}>
            {attrezzo.stato}
          </span>
        </div>
      </div>

      {/* Ripartizione Assegnazione */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <MapPin size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cantiere Attuale</span>
          </div>
          <p className="font-bold text-gray-900">{attrezzo.project?.name || 'Nessun cantiere'}</p>
          <p className="text-xs text-gray-500 mt-1">{attrezzo.project?.indirizzo || 'Disponibile in magazzino'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <User size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Responsabile / Dipendente</span>
          </div>
          <p className="font-bold text-gray-900">{attrezzo.dipendente ? `${attrezzo.dipendente.nome} ${attrezzo.dipendente.cognome || ''}` : 'Nessun dipendente'}</p>
          <p className="text-xs text-gray-500 mt-1">{attrezzo.dipendente?.tipo || 'Non assegnato'}</p>
        </div>
      </div>

      {/* Dati Manutenzione */}
      <div className={`rounded-xl p-6 border transition-all ${isManutenzioneScaduta ? 'bg-red-50 border-red-100' : 'bg-green-50/50 border-green-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History size={18} className={isManutenzioneScaduta ? 'text-red-600' : 'text-green-600'} />
            <span className="text-xs font-black uppercase tracking-widest">Manutenzione & Revisione</span>
          </div>
          {isManutenzioneScaduta && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse">
              <AlertCircle size={12} /> SCADUTA
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ultimi Intervento</p>
            <p className="text-lg font-black text-gray-900">
              {attrezzo.dataManutenzione 
                ? new Date(attrezzo.dataManutenzione).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
                : 'Dato non inserito'}
            </p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
            Aggiorna registro
          </button>
        </div>
      </div>

      {/* Compliance & Documenti */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Documentazione Tecnica</h3>
        <div className="grid grid-cols-1 gap-2">
          {attrezzo.documenti?.length > 0 ? (
            attrezzo.documenti.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">{doc.nome}</p>
                    <p className="text-[10px] text-gray-500 font-medium">Scade il {new Date(doc.dataScadenza).toLocaleDateString()}</p>
                  </div>
                </div>
                {new Date(doc.dataScadenza) > new Date() ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <AlertCircle size={18} className="text-red-500" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nessun documento caricato</p>
            </div>
          )}
        </div>
      </div>

      {/* Note Speciali */}
      {attrezzo.note && (
        <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-yellow-800 mb-2">Note Operative</h4>
          <p className="text-sm text-yellow-900/80 leading-relaxed font-medium">
            {attrezzo.note}
          </p>
        </div>
      )}
    </div>
  );
}
