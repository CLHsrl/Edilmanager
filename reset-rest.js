const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cancellazione dei dati rimanenti...');
    
    // Delete in correct order to avoid foreign key constraints (though some are cascade)
    await prisma.systemAuditLog.deleteMany({});
    
    await prisma.strategicMission.deleteMany({});
    await prisma.businessAdvisor.deleteMany({});
    
    // Magazzino & Prezzi
    await prisma.articoloMagazzino.deleteMany({});
    await prisma.priceItem.deleteMany({});
    
    // Safety
    await prisma.safetySettings.deleteMany({
        where: { id: { not: "GLOBAL" } } // usually safety settings has a global record, but let's clear it all or just the ones causing issues. Actually let's not delete safetySettings if it's the global config, or delete and it will be recreated.
    });
    
    // Leads
    await prisma.lead.deleteMany({});
    
    // Dipendenti & Documenti (Compliance)
    await prisma.complianceDoc.deleteMany({});
    await prisma.presenza.deleteMany({});
    await prisma.assenza.deleteMany({});
    
    // Firme e Versioni Documenti
    await prisma.documentVersion.deleteMany({});
    await prisma.digitalSignature.deleteMany({});

    console.log('Tutti i restanti dati di base (missioni, articoli, documenti) sono stati rimossi.');
    await prisma.$disconnect();
}
main();
