const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Counting data in DB...');
    const counts = {
        users: await prisma.user.count(),
        clients: await prisma.client.count(),
        projects: await prisma.project.count(),
        fornitori: await prisma.fornitore.count(),
        fatture: await prisma.fattura.count(),
        lavoratori: await prisma.lavoratore.count(),
        attrezzature: await prisma.attrezzatura.count(),
        movimenti: await prisma.movimento.count(),
        task: await prisma.workflowTask.count(),
        missioni: await prisma.strategicMission.count(),
        articoli: await prisma.articoloMagazzino.count(),
        vociPrezzi: await prisma.priceItem.count(),
    };
    console.log(counts);
    await prisma.$disconnect();
}
main();
