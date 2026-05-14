'use client';

import { Printer } from 'lucide-react';

export default function PrintButton({ label = "Scarica Report", className = "" }: { label?: string, className?: string }) {
  return (
    <button 
      onClick={() => window.print()} 
      className={`flex items-center gap-2 px-8 py-4 bg-white text-[#0a0c10] font-black rounded-[2rem] hover:bg-gray-200 transition-all shadow-2xl tracking-tight no-print ${className}`}
    >
      {label} <Printer size={18} />
    </button>
  );
}
