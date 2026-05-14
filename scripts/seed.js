const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasourceUrl: "file:./dev.db"
});

async function main() {
    console.log('Seeding Price Items...');

    const items = [
        { code: 'A.01.01', description: 'Scavo di sbancamento in terreno di qualsiasi natura', unit: 'm3', price: 12.50, category: 'Scavi', source: 'Regione Lombardia 2024' },
        { code: 'A.01.02', description: 'Scavo a sezione obbligata per fondazioni', unit: 'm3', price: 18.00, category: 'Scavi', source: 'Regione Lombardia 2024' },
        { code: 'B.05.01', description: 'Calcestruzzo per strutture di fondazione', unit: 'm3', price: 145.00, category: 'Calcestruzzi', source: 'Regione Lombardia 2024' },
        { code: 'C.10.01', description: 'Muratura portante in blocchi di laterizio', unit: 'm2', price: 55.00, category: 'Murature', source: 'Regione Lombardia 2024' },
        { code: 'D.15.01', description: 'Intonaco civile interno', unit: 'm2', price: 22.00, category: 'Finiture', source: 'Regione Lombardia 2024' },
        { code: 'E.20.01', description: 'Pavimento in gres porcellanato', unit: 'm2', price: 45.00, category: 'Pavimenti', source: 'Regione Lombardia 2024' },
    ];

    for (const item of items) {
        await prisma.priceItem.create({
            data: item,
        });
    }

    console.log('Seeding Clients...');
    await prisma.client.create({
        data: {
            name: 'Mario Rossi',
            address: 'Via Roma 1, Milano',
            taxId: 'RSSMRA80A01F205Z',
            email: 'mario.rossi@email.com',
            phone: '3331234567'
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
