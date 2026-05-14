-- CreateTable
CREATE TABLE "SystemAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'SYSTEM',
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'GARZONE DI CANTIERE',
    "lastDailyBonusDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "number" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'PRIVATE',
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "taxId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "pec" TEXT,
    "sdiCode" TEXT,
    "address" TEXT,
    "city" TEXT,
    "cap" TEXT,
    "province" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portalEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "number" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ONGOING',
    "committente" TEXT,
    "indirizzo" TEXT,
    "citta" TEXT,
    "cap" TEXT,
    "clientId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "aiMetadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portalKey" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'TECHNICAL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "notes" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFI" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "answeredAt" TIMESTAMP(3),
    "answeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalSignature" (
    "id" TEXT NOT NULL,
    "signatureData" TEXT NOT NULL,
    "signerName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'COMMITTENTE',
    "rapportinoId" TEXT,
    "ddtId" TEXT,
    "quoteId" TEXT,
    "contractId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigitalSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rapportino" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "attivita" TEXT NOT NULL,
    "note" TEXT,
    "mezzi" TEXT,
    "materiali" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "photos" TEXT,
    "aiSafetyCheck" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rapportino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ddt" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "numeroDdt" TEXT NOT NULL,
    "fornitoreId" TEXT,
    "fornitoreName" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "importo" DOUBLE PRECISION,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ddt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornitore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ragioneSociale" TEXT,
    "vatId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'FORNITORE',
    "category" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "dataScadenzaDurc" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fornitore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "vatType" TEXT NOT NULL DEFAULT '22%',
    "taxableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "signedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportinoLavoratore" (
    "id" TEXT NOT NULL,
    "rapportinoId" TEXT NOT NULL,
    "lavoratoreId" TEXT NOT NULL,
    "ore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "RapportinoLavoratore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lavoratore" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'DIPENDENTE',
    "costoOrario" DOUBLE PRECISION,
    "telefono" TEXT,
    "email" TEXT,
    "dataAssunzione" TIMESTAMP(3),
    "livello" TEXT,
    "ferieAnnuetot" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lavoratore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presenza" (
    "id" TEXT NOT NULL,
    "lavoratoreId" TEXT NOT NULL,
    "entrata" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uscita" TIMESTAMP(3),
    "latIn" DOUBLE PRECISION,
    "longIn" DOUBLE PRECISION,
    "latOut" DOUBLE PRECISION,
    "longOut" DOUBLE PRECISION,
    "isManuale" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presenza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assenza" (
    "id" TEXT NOT NULL,
    "lavoratoreId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataInizio" TIMESTAMP(3) NOT NULL,
    "dataFine" TIMESTAMP(3) NOT NULL,
    "giorniTotali" DOUBLE PRECISION,
    "stato" TEXT NOT NULL DEFAULT 'PENDENTE',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assenza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceDoc" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataScadenza" TIMESTAMP(3) NOT NULL,
    "stato" TEXT NOT NULL DEFAULT 'VALIDO',
    "fileUrl" TEXT,
    "lavoratoreId" TEXT,
    "attrezzaturaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DdtArticolo" (
    "id" TEXT NOT NULL,
    "ddtId" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "quantita" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unita" TEXT,
    "prezzoUn" DOUBLE PRECISION,

    CONSTRAINT "DdtArticolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sal" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "importo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalVoce" (
    "id" TEXT NOT NULL,
    "salId" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "percentuale" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "importoVoce" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "SalVoce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Previsionale" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "importo" DOUBLE PRECISION NOT NULL,
    "descrizione" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Previsionale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'corpo',
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "dependencies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceItem" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "source" TEXT,

    CONSTRAINT "PriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ITEM',
    "priceItemId" TEXT,
    "description" TEXT NOT NULL,
    "unit" TEXT,
    "price" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedToId" TEXT,
    "lavoratoreId" TEXT,
    "roleScope" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContoBancario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'BANCARIO',
    "saldoIniziale" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "iban" TEXT,
    "note" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContoBancario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimento" (
    "id" TEXT NOT NULL,
    "contoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "importo" DOUBLE PRECISION NOT NULL,
    "descrizione" TEXT,
    "controparte" TEXT,
    "riferimento" TEXT,
    "fatturaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fattura" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fornitoreId" TEXT,
    "soggetto" TEXT NOT NULL,
    "dataEmissione" TIMESTAMP(3) NOT NULL,
    "dataScadenza" TIMESTAMP(3),
    "importo" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL DEFAULT 22,
    "totale" DOUBLE PRECISION NOT NULL,
    "stato" TEXT NOT NULL DEFAULT 'DA_PAGARE',
    "fileUrl" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fattura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attrezzatura" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "targa" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'VEICOLO',
    "costoOrario" DOUBLE PRECISION,
    "stato" TEXT NOT NULL DEFAULT 'DISPONIBILE',
    "note" TEXT,
    "dataManutenzione" TIMESTAMP(3),
    "cantiereId" TEXT,
    "dipendenteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attrezzatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticoloMagazzino" (
    "id" TEXT NOT NULL,
    "codice" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT,
    "unitaMisura" TEXT NOT NULL DEFAULT 'PZ',
    "giacenza" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "livelloScortaMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costoUnitario" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticoloMagazzino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportinoAttrezzatura" (
    "id" TEXT NOT NULL,
    "rapportinoId" TEXT NOT NULL,
    "attrezzaturaId" TEXT NOT NULL,
    "oreUtilizzo" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "RapportinoAttrezzatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportinoArticolo" (
    "id" TEXT NOT NULL,
    "rapportinoId" TEXT NOT NULL,
    "articoloMagazzinoId" TEXT NOT NULL,
    "quantita" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "RapportinoArticolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorName" TEXT,
    "content" TEXT,
    "photos" TEXT,
    "type" TEXT NOT NULL DEFAULT 'UPDATE',
    "isVisibleToClient" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT,
    "workType" TEXT,
    "estimatedBudget" DOUBLE PRECISION,
    "surveyDate" TIMESTAMP(3),
    "notes" TEXT,
    "coachingState" TEXT,
    "stagnationAlert" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "convertedToQuoteId" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetySettings" (
    "id" TEXT NOT NULL DEFAULT 'GLOBAL',
    "companyName" TEXT NOT NULL DEFAULT 'Edil One Costruzioni S.r.l.',
    "vatId" TEXT,
    "legalAddress" TEXT,
    "legalCity" TEXT,
    "responsabileSicurezza" TEXT,
    "rspp" TEXT,
    "medicoCompetente" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyPlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Piano Operativo di Sicurezza',
    "content" TEXT,
    "risks" TEXT,
    "materials" TEXT,
    "preventionMeasures" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "aiInsights" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategicMission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "impact" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "rewardXp" INTEGER NOT NULL DEFAULT 100,
    "deadline" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "aiRationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategicMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAdvisor" (
    "id" TEXT NOT NULL DEFAULT 'GLOBAL',
    "lastAnalysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentGrowthPhase" TEXT NOT NULL DEFAULT 'STABILIZATION',
    "globalHealthScore" INTEGER NOT NULL DEFAULT 70,
    "targetMargin" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "aiInsights" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessAdvisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectQuotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectLavoratori" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MovimentoProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FatturaProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_number_key" ON "Client"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Project_portalKey_key" ON "Project"("portalKey");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalSignature_rapportinoId_key" ON "DigitalSignature"("rapportinoId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalSignature_ddtId_key" ON "DigitalSignature"("ddtId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalSignature_quoteId_key" ON "DigitalSignature"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalSignature_contractId_key" ON "DigitalSignature"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Fornitore_name_key" ON "Fornitore"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Fornitore_vatId_key" ON "Fornitore"("vatId");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_key" ON "Quote"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_quoteId_key" ON "Contract"("quoteId");

-- CreateIndex
CREATE UNIQUE INDEX "Attrezzatura_targa_key" ON "Attrezzatura"("targa");

-- CreateIndex
CREATE UNIQUE INDEX "ArticoloMagazzino_codice_key" ON "ArticoloMagazzino"("codice");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectQuotes_AB_unique" ON "_ProjectQuotes"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectQuotes_B_index" ON "_ProjectQuotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectLavoratori_AB_unique" ON "_ProjectLavoratori"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectLavoratori_B_index" ON "_ProjectLavoratori"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovimentoProjects_AB_unique" ON "_MovimentoProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_MovimentoProjects_B_index" ON "_MovimentoProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FatturaProjects_AB_unique" ON "_FatturaProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_FatturaProjects_B_index" ON "_FatturaProjects"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDocument" ADD CONSTRAINT "ProjectDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ProjectDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFI" ADD CONSTRAINT "RFI_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalSignature" ADD CONSTRAINT "DigitalSignature_rapportinoId_fkey" FOREIGN KEY ("rapportinoId") REFERENCES "Rapportino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalSignature" ADD CONSTRAINT "DigitalSignature_ddtId_fkey" FOREIGN KEY ("ddtId") REFERENCES "Ddt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalSignature" ADD CONSTRAINT "DigitalSignature_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalSignature" ADD CONSTRAINT "DigitalSignature_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rapportino" ADD CONSTRAINT "Rapportino_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ddt" ADD CONSTRAINT "Ddt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ddt" ADD CONSTRAINT "Ddt_fornitoreId_fkey" FOREIGN KEY ("fornitoreId") REFERENCES "Fornitore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoLavoratore" ADD CONSTRAINT "RapportinoLavoratore_rapportinoId_fkey" FOREIGN KEY ("rapportinoId") REFERENCES "Rapportino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoLavoratore" ADD CONSTRAINT "RapportinoLavoratore_lavoratoreId_fkey" FOREIGN KEY ("lavoratoreId") REFERENCES "Lavoratore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presenza" ADD CONSTRAINT "Presenza_lavoratoreId_fkey" FOREIGN KEY ("lavoratoreId") REFERENCES "Lavoratore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assenza" ADD CONSTRAINT "Assenza_lavoratoreId_fkey" FOREIGN KEY ("lavoratoreId") REFERENCES "Lavoratore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceDoc" ADD CONSTRAINT "ComplianceDoc_lavoratoreId_fkey" FOREIGN KEY ("lavoratoreId") REFERENCES "Lavoratore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceDoc" ADD CONSTRAINT "ComplianceDoc_attrezzaturaId_fkey" FOREIGN KEY ("attrezzaturaId") REFERENCES "Attrezzatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DdtArticolo" ADD CONSTRAINT "DdtArticolo_ddtId_fkey" FOREIGN KEY ("ddtId") REFERENCES "Ddt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sal" ADD CONSTRAINT "Sal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalVoce" ADD CONSTRAINT "SalVoce_salId_fkey" FOREIGN KEY ("salId") REFERENCES "Sal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Previsionale" ADD CONSTRAINT "Previsionale_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectItem" ADD CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_priceItemId_fkey" FOREIGN KEY ("priceItemId") REFERENCES "PriceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTask" ADD CONSTRAINT "WorkflowTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTask" ADD CONSTRAINT "WorkflowTask_lavoratoreId_fkey" FOREIGN KEY ("lavoratoreId") REFERENCES "Lavoratore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimento" ADD CONSTRAINT "Movimento_contoId_fkey" FOREIGN KEY ("contoId") REFERENCES "ContoBancario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimento" ADD CONSTRAINT "Movimento_fatturaId_fkey" FOREIGN KEY ("fatturaId") REFERENCES "Fattura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fattura" ADD CONSTRAINT "Fattura_fornitoreId_fkey" FOREIGN KEY ("fornitoreId") REFERENCES "Fornitore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attrezzatura" ADD CONSTRAINT "Attrezzatura_cantiereId_fkey" FOREIGN KEY ("cantiereId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attrezzatura" ADD CONSTRAINT "Attrezzatura_dipendenteId_fkey" FOREIGN KEY ("dipendenteId") REFERENCES "Lavoratore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoAttrezzatura" ADD CONSTRAINT "RapportinoAttrezzatura_rapportinoId_fkey" FOREIGN KEY ("rapportinoId") REFERENCES "Rapportino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoAttrezzatura" ADD CONSTRAINT "RapportinoAttrezzatura_attrezzaturaId_fkey" FOREIGN KEY ("attrezzaturaId") REFERENCES "Attrezzatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoArticolo" ADD CONSTRAINT "RapportinoArticolo_rapportinoId_fkey" FOREIGN KEY ("rapportinoId") REFERENCES "Rapportino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportinoArticolo" ADD CONSTRAINT "RapportinoArticolo_articoloMagazzinoId_fkey" FOREIGN KEY ("articoloMagazzinoId") REFERENCES "ArticoloMagazzino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyPlan" ADD CONSTRAINT "SafetyPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectQuotes" ADD CONSTRAINT "_ProjectQuotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectQuotes" ADD CONSTRAINT "_ProjectQuotes_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectLavoratori" ADD CONSTRAINT "_ProjectLavoratori_A_fkey" FOREIGN KEY ("A") REFERENCES "Lavoratore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectLavoratori" ADD CONSTRAINT "_ProjectLavoratori_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimentoProjects" ADD CONSTRAINT "_MovimentoProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Movimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimentoProjects" ADD CONSTRAINT "_MovimentoProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FatturaProjects" ADD CONSTRAINT "_FatturaProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Fattura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FatturaProjects" ADD CONSTRAINT "_FatturaProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
