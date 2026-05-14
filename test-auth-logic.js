const { PrismaClient } = require('./src/lib/prisma-client-v25');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuth() {
  const email = 'admin@edilmanager.it';
  const password = 'admin';

  console.log('Testing auth for:', email);
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('User not found in DB');
    return;
  }

  console.log('User found:', user.email);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  
  if (!isMatch) {
    console.log('Hash in DB:', user.password);
    const newHash = await bcrypt.hash(password, 10);
    console.log('Sample hash for "admin":', newHash);
  }
}

testAuth().finally(() => prisma.$disconnect());
