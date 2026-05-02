"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const [studentCount, teacherCount, totalRevenue, recentAdmissions] = await Promise.all([
            prisma_1.default.student.count({ where: { schoolId, status: 'ACTIVE' } }),
            prisma_1.default.teacher.count({ where: { schoolId } }),
            prisma_1.default.payment.aggregate({
                where: { invoice: { student: { schoolId } } },
                _sum: { paidAmount: true },
            }),
            prisma_1.default.student.findMany({
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
        const attendanceCount = await prisma_1.default.attendance.count({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.controller.js.map