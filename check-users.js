const { PrismaClient } = require('./src/lib/prisma-client-v25');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log('USERS IN DB:', JSON.stringify(users.map(u => ({ email: u.email, role: u.role })), null, 2));
  await prisma.$disconnect();
}

check();
