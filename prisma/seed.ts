import { PrismaClient } from '../src/lib/prisma-client-v25';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏛️  Starting RE-SEEDING (Enterprise High Fidelity)...');

  // 1. Cleansing
  console.log('🧹 Cleaning existing data...');
  await prisma.workflowTask.deleteMany();
  await prisma.user.deleteMany();
  await prisma.previsionale.deleteMany();
  await prisma.fattura.deleteMany();
  await prisma.movimento.deleteMany();
  await prisma.contoBancario.deleteMany();
  await prisma.rapportinoArticolo.deleteMany();
  await prisma.rapportinoAttrezzatura.deleteMany();
  await prisma.rapportinoLavoratore.deleteMany();
  await prisma.digitalSignature.deleteMany();
  await prisma.complianceDoc.deleteMany();
  await prisma.articoloMagazzino.deleteMany();
  await prisma.attrezzatura.deleteMany();
  await prisma.rapportino.deleteMany();
  await prisma.sal.deleteMany();
  await prisma.projectItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lavoratore.deleteMany();
  await prisma.client.deleteMany();
  await prisma.fornitore.deleteMany();
  console.log('🧹 Cleaned!');

  // 1.5 Users (Admin, PM, Operaio)
  console.log('👤 Creating users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin', salt);
  const pmPassword = await bcrypt.hash('pm', salt);
  const operaioPassword = await bcrypt.hash('operaio', salt);

  await prisma.user.createMany({
    data: [
      { email: 'admin@edilmanager.it', password: adminPassword, role: 'ADMIN', name: 'Amministratore' },
      { email: 'pm@edilmanager.it', password: pmPassword, role: 'PM', name: 'Project Manager' },
      { email: 'operaio@edilmanager.it', password: operaioPassword, role: 'OPERAIO', name: 'Operaio Specializzato' }
    ]
  });
  console.log('✅ Users Created');
  // 2. Clients (50) - Realistic
  const clientTypes = ['PRIVATE', 'COMPANY'];
  const companies = [
    'Edilizia Moderna S.p.A.', 'Rossi Costruzioni S.r.l.', 'Immobiliare Luce', 
    'Global Building Tech', 'ArchiTech Partners', 'EcoHouse S.r.l.', 'Vetro & Acciaio S.a.s.',
    'Restauri Storici S.p.A.', 'Urban & Green', 'Cantieri Veloci'
  ];
  const firstNames = ['Luca', 'Marco', 'Giulia', 'Elena', 'Roberto', 'Paola', 'Francesco', 'Alessandro', 'Silvia', 'Matteo'];
  const lastNames = ['Rossi', 'Bianchi', 'Verdi', 'Russo', 'Ferrari', 'Esposito', 'Gallo', 'Conti', 'Costa', 'Mancini'];
  const cities = ['Milano', 'Roma', 'Torino', 'Napoli', 'Firenze', 'Bologna', 'Venezia', 'Verona', 'Genova'];

  const clients = [];
  for (let i = 1; i <= 50; i++) {
    const type = clientTypes[Math.floor(Math.random() * 2)];
    const isCompany = type === 'COMPANY';
    const cName = isCompany ? `${companies[i % companies.length]} # ${i}` : `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(Math.random() * 10)]}`;
    
    const client = await prisma.client.upsert({
      where: { number: i },
      update: {},
      create: {
        number: i,
        type,
        name: cName,
        taxId: isCompany ? `IT${10000000000 + i}` : `RSSMRC80A01H${500 + i}Z`,
        email: `info@${cName.replace(/[^a-z0-9]/gi, '').toLowerCase()}.it`,
        city: cities[i % cities.length],
        address: `Via delle Industrie ${i}`,
        cap: '20100',
        province: 'MI'
      }
    });
    clients.push(client);
  }
  console.log('✅ Clients Created');

  // 2.5 Fornitori / Subappaltatori
  await prisma.fornitore.create({
    data: {
      name: 'Edil Scavi S.r.l.',
      ragioneSociale: 'Edil Scavi S.r.l. (Subappaltatore)',
      tipo: 'SUBAPPALTATORE',
      dataScadenzaDurc: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000) // Valid 90 days
    }
  });

  await prisma.fornitore.create({
    data: {
      name: 'Materiali Elettrici Grossista',
      ragioneSociale: 'Materiali Elettrici Grossista',
      tipo: 'FORNITORE',
      dataScadenzaDurc: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000) // EXPIRED 15 days ago
    }
  });
  console.log('✅ Fornitori & DURC Created');

  // 3. Workers (20) - UNIQUE NAMES
  const workers = [];
  for (let i = 0; i < 20; i++) {
    const fName = firstNames[i % 10];
    const lName = lastNames[Math.floor(i / 2)];
    const worker = await prisma.lavoratore.create({
      data: {
        nome: fName,
        cognome: lName,
        tipo: i % 4 === 0 ? 'SUBAPPALTATORE' : 'DIPENDENTE',
        costoOrario: 22 + (i % 8),
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@ediltech.it`,
        livello: `${(i % 3) + 1}° Livello`,
        ferieAnnuetot: 24
      }
    });
    workers.push(worker);
  }
  console.log('✅ Workers Created (Unique names)');

  // 4. Accounts & Movements (For BI)
  const conto = await prisma.contoBancario.create({
    data: {
      nome: 'UNICREDIT BUSINESS',
      saldoIniziale: 50000,
      iban: 'IT60X0123456789012345678901'
    }
  });

  // 5. Projects (100)
  const projects = [];
  for (let i = 1; i <= 100; i++) {
    const client = clients[i % clients.length];
    const pName = `Cantiere ${cities[i % cities.length]} [REF-${1000 + i}]`;
    const project = await prisma.project.create({
      data: {
        name: pName,
        description: pName, // Syncing both fields to avoid "Senza Titolo"
        number: 202600 + i,
        clientId: client.id,
        budget: 45000 + (Math.random() * 150000),
        status: i % 8 === 0 ? 'COMPLETED' : 'ONGOING',
        indirizzo: `Viale della Vittoria ${i}`,
        citta: cities[i % cities.length]
      }
    });
    projects.push(project);

    // 6. Project Items (Budget decomposition)
    await prisma.projectItem.create({
      data: {
        projectId: project.id,
        description: 'Smantellamento e Scavo',
        unit: 'MQ',
        unitPrice: 45,
        quantity: 100,
        totalPrice: 4500
      }
    });

    // 7. Small check: Seed some Fatture for this project (For BI)
    if (i % 5 === 0) {
      await prisma.fattura.create({
        data: {
          numero: `FT-${2026}/${i}`,
          tipo: 'ATTIVA',
          soggetto: client.name,
          dataEmissione: new Date(),
          importo: 12000,
          totale: 14640,
          stato: 'PAGATA',
          projects: { connect: { id: project.id } }
        }
      });
    }

    // 8. Forecasts (Previsionali) - CRITICAL FOR BI DASHBOARD
    await prisma.previsionale.create({
      data: {
        projectId: project.id,
        tipo: 'INCASSO',
        categoria: 'SAL',
        data: new Date(new Date().getTime() + (Math.random() * 90 * 24 * 60 * 60 * 1000)),
        importo: 15000 + (Math.random() * 10000),
        descrizione: 'Previsione 1° SAL'
      }
    });
    await prisma.previsionale.create({
      data: {
        projectId: project.id,
        tipo: 'COSTO',
        categoria: 'FORNITORI',
        data: new Date(new Date().getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)),
        importo: 5000 + (Math.random() * 5000),
        descrizione: 'Acquisto materiali base'
      }
    });
  }
  console.log('✅ Projects, Invoices & Forecasts Created');

  // 9. Equipment
  for (let i = 1; i <= 15; i++) {
    const eName = i % 2 === 0 ? `Camion Iveco EuroCargo ${i}` : `Miniescavatore JCB ${i}`;
    const mezz = await prisma.attrezzatura.create({
      data: {
        nome: eName,
        targa: `ZA-00${i}-BB`,
        tipo: 'VEICOLO',
        costoOrario: 35 + (i * 2)
      }
    });

    // Add compliance docs (Revisioni)
    await prisma.complianceDoc.create({
      data: {
        nome: 'Revisione Periodica',
        dataScadenza: new Date(new Date().getTime() + (Math.random() * 180 * 24 * 60 * 60 * 1000)),
        attrezzaturaId: mezz.id
      }
    });
  }
  console.log('✅ Logistics & Compliance Created');

  // 11. Articles (Magazzino)
  const categories = ['Elettricità', 'Idraulica', 'Edile', 'Ferramenta', 'Sicurezza'];
  for (let i = 1; i <= 30; i++) {
    await prisma.articoloMagazzino.create({
      data: {
        codice: `ART-${1000 + i}`,
        nome: `Articolo di Prova ${i}`,
        categoria: categories[i % categories.length],
        unitaMisura: i % 3 === 0 ? 'MT' : 'PZ',
        giacenza: 10 + (Math.random() * 50),
        livelloScortaMin: 5,
        costoUnitario: 5 + (Math.random() * 20)
      }
    });
  }
  console.log('✅ Articles Created');

  // 12. Digital Documents (DDT & Rapportini for every project)
  for (const p of projects) {
    // 2 DDTs per project
    for (let i = 1; i <= 2; i++) {
      await prisma.ddt.create({
        data: {
          numeroDdt: `DDT-${p.number}/${i}`,
          data: new Date(),
          fornitoreName: 'Fornitore Logistica S.r.l.',
          projectId: p.id
        }
      });
    }
  }
  console.log('✅ DDTs Created for Projects');

  console.log('🚀 ENTERPRISE RE-SEEDING COMPLETED!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
