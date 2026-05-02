import prisma from './src/config/prisma';
import bcrypt from 'bcrypt';

async function test() {
  try {
    const school = await prisma.school.findFirst();
    if (!school) throw new Error("No school found");

    const email = `test${Date.now()}@test.com`;
    const user = await prisma.user.create({
      data: {
        fullName: 'Test Teacher',
        email,
        passwordHash: await bcrypt.hash('test123', 10),
        role: 'TEACHER',
        schoolId: school.id
      }
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        schoolId: school.id,
        employeeCode: `EMP${Date.now()}`,
        qualification: 'Test'
      }
    });

    console.log("SUCCESS:", teacher);
  } catch (err) {
    console.error("FAILURE:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
