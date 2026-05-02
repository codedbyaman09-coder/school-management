import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../config/prisma';

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
      include: {
        user: { select: { fullName: true, email: true, phone: true, isActive: true } },
        classSubjects: {
          include: {
            class: { select: { name: true } },
            subject: { select: { name: true } },
          },
        },
      },
      orderBy: { hireDate: 'desc' },
    });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id as string },
      include: {
        user: { select: { fullName: true, email: true, phone: true, isActive: true } },
        classSubjects: { include: { class: true, subject: true } },
        timetables: { include: { section: { include: { class: true } }, subject: true } },
      },
    });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  const { fullName, email, password, phone, employeeCode, qualification, hireDate, salary } = req.body;
  const schoolId = (req as any).schoolId;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(password || 'teacher123', 10);
      
      const teacherHireDate = hireDate ? new Date(hireDate) : new Date();
      if (isNaN(teacherHireDate.getTime())) {
        throw new Error("Invalid Hire Date format");
      }

      const user = await (tx as any).user.create({
        data: { fullName, email, passwordHash, phone, role: 'TEACHER', schoolId },
      });

      const teacher = await (tx as any).teacher.create({
        data: {
          userId: user.id,
          schoolId,
          employeeCode,
          qualification,
          hireDate: teacherHireDate,
          salary: salary ? parseFloat(salary) : null,
        },
      });

      return teacher;
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Teacher Creation Error:", error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'Email or Employee Code';
      return res.status(400).json({ error: `A teacher with this ${field} already exists.` });
    }
    res.status(500).json({ error: 'Failed to create teacher: ' + (error.message || 'Unknown error') });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  const { fullName, email, phone, qualification, salary } = req.body;
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: req.params.id as string } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    await prisma.$transaction(async (tx) => {
      if (fullName || email || phone) {
        await (tx as any).user.update({
          where: { id: teacher.userId },
          data: { ...(fullName && { fullName }), ...(email && { email }), ...(phone && { phone }) },
        });
      }
      await (tx as any).teacher.update({
        where: { id: req.params.id as string },
        data: {
          ...(qualification && { qualification }),
          ...(salary && { salary: parseFloat(salary) }),
        },
      });
    });

    res.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: req.params.id as string } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    await prisma.user.update({
      where: { id: teacher.userId },
      data: { isActive: false },
    });

    res.json({ message: 'Teacher deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};
