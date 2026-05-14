import { getCashflowGlobalData, getDashboardData } from '../../cassa-actions';
import CashflowClient from './CashflowClient';

export default async function CashflowPage() {
  const [data, dashboard] = await Promise.all([
    getCashflowGlobalData(),
    getDashboardData() // To get total current saldo for reference if needed
  ]);

  return <CashflowClient data={data as any} saldoAttuale={dashboard.saldoTotale} />;
}
