import { getFornitori } from '../fornitori-actions';
import FornitoriClient from './FornitoriClient';

export default async function FornitoriPage() {
  const fornitori = await getFornitori();

  return <FornitoriClient initialFornitori={fornitori as any} />;
}
