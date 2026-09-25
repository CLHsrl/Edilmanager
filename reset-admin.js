const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Inizio pulizia database...');

        // Delete all users
        await prisma.user.deleteMany({});
        console.log('Tutti gli utenti esistenti sono stati eliminati.');

        // Delete all sample data if requested (optional based on user saying "tutto il resto cancellalo")
        // The prompt says "tutto il resto cancellalo voglio iniziare ad usarlo per la mia azienda".
        // It's safer to clear transactions/projects/clients as well, but maybe just start with users for now or clear everything.
        // Let's clear the main transactional tables to give a clean slate.
        await prisma.movimento.deleteMany({});
        await prisma.contoBancario.deleteMany({});
        await prisma.salVoce.deleteMany({});
        await prisma.sal.deleteMany({});
        await prisma.ddtArticolo.deleteMany({});
        await prisma.ddt.deleteMany({});
        await prisma.rapportinoArticolo.deleteMany({});
        await prisma.rapportinoAttrezzatura.deleteMany({});
        await prisma.rapportinoLavoratore.deleteMany({});
        await prisma.rapportino.deleteMany({});
        await prisma.projectItem.deleteMany({});
        await prisma.projectUpdate.deleteMany({});
        await prisma.safetyPlan.deleteMany({});
        await prisma.projectDocument.deleteMany({});
        await prisma.rFI.deleteMany({});
        await prisma.previsionale.deleteMany({});
        await prisma.fattura.deleteMany({});
        await prisma.project.deleteMany({});
        await prisma.client.deleteMany({});
        await prisma.fornitore.deleteMany({});
        await prisma.quoteItem.deleteMany({});
        await prisma.quote.deleteMany({});
        await prisma.lead.deleteMany({});
        await prisma.lavoratore.deleteMany({});
        await prisma.attrezzatura.deleteMany({});
        
        console.log('Tutti i dati di test (progetti, clienti, lavoratori, ddt, fatture ecc.) sono stati eliminati.');

        // Create the new admin
        const hashedPassword = await bcrypt.hash('Casarina1!', 10);
        
        const newAdmin = await prisma.user.create({
            data: {
                email: 'camata28@gmail.com',
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Amministratore'
            }
        });

        console.log('Nuovo account admin creato con successo:', newAdmin.email);
    } catch (e) {
        console.error('Errore durante la creazione:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
