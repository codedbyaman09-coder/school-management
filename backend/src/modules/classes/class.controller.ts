import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// ===== SCHOOLS =====
export const createSchool = async (req: Request, res: Response) => {
  const { name, code, address, phone, email, plan, maxStudents } = req.body;
  try {
    let studentLimit = 200;
    if (plan === 'PREMIUM') studentLimit = 1000;
    if (plan === 'CUSTOM' && maxStudents) studentLimit = parseInt(maxStudents);

    const school = await prisma.school.create({
      data: { 
        name, 
        code, 
        address, 
        phone, 
        email,
        plan: plan || 'STARTER',
        maxStudents: studentLimit
      },
    });
    res.status(201).json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create school' });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const schools = await prisma.school.findMany({ orderBy: { name: 'asc' } });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
};

// ===== CLASSES =====
export const getClasses = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        sections: true,
        subjects: { include: { subject: true, teacher: { include: { user: { select: { fullName: true } } } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { orderNo: 'asc' },
    });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

export const createClass = async (req: Request, res: Response) => {
  const { name, orderNo } = req.body;
  const schoolId = (req as any).schoolId;
  try {
    const cls = await prisma.class.create({
      data: { name, orderNo: orderNo || 0, schoolId },
    });
    res.status(201).json(cls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  const { name, orderNo } = req.body;
  try {
    const cls = await prisma.class.update({
      where: { id: req.params.id as string },
      data: { ...(name && { name }), ...(orderNo !== undefined && { orderNo }) },
    });
    res.json(cls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    await prisma.class.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete class. Make sure no students are enrolled.' });
  }
};

// ===== SECTIONS =====
export const getSections = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;

    const sections = await prisma.section.findMany({
      where,
      include: { class: { select: { name: true } }, _count: { select: { enrollments: true } } },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

export const createSection = async (req: Request, res: Response) => {
  const { name, classId } = req.body;
  try {
    const section = await prisma.section.create({
      data: { name, classId },
    });
    res.status(201).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create section' });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    await prisma.section.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete section' });
  }
};

// ===== SUBJECTS =====
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const subjects = await prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  const { name, code } = req.body;
  const schoolId = (req as any).schoolId;
  try {
    const subject = await prisma.subject.create({
      data: { name, code, schoolId },
    });
    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    await prisma.subject.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};

// ===== ENROLLMENTS =====
export const createEnrollment = async (req: Request, res: Response) => {
  const { studentId, classId, sectionId, academicYearId, rollNo } = req.body;
  try {
    const enrollment = await prisma.enrollment.create({
      data: { studentId, classId, sectionId, academicYearId, rollNo },
    });
    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
};
