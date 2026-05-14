import { getDashboardData } from '../../cassa-actions';
import ContiClient from './ContiClient';

export default async function ContiPage() {
  const data = await getDashboardData(); // Re-use this as it already computes saldoAttuale
  
  return <ContiClient conti={data.conti as any} />;
}
