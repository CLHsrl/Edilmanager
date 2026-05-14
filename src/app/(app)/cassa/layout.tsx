import Link from 'next/link';
import { Euro, ArrowRightLeft, CreditCard, LineChart } from 'lucide-react';

export default function CassaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Tabs / Sub-nav */}
      <div className="flex gap-2 border-b border-gray-200 pb-px overflow-x-auto">
        <Link href="/cassa" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-t-xl transition-all whitespace-nowrap">
          <Euro size={16} /> Panoramica
        </Link>
        <Link href="/cassa/conti" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-t-xl transition-all whitespace-nowrap">
          <CreditCard size={16} /> Conti & Casse
        </Link>
        <Link href="/cassa/movimenti" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-t-xl transition-all whitespace-nowrap">
          <ArrowRightLeft size={16} /> Movimenti
        </Link>
        <Link href="/cassa/cashflow" className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-t-xl transition-all whitespace-nowrap">
          <LineChart size={16} /> Cashflow Globale
        </Link>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
