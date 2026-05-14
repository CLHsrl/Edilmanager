import { getLavoratori } from '../lavoratori-actions';
import { getProjects } from '../actions';
import LavoratoriClient from './LavoratoriClient';

export default async function LavoratoriPage() {
  const [lavoratori, projects] = await Promise.all([
    getLavoratori(),
    getProjects()
  ]);

  const stats = {
    total: lavoratori.length,
    dipendenti: lavoratori.filter(l => l.tipo === 'DIPENDENTE').length,
    inServizio: lavoratori.filter(l => l.presenze?.some(p => p.uscita === null)).length,
    documentiInScadenza: lavoratori.reduce((acc, l) => acc + (l.documenti?.filter(d => new Date(d.dataScadenza) < new Date()).length || 0), 0)
  };

  return (
    <div className="page-content">
      <LavoratoriClient 
        lavoratori={lavoratori as any} 
        projects={projects as any} 
        stats={stats} 
      />
    </div>
  );
}
