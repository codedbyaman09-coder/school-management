import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../config/prisma';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const { search, status, classId, sectionId } = req.query;

    const where: any = { schoolId };
    if (status) where.status = status;
    if (classId || sectionId) {
      where.enrollments = { 
        some: { 
          ...(classId && { classId: classId as string }),
          ...(sectionId && { sectionId: sectionId as string }),
          status: 'ACTIVE'
        } 
      };
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { fullName: true, email: true, phone: true, role: true } },
        enrollments: {
          include: {
            class: { select: { name: true } },
            section: { select: { name: true } },
          },
          orderBy: { academicYearId: 'desc' },
          take: 1,
        },
        guardians: {
          include: { guardian: { include: { user: { select: { fullName: true, phone: true } } } } },
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { joinDate: 'desc' },
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { fullName: true, email: true, phone: true, role: true } },
        enrollments: {
          include: {
            class: true,
            section: true,
            attendance: { orderBy: { attendanceDate: 'desc' }, take: 30 },
            marks: { include: { examSubject: { include: { exam: true, subject: true } } } },
          },
        },
        guardians: { include: { guardian: { include: { user: true } } } },
        invoices: { include: { payments: true }, orderBy: { issueDate: 'desc' }, take: 10 },
      },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  const { fullName, email, password, phone, admissionNo, dob, gender, bloodGroup, address, classId, sectionId, academicYearId, parentName, parentEmail, parentPhone } = req.body;
  const schoolId = (req as any).schoolId;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check Student Limit
      const school = await (tx as any).school.findUnique({ where: { id: schoolId } });
      const currentCount = await (tx as any).student.count({ where: { schoolId } });
      
      if (currentCount >= (school?.maxStudents || 200)) {
        throw new Error(`Student limit reached. Your current plan (${school?.plan}) allows up to ${school?.maxStudents} students. Please upgrade your plan.`);
      }

      // Create student user
      const passwordHash = await bcrypt.hash(password || 'student123', 10);
      const studentUser = await (tx as any).user.create({
        data: { fullName, email, passwordHash, phone, role: 'STUDENT', schoolId },
      });

      // Create student record
      const studentDob = dob ? new Date(dob) : null;
      if (studentDob && isNaN(studentDob.getTime())) {
        throw new Error("Invalid Date of Birth format");
      }

      const student = await (tx as any).student.create({
        data: {
          userId: studentUser.id,
          schoolId,
          admissionNo,
          dob: studentDob,
          gender,
          bloodGroup,
          address,
        },
      });

      // Create enrollment if class provided
      if (classId && sectionId) {
        let ayId = academicYearId;
        if (!ayId) {
          const currentAY = await (tx as any).academicYear.findFirst({
            where: { schoolId, isCurrent: true }
          });
          ayId = currentAY?.id;
        }

        if (ayId) {
          await (tx as any).enrollment.create({
            data: {
              studentId: student.id,
              classId,
              sectionId,
              academicYearId: ayId,
            },
          });
        }
      }

      // Create guardian if parent info provided
      if (parentName && parentEmail) {
        const parentHash = await bcrypt.hash('parent123', 10);
        const parentUser = await (tx as any).user.create({
          data: { fullName: parentName, email: parentEmail, passwordHash: parentHash, phone: parentPhone, role: 'PARENT', schoolId },
        });
        const guardian = await (tx as any).guardian.create({
          data: { userId: parentUser.id },
        });
        await (tx as any).studentGuardian.create({
          data: { studentId: student.id, guardianId: guardian.id, relationType: 'FATHER', isPrimary: true },
        });
      }

      return student;
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Student Creation Error:", error);
    if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
      return res.status(503).json({ error: 'Database is not running. Please start your PostgreSQL server.' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create student: ' + (error.message || 'Unknown error') });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { fullName, email, phone, dob, gender, bloodGroup, address, status } = req.body;
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id as string } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await prisma.$transaction(async (tx) => {
      if (fullName || email || phone) {
        await (tx as any).user.update({
          where: { id: student.userId },
          data: { ...(fullName && { fullName }), ...(email && { email }), ...(phone && { phone }) },
        });
      }
      await (tx as any).student.update({
        where: { id: req.params.id as string },
        data: {
          ...(dob && { dob: new Date(dob) }),
          ...(gender && { gender }),
          ...(bloodGroup && { bloodGroup }),
          ...(address && { address }),
          ...(status && { status }),
        },
      });
    });

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id as string } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await prisma.student.update({
      where: { id: req.params.id as string },
      data: { status: 'INACTIVE' },
    });

    res.json({ message: 'Student deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
