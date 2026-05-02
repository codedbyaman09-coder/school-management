import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// ===== EXAMS =====
export const getExams = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const exams = await prisma.exam.findMany({
      where: { schoolId },
      include: {
        examSubjects: {
          include: {
            class: { select: { name: true } },
            subject: { select: { name: true } },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

export const createExam = async (req: Request, res: Response) => {
  const { name, academicYearId, startDate, endDate } = req.body;
  const schoolId = (req as any).schoolId;
  try {
    let ayId = academicYearId;
    if (!ayId) {
      const currentAY = await (prisma as any).academicYear.findFirst({
        where: { schoolId, isCurrent: true }
      });
      ayId = currentAY?.id;
    }

    if (!ayId) return res.status(400).json({ error: 'Current academic year not found' });

    const exam = await prisma.exam.create({
      data: {
        name,
        schoolId,
        academicYearId: ayId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res.status(201).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    await prisma.exam.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
};

// ===== EXAM SUBJECTS =====
export const createExamSubject = async (req: Request, res: Response) => {
  const { examId, classId, subjectId, maxMarks, passMarks, examDate } = req.body;
  try {
    const examSubject = await prisma.examSubject.create({
      data: {
        examId,
        classId,
        subjectId,
        maxMarks: parseFloat(maxMarks),
        passMarks: parseFloat(passMarks),
        examDate: examDate ? new Date(examDate) : null,
      },
    });
    res.status(201).json(examSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam subject' });
  }
};

// ===== MARKS =====
export const submitMarks = async (req: Request, res: Response) => {
  const { examSubjectId, marks } = req.body; // marks: [{ enrollmentId, obtainedMarks, grade, remarks }]
  try {
    const results = await prisma.$transaction(
      marks.map((m: any) =>
        prisma.marks.upsert({
          where: { id: (m.id as string) || 'new' },
          create: {
            examSubjectId,
            enrollmentId: m.enrollmentId,
            obtainedMarks: parseFloat(m.obtainedMarks),
            grade: m.grade,
            remarks: m.remarks,
          },
          update: {
            obtainedMarks: parseFloat(m.obtainedMarks),
            grade: m.grade,
            remarks: m.remarks,
          },
        })
      )
    );
    res.json({ message: `Marks submitted for ${results.length} students`, count: results.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit marks' });
  }
};

export const getMarks = async (req: Request, res: Response) => {
  try {
    const { examId, classId, subjectId } = req.query;

    let where: any = {};
    if (examId || classId || subjectId) {
      where.examSubject = {};
      if (examId) where.examSubject.examId = examId;
      if (classId) where.examSubject.classId = classId;
      if (subjectId) where.examSubject.subjectId = subjectId;
    }

    const marks = await prisma.marks.findMany({
      where,
      include: {
        examSubject: {
          include: {
            exam: { select: { name: true } },
            subject: { select: { name: true } },
          },
        },
        enrollment: {
          include: {
            student: { include: { user: { select: { fullName: true } } } },
          },
        },
      },
    });

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
};

export const getStudentResults = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: studentId as string },
      include: {
        marks: {
          include: {
            examSubject: {
              include: {
                exam: true,
                subject: true,
              },
            },
          },
        },
        class: true,
        section: true,
      },
    });

    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student results' });
  }
};
