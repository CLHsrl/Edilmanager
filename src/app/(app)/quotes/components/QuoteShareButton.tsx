'use client';

export default function QuoteShareButton({ quoteNumber, clientEmail }: { quoteNumber: string | number, clientEmail?: string | null }) {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`Simulazione invio preventivo #${quoteNumber} a ${clientEmail || 'cliente'} via Email/WhatsApp.`);
      }}
      className="flex-1 py-3 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all flex items-center justify-center gap-2"
    >
      Invia al Cliente
    </button>
  );
}
