import { prisma } from '@/lib/prisma';
import GlobalProactiveBanner from './GlobalProactiveBanner';

export default async function AnomalyContainer() {
    // Shared logic for "Le voglio ovunque"
    const allOngoingProjects = await prisma.project.findMany({
        where: { status: 'ONGOING' },
        include: {
            rapportini: {
                include: {
                    lavoratori: true,
                    articoliMagazzino: { include: { articoloMagazzino: true } }
                }
            }
        }
    });

    const anomalies = allOngoingProjects.map(p => {
        const budget = p.budget || 0;
        const laborCost = p.rapportini.reduce((sum, r) => 
            sum + r.lavoratori.reduce((subSum, l) => subSum + (l.ore * 25), 0), 0);
        const materialCost = p.rapportini.reduce((sum, r) => 
            sum + r.articoliMagazzino.reduce((subSum, a) => subSum + (a.quantita * (a.articoloMagazzino.costoUnitario || 10)), 0), 0);
        
        const totalCost = laborCost + materialCost;
        const usagePercent = budget > 0 ? (totalCost / budget) * 100 : 0;

        return {
            id: p.id,
            name: p.name,
            usagePercent
        };
    }).filter(a => a.usagePercent > 85);

    return <GlobalProactiveBanner anomalies={anomalies} />;
}
