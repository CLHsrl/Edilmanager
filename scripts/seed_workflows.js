const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Workflows...');

    await prisma.workflowTask.create({
        data: {
            title: 'Revisione Contratto Rossi',
            description: 'Verificare clausole assicurative prima della firma.',
            status: 'TODO',
            priority: 'HIGH',
            roleScope: 'OFFICE'
        }
    });

    await prisma.workflowTask.create({
        data: {
            title: 'Ordine Materiali Cantiere Verdi',
            description: 'Ordinare cemento e ferro per le fondazioni.',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            roleScope: 'SITE'
        }
    });

    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
