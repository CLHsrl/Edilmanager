const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'camata28@gmail.com' }
    });
    console.log('User from DB:', user);
    if (user) {
        const match = await bcrypt.compare('Casarina1!', user.password);
        console.log('Password match:', match);
    }
    await prisma.$disconnect();
}

main();
