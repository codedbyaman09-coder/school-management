import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;

    const [studentCount, teacherCount, totalRevenue, recentAdmissions] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId } }),
      prisma.payment.aggregate({
        where: { invoice: { student: { schoolId } } },
        _sum: { paidAmount: true },
      }),
      prisma.student.findMany({
        where: { schoolId },
        include: {
          user: { select: { fullName: true } },
          enrollments: {
            include: {
              class: { select: { name: true } },
              section: { select: { name: true } },
            },
            take: 1,
          },
        },
        orderBy: { joinDate: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate attendance rate (simple version: percentage of students present today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendanceCount = await prisma.attendance.count({
      where: {
        attendanceDate: { gte: today },
        status: 'PRESENT',
        enrollment: { student: { schoolId } }
      }
    });

    const attendanceRate = studentCount > 0 ? (attendanceCount / studentCount) * 100 : 0;

    res.json({
      studentCount,
      teacherCount,
      totalRevenue: totalRevenue._sum.paidAmount || 0,
      attendanceRate: attendanceRate.toFixed(1),
      recentAdmissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
