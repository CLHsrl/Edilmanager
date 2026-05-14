import { getProjects } from '../actions';
import { HardHat, Wallet, CheckCircle2 } from 'lucide-react';
import { getServerSession } from '@/lib/auth-server';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
    const session = await getServerSession();
    const query = (await searchParams).query || '';
    const projects = await getProjects(query);

    // KPI Calculations
    const activeProjects = projects.filter(p => p.status === 'ONGOING').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    return (
        <div className="page-content">
            <ProjectsClient 
                projects={projects as any} 
                isAdmin={session.role === 'ADMIN'} 
                stats={{ activeProjects, completedProjects, totalBudget }}
            />
        </div>
    );
}
