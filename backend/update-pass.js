const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function updatePassword() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.updateMany({
    where: { email: 'admin@school.com' },
    data: { passwordHash: hash }
  });
  console.log('Password updated to admin123');
  await prisma.$disconnect();
}

updatePassword().catch(console.error);
