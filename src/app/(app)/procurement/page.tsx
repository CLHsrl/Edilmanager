import { getPriceComparison } from '../procurement-actions';
import ProcurementClient from './ProcurementClient';

export default async function ProcurementPage() {
  const comparison = await getPriceComparison();
  
  return <ProcurementClient initialData={comparison} />;
}
