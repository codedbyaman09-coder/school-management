import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const markAttendance = async (req: Request, res: Response) => {
  const { enrollmentId, date, status } = req.body;
  const markedById = (req as any).userId;
  try {
    // Check if already marked
    const existing = await prisma.attendance.findFirst({
      where: { enrollmentId, attendanceDate: new Date(date) },
    });

    if (existing) {
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status, markedById },
      });
      return res.json(updated);
    }

    const attendance = await prisma.attendance.create({
      data: {
        enrollmentId,
        attendanceDate: new Date(date),
        status,
        markedById,
      },
    });
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

export const markBulkAttendance = async (req: Request, res: Response) => {
  const { date, records } = req.body; // records: [{ enrollmentId, status }]
  const markedById = (req as any).userId;
  try {
    const results = await prisma.$transaction(
      records.map((record: any) =>
        prisma.attendance.upsert({
          where: {
            id: (record.id as string) || 'new',
          },
          create: {
            enrollmentId: record.enrollmentId,
            attendanceDate: new Date(date),
            status: record.status,
            markedById,
          },
          update: {
            status: record.status,
            markedById,
          },
        })
      )
    );
    res.json({ message: `Attendance marked for ${results.length} students`, count: results.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark bulk attendance' });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, date, month } = req.query;

    let where: any = {};

    if (date) {
      where.attendanceDate = new Date(date as string);
    } else if (month) {
      const [year, m] = (month as string).split('-');
      const start = new Date(parseInt(year), parseInt(m) - 1, 1);
      const end = new Date(parseInt(year), parseInt(m), 0);
      where.attendanceDate = { gte: start, lte: end };
    }

    if (classId || sectionId) {
      where.enrollment = {};
      if (classId) where.enrollment.classId = classId;
      if (sectionId) where.enrollment.sectionId = sectionId;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        enrollment: {
          include: {
            student: { include: { user: { select: { fullName: true } } } },
            class: { select: { name: true } },
            section: { select: { name: true } },
          },
        },
      },
      orderBy: { attendanceDate: 'desc' },
    });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const getAttendanceStats = async (req: Request, res: Response) => {
  try {
    const { classId, sectionId, month } = req.query;
    const [year, m] = (month as string || '2026-01').split('-');
    const start = new Date(parseInt(year), parseInt(m) - 1, 1);
    const end = new Date(parseInt(year), parseInt(m), 0);

    let enrollmentWhere: any = {};
    if (classId) enrollmentWhere.classId = classId;
    if (sectionId) enrollmentWhere.sectionId = sectionId;

    const total = await prisma.attendance.count({
      where: {
        attendanceDate: { gte: start, lte: end },
        enrollment: enrollmentWhere,
      },
    });

    const present = await prisma.attendance.count({
      where: {
        attendanceDate: { gte: start, lte: end },
        status: 'PRESENT',
        enrollment: enrollmentWhere,
      },
    });

    const absent = await prisma.attendance.count({
      where: {
        attendanceDate: { gte: start, lte: end },
        status: 'ABSENT',
        enrollment: enrollmentWhere,
      },
    });

    res.json({
      total,
      present,
      absent,
      late: total - present - absent,
      rate: total > 0 ? ((present / total) * 100).toFixed(1) : '0',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get attendance stats' });
  }
};
