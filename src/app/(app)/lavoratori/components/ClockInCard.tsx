'use client';

import { useState } from 'react';
import { clockIn, clockOut } from '../../lavoratori-actions';
import { MapPin, Clock, Loader2, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

export default function ClockInCard({ lavoratoreId, currentPresenza }: { lavoratoreId: string, currentPresenza?: any }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClockIn = async () => {
    setIsPending(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await clockIn(lavoratoreId, pos.coords.latitude, pos.coords.longitude);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsPending(false);
        }
      },
      (err) => {
        setError("Per il check-in è necessaria la posizione GPS.");
        setIsPending(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleClockOut = async () => {
    setIsPending(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await clockOut(lavoratoreId, pos.coords.latitude, pos.coords.longitude);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsPending(false);
        }
      },
      (err) => {
        // Clock out even without GPS if needed, but here we enforce it
        setError("GPS richiesto per validazione chiusura turno.");
        setIsPending(false);
      }
    );
  };

  const active = !!currentPresenza && !currentPresenza.uscita;

  return (
    <div className={`p-6 rounded-3xl border-2 transition-all ${
      active ? 'bg-green-50 border-green-200 shadow-lg shadow-green-100' : 'bg-gray-50 border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timbratrice Digitale Georeferenziata</h4>
          <p className={`text-sm font-black mt-1 ${active ? 'text-green-600' : 'text-gray-600'}`}>
            {active ? 'SERVIZIO ATTIVO' : 'FUORI SERVIZIO'}
          </p>
        </div>
        <div className={`p-2 rounded-xl ${active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
          <Clock size={20} />
        </div>
      </div>

      {active ? (
        <div className="space-y-4">
          <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-2"><LogIn size={14} className="text-green-500" /> Entrata alle:</span>
            <span className="text-gray-900">{new Date(currentPresenza.entrata).toLocaleTimeString('it-IT')}</span>
          </div>
          <button 
            onClick={handleClockOut}
            disabled={isPending}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-100 transition-all active:scale-95"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            FINE TURNO (CHECK-OUT)
          </button>
        </div>
      ) : (
        <button 
          onClick={handleClockIn}
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          INIZIA TURNO (CHECK-IN) 
        </button>
      )}

      {error && (
        <p className="mt-3 text-[10px] font-bold text-red-500 text-center uppercase">{error}</p>
      )}
      
      {!error && !isPending && (
        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
           <MapPin size={10} className="text-blue-400" /> GPS Validazione Attiva
        </div>
      )}
    </div>
  );
}
