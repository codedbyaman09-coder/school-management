import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create School
  const school = await prisma.school.upsert({
    where: { code: 'SCH001' },
    update: {},
    create: {
      name: 'EduMaster International School',
      code: 'SCH001',
      address: '123 Education Hub, Knowledge City',
      phone: '0123456789',
    },
  });

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      passwordHash: adminPassword,
      fullName: 'School Admin',
      role: 'ADMIN',
      schoolId: school.id,
    },
  });
  console.log('✅ Admin user created: admin@school.com / admin123');

  // 3. Create Academic Year
  const academicYear = await (prisma as any).academicYear.upsert({
    where: { name: '2026-27' },
    update: {},
    create: {
      name: '2026-27',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
      schoolId: school.id,
    },
  });

  // 4. Create Classes
  const grade10 = await prisma.class.create({
    data: { name: 'Grade 10', orderNo: 10, schoolId: school.id },
  });

  // 5. Create Sections
  const secA = await prisma.section.create({
    data: { name: 'A', classId: grade10.id },
  });

  // 6. Create Subjects
  const math = await prisma.subject.create({
    data: { name: 'Mathematics', code: 'MATH101', schoolId: school.id },
  });
  const science = await prisma.subject.create({
    data: { name: 'Science', code: 'SCI101', schoolId: school.id },
  });

  // 7. Assign Subjects to Classes
  await prisma.classSubject.create({
    data: { classId: grade10.id, subjectId: math.id },
  });

  // 8. Create Teachers
  const teacherPass = await bcrypt.hash('teacher123', 10);
  const teacherUser = await prisma.user.create({
    data: {
      email: 'John@school.com',
      passwordHash: teacherPass,
      fullName: 'John Doe',
      role: 'TEACHER',
      schoolId: school.id,
    },
  });
  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      employeeCode: 'TCH001',
      qualification: 'M.Sc. Mathematics',
      hireDate: new Date(),
      schoolId: school.id,
    },
  });

  // 9. Create Students
  const studentUser1 = await prisma.user.create({
    data: {
      email: 'rahul@student.com',
      passwordHash: await bcrypt.hash('student123', 10),
      fullName: 'Rahul Sharma',
      role: 'STUDENT',
      schoolId: school.id,
    },
  });
  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      admissionNo: 'ADM2026001',
      dob: new Date('2010-05-15'),
      gender: 'MALE',
      address: 'Near City Mall, Delhi',
      schoolId: school.id,
    },
  });

  // 10. Enroll Students
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      classId: grade10.id,
      sectionId: secA.id,
      academicYearId: academicYear.id,
      rollNo: '101',
    },
  });

  // 11. Create Fee Invoice & Items
  const invoice = await prisma.invoice.create({
    data: {
      studentId: student1.id,
      invoiceNo: 'INV-2026-001',
      totalAmount: 5000,
      dueDate: new Date('2026-06-01'),
      status: 'PARTIAL',
      academicYearId: academicYear.id,
      items: {
        create: [
          { feeType: 'Tution Fee', amount: 4000 },
          { feeType: 'Library Fee', amount: 1000 },
        ]
      }
    },
  });

  // 12. Create Payment
  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      paidAmount: 2000,
      paymentMethod: 'CASH',
      receivedById: admin.id,
      transactionRef: 'REC-001'
    }
  });

  // 13. Create Attendance
  await prisma.attendance.create({
    data: {
      enrollmentId: (await prisma.enrollment.findFirst({ where: { studentId: student1.id } }))!.id,
      status: 'PRESENT',
      attendanceDate: new Date(),
      markedById: admin.id,
    }
  });

  // 14. Create Exam & Exam Subject
  const exam = await (prisma as any).exam.create({
    data: {
      name: 'First Term Examination',
      startDate: new Date(),
      endDate: new Date(),
      schoolId: school.id,
      academicYearId: academicYear.id
    }
  });

  const exSub = await (prisma as any).examSubject.create({
    data: {
      examId: exam.id,
      classId: grade10.id,
      subjectId: math.id,
      maxMarks: 100,
      passMarks: 33,
      examDate: new Date()
    }
  });

  // 15. Create Marks
  await (prisma as any).marks.create({
    data: {
      examSubjectId: exSub.id,
      enrollmentId: (await prisma.enrollment.findFirst({ where: { studentId: student1.id } }))!.id,
      obtainedMarks: 85,
      grade: 'A',
      remarks: 'Excellent'
    }
  });

  // 16. Create Announcement
  await (prisma as any).announcement.create({
    data: {
      title: 'School Reopening',
      message: 'The school will reopen on 1st April 2026.',
      audienceType: 'ALL',
      schoolId: school.id,
      createdById: admin.id
    }
  });

  console.log('✅ Database seeded with all records!');
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
