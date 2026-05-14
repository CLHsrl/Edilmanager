import { getMovimenti, getConti } from '../../cassa-actions';
import { getProjects } from '../../actions';
import MovimentiClient from './MovimentiClient';

export default async function MovimentiPage() {
  const [movimenti, conti, projects] = await Promise.all([
    getMovimenti(),
    getConti(),
    getProjects()
  ]);

  return <MovimentiClient movimenti={movimenti as any} conti={conti} projects={projects as any} />;
}
