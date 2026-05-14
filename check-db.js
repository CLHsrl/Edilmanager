
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const leadCount = await prisma.lead.count();
  const projectCount = await prisma.project.count();
  const clientCount = await prisma.client.count();

  console.log({
    userCount,
    leadCount,
    projectCount,
    clientCount
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
