import { getProjects } from '../actions';
import { getServerSession } from '@/lib/auth-server';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
    const session = await getServerSession();
    const query = (await searchParams).query || '';
    const projects = await getProjects(query);

    // KPI base
    const activeProjects   = projects.filter(p => p.status === 'ONGOING').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget      = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    // Margine: calcolato SOLO sui cantieri che hanno almeno una voce di USCITA inserita.
    // Se nessuno ha uscite → hasMargineData = false → il client mostra "Nessun dato"
    const projectsWithCosts = projects.filter(p =>
        (p as any).previsionali?.some((x: any) => x.tipo === 'USCITA')
    );
    const hasMargineData = projectsWithCosts.length > 0;

    let totalMargine = 0;
    let marginePerc  = 0;

    if (hasMargineData) {
        const totalRicavi = projectsWithCosts.reduce((sum, p) => {
            const entrate = (p as any).previsionali
                ?.filter((x: any) => x.tipo === 'ENTRATA')
                .reduce((s: number, x: any) => s + x.importo, 0) ?? 0;
            // Se non ci sono entrate esplicite, usa il budget come proxy del ricavo
            return sum + (entrate > 0 ? entrate : (p.budget || 0));
        }, 0);

        const totalCosti = projectsWithCosts.reduce((sum, p) => {
            return sum + ((p as any).previsionali
                ?.filter((x: any) => x.tipo === 'USCITA')
                .reduce((s: number, x: any) => s + x.importo, 0) ?? 0);
        }, 0);

        totalMargine = totalRicavi - totalCosti;
        marginePerc  = totalRicavi > 0 ? (totalMargine / totalRicavi) * 100 : 0;
    }

    return (
        <ProjectsClient
            projects={projects as any}
            isAdmin={session.role === 'ADMIN'}
            stats={{ activeProjects, completedProjects, totalBudget, totalMargine, marginePerc, hasMargineData }}
        />
    );
}
