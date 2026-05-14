import { getFornitori } from '../fornitori-actions';
import FornitoriClient from './FornitoriClient';

export default async function FornitoriPage() {
  const fornitori = await getFornitori();

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <FornitoriClient initialFornitori={fornitori as any} />
    </div>
  );
}
