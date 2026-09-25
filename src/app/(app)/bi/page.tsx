import { getBIStats } from '../analytics-actions';
import BIAnalytics from '@/components/BIAnalytics';
import { TrendingUp } from 'lucide-react';

export default async function BIPage() {
  const data = await getBIStats();

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <TrendingUp size={14} className="text-[#003F61]" />
            <span>Strategia / Business Intelligence & Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-[#003F61] tracking-tight">BI Analytics & Previsioni</h1>
          <p className="text-sm text-slate-500 mt-1">Analisi avanzata della marginalità per cantiere, forecast di cassa a 6 mesi e controllo scostamenti.</p>
        </div>
      </div>

      <BIAnalytics data={data} />
    </div>
  );
}
