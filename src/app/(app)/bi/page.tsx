import { getBIStats } from '../analytics-actions';
import BIAnalytics from '@/components/BIAnalytics';
import { TrendingUp } from 'lucide-react';

export default async function BIPage() {
  const data = await getBIStats();

  return (
    <div className="flex flex-col gap-10 pb-20 reveal">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <div className="page-label">
            <TrendingUp className="text-blue-600" size={14} />
            Predictive Analytics & Intelligence
          </div>
          <h1 className="page-title">BI Analytics</h1>
          <p className="page-description">Previsioni finanziarie e analisi marginalità profonda per cantiere</p>
        </div>
      </div>

      <BIAnalytics data={data} />
    </div>
  );
}
